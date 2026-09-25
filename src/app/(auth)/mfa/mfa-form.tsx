"use client";

import { AnimatePresence, motion } from "motion/react";
import { KeyRound, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { verifyMfa } from "@/features/auth/actions";
import type { ActionResult } from "@/lib/result";

export function MfaForm({ next }: { next?: string }) {
  const router = useRouter();
  const [method, setMethod] = React.useState<"totp" | "recovery">("totp");
  const [code, setCode] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<{ redirectTo: string }> | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  async function submit(value = code) {
    setPending(true);
    const res = await verifyMfa({ method, code: value, rememberDevice: remember, next });
    setResult(res);
    if (res.ok) {
      router.replace(res.data.redirectTo);
      router.refresh();
      return;
    }
    setPending(false);
    setAttempt((n) => n + 1);
    setCode("");
    if (res.code === "UNAUTHENTICATED" && /expired/i.test(res.message))
      router.replace("/login?reason=expired");
  }

  const error =
    result && !result.ok
      ? result.code === "VALIDATION"
        ? "Check the code and try again."
        : result.message
      : null;

  return (
    <div className="grid gap-8">
      <AuthHeader
        icon={method === "totp" ? <Smartphone /> : <KeyRound />}
        title="Two-step verification"
        description={
          method === "totp"
            ? "Open your authenticator app and enter the 6-digit code for ESOCS Admin."
            : "Enter one of the recovery codes you saved when you turned on two-step verification."
        }
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="grid gap-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="grid gap-2"
          >
            {method === "totp" ? (
              <div key={attempt}>
                <OtpInput
                  value={code}
                  onChange={setCode}
                  onComplete={(v) => void submit(v)}
                  invalid={!!error}
                  disabled={pending}
                  autoFocus
                  aria-label="Authentication code"
                />
              </div>
            ) : (
              <Field label="Recovery code" htmlFor="recovery">
                <Input
                  id="recovery"
                  size="lg"
                  autoComplete="one-time-code"
                  autoFocus
                  className="font-mono tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-invalid={!!error}
                />
              </Field>
            )}
            <p aria-live="polite" className="min-h-5 text-sm text-danger">
              {error}
            </p>
          </motion.div>
        </AnimatePresence>
        <Checkbox
          label="Don’t ask again on this device for 30 days"
          checked={remember}
          onCheckedChange={(v) => setRemember(v === true)}
        />
        <Button type="submit" size="lg" fullWidth loading={pending} disabled={code.length < 6}>
          Verify
        </Button>
      </form>
      <div className="grid gap-2 text-center text-base text-muted-foreground">
        <button
          type="button"
          className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => {
            setMethod(method === "totp" ? "recovery" : "totp");
            setCode("");
            setResult(null);
          }}
        >
          {method === "totp" ? "Use a recovery code instead" : "Use my authenticator app"}
        </button>
        <Link href="/login" className="text-sm hover:text-foreground">
          Cancel and go back
        </Link>
      </div>
    </div>
  );
}
