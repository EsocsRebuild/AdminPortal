"use client";

import * as React from "react";

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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { sleep } from "@/lib/utils";

const parishes = [
  "Mount Zion, Lagos",
  "Holy Trinity, Ibadan",
  "Seraph Temple, Abuja",
  "Cherub Cathedral, Kaduna",
];

export function MemberFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name")).trim()) next.name = "Enter the member's full name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPending(true);
    await sleep(700); // TODO: api.post("/members", { body: Object.fromEntries(data) })
    setPending(false);
    onOpenChange(false);
    toast.success("Member added", { description: `${data.get("name")} has been added to the register.` });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>
              They&apos;ll receive a welcome email with a link to complete their profile.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="m-name" required error={errors.name} className="sm:col-span-2">
              <Input
                id="m-name"
                name="name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby="m-name-msg"
              />
            </Field>
            <Field label="Email" htmlFor="m-email" required error={errors.email}>
              <Input
                id="m-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="m-email-msg"
              />
            </Field>
            <Field label="Phone" htmlFor="m-phone" optional>
              <Input id="m-phone" name="phone" type="tel" autoComplete="tel" placeholder="+234" />
            </Field>
            <Field label="Parish" htmlFor="m-parish" className="sm:col-span-2">
              <Select name="parish" defaultValue={parishes[0]}>
                <SelectTrigger id="m-parish">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parishes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Switch
              name="welcome"
              defaultChecked
              label="Send welcome email"
              description="Includes service times and a link to the member portal."
              className="sm:col-span-2"
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Add member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
