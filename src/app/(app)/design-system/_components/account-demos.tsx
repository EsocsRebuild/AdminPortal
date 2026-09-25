"use client";

import * as React from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { CountUp } from "@/components/motion/count-up";
import { SuccessCheck } from "@/components/motion/success-check";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/otp-input";
import { Stepper } from "@/components/ui/stepper";

export function AccountDemos() {
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [replay, setReplay] = React.useState(0);

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <p className="text-xs font-medium text-muted-foreground">Stepper</p>
        <Stepper steps={["About you", "Your church", "Security"]} current={step} />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <Button size="sm" onClick={() => setStep((s) => Math.min(3, s + 1))}>
            Next
          </Button>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <Field label="Password" htmlFor="ds-pw">
            <PasswordInput id="ds-pw" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <PasswordStrength password={password} />
        </div>
        <div className="grid content-start gap-3">
          <p className="text-sm font-medium">Verification code</p>
          <OtpInput value={code} onChange={setCode} />
          <p className="text-xs text-muted-foreground">
            Paste a 6-digit code, or type. Backspace and arrows work.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-8">
        <div key={replay} className="flex items-center gap-6">
          <SuccessCheck />
          <p className="tabular text-metric font-semibold">
            <CountUp value={1250} />
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setReplay((n) => n + 1)}>
          Replay animations
        </Button>
      </div>
    </div>
  );
}
