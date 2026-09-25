"use client";

import { Mail } from "lucide-react";
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
      <Field label="Email address" htmlFor="email" error={fieldError(result, "email")}>
        <Input
          id="email"
          type="email"
          size="lg"
          autoComplete="username"
          autoFocus
          prefix={<Mail />}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={!!fieldError(result, "email")}
          aria-describedby="email-msg"
          required
        />
      </Field>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
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
        />
        {fieldError(result, "password") && (
          <p role="alert" className="text-xs text-danger">
            {fieldError(result, "password")}
          </p>
        )}
      </div>
      <Checkbox
        label="Keep me signed in on this device"
        description="Only on a computer you don’t share."
        checked={form.remember}
        onCheckedChange={(v) => setForm({ ...form, remember: v === true })}
      />
      <Button type="submit" size="lg" fullWidth loading={pending}>
        {pending ? "Signing you in…" : "Sign in"}
      </Button>
    </form>
  );
}
