"use client";

import { Crown, Mail, Lock, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setupSuperAdmin } from "@/features/auth/actions";

export function SuperAdminSetupForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    authorityKey: "",
    password: "",
    confirmPassword: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorBanner(null);

    if (form.password !== form.confirmPassword) {
      setErrorBanner("Master passwords do not match. Please verify.");
      return;
    }

    if (form.password.length < 8) {
      setErrorBanner("Password must be at least 8 characters long.");
      return;
    }

    setPending(true);
    const res = await setupSuperAdmin({
      name: form.name,
      email: form.email,
      authorityKey: form.authorityKey,
      password: form.password,
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.replace(res.data.redirectTo || "/admin-web/vetting");
        router.refresh();
      }, 1500);
      return;
    }

    setPending(false);
    setErrorBanner(res.message || "Authority verification failed. Check master passcode.");
  }

  if (success) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-500/30 bg-amber-950/40 p-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-amber-400 animate-bounce" />
        <h3 className="text-lg font-bold text-white">Super Admin Authority Initialized!</h3>
        <p className="text-xs text-amber-200">
          Apex ecclesiastical credentials authorized. Navigating to the Super Vetting Board...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorBanner && <Alert tone="danger">{errorBanner}</Alert>}

      <div className="space-y-1.5">
        <label htmlFor="super-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
          <Crown className="size-3.5 text-amber-400" />
          Apex Administrator Name & Ecclesiastical Rank
        </label>
        <Input
          id="super-name"
          name="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Special Apostle Babatunde (Apex Board)"
          required
          autoFocus
          className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="super-email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
          <Mail className="size-3.5 text-amber-400" />
          Apex Authority Email
        </label>
        <Input
          id="super-email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="apex.council@esocs.org"
          required
          className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-500"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="authority-key" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            <KeyRound className="size-3.5 text-amber-400" />
            Central Authority Master Passcode
          </label>
          <span className="text-2xs text-amber-400/80">Default Key: ESOCS-APEX-2026</span>
        </div>
        <Input
          id="authority-key"
          name="authorityKey"
          type="text"
          value={form.authorityKey}
          onChange={(e) => setForm({ ...form, authorityKey: e.target.value })}
          placeholder="ESOCS-APEX-2026"
          required
          className="border-slate-700 bg-slate-950 font-mono text-sm tracking-wider text-amber-300 placeholder:text-slate-500 focus-visible:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="super-pass" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            <Lock className="size-3.5 text-amber-400" />
            Master Password
          </label>
          <Input
            id="super-pass"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••••••"
            required
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="super-confirm-pass" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            Confirm Password
          </label>
          <Input
            id="super-confirm-pass"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="••••••••••••"
            required
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-amber-500 py-3 font-bold text-slate-950 shadow-xl shadow-amber-950/60 transition-all hover:bg-amber-400"
      >
        {pending ? (
          "Authorizing Apex Credentials…"
        ) : (
          <>
            Activate Super Admin Account
            <ArrowRight className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
