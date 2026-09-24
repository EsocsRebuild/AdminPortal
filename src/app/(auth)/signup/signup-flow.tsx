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
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { passwordScore, PasswordStrength } from "@/components/auth/password-strength";
import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { sleep } from "@/lib/utils";

const parishes = [
  "Mount Zion, Lagos",
  "Holy Trinity, Ibadan",
  "Seraph Temple, Abuja",
  "Cherub Cathedral, Kaduna",
  "Grace Parish, Port Harcourt",
  "Bethel, Abeokuta",
];

const roles = [
  {
    value: "parish_admin",
    icon: Church,
    title: "Parish administrator",
    text: "Manage members and events for a parish.",
  },
  { value: "finance", icon: HandCoins, title: "Finance", text: "Record giving and see financial reports." },
  {
    value: "editor",
    icon: BookOpenText,
    title: "Content editor",
    text: "Publish sermons, news and announcements.",
  },
  { value: "viewer", icon: Eye, title: "Just looking", text: "View information without making changes." },
];

const steps = [
  { label: "About you", title: "Let’s get you set up", description: "It takes about two minutes." },
  { label: "Your church", title: "Where do you serve?", description: "This decides what you’ll see first." },
  { label: "Security", title: "Create a password", description: "You’ll use it with your email to sign in." },
];

type Form = {
  name: string;
  email: string;
  phone: string;
  parish: string;
  role: string;
  password: string;
  confirm: string;
  terms: boolean;
};

function validate(step: number, f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (step === 0) {
    if (f.name.trim().split(/\s+/).length < 2) e.name = "Please enter your first and last name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "That email doesn’t look right. Check for typos.";
  }
  if (step === 1) {
    if (!f.parish) e.parish = "Choose the parish you serve in.";
    if (!f.role) e.role = "Choose what you’ll mostly do.";
  }
  if (step === 2) {
    if (passwordScore(f.password) < 3)
      e.password = "Make your password a little stronger (see the list below).";
    if (f.confirm !== f.password) e.confirm = "The two passwords don’t match yet.";
    if (!f.terms) e.terms = "Please agree to continue.";
  }
  return e;
}

export function SignupFlow() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof Form, string>>>({});
  const [form, setForm] = React.useState<Form>({
    name: "",
    email: "",
    phone: "",
    parish: "",
    role: "",
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
    setStep(next);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length) {
      // Move focus to the first problem so it's easy to fix.
      const first = Object.keys(found)[0];
      document.getElementById(`su-${first}`)?.focus();
      return;
    }
    if (step < steps.length - 1) return go(step + 1);
    setPending(true);
    await sleep(800); // TODO: POST /auth/signup
    router.push(`/verify?email=${encodeURIComponent(form.email)}`);
  }

  const s = steps[step];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      <Stepper steps={steps.map((x) => x.label)} current={step} />

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.3, ease: easeOutExpo }}
          className="grid gap-6"
        >
          <AuthHeader
            icon={step === 0 ? <UserRoundPlus /> : undefined}
            title={s.title}
            description={s.description}
          />

          {step === 0 && (
            <div className="grid gap-4">
              <Field label="Full name" htmlFor="su-name" error={errors.name}>
                <Input
                  id="su-name"
                  size="lg"
                  autoComplete="name"
                  autoFocus
                  prefix={<UserRound />}
                  placeholder="e.g. Adaeze Okafor"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby="su-name-msg"
                />
              </Field>
              <Field
                label="Email address"
                htmlFor="su-email"
                error={errors.email}
                hint="We’ll send a short code here to confirm it’s you."
              >
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
              <Field label="Phone number" htmlFor="su-phone" optional>
                <Input
                  id="su-phone"
                  type="tel"
                  size="lg"
                  autoComplete="tel"
                  prefix={<Phone />}
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5">
              <Field label="Parish" htmlFor="su-parish" error={errors.parish}>
                <Select value={form.parish} onValueChange={(v) => set("parish", v)}>
                  <SelectTrigger
                    id="su-parish"
                    size="lg"
                    aria-invalid={!!errors.parish}
                    aria-describedby="su-parish-msg"
                  >
                    <SelectValue placeholder="Choose your parish" />
                  </SelectTrigger>
                  <SelectContent>
                    {parishes.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
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
                  id="su-role"
                  value={form.role}
                  onValueChange={(v) => set("role", v)}
                  aria-labelledby="su-role-label"
                  aria-describedby={errors.role ? "su-role-msg" : undefined}
                  className="grid gap-2"
                >
                  {roles.map((r) => (
                    <RadioCard key={r.value} value={r.value} className="group flex items-center gap-3.5 p-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-control bg-surface-muted text-muted-foreground transition-colors duration-200 group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground">
                        <r.icon className="size-[1.125rem]" />
                      </span>
                      <span className="grid gap-0.5">
                        <span className="text-base font-medium">{r.title}</span>
                        <span className="text-sm text-muted-foreground">{r.text}</span>
                      </span>
                    </RadioCard>
                  ))}
                </RadioPrimitive.Root>
                {errors.role && (
                  <p id="su-role-msg" role="alert" className="text-xs text-danger">
                    {errors.role}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">An administrator will confirm your access.</p>
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
          <Button
            variant="ghost"
            size="lg"
            onClick={() => go(step - 1)}
            leftIcon={<ArrowLeft />}
            disabled={pending}
          >
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
          {step < steps.length - 1 ? "Continue" : pending ? "Creating your account…" : "Create account"}
        </Button>
      </div>
    </form>
  );
}
