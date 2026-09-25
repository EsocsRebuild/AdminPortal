"use client";

import * as React from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { useAction } from "@/hooks/use-action";
import { formatRelative } from "@/lib/format";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { changePassword } from "../actions";
import { changePasswordInput } from "../schemas";

export function PasswordForm({ changedAt }: { changedAt: string | null }) {
  const blank = { current: "", next: "", confirm: "" };
  const [v, setV] = React.useState(blank);
  const [errors, setErrors] = React.useState<Errors>({});
  const save = useAction(changePassword, {
    success: "Password changed. You’ve been signed out on other devices.",
    onSuccess: () => setV(blank),
  });

  return (
    <Card>
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const check = validate(changePasswordInput, v);
          if (!check.ok) return setErrors(check.errors);
          const res = await save.run(v);
          setErrors(resultErrors(res));
        }}
      >
        <CardHeader
          title="Password"
          description={
            changedAt ? (
              <span suppressHydrationWarning>Last changed {formatRelative(changedAt)}.</span>
            ) : (
              "Use a long, unique password."
            )
          }
        />
        <CardContent className="grid max-w-lg gap-4">
          <Field label="Current password" htmlFor="pw-current" error={errors.current}>
            <PasswordInput
              id="pw-current"
              autoComplete="current-password"
              value={v.current}
              onChange={(e) => setV({ ...v, current: e.target.value })}
              aria-invalid={!!errors.current}
              aria-describedby="pw-current-msg"
            />
          </Field>
          <Field label="New password" htmlFor="pw-next" error={errors.next}>
            <PasswordInput
              id="pw-next"
              autoComplete="new-password"
              value={v.next}
              onChange={(e) => setV({ ...v, next: e.target.value })}
              aria-invalid={!!errors.next}
              aria-describedby="pw-next-msg pw-strength"
              maxLength={128}
            />
          </Field>
          {v.next && <PasswordStrength id="pw-strength" password={v.next} />}
          <Field label="Type the new password again" htmlFor="pw-confirm" error={errors.confirm}>
            <PasswordInput
              id="pw-confirm"
              autoComplete="new-password"
              value={v.confirm}
              onChange={(e) => setV({ ...v, confirm: e.target.value })}
              aria-invalid={!!errors.confirm}
              aria-describedby="pw-confirm-msg"
              maxLength={128}
            />
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" loading={save.pending} disabled={!v.current || !v.next}>
            Change password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
