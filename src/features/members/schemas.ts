import { z } from "zod";

import { genders, memberStatuses } from "./types";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Keep this under ${max} characters.` })
    .transform((v) => v || null)
    .nullable()
    .optional();

export const memberInput = z.object({
  firstName: z.string().trim().min(1, { error: "Enter a first name." }).max(60),
  lastName: z.string().trim().min(1, { error: "Enter a last name." }).max(60),
  email: z
    .union([z.literal(""), z.email({ error: "That email doesn’t look right." })])
    .transform((v) => v || null)
    .nullable()
    .optional(),
  phone: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^[+\d][\d\s()-]{6,24}$/, { error: "Enter a valid phone number." }),
    ])
    .transform((v) => v || null)
    .nullable()
    .optional(),
  parishId: z.string().min(1, { error: "Choose a parish." }),
  rank: optionalText(60),
  gender: z.enum(genders).nullable().optional(),
  dateOfBirth: z
    .union([z.literal(""), z.iso.date({ error: "Enter a valid date." })])
    .transform((v) => v || null)
    .nullable()
    .optional(),
  address: optionalText(240),
  notes: optionalText(2000),
  status: z.enum(memberStatuses).default("active"),
  emailConsent: z.boolean().default(false),
});

export type MemberInput = z.input<typeof memberInput>;

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

export const updateMemberInput = z.object({ id, values: memberInput });
export const memberIdInput = z.object({ id });
export const bulkMembersInput = z.object({
  ids: z.array(id).min(1).max(500, { error: "Select 500 or fewer at a time." }),
  action: z.enum(["approve", "deactivate"]),
});
export const bulkDeleteInput = z.object({ ids: z.array(id).min(1).max(500) });
