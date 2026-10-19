"use client";

import { UserRound, Mail, Lock, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signUp } from "@/features/auth/actions";
import type { PublicParish, PublicRole } from "@/features/auth/types";

interface WebAdminSignupFormProps {
  parishes: PublicParish[];
  roles: PublicRole[];
}

export function WebAdminSignupForm({ parishes, roles }: WebAdminSignupFormProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    parishId: parishes[0]?.id || "",
    requestedRoleId: roles[0]?.id || "",
    password: "",
    confirmPassword: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorBanner(null);

    if (form.password !== form.confirmPassword) {
      setErrorBanner("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }

    if (form.password.length < 8) {
      setErrorBanner("Password must be at least 8 characters long.");
      return;
    }

    setPending(true);
    const res = await signUp({
      name: form.name,
      email: form.email,
      phone: form.phone,
      parishId: form.parishId,
      requestedRoleId: form.requestedRoleId,
      password: form.password,
      confirm: form.confirmPassword,
      terms: true,
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin-web/login");
      }, 2000);
      return;
    }

    setPending(false);
    setErrorBanner(res.message || "Failed to create administrator account. Please try again.");
  }

  if (success) {
    return (
      <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-400 animate-bounce" />
        <h3 className="text-lg font-bold text-white">Administrator Account Created!</h3>
        <p className="text-xs text-slate-300">
          Your credentials have been registered. Redirecting you to the Web Studio sign-in...
        </p>
        <Link href="/admin-web/login">
          <Button className="mt-2 w-full bg-emerald-600 font-medium text-white hover:bg-emerald-500">
            Proceed to Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorBanner && <Alert tone="danger">{errorBanner}</Alert>}

      <div className="space-y-1.5">
        <label htmlFor="admin-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
          <UserRound className="size-3.5 text-emerald-400" />
          Full Name
        </label>
        <Input
          id="admin-name"
          name="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Bro. Emmanuel Adeyemi"
          required
          autoFocus
          className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            <Mail className="size-3.5 text-emerald-400" />
            Official Email
          </label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="emmanuel@esocs.org"
            required
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-phone" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            Phone Number (Optional)
          </label>
          <Input
            id="admin-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+234 800 000 0000"
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-parish" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
          <Building2 className="size-3.5 text-emerald-400" />
          Assigned Parish / Branch Scope
        </label>
        <Select
          value={form.parishId}
          onValueChange={(val) => setForm({ ...form, parishId: val })}
        >
          <SelectTrigger className="border-slate-700 bg-slate-950 font-medium text-white">
            <SelectValue placeholder="Select your parish" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-900 text-slate-100">
            {parishes.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-role" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          Web Administrative Responsibility
        </label>
        <Select
          value={form.requestedRoleId}
          onValueChange={(val) => setForm({ ...form, requestedRoleId: val })}
        >
          <SelectTrigger className="border-slate-700 bg-slate-950 font-medium text-white">
            <SelectValue placeholder="Select responsibility" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-900 text-slate-100">
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="admin-pass" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            <Lock className="size-3.5 text-emerald-400" />
            Password
          </label>
          <Input
            id="admin-pass"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••••••"
            required
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-confirm-pass" className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            Confirm Password
          </label>
          <Input
            id="admin-confirm-pass"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="••••••••••••"
            required
            className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-emerald-600 py-2.5 font-medium text-white shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-500"
      >
        {pending ? (
          "Registering Administrator Account…"
        ) : (
          <>
            Complete Admin Registration
            <ArrowRight className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
