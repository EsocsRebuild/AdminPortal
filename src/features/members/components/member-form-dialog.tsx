"use client";

import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import type { Parish } from "@/features/lookups/queries";
import { useAction } from "@/hooks/use-action";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { createMember, updateMember } from "../actions";
import { memberInput } from "../schemas";
import { memberStatuses, statusLabels, type Member } from "../types";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parishId: string;
  rank: string;
  gender: "female" | "male" | "";
  dateOfBirth: string;
  address: string;
  notes: string;
  status: (typeof memberStatuses)[number];
  emailConsent: boolean;
};

function initial(member?: Member): Values {
  return {
    firstName: member?.firstName ?? "",
    lastName: member?.lastName ?? "",
    email: member?.email ?? "",
    phone: member?.phone ?? "",
    parishId: member?.parish?.id ?? "",
    rank: member?.rank ?? "",
    gender: member?.gender ?? "",
    dateOfBirth: member?.dateOfBirth?.slice(0, 10) ?? "",
    address: member?.address ?? "",
    notes: member?.notes ?? "",
    status: member?.status ?? "active",
    emailConsent: member?.emailConsent ?? false,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-3 text-xs font-medium text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

export function MemberFormDialog({
  open,
  onOpenChange,
  parishes,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parishes: Parish[];
  /** Editing when set; creating otherwise. */
  member?: Member;
}) {
  const router = useRouter();
  const editing = !!member;
  const [values, setValues] = React.useState<Values>(() => initial(member));
  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    if (open) {
      setValues(initial(member));
      setErrors({});
    }
  }, [open, member]);

  const create = useAction(createMember, {
    success: (d) => `${d.name} was added`,
    onSuccess: (d) => {
      onOpenChange(false);
      router.push(`/members/${d.id}`);
    },
  });
  const update = useAction(updateMember, {
    success: "Changes saved",
    onSuccess: () => onOpenChange(false),
  });
  const pending = create.pending || update.pending;

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...values, gender: values.gender || null };
    const check = validate(memberInput, payload);
    if (!check.ok) return setErrors(check.errors);
    const res = editing ? await update.run({ id: member.id, values: payload }) : await create.run(payload);
    if (!res.ok) setErrors(resultErrors(res, "values."));
  }

  const err = (k: keyof Values) => errors[k];
  const describe = (k: keyof Values) => (err(k) ? `m-${k}-msg` : undefined);

  return (
    <Dialog open={open} onOpenChange={(o) => !pending && onOpenChange(o)}>
      <DialogContent size="lg">
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit member" : "Add a member"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update their details. Changes are recorded in the audit log." : "Only a name and parish are required. You can add the rest later."}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-7">
            <Section title="Name">
              <Field label="First name" htmlFor="m-firstName" error={err("firstName")} required>
                <Input id="m-firstName" autoFocus autoComplete="off" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!err("firstName")} aria-describedby={describe("firstName")} maxLength={60} />
              </Field>
              <Field label="Last name" htmlFor="m-lastName" error={err("lastName")} required>
                <Input id="m-lastName" autoComplete="off" value={values.lastName} onChange={(e) => set("lastName", e.target.value)} aria-invalid={!!err("lastName")} aria-describedby={describe("lastName")} maxLength={60} />
              </Field>
            </Section>

            <Section title="Contact">
              <Field label="Email" htmlFor="m-email" error={err("email")} optional>
                <Input id="m-email" type="email" prefix={<Mail />} autoComplete="off" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")} aria-describedby={describe("email")} />
              </Field>
              <Field label="Phone" htmlFor="m-phone" error={err("phone")} optional>
                <Input id="m-phone" type="tel" prefix={<Phone />} autoComplete="off" placeholder="+234" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err("phone")} aria-describedby={describe("phone")} />
              </Field>
              <div className="rounded-card border border-border bg-surface-muted/50 p-3.5 sm:col-span-2">
                <Switch
                  label="Happy to receive email updates"
                  description="Only switch this on if they’ve agreed. Members without consent are never added to email campaigns."
                  checked={values.emailConsent}
                  onCheckedChange={(v) => set("emailConsent", v)}
                  disabled={!values.email}
                />
              </div>
            </Section>

            <Section title="Church">
              <Field label="Parish" htmlFor="m-parishId" error={err("parishId")} required>
                <Select value={values.parishId} onValueChange={(v) => set("parishId", v)}>
                  <SelectTrigger id="m-parishId" aria-invalid={!!err("parishId")} aria-describedby={describe("parishId")}>
                    <SelectValue placeholder="Choose a parish" />
                  </SelectTrigger>
                  <SelectContent>
                    {parishes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Rank or title" htmlFor="m-rank" error={err("rank")} optional>
                <Input id="m-rank" placeholder="e.g. Elder" value={values.rank} onChange={(e) => set("rank", e.target.value)} maxLength={60} />
              </Field>
              <Field label="Status" htmlFor="m-status">
                <Select value={values.status} onValueChange={(v) => set("status", v as Values["status"])}>
                  <SelectTrigger id="m-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {memberStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </Section>

            <Section title="Personal">
              <Field label="Gender" htmlFor="m-gender" optional>
                <Select value={values.gender || undefined} onValueChange={(v) => set("gender", v as Values["gender"])}>
                  <SelectTrigger id="m-gender">
                    <SelectValue placeholder="Not set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of birth" htmlFor="m-dateOfBirth" error={err("dateOfBirth")} optional>
                <Input id="m-dateOfBirth" type="date" max={new Date().toISOString().slice(0, 10)} value={values.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} aria-invalid={!!err("dateOfBirth")} aria-describedby={describe("dateOfBirth")} />
              </Field>
              <Field label="Address" htmlFor="m-address" optional className="sm:col-span-2">
                <Input id="m-address" autoComplete="off" value={values.address} onChange={(e) => set("address", e.target.value)} maxLength={240} />
              </Field>
              <Field label="Notes" htmlFor="m-notes" optional hint="Visible to administrators only." className="sm:col-span-2">
                <Textarea id="m-notes" rows={3} value={values.notes} onChange={(e) => set("notes", e.target.value)} maxLength={2000} aria-describedby="m-notes-msg" />
              </Field>
            </Section>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              {editing ? "Save changes" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
