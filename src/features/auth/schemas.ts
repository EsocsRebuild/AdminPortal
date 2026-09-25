import { z } from "zod";

import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/password";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "That email doesn’t look right. Check for typos." }));

export const newPassword = z
  .string()
  .min(PASSWORD_MIN, { error: `Use at least ${PASSWORD_MIN} characters. A short phrase works well.` })
  .max(PASSWORD_MAX, { error: `Use ${PASSWORD_MAX} characters or fewer.` });

const code = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: "Enter the 6-digit code." });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }).max(PASSWORD_MAX),
  remember: z.boolean().default(false),
  next: z.string().optional(),
});

export const mfaSchema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("totp"), code, rememberDevice: z.boolean().default(false), next: z.string().optional() }),
  z.object({
    method: z.literal("recovery"),
    code: z.string().trim().min(8, { error: "Enter one of your recovery codes." }).max(32),
    rememberDevice: z.boolean().default(false),
    next: z.string().optional(),
  }),
]);

export const signUpStep1 = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: "Please enter your first and last name." })
    .max(120)
    .refine((v) => v.split(/\s+/).length >= 2, { error: "Please enter your first and last name." }),
  email,
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d][\d\s()-]{6,}$/, { error: "Enter a valid phone number, e.g. +234 800 000 0000." })
    .optional()
    .or(z.literal("")),
});

export const signUpStep2 = z.object({
  parishId: z.string().min(1, { error: "Choose the parish you serve in." }),
  requestedRoleId: z.string().min(1, { error: "Choose what you’ll mostly do." }),
});

export const signUpStep3 = z
  .object({
    password: newPassword,
    confirm: z.string(),
    terms: z.literal(true, { error: "Please agree to continue." }),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], error: "The two passwords don’t match yet." });

export const signUpSchema = signUpStep1.and(signUpStep2).and(signUpStep3);

export const verifyEmailSchema = z.object({ code });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ token: z.string().min(16).max(512), password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], error: "The two passwords don’t match yet." });

export const reauthSchema = z.object({ password: z.string().min(1, { error: "Enter your password." }).max(PASSWORD_MAX) });

export type SignInInput = z.input<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;

export const acceptInviteSchema = z
  .object({
    token: z.string().min(16).max(512),
    name: z.string().trim().min(3, { error: "Please enter your full name." }).max(120),
    password: newPassword,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], error: "The two passwords don’t match yet." });
