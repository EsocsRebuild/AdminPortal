"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { resetPassword } from "@/features/auth/actions";
import { resetPasswordSchema } from "@/features/auth/schemas";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState<{ password?: string; confirm?: string }>({});
  const [banner, setBanner] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = resetPasswordSchema.safeParse({ token, password, confirm });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as keyof typeof errors;
        next[k] ??= i.message;
      }
      return setErrors(next);
    }
    setErrors({});
    setPending(true);
    const res = await resetPassword({ token, password, confirm });
    if (res.ok) return router.replace("/login?reason=password-reset");
    setPending(false);
    setBanner(
      res.code === "NOT_FOUND" || res.code === "UNAUTHENTICATED"
        ? "This reset link has expired or was already used. Request a new one."
        : (res.fieldErrors?.password?.[0] ?? res.message),
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <AuthHeader
        icon={<LockKeyhole />}
        title="Choose a new password"
        description="Pick something you haven’t used here before. You’ll be signed out everywhere else."
      />
      {banner && (
        <Alert
          tone="danger"
          action={
            <Link href="/forgot-password" className="text-sm font-medium underline">
              New link
            </Link>
          }
        >
          {banner}
        </Alert>
      )}
      <Field label="New password" htmlFor="rp-password" error={errors.password}>
        <PasswordInput
          id="rp-password"
          size="lg"
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby="rp-password-msg rp-strength"
          maxLength={128}
        />
      </Field>
      <PasswordStrength id="rp-strength" password={password} />
      <Field label="Type it again" htmlFor="rp-confirm" error={errors.confirm}>
        <PasswordInput
          id="rp-confirm"
          size="lg"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={!!errors.confirm}
          aria-describedby="rp-confirm-msg"
          maxLength={128}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={pending}>
        Update password
      </Button>
    </form>
  );
}
