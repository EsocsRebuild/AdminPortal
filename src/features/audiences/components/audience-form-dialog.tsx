"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { createAudience, updateAudience } from "../actions";
import { listInput } from "../schemas";
import type { AudienceList } from "../types";

export function AudienceFormDialog({
  open,
  onOpenChange,
  audience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience?: AudienceList;
}) {
  const router = useRouter();
  const [values, setValues] = React.useState({ name: "", description: "", doubleOptIn: true });
  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    if (!open) return;
    setValues({
      name: audience?.name ?? "",
      description: audience?.description ?? "",
      doubleOptIn: audience?.doubleOptIn ?? true,
    });
    setErrors({});
  }, [open, audience]);

  const create = useAction(createAudience, {
    success: "Audience created",
    onSuccess: ({ id }) => {
      onOpenChange(false);
      router.push(`/audiences/${id}`);
    },
  });
  const update = useAction(updateAudience, { success: "Audience updated", onSuccess: () => onOpenChange(false) });
  const pending = create.pending || update.pending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const check = validate(listInput, values);
    if (!check.ok) return setErrors(check.errors);
    const res = audience ? await update.run({ id: audience.id, values }) : await create.run(values);
    if (!res.ok) setErrors(resultErrors(res, "values."));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !pending && onOpenChange(o)}>
      <DialogContent>
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>{audience ? "Edit audience" : "New audience"}</DialogTitle>
            <DialogDescription>An audience is a list of people you send emails to, like “Youth fellowship” or “Weekly newsletter”.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <Field label="Name" htmlFor="aud-name" error={errors.name} required>
              <Input id="aud-name" autoFocus value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby="aud-name-msg" maxLength={80} />
            </Field>
            <Field label="Description" htmlFor="aud-desc" optional hint="Helps other administrators know what this list is for.">
              <Textarea id="aud-desc" rows={2} value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} maxLength={280} aria-describedby="aud-desc-msg" />
            </Field>
            <div className="rounded-card border border-border bg-surface-muted/50 p-3.5">
              <Switch
                label="Ask new sign-ups to confirm by email"
                description="Recommended. Keeps your list clean and protects your sending reputation."
                checked={values.doubleOptIn}
                onCheckedChange={(v) => setValues({ ...values, doubleOptIn: v })}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              {audience ? "Save" : "Create audience"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
