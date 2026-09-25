import { z } from "zod";

import { safeUrl } from "@/features/email-builder/schema";

import { fieldTypes } from "./types";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const fieldId = z.string().regex(/^[a-z0-9]{4,24}$/i);

export const fieldSchema = z.object({
  id: fieldId,
  type: z.enum(fieldTypes),
  label: z.string().trim().max(300),
  description: z.string().trim().max(1000).nullable(),
  placeholder: z.string().trim().max(150).nullable(),
  required: z.boolean(),
  options: z
    .array(z.object({ id: fieldId, label: z.string().trim().max(200) }))
    .max(100)
    .nullable(),
  validation: z
    .object({
      min: z.number().nullable().optional(),
      max: z.number().nullable().optional(),
      maxLength: z.number().int().min(1).max(5000).nullable().optional(),
    })
    .nullable(),
});

export const createFormInput = z.object({
  title: z.string().trim().min(2, { error: "Give the form a title." }).max(150),
});

export const updateFormInput = z.object({
  id,
  title: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  fields: z.array(fieldSchema).max(100, { error: "Forms can have up to 100 questions." }).optional(),
});

export const settingsInput = z.object({
  id,
  settings: z.object({
    submitLabel: z.string().trim().min(1, { error: "Add the button text." }).max(40),
    confirmationTitle: z.string().trim().min(1, { error: "Add a thank-you heading." }).max(120),
    confirmationMessage: z.string().trim().max(1000),
    redirectUrl: z.union([z.literal(""), safeUrl]).transform((v) => v || null).nullable(),
    closesAt: z.iso.datetime({ offset: true }).nullable(),
    responseLimit: z.number().int().min(1).max(1_000_000).nullable(),
    notifyEmails: z.array(z.email({ error: "One of these emails doesn’t look right." })).max(10),
    audienceId: id.nullable(),
  }),
});

/** Publishing re-checks the whole form so nothing half-built goes live. */
export const publishableSchema = z.object({
  title: z.string().trim().min(1, { error: "Add a title." }),
  fields: z
    .array(
      fieldSchema.superRefine((f, ctx) => {
        if (!f.label && f.type !== "section") ctx.addIssue({ code: "custom", message: "Every question needs a label.", path: ["label"] });
        if (["select", "radio", "checkboxes"].includes(f.type) && (!f.options || f.options.filter((o) => o.label).length < 2))
          ctx.addIssue({ code: "custom", message: `“${f.label || "A choice question"}” needs at least two options.`, path: ["options"] });
      }),
    )
    .refine((fs) => fs.some((f) => f.type !== "section"), { error: "Add at least one question." }),
});

export const formIdInput = z.object({ id });
export const slugInput = z.object({
  id,
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/, { error: "Use 3–60 lowercase letters, numbers and dashes." }),
});
export const deleteResponsesInput = z.object({ id, responseIds: z.array(id).min(1).max(500) });

export const publicSubmitInput = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,60}$/),
  answers: z.record(z.string().max(24), z.unknown()),
  /** Honeypot: real people never see or fill this field. */
  website: z.string().max(0).optional(),
  /** When the page loaded, to reject instant bot submissions. */
  startedAt: z.number().int(),
  captchaToken: z.string().max(4096).optional(),
});
