"use client";

import { Mail } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { addContact } from "../actions";
import { addContactInput } from "../schemas";

function AddContactDialogBody({
  listId,
  onOpenChange,
}: {
  listId: string;
  onOpenChange: (o: boolean) => void;
}) {
  const blank = { email: "", firstName: "", lastName: "", consent: false };
  const [values, setValues] = React.useState(blank);
  const [errors, setErrors] = React.useState<Errors>({});
  const add = useAction(addContact, { success: "Contact added" });

  async function submit(e: React.FormEvent, another = false) {
    e.preventDefault();
    const payload = { listId, ...values, consent: values.consent as true };
    const check = validate(addContactInput, payload);
    if (!check.ok) return setErrors(check.errors);
    const res = await add.run(payload);
    if (!res.ok) return setErrors(resultErrors(res));
    if (another) {
      setValues({ ...blank, consent: values.consent });
      document.getElementById("c-email")?.focus();
    } else onOpenChange(false);
  }

  return (
    <>
      <form onSubmit={(e) => submit(e)} noValidate className="flex min-h-0 flex-col">
        <DialogHeader>
          <DialogTitle>Add a contact</DialogTitle>
          <DialogDescription>For one person. To add many at once, use Import instead.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="c-email" error={errors.email} required className="sm:col-span-2">
            <Input
              id="c-email"
              type="email"
              autoFocus
              prefix={<Mail />}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby="c-email-msg"
            />
          </Field>
          <Field label="First name" htmlFor="c-first" optional>
            <Input
              id="c-first"
              value={values.firstName}
              onChange={(e) => setValues({ ...values, firstName: e.target.value })}
              maxLength={80}
            />
          </Field>
          <Field label="Last name" htmlFor="c-last" optional>
            <Input
              id="c-last"
              value={values.lastName}
              onChange={(e) => setValues({ ...values, lastName: e.target.value })}
              maxLength={80}
            />
          </Field>
          <div className="grid gap-1 sm:col-span-2">
            <Checkbox
              label="They’ve agreed to receive emails from us"
              checked={values.consent}
              onCheckedChange={(v) => setValues({ ...values, consent: v === true })}
            />
            {errors.consent && (
              <p role="alert" className="text-xs text-danger">
                {errors.consent}
              </p>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={add.pending}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={(e) => submit(e, true)} disabled={add.pending}>
            Save and add another
          </Button>
          <Button type="submit" loading={add.pending}>
            Add contact
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function AddContactDialog({
  listId,
  open,
  onOpenChange,
}: {
  listId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <AddContactDialogBody listId={listId} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
