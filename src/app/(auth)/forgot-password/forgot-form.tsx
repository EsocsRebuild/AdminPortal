"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, KeyRound, Mail, MailOpen } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
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
    <div className="grid gap-6">
      {/* Top Prominent Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-slate-200 shadow-xs backdrop-blur-xs transition-all hover:border-amber-400/50 hover:bg-slate-900 hover:text-white"
        >
          <ArrowLeft className="size-3.5 text-amber-400 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to sign in</span>
        </Link>
      </div>

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
              icon={
                <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 shadow-inner">
                  <MailOpen className="size-6" />
                </div>
              }
              title="Check your inbox"
              description={
                <>
                  If an account exists for{" "}
                  <span className="font-bold break-all text-amber-300">{email}</span>, you’ll get a link to
                  choose a new password. It works for 30 minutes.
                </>
              }
            />
            <ol className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs font-medium text-slate-300">
              {[
                "Open the email from ESOCS Governance Admin",
                "Select “Choose a new password” link",
                "Sign in with your newly chosen credentials",
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-bold text-amber-400 ring-1 ring-amber-400/40">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <p className="text-center text-xs font-semibold text-slate-300">
              Nothing yet?{" "}
              {resend.done ? (
                <button
                  type="button"
                  className="cursor-pointer font-bold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
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
                <span className="tabular text-slate-400">You can resend in {resend.left}s</span>
              )}
            </p>
            <Button
              variant="outline"
              size="lg"
              asChild
              fullWidth
              className="border-slate-700 bg-slate-900 py-3 font-bold text-white transition-all hover:border-slate-600 hover:bg-slate-800"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="size-4 text-amber-400" />
                Return to Sign In
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5"
          >
            <AuthHeader
              icon={
                <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 shadow-inner">
                  <KeyRound className="size-6" />
                </div>
              }
              title="Forgot your password?"
              description="No problem. Enter your email and we’ll send you a link to reset it."
            />
            <div className="grid gap-1.5">
              <label htmlFor="fp-email" className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Mail className="size-3.5 text-amber-400" />
                Email address
              </label>
              <Input
                id="fp-email"
                type="email"
                size="lg"
                autoComplete="email"
                autoFocus
                prefix={<Mail className="text-amber-400" />}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(undefined);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "fp-email-msg" : undefined}
                className="border-slate-700 bg-slate-900 font-medium text-white placeholder:text-slate-400 focus-visible:ring-amber-400"
              />
              {error && (
                <p id="fp-email-msg" role="alert" className="text-xs font-semibold text-red-400">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={pending}
              className="flex items-center justify-center gap-2 bg-amber-500 py-3 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-950/50 transition-all hover:bg-amber-400"
            >
              {pending ? (
                "Sending reset link…"
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Visible Bottom Card to Return to Sign In */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-center">
        <p className="text-xs font-medium text-slate-300">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-bold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
          >
            Go back to sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
