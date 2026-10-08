"use client";

import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/features/auth/actions";
import { fieldError, type ActionResult } from "@/lib/result";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<{ redirectTo: string }> | null>(null);
  const [attempt, setAttempt] = React.useState(0);
  const [form, setForm] = React.useState({ email: "", password: "", remember: false });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await signIn({ ...form, next });
    setResult(res);
    if (res.ok) {
      router.replace(res.data.redirectTo);
      router.refresh();
      return;
    }
    setPending(false);
    setAttempt((n) => n + 1);
    // Never keep a rejected password in the field.
    setForm((f) => ({ ...f, password: "" }));
  }

  const banner =
    result && !result.ok && result.code !== "VALIDATION"
      ? result.code === "UNAUTHENTICATED"
        ? "That email and password don’t match. Check them and try again."
        : result.message
      : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {banner && (
        <div key={attempt} className="animate-shake">
          <Alert tone="danger">{banner}</Alert>
        </div>
      )}
      <Field
        label={<span className="text-sm font-bold text-white">Email address</span>}
        htmlFor="email"
        error={fieldError(result, "email")}
      >
        <Input
          id="email"
          type="email"
          size="lg"
          autoComplete="username"
          autoFocus
          prefix={<Mail className="text-amber-400" />}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={!!fieldError(result, "email")}
          aria-describedby="email-msg"
          required
          className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
        />
      </Field>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-bold text-white">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
          >
            Forgot it?
          </Link>
        </div>
        <PasswordInput
          id="password"
          size="lg"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          aria-invalid={!!fieldError(result, "password")}
          required
          className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
        />
        {fieldError(result, "password") && (
          <p role="alert" className="text-xs text-danger">
            {fieldError(result, "password")}
          </p>
        )}
      </div>
      <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-md backdrop-blur-md">
        <Checkbox
          label={<span className="text-sm font-bold text-white">Keep me signed in on this device</span>}
          description={
            <span className="text-xs font-semibold text-slate-300">Only on a computer you don’t share.</span>
          }
          checked={form.remember}
          onCheckedChange={(v) => setForm({ ...form, remember: v === true })}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={pending}
        className="flex items-center justify-center gap-2 bg-amber-500 py-3 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-950/50 transition-all hover:bg-amber-400"
      >
        {pending ? (
          "Signing you in…"
        ) : (
          <>
            Sign in to Portal
            <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}
