"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { passwordScore, PasswordStrength } from "@/components/auth/password-strength";
import { easeOutExpo } from "@/components/motion/reveal";
import { SuccessCheck } from "@/components/motion/success-check";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { sleep } from "@/lib/utils";

export function ResetForm() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState<{ password?: string; confirm?: string }>({});
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      password:
        passwordScore(password) < 3
          ? "Make your password a little stronger (see the list below)."
          : undefined,
      confirm: confirm !== password ? "The two passwords don’t match yet." : undefined,
    };
    setErrors(next);
    if (next.password || next.confirm) return;
    setPending(true);
    await sleep(700); // TODO: POST /auth/reset-password with the token from the link
    setDone(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="grid justify-items-center gap-6 text-center"
        >
          <SuccessCheck />
          <div className="grid gap-2">
            <h1 className="text-heading-lg font-semibold">Password updated</h1>
            <p className="text-md text-muted-foreground">You can now sign in with your new password.</p>
          </div>
          <Button size="lg" fullWidth asChild rightIcon={<ArrowRight />}>
            <Link href="/login">Sign in</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, scale: 0.98 }}
          onSubmit={onSubmit}
          noValidate
          className="grid gap-6"
        >
          <AuthHeader
            icon={<LockKeyhole />}
            title="Choose a new password"
            description="Pick something you haven’t used here before."
          />
          <Field label="New password" htmlFor="rp-password" error={errors.password}>
            <PasswordInput
              id="rp-password"
              size="lg"
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby="rp-password-msg rp-strength"
            />
          </Field>
          <PasswordStrength id="rp-strength" password={password} />
          <Field label="Type it again" htmlFor="rp-confirm" error={errors.confirm}>
            <PasswordInput
              id="rp-confirm"
              size="lg"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
              aria-describedby="rp-confirm-msg"
            />
          </Field>
          <Button type="submit" size="lg" fullWidth loading={pending}>
            Update password
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
