import { z } from "zod";

import { draftDocumentSchema, emailDocumentSchema } from "@/features/email-builder/schema";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const email = z.string().trim().toLowerCase().pipe(z.email({ error: "That email doesn’t look right." }));
const optional = (max: number) => z.string().trim().max(max).transform((v) => v || null).nullable().optional();

export const setupSchema = z.object({
  name: z.string().trim().min(2, { error: "Give the campaign a name." }).max(100),
  subject: z.string().trim().max(150, { error: "Keep the subject under 150 characters." }).transform((v) => v || null).nullable().optional(),
  previewText: optional(150),
  fromName: optional(80),
  fromEmail: z.union([z.literal(""), email]).transform((v) => v || null).nullable().optional(),
  replyTo: z.union([z.literal(""), email]).transform((v) => v || null).nullable().optional(),
});

export const createCampaignInput = z.object({
  name: setupSchema.shape.name,
  content: draftDocumentSchema,
});

export const updateCampaignInput = z.object({
  id,
  setup: setupSchema.optional(),
  audience: z.object({ listIds: z.array(id).max(50) }).optional(),
  content: draftDocumentSchema.optional(),
});

/** Everything that must be true before a campaign can go out. Checked client- and server-side. */
export const readyToSendSchema = z.object({
  subject: z.string({ error: "Add a subject line." }).trim().min(1, { error: "Add a subject line." }),
  fromName: z.string({ error: "Add a sender name." }).trim().min(1, { error: "Add a sender name." }),
  fromEmail: z.string({ error: "Choose who it’s from." }).min(1, { error: "Choose who it’s from." }),
  listIds: z.array(z.string()).min(1, { error: "Choose at least one audience." }),
  content: emailDocumentSchema.refine((d) => d.blocks.length > 0, { error: "Add some content to the email." }),
});

export const campaignIdInput = z.object({ id });
export const sendTestInput = z.object({
  id,
  emails: z.array(email).min(1, { error: "Add an email address." }).max(5, { error: "Send to 5 addresses or fewer." }),
});
export const scheduleInput = z.object({
  id,
  sendAt: z.iso.datetime({ offset: true, error: "Choose a date and time." }).refine(
    (v) => {
      const t = Date.parse(v);
      return t > Date.now() + 5 * 60_000 && t < Date.now() + 365 * 86_400_000;
    },
    { error: "Choose a time at least 5 minutes from now and within a year." },
  ),
});
/** The client echoes the recipient count it showed, so the API can refuse if the audience changed. */
export const sendNowInput = z.object({ id, expectedRecipients: z.number().int().min(1) });
export const estimateInput = z.object({ listIds: z.array(id).max(50) });
