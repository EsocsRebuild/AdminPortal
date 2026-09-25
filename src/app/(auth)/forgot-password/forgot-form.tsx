"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, KeyRound, Mail, MailOpen } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useCountdown } from "@/hooks/use-countdown";
import { requestPasswordReset } from "@/features/auth/actions";

export function ForgotForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const resend = useCountdown(30);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter the email you use to sign in.");
    setPending(true);
    const res = await requestPasswordReset({ email });
    setPending(false);
    if (!res.ok) return setError(res.fieldErrors?.email?.[0] ?? res.message);
    resend.restart();
    setSent(true);
  }

  return (
    <div className="grid gap-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="grid gap-6"
          >
            <AuthHeader
              icon={<MailOpen />}
              title="Check your inbox"
              description={
                <>
                  If an account exists for{" "}
                  <span className="font-medium break-all text-foreground">{email}</span>, you’ll get a link to
                  choose a new password. It works for 30 minutes.
                </>
              }
            />
            <ol className="grid gap-3 rounded-card bg-surface-muted p-4 text-sm text-muted-foreground">
              {[
                "Open the email from ESOCS Admin",
                "Select “Choose a new password”",
                "Sign in with your new password",
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface text-xs font-semibold text-foreground shadow-xs">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="text-center text-base text-muted-foreground">
              Nothing yet?{" "}
              {resend.done ? (
                <button
                  type="button"
                  className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
                  onClick={async () => {
                    resend.restart();
                    const res = await requestPasswordReset({ email });
                    if (res.ok) toast.success("Email sent again");
                    else toast.error(res.message);
                  }}
                >
                  Send it again
                </button>
              ) : (
                <span className="tabular">You can resend in {resend.left}s</span>
              )}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6"
          >
            <AuthHeader
              icon={<KeyRound />}
              title="Forgot your password?"
              description="No problem. Enter your email and we’ll send you a link to reset it."
            />
            <Field label="Email address" htmlFor="fp-email" error={error}>
              <Input
                id="fp-email"
                type="email"
                size="lg"
                autoComplete="email"
                autoFocus
                prefix={<Mail />}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(undefined);
                }}
                aria-invalid={!!error}
                aria-describedby="fp-email-msg"
              />
            </Field>
            <Button type="submit" size="lg" fullWidth loading={pending}>
              Send reset link
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      <Button variant="ghost" asChild leftIcon={<ArrowLeft />} className="justify-self-center">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </div>
  );
}
