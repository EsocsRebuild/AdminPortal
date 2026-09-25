"use client";

import { MailOpen, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { acceptInvitation } from "@/features/auth/actions";
import { acceptInviteSchema } from "@/features/auth/schemas";

type Errors = Partial<Record<"name" | "password" | "confirm", string>>;

export function InviteForm({
  token,
  invitation,
}: {
  token: string;
  invitation: { email: string; name: string | null; roleName: string; invitedBy: string };
}) {
  const router = useRouter();
  const [form, setForm] = React.useState({ name: invitation.name ?? "", password: "", confirm: "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const [banner, setBanner] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = acceptInviteSchema.safeParse({ token, ...form });
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) next[i.path[0] as keyof Errors] ??= i.message;
      return setErrors(next);
    }
    setErrors({});
    setPending(true);
    const res = await acceptInvitation({ token, ...form });
    if (res.ok) return router.replace("/login?reason=invite-accepted");
    setPending(false);
    setBanner(res.message);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <AuthHeader
        icon={<MailOpen />}
        title="You’re invited"
        description={
          <>
            {invitation.invitedBy} invited{" "}
            <span className="font-medium text-foreground">{invitation.email}</span> to join as{" "}
            <span className="font-medium text-foreground">{invitation.roleName}</span>.
          </>
        }
      />
      {banner && <Alert tone="danger">{banner}</Alert>}
      <Field label="Your full name" htmlFor="inv-name" error={errors.name}>
        <Input
          id="inv-name"
          size="lg"
          autoComplete="name"
          prefix={<UserRound />}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={!!errors.name}
          aria-describedby="inv-name-msg"
        />
      </Field>
      <Field label="Create a password" htmlFor="inv-password" error={errors.password}>
        <PasswordInput
          id="inv-password"
          size="lg"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          aria-invalid={!!errors.password}
          aria-describedby="inv-password-msg inv-strength"
          maxLength={128}
        />
      </Field>
      <PasswordStrength id="inv-strength" password={form.password} />
      <Field label="Type it again" htmlFor="inv-confirm" error={errors.confirm}>
        <PasswordInput
          id="inv-confirm"
          size="lg"
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          aria-invalid={!!errors.confirm}
          aria-describedby="inv-confirm-msg"
          maxLength={128}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={pending}>
        Create my account
      </Button>
    </form>
  );
}
