import { z } from "zod";

const email = z
  .union([z.literal(""), z.email({ error: "That email doesn’t look right." })])
  .transform((v) => v || null);

export const sendingSettingsInput = z.object({
  organisationName: z.string().trim().min(2, { error: "Enter your organisation’s name." }).max(120),
  postalAddress: z
    .string()
    .trim()
    .min(10, { error: "Enter a full postal address. The law requires it in marketing emails." })
    .max(300),
  defaultFromName: z
    .string()
    .trim()
    .max(80)
    .transform((v) => v || null),
  defaultFromEmail: email,
  defaultReplyTo: email,
});

export const domainInput = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/, {
      error: "Enter a domain like esocs.org (no https:// or www).",
    }),
});
export const domainIdInput = z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/) });
