"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Lock,
  Mail,
  Monitor,
  Phone,
  Save,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";
import type { SessionUser } from "@/types/auth";

import { updateProfile } from "../actions";
import { profileInput } from "../schemas";
import type { Profile, SecurityOverview } from "../types";

export interface ProfileFormProps {
  profile: Profile;
  session?: SessionUser | null;
  security?: SecurityOverview | null;
  userUnit?: {
    unitName: string;
    unitSlug: string;
    unitId?: string | null;
    isGlobal: boolean;
  };
}

export function ProfileForm({
  profile,
  session,
  security,
  userUnit = {
    unitName: "Diobu Provincial Headquarters",
    unitSlug: "diobu-provincial-headquarters",
    isGlobal: false,
  },
}: ProfileFormProps) {
  const router = useRouter();
  const [v, setV] = React.useState({ name: profile.name, phone: profile.phone ?? "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const save = useAction(updateProfile, {
    success: "Profile credentials updated successfully",
    onSuccess: () => router.refresh(),
  });
  const dirty = v.name !== profile.name || v.phone !== (profile.phone ?? "");

  const roleName = session?.role?.name || "Ecclesiastical Administrator";
  const isPlatformAdmin = Boolean(session?.isPlatformAdmin);
  const handlerCode = `HD-${session?.id ? session.id.slice(0, 8).toUpperCase() : "8024-DIOBU"}`;
  const mfaActive = Boolean(security?.mfaEnabled || session?.mfaEnabled);

  return (
    <div className="space-y-6">
      {/* ─── Executive Profile Hero Banner ─── */}
      <div className="via-slate-850 relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-r from-slate-900 to-amber-950/40 p-6 shadow-md md:p-8 dark:border-border/50">
        {/* Crest watermark in background */}
        <div className="pointer-events-none absolute -top-10 -right-10 opacity-10 select-none">
          <Crest size={220} />
        </div>

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative shrink-0">
              <Avatar
                name={v.name || profile.name}
                src={profile.avatarUrl}
                size="xl"
                status="online"
                className="size-20 shadow-lg ring-4 ring-amber-400/80 sm:size-22"
              />
              <span className="absolute -right-1 -bottom-1 rounded-full bg-amber-500 p-1 text-slate-950 shadow-md">
                <ShieldCheck className="size-3.5" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-brand text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {v.name || profile.name}
                </h2>
                <Badge tone="primary" className="gap-1 px-2 py-0.5 text-2xs uppercase">
                  <ShieldCheck className="size-3 text-primary" /> Verified Handler
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-semibold text-amber-500 dark:text-amber-400">{roleName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-foreground">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  {userUnit.unitName}
                </span>
              </div>

              {/* Status pills row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active Session
                </span>
                <span className="rounded-full border border-slate-700/60 bg-slate-800/60 px-2.5 py-0.5 font-mono text-2xs font-medium text-slate-300">
                  Handler ID: {handlerCode}
                </span>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-semibold text-amber-500">
                  {isPlatformAdmin ? "Tier 1 • High Clearance" : "Tier 2 • Provincial Clearance"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick link button to public live site */}
          <div className="flex shrink-0 items-center sm:self-center">
            <Link
              href={`/church/${userUnit.unitSlug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-surface-hover"
            >
              <Building2 className="size-3.5 text-primary" />
              <span>View Parish Web</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid: Form (Left) & Ecclesiastical Oversight (Right) ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Editable Personal Credentials Form (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <form
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                const check = validate(profileInput, v);
                if (!check.ok) return setErrors(check.errors);
                const res = await save.run(v);
                setErrors(resultErrors(res));
              }}
            >
              <CardHeader
                title="Personal Credentials & Contact"
                description="Update your official legal name and contact phone displayed across ministerial audit trails."
              />
              <CardContent className="grid gap-5">
                <Field
                  label="Full legal name"
                  htmlFor="p-name"
                  error={errors.name}
                  hint="Your official ministerial identity on certificates, audit logs, and pastoral records."
                >
                  <Input
                    id="p-name"
                    autoComplete="name"
                    value={v.name}
                    onChange={(e) => setV({ ...v, name: e.target.value })}
                    aria-invalid={!!errors.name}
                    aria-describedby="p-name-msg"
                    maxLength={120}
                    className="h-10 text-sm"
                  />
                </Field>

                <Field
                  label="Account sign-in email"
                  htmlFor="p-email"
                  hint="Primary credentials address. Contact the Prelate Executive Secretariat to modify login email."
                >
                  <div className="relative">
                    <Input
                      id="p-email"
                      prefix={<Mail className="size-4 text-muted-foreground" />}
                      value={profile.email}
                      readOnly
                      disabled
                      aria-describedby="p-email-msg"
                      className="h-10 cursor-not-allowed bg-surface-muted font-mono text-sm text-muted-foreground"
                    />
                    <span className="text-3xs absolute top-2.5 right-2.5 flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <Lock className="size-2.5" /> Verified
                    </span>
                  </div>
                </Field>

                <Field
                  label="Telephone / Mobile"
                  htmlFor="p-phone"
                  error={errors.phone}
                  optional
                  hint="Direct mobile number for high-priority ministerial notices and ordination vetting alerts."
                >
                  <Input
                    id="p-phone"
                    type="tel"
                    prefix={<Phone className="size-4 text-muted-foreground" />}
                    autoComplete="tel"
                    placeholder="e.g. +234 808 639 2101"
                    value={v.phone}
                    onChange={(e) => setV({ ...v, phone: e.target.value })}
                    aria-invalid={!!errors.phone}
                    aria-describedby="p-phone-msg"
                    className="h-10 text-sm"
                  />
                </Field>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-2xs text-muted-foreground">
                  {dirty ? "Unsaved credential modifications" : "All credentials synchronized"}
                </span>
                <Button
                  type="submit"
                  leftIcon={<Save className="size-4" />}
                  loading={save.pending}
                  disabled={!dirty}
                >
                  Save changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Constitutional Audit & Traceability Notice */}
          <div className="rounded-xl border border-border/80 bg-surface/50 p-4">
            <div className="flex items-start gap-3">
              <ScrollText className="mt-0.5 size-4.5 shrink-0 text-amber-500" />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Holy Order Audit & Cryptographic Traceability</p>
                <p>
                  In compliance with The Holy Order Constitution, all operations executed under handler code{" "}
                  <code className="font-mono font-bold text-primary">{handlerCode}</code>—including member
                  status advancements, ordination dossier clearance, and stewardship receipts—are permanently
                  logged with cryptographic timestamps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ecclesiastical Jurisdiction & Security Clearance (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Ecclesiastical Jurisdiction Card */}
          <Card>
            <CardHeader
              title="Ecclesiastical Jurisdiction"
              description="Your assigned Holy Order branch and operational authority scope."
            />
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border/70 bg-surface-muted/50 p-3.5">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">{userUnit.unitName}</span>
                </div>
                <p className="mt-1 text-2xs text-muted-foreground">
                  {userUnit.isGlobal
                    ? "Organisation-Wide Holy Order Authority (Global)"
                    : "Provincial Headquarters • CMC 9 Port Harcourt"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">
                  Oversight Privileges
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Member & Census Registry Oversight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Services & Attendance Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Stewardship & Batch Approvals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Ordination Candidate Vetting Cleared</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span>Web Studio & Public Media Publishing</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Security & Authentication Clearance Card */}
          <Card>
            <CardHeader
              title="Security & 2FA Status"
              description="Credential protection and multi-factor authentication."
            />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/70 p-3">
                <div className="flex items-center gap-3">
                  <KeyRound className="size-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Two-Step Verification</p>
                    <p className="text-2xs text-muted-foreground">
                      {mfaActive ? "MFA Active & Enforced" : "MFA Not Configured"}
                    </p>
                  </div>
                </div>
                <Badge tone={mfaActive ? "success" : "warning"} className="text-3xs uppercase">
                  {mfaActive ? "Active" : "Recommended"}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/70 p-3">
                <div className="flex items-center gap-3">
                  <Monitor className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Active Session</p>
                    <p className="text-2xs text-muted-foreground">Current Browser Session Authenticated</p>
                  </div>
                </div>
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Link
                href="/settings/security"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised py-2 text-xs font-semibold text-foreground transition-all hover:bg-surface-hover"
              >
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Manage Password & Security</span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
