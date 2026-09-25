"use client";

import { AnimatePresence, motion } from "motion/react";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { easeOutExpo } from "@/components/motion/reveal";
import { SuccessCheck } from "@/components/motion/success-check";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { toast } from "@/components/ui/toaster";
import { resendVerification, verifyEmail } from "@/features/auth/actions";
import { useCountdown } from "@/hooks/use-countdown";

export function VerifyForm({ maskedEmail }: { maskedEmail: string }) {
  const [code, setCode] = React.useState("");
  const [state, setState] = React.useState<"idle" | "checking" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState(0);
  const resend = useCountdown(45);

  async function check(value: string) {
    setState("checking");
    setError(null);
    const res = await verifyEmail({ code: value });
    if (res.ok) return setState("done");
    setState("idle");
    setError(res.code === "VALIDATION" ? "That code didn’t work. Check the email and try again." : res.message);
    setAttempt((n) => n + 1);
    setCode("");
  }

  async function sendAgain() {
    resend.restart();
    const res = await resendVerification({});
    if (res.ok) toast.success("New code sent", { description: `Check ${maskedEmail}.` });
    else toast.error(res.message);
  }

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="grid justify-items-center gap-6 text-center"
        >
          <SuccessCheck />
          <div className="grid gap-2">
            <h1 className="text-heading-lg font-semibold">Email confirmed</h1>
            <p className="text-md text-muted-foreground">
              Your request is now with an administrator. We’ll email you as soon as your access is approved.
            </p>
          </div>
          <Button size="lg" fullWidth variant="secondary" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div key="form" exit={{ opacity: 0, scale: 0.98 }} className="grid gap-8">
          <AuthHeader
            icon={<MailCheck />}
            title="Check your email"
            description={
              <>
                We sent a 6-digit code to <span className="font-medium text-foreground">{maskedEmail}</span>. It
                expires in 15 minutes.
              </>
            }
          />
          <div className="grid gap-3">
            <div key={attempt}>
              <OtpInput
                value={code}
                onChange={(v) => {
                  setCode(v);
                  setError(null);
                }}
                onComplete={check}
                invalid={!!error}
                disabled={state === "checking"}
                autoFocus
              />
            </div>
            <p aria-live="polite" className="min-h-5 text-sm">
              {state === "checking" && <span className="text-muted-foreground">Checking your code…</span>}
              {error && <span className="text-danger">{error}</span>}
            </p>
          </div>
          <Button size="lg" fullWidth loading={state === "checking"} disabled={code.length < 6} onClick={() => check(code)}>
            Confirm email
          </Button>
          <p className="text-center text-base text-muted-foreground">
            Didn’t get it? Check your spam folder, or{" "}
            {resend.done ? (
              <button
                type="button"
                className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
                onClick={sendAgain}
              >
                send a new code
              </button>
            ) : (
              <span className="tabular">send a new code in {resend.left}s</span>
            )}
            .
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
