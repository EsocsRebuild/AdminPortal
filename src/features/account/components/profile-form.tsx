"use client";

import { Mail, Phone, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { updateProfile } from "../actions";
import { profileInput } from "../schemas";
import type { Profile } from "../types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [v, setV] = React.useState({ name: profile.name, phone: profile.phone ?? "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const save = useAction(updateProfile, { success: "Profile updated", onSuccess: () => router.refresh() });
  const dirty = v.name !== profile.name || v.phone !== (profile.phone ?? "");

  return (
    <Card>
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const check = validate(profileInput, v);
          if (!check.ok) return setErrors(check.errors);
          const res = await save.run(v);
          setErrors(resultErrors(res));
        }}
      >
        <CardHeader
          title="Your profile"
          description="How you appear to other administrators and in the audit log."
        />
        <CardContent className="grid gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={v.name || profile.name} src={profile.avatarUrl} size="xl" />
            <p className="text-sm text-muted-foreground">
              Your initials are shown until photo uploads are available.
            </p>
          </div>
          <Field label="Full name" htmlFor="p-name" error={errors.name} inline>
            <Input
              id="p-name"
              autoComplete="name"
              value={v.name}
              onChange={(e) => setV({ ...v, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby="p-name-msg"
              maxLength={120}
            />
          </Field>
          <Field
            label="Email"
            htmlFor="p-email"
            hint="Used to sign in. Ask an administrator to change it."
            inline
          >
            <Input
              id="p-email"
              prefix={<Mail />}
              value={profile.email}
              readOnly
              disabled
              aria-describedby="p-email-msg"
            />
          </Field>
          <Field label="Phone" htmlFor="p-phone" error={errors.phone} optional inline>
            <Input
              id="p-phone"
              type="tel"
              prefix={<Phone />}
              autoComplete="tel"
              value={v.phone}
              onChange={(e) => setV({ ...v, phone: e.target.value })}
              aria-invalid={!!errors.phone}
              aria-describedby="p-phone-msg"
            />
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" leftIcon={<Save />} loading={save.pending} disabled={!dirty}>
            Save changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
