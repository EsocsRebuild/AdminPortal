"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Church,
  Eye,
  HandCoins,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { z } from "zod";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { easeOutExpo } from "@/components/motion/reveal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { signUp } from "@/features/auth/actions";
import { signUpStep1, signUpStep2, signUpStep3 } from "@/features/auth/schemas";
import type { PublicParish, PublicRole } from "@/features/auth/types";

const roleIcons: Record<string, LucideIcon> = {
  church: Church,
  finance: HandCoins,
  editor: BookOpenText,
  viewer: Eye,
  admin: ShieldCheck,
};

const steps = [
  { label: "About you", title: "Request an account", description: "It takes about two minutes. An administrator will approve it." },
  { label: "Your church", title: "Where do you serve?", description: "This decides what you’ll see first." },
  { label: "Security", title: "Create a password", description: "You’ll use it with your email to sign in." },
];

const schemas = [signUpStep1, signUpStep2, signUpStep3] as const;

type Form = {
  name: string;
  email: string;
  phone: string;
  parishId: string;
  requestedRoleId: string;
  password: string;
  confirm: string;
  terms: boolean;
};
type Errors = Partial<Record<keyof Form, string>>;

function firstErrors(error: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof Form;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function SignupFlow({ parishes, roles }: { parishes: PublicParish[]; roles: PublicRole[] }) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [pending, setPending] = React.useState(false);
  const [banner, setBanner] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [form, setForm] = React.useState<Form>({
    name: "",
    email: "",
    phone: "",
    parishId: "",
    requestedRoleId: "",
    password: "",
    confirm: "",
    terms: false,
  });

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setErrors({});
    setBanner(null);
    setStep(next);
  };

  const focusFirst = (found: Errors) => {
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`su-${first}`)?.focus());
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schemas[step].safeParse(form);
    if (!parsed.success) {
      const found = firstErrors(parsed.error);
      setErrors(found);
      focusFirst(found);
      return;
    }
    if (step < steps.length - 1) return go(step + 1);

    setPending(true);
    const res = await signUp({ ...form, terms: form.terms as true });
    if (res.ok) return router.push(res.data.redirectTo);
    setPending(false);
    if (res.fieldErrors) {
      const found = Object.fromEntries(Object.entries(res.fieldErrors).map(([k, v]) => [k, v?.[0]])) as Errors;
      // Jump back to the step that owns the first server-side error.
      const owner = [signUpStep1, signUpStep2].findIndex((s) => Object.keys(found).some((k) => k in s.shape));
      if (owner >= 0 && owner !== step) {
        setDirection(-1);
        setStep(owner);
      }
      setErrors(found);
      focusFirst(found);
    }
    setBanner(res.code === "CONFLICT" ? "An account with this email already exists. Try signing in instead." : res.message);
  }

  const s = steps[step];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      <Stepper steps={steps.map((x) => x.label)} current={step} />

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.3, ease: easeOutExpo }}
          className="grid gap-6"
        >
          <AuthHeader icon={step === 0 ? <UserRoundPlus /> : undefined} title={s.title} description={s.description} />
          {banner && <Alert tone="danger">{banner}</Alert>}

          {step === 0 && (
            <div className="grid gap-4">
              <Field label="Full name" htmlFor="su-name" error={errors.name}>
                <Input
                  id="su-name"
                  size="lg"
                  autoComplete="name"
                  autoFocus
                  prefix={<UserRound />}
                  placeholder="First and last name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby="su-name-msg"
                  maxLength={120}
                />
              </Field>
              <Field label="Email address" htmlFor="su-email" error={errors.email} hint="We’ll send a short code here to confirm it’s you.">
                <Input
                  id="su-email"
                  type="email"
                  size="lg"
                  autoComplete="email"
                  prefix={<Mail />}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby="su-email-msg"
                />
              </Field>
              <Field label="Phone number" htmlFor="su-phone" optional error={errors.phone}>
                <Input
                  id="su-phone"
                  type="tel"
                  size="lg"
                  autoComplete="tel"
                  prefix={<Phone />}
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby="su-phone-msg"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5">
              <Field label="Parish" htmlFor="su-parishId" error={errors.parishId}>
                <Select value={form.parishId} onValueChange={(v) => set("parishId", v)}>
                  <SelectTrigger id="su-parishId" size="lg" aria-invalid={!!errors.parishId} aria-describedby="su-parishId-msg">
                    <SelectValue placeholder="Choose your parish" />
                  </SelectTrigger>
                  <SelectContent>
                    {parishes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-2">
                <p id="su-role-label" className="text-sm font-medium">
                  What will you mostly do?
                </p>
                <RadioPrimitive.Root
                  id="su-requestedRoleId"
                  value={form.requestedRoleId}
                  onValueChange={(v) => set("requestedRoleId", v)}
                  aria-labelledby="su-role-label"
                  aria-describedby={errors.requestedRoleId ? "su-role-msg" : undefined}
                  className="grid gap-2"
                >
                  {roles.map((r) => {
                    const Icon = roleIcons[r.icon] ?? UserRound;
                    return (
                      <RadioCard key={r.id} value={r.id} className="group flex items-center gap-3.5 p-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-control bg-surface-muted text-muted-foreground transition-colors duration-200 group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground">
                          <Icon className="size-[1.125rem]" />
                        </span>
                        <span className="grid gap-0.5">
                          <span className="text-base font-medium">{r.name}</span>
                          <span className="text-sm text-muted-foreground">{r.description}</span>
                        </span>
                      </RadioCard>
                    );
                  })}
                </RadioPrimitive.Root>
                {errors.requestedRoleId && (
                  <p id="su-role-msg" role="alert" className="text-xs text-danger">
                    {errors.requestedRoleId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">An administrator confirms every request before access is granted.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <Field label="Password" htmlFor="su-password" error={errors.password}>
                <PasswordInput
                  id="su-password"
                  size="lg"
                  autoComplete="new-password"
                  autoFocus
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby="su-password-msg su-strength"
                  maxLength={128}
                />
              </Field>
              <PasswordStrength id="su-strength" password={form.password} />
              <Field label="Type it again" htmlFor="su-confirm" error={errors.confirm}>
                <PasswordInput
                  id="su-confirm"
                  size="lg"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  aria-invalid={!!errors.confirm}
                  aria-describedby="su-confirm-msg"
                  maxLength={128}
                />
              </Field>
              <div className="grid gap-1.5">
                <Checkbox
                  id="su-terms"
                  checked={form.terms}
                  onCheckedChange={(v) => set("terms", v === true)}
                  label="I agree to the terms of use and privacy policy"
                  aria-invalid={!!errors.terms}
                />
                {errors.terms && (
                  <p role="alert" className="text-xs text-danger">
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button variant="ghost" size="lg" onClick={() => go(step - 1)} leftIcon={<ArrowLeft />} disabled={pending}>
            Back
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          loading={pending}
          rightIcon={step < steps.length - 1 ? <ArrowRight /> : undefined}
        >
          {step < steps.length - 1 ? "Continue" : pending ? "Sending your request…" : "Request account"}
        </Button>
      </div>
    </form>
  );
}
