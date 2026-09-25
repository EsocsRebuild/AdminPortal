"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";

import { createForm } from "../actions";

export function NewFormButton() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(() => params.get("new") === "1");
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState<string>();
  const create = useAction(createForm, { onSuccess: ({ id }) => router.push(`/forms/${id}/edit`) });

  return (
    <Can permission="forms:manage">
      <Button leftIcon={<Plus />} onClick={() => setOpen(true)}>
        New form
      </Button>
      <Dialog open={open} onOpenChange={(o) => !create.pending && setOpen(o)}>
        <DialogContent size="sm">
          <form
            noValidate
            className="flex min-h-0 flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              if (title.trim().length < 2) return setError("Give the form a title.");
              const res = await create.run({ title });
              if (!res.ok) setError(res.fieldErrors?.title?.[0]);
            }}
          >
            <DialogHeader>
              <DialogTitle>New form</DialogTitle>
              <DialogDescription>For registrations, surveys, prayer requests, volunteer sign-ups… anything.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Field label="Form title" htmlFor="nf-title" error={error} hint="People see this at the top of the form.">
                <Input id="nf-title" autoFocus placeholder="e.g. Youth camp registration" value={title} onChange={(e) => { setTitle(e.target.value); setError(undefined); }} aria-invalid={!!error} aria-describedby="nf-title-msg" maxLength={150} />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={create.pending}>
                Cancel
              </Button>
              <Button type="submit" loading={create.pending}>
                Create and build
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
