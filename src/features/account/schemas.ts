import { z } from "zod";

import { newPassword } from "@/features/auth/schemas";

export const profileInput = z.object({
  name: z.string().trim().min(3, { error: "Please enter your full name." }).max(120),
  phone: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^[+\d][\d\s()-]{6,24}$/, { error: "Enter a valid phone number." }),
    ])
    .transform((v) => v || null),
});

export const changePasswordInput = z
  .object({
    current: z.string().min(1, { error: "Enter your current password." }).max(128),
    next: newPassword,
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], error: "The two passwords don’t match yet." })
  .refine((v) => v.next !== v.current, { path: ["next"], error: "Choose a password you haven’t used here." });

export const mfaCodeInput = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { error: "Enter the 6-digit code." }),
});
export const sessionIdInput = z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/) });
export const notificationPrefsInput = z.object({
  accessRequests: z.boolean(),
  formResponses: z.boolean(),
  campaignReports: z.boolean(),
  weeklySummary: z.boolean(),
});
