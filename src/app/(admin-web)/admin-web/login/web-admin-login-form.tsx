"use client";

import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { signIn } from "@/features/auth/actions";
import { fieldError, type ActionResult } from "@/lib/result";

export function WebAdminLoginForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<{ redirectTo: string }> | null>(null);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await signIn({
      email: form.email,
      password: form.password,
      remember: true,
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
        ? "Invalid email or password. Please verify and try again."
        : result.message
      : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {banner && <Alert tone="danger">{banner}</Alert>}

      <div className="space-y-1.5">
        <label
          htmlFor="web-email"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-100"
        >
          <Mail className="size-3.5 text-emerald-400" />
          Web Admin Email
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
          className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
        />
        {fieldError(result, "email") && (
          <p className="text-xs text-red-400">{fieldError(result, "email")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="web-pass"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-100"
          >
            <Lock className="size-3.5 text-emerald-400" />
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Forgot?
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
          className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
        />
        {fieldError(result, "password") && (
          <p className="text-xs text-red-400">{fieldError(result, "password")}</p>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-600 py-2.5 font-medium text-white shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-500"
          >
            {pending ? (
              "Signing in…"
            ) : (
              <>
                Sign In to Web Studio
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
          <p>Authenticates your Web Admin session into the Content Studio</p>
        </TooltipContent>
      </Tooltip>
    </form>
  );
}

