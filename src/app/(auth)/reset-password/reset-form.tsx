"use client";

import { ArrowLeft, ArrowRight, Lock, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
    <div className="grid gap-6">
      {/* Top Prominent Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-slate-200 shadow-xs backdrop-blur-xs transition-all hover:border-amber-400/50 hover:bg-slate-900 hover:text-white"
        >
          <ArrowLeft className="size-3.5 text-amber-400 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to sign in</span>
        </Link>
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <AuthHeader
          icon={
            <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 shadow-inner">
              <LockKeyhole className="size-6" />
            </div>
          }
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
        <div className="grid gap-1.5">
          <label htmlFor="rp-password" className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Lock className="size-3.5 text-amber-400" />
            New password
          </label>
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
            className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
          />
          {errors.password && (
            <p id="rp-password-msg" role="alert" className="text-xs font-semibold text-red-400">
              {errors.password}
            </p>
          )}
        </div>
        <PasswordStrength id="rp-strength" password={password} />
        <div className="grid gap-1.5">
          <label htmlFor="rp-confirm" className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Lock className="size-3.5 text-amber-400" />
            Confirm password
          </label>
          <PasswordInput
            id="rp-confirm"
            size="lg"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={!!errors.confirm}
            aria-describedby="rp-confirm-msg"
            maxLength={128}
            className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
          />
          {errors.confirm && (
            <p id="rp-confirm-msg" role="alert" className="text-xs font-semibold text-red-400">
              {errors.confirm}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={pending}
          className="flex items-center justify-center gap-2 bg-amber-500 py-3 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-950/50 transition-all hover:bg-amber-400"
        >
          {pending ? (
            "Updating password…"
          ) : (
            <>
              Update password
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>

      {/* Visible Bottom Card to Return to Sign In */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-center">
        <p className="text-xs font-medium text-slate-300">
          Already know your password?{" "}
          <Link
            href="/login"
            className="font-bold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
          >
            Go back to sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
