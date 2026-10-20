"use client";

import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { signIn } from "@/features/auth/actions";
import { fieldError, type ActionResult } from "@/lib/result";

export function WebAdminLoginForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<{ redirectTo: string }> | null>(null);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    remember: false,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await signIn({
      email: form.email,
      password: form.password,
      remember: form.remember,
      next: "/admin-web/dashboard",
    });
    setResult(res);
    if (res.ok) {
      router.replace(res.data.redirectTo || "/admin-web/dashboard");
      router.refresh();
      return;
    }
    setPending(false);
    setForm((f) => ({ ...f, password: "" }));
  }

  const banner =
    result && !result.ok && result.code !== "VALIDATION"
      ? result.code === "UNAUTHENTICATED"
        ? "That email and password don’t match. Check them and try again."
        : result.message
      : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {banner && <Alert tone="danger">{banner}</Alert>}

      <div className="grid gap-1.5">
        <label htmlFor="web-email" className="flex items-center gap-1.5 text-sm font-bold text-white">
          <Mail className="size-3.5 text-amber-400" />
          Email address
        </label>
        <Input
          id="web-email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="admin@esocs.test"
          required
          autoFocus
          className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
        />
        {fieldError(result, "email") && <p className="text-xs text-red-400">{fieldError(result, "email")}</p>}
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="web-pass" className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Lock className="size-3.5 text-amber-400" />
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
          >
            Forgot it?
          </Link>
        </div>
        <Input
          id="web-pass"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••••••"
          required
          className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
        />
        {fieldError(result, "password") && (
          <p className="text-xs text-red-400">{fieldError(result, "password")}</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
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
        disabled={pending}
        className="flex items-center justify-center gap-2 bg-amber-500 py-3 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-950/50 transition-all hover:bg-amber-400"
      >
        {pending ? (
          "Signing you in…"
        ) : (
          <>
            Sign in to Web Studio
            <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}
