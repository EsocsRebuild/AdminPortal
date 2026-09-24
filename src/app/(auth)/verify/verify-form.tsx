"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { easeOutExpo } from "@/components/motion/reveal";
import { SuccessCheck } from "@/components/motion/success-check";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { toast } from "@/components/ui/toaster";
import { useCountdown } from "@/hooks/use-countdown";
import { sleep } from "@/lib/utils";

export function VerifyForm() {
  const email = useSearchParams().get("email") ?? "your email";
  const [code, setCode] = React.useState("");
  const [state, setState] = React.useState<"idle" | "checking" | "wrong" | "done">("idle");
  const [attempt, setAttempt] = React.useState(0);
  const resend = useCountdown(30);

  async function check(value: string) {
    setState("checking");
    await sleep(700); // TODO: POST /auth/verify
    // Demo: 000000 is treated as a wrong code.
    if (value === "000000") {
      setState("wrong");
      setAttempt((n) => n + 1);
      setCode("");
      return;
    }
    setState("done");
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
            <h1 className="text-heading-lg font-semibold">You’re all set</h1>
            <p className="text-md text-muted-foreground">
              Your email is confirmed. An administrator will approve your access shortly. We’ll email you as
              soon as they do.
            </p>
          </div>
          <Button size="lg" fullWidth asChild rightIcon={<ArrowRight />}>
            <Link href="/dashboard">Take a look around</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div key="form" exit={{ opacity: 0, scale: 0.98 }} className="grid gap-8">
          <AuthHeader
            icon={<MailCheck />}
            title="Check your email"
            description={
              <>
                We sent a 6-digit code to{" "}
                <span className="font-medium break-all text-foreground">{email}</span>. Enter it below.
              </>
            }
          />
          <div className="grid gap-3">
            <div key={attempt}>
              <OtpInput
                value={code}
                onChange={(v) => {
                  setCode(v);
                  if (state === "wrong") setState("idle");
                }}
                onComplete={check}
                invalid={state === "wrong"}
                disabled={state === "checking"}
                autoFocus
              />
            </div>
            <p aria-live="polite" className="min-h-5 text-sm">
              {state === "checking" && <span className="text-muted-foreground">Checking your code…</span>}
              {state === "wrong" && (
                <span className="text-danger">That code didn’t work. Check the email and try again.</span>
              )}
            </p>
          </div>
          <Button
            size="lg"
            fullWidth
            loading={state === "checking"}
            disabled={code.length < 6}
            onClick={() => check(code)}
          >
            Confirm email
          </Button>
          <p className="text-center text-base text-muted-foreground">
            Didn’t get it? Check your spam folder, or{" "}
            {resend.done ? (
              <button
                type="button"
                className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  resend.restart();
                  toast.success("New code sent", { description: `Check ${email}.` });
                }}
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
