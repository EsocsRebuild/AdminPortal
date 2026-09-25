"use client";

import { Mail, UserPlus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { inviteAdmin } from "../actions";
import { inviteInput } from "../schemas";
import type { Role } from "../types";

export function InviteButton({ roles }: { roles: Role[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(() => params.get("invite") === "1");
  const [v, setV] = React.useState({ email: "", name: "", roleId: "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const invite = useAction(inviteAdmin, {
    success: `Invitation sent`,
    onSuccess: () => {
      setOpen(false);
      setV({ email: "", name: "", roleId: "" });
      if (params.get("invite")) router.replace(pathname);
    },
  });
  const assignable = roles.filter((r) => !r.locked);
  const role = roles.find((r) => r.id === v.roleId);

  return (
    <Can permission="users:manage">
      <Button leftIcon={<UserPlus />} onClick={() => setOpen(true)}>
        Invite administrator
      </Button>
      <Dialog open={open} onOpenChange={(o) => !invite.pending && setOpen(o)}>
        <DialogContent>
          <form
            noValidate
            className="flex min-h-0 flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              const check = validate(inviteInput, v);
              if (!check.ok)
                return setErrors({ ...check.errors, roleId: check.errors.roleId && "Choose a role." });
              const res = await invite.run(v);
              if (!res.ok) setErrors(resultErrors(res));
            }}
          >
            <DialogHeader>
              <DialogTitle>Invite an administrator</DialogTitle>
              <DialogDescription>
                They’ll get an email with a link to set their password. The link expires in 7 days.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-4">
              <Field label="Email" htmlFor="inv-email" error={errors.email} required>
                <Input
                  id="inv-email"
                  type="email"
                  autoFocus
                  prefix={<Mail />}
                  value={v.email}
                  onChange={(e) => setV({ ...v, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby="inv-email-msg"
                />
              </Field>
              <Field label="Name" htmlFor="inv-name" optional>
                <Input
                  id="inv-name"
                  value={v.name}
                  onChange={(e) => setV({ ...v, name: e.target.value })}
                  maxLength={120}
                />
              </Field>
              <Field
                label="Role"
                htmlFor="inv-role"
                error={errors.roleId}
                hint={role?.description ?? "Decides what they can see and do."}
              >
                <Select value={v.roleId || undefined} onValueChange={(roleId) => setV({ ...v, roleId })}>
                  <SelectTrigger id="inv-role" aria-invalid={!!errors.roleId} aria-describedby="inv-role-msg">
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignable.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={invite.pending}>
                Cancel
              </Button>
              <Button type="submit" loading={invite.pending}>
                Send invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
