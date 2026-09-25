"use client";

import { Save } from "lucide-react";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AudienceList } from "@/features/audiences/types";
import { useAction } from "@/hooks/use-action";
import { resultErrors, type Errors } from "@/lib/validate";

import { updateFormSettings, updateFormSlug } from "../actions";
import type { Form } from "../types";

const NONE = "__none";
const toLocal = (iso: string | null) =>
  iso ? new Date(new Date(iso).getTime() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : "";

export function FormSettingsForm({ form, audiences, canManage, appUrl }: { form: Form; audiences: AudienceList[]; canManage: boolean; appUrl: string }) {
  const s = form.settings;
  const [v, setV] = React.useState({
    submitLabel: s.submitLabel,
    confirmationTitle: s.confirmationTitle,
    confirmationMessage: s.confirmationMessage,
    redirectUrl: s.redirectUrl ?? "",
    closesAt: toLocal(s.closesAt),
    limitOn: s.responseLimit !== null,
    responseLimit: s.responseLimit?.toString() ?? "",
    notifyEmails: s.notifyEmails.join(", "),
    audienceId: s.audienceId ?? NONE,
  });
  const [slug, setSlug] = React.useState(form.slug);
  const [errors, setErrors] = React.useState<Errors>({});
  const save = useAction(updateFormSettings, { success: "Settings saved" });
  const saveSlug = useAction(updateFormSlug, { success: "Link updated" });
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((x) => ({ ...x, [k]: val }));
  const hasConsent = form.fields.some((f) => f.type === "consent");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await save.run({
      id: form.id,
      settings: {
        submitLabel: v.submitLabel,
        confirmationTitle: v.confirmationTitle,
        confirmationMessage: v.confirmationMessage,
        redirectUrl: v.redirectUrl,
        closesAt: v.closesAt ? new Date(v.closesAt).toISOString() : null,
        responseLimit: v.limitOn && v.responseLimit ? Number(v.responseLimit) : null,
        notifyEmails: v.notifyEmails.split(/[,\s]+/).filter(Boolean),
        audienceId: v.audienceId === NONE ? null : v.audienceId,
      },
    });
    setErrors(res.ok ? {} : resultErrors(res, "settings."));
  }

  return (
    <form onSubmit={submit} noValidate className="grid max-w-3xl gap-page">
      <fieldset disabled={!canManage} className="contents">
        <Card>
          <CardHeader title="After someone submits" />
          <CardContent className="grid gap-5">
            <Field label="Button text" htmlFor="fs-submit" error={errors.submitLabel}>
              <Input id="fs-submit" value={v.submitLabel} onChange={(e) => set("submitLabel", e.target.value)} maxLength={40} className="max-w-xs" aria-describedby="fs-submit-msg" />
            </Field>
            <Field label="Thank-you heading" htmlFor="fs-title" error={errors.confirmationTitle}>
              <Input id="fs-title" value={v.confirmationTitle} onChange={(e) => set("confirmationTitle", e.target.value)} maxLength={120} aria-describedby="fs-title-msg" />
            </Field>
            <Field label="Thank-you message" htmlFor="fs-msg" optional>
              <Textarea id="fs-msg" rows={3} value={v.confirmationMessage} onChange={(e) => set("confirmationMessage", e.target.value)} maxLength={1000} />
            </Field>
            <Field label="Then send them to" htmlFor="fs-redirect" optional error={errors.redirectUrl} hint="A page on your website, e.g. event details. Leave empty to just show the thank-you message.">
              <Input id="fs-redirect" type="url" placeholder="https://" value={v.redirectUrl} onChange={(e) => set("redirectUrl", e.target.value)} aria-describedby="fs-redirect-msg" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Limits" description="Close the form automatically." />
          <CardContent className="grid gap-5">
            <Field label="Stop accepting responses on" htmlFor="fs-close" optional hint="In your local time.">
              <Input id="fs-close" type="datetime-local" value={v.closesAt} onChange={(e) => set("closesAt", e.target.value)} className="max-w-xs" aria-describedby="fs-close-msg" />
            </Field>
            <Switch label="Limit the number of responses" description="Useful for events with limited places." checked={v.limitOn} onCheckedChange={(on) => set("limitOn", on)} />
            {v.limitOn && (
              <Field label="Maximum responses" htmlFor="fs-limit" error={errors.responseLimit}>
                <Input id="fs-limit" type="number" min={1} value={v.responseLimit} onChange={(e) => set("responseLimit", e.target.value)} className="max-w-40" />
              </Field>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Notifications & follow-up" />
          <CardContent className="grid gap-5">
            <Field label="Email these people about new responses" htmlFor="fs-notify" optional error={errors.notifyEmails} hint="Separate addresses with commas. Up to 10.">
              <Input id="fs-notify" value={v.notifyEmails} onChange={(e) => set("notifyEmails", e.target.value)} aria-describedby="fs-notify-msg" />
            </Field>
            <Field label="Add people who agree to emails to an audience" htmlFor="fs-audience" optional>
              <Select value={v.audienceId} onValueChange={(x) => set("audienceId", x)} disabled={!canManage || audiences.length === 0}>
                <SelectTrigger id="fs-audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Don’t add to an audience</SelectItem>
                  {audiences.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {v.audienceId !== NONE && !hasConsent && (
              <Alert tone="warning">
                Add an <span className="font-medium">Agreement</span> question to the form. Only people who tick it are added, so nobody is emailed without consent.
              </Alert>
            )}
          </CardContent>
        </Card>

        {canManage && (
          <div className="flex justify-end">
            <Button type="submit" leftIcon={<Save />} loading={save.pending}>
              Save settings
            </Button>
          </div>
        )}
      </fieldset>

      {canManage && (
        <Card>
          <CardHeader title="Form link" description="Changing it breaks any links you’ve already shared." />
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 items-center rounded-control border border-input bg-surface-muted pl-3 text-sm text-muted-foreground">
                <span className="shrink-0 truncate">{appUrl.replace(/^https?:\/\//, "")}/f/</span>
                <input
                  aria-label="Form link ending"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  maxLength={60}
                  className="h-control-md min-w-0 flex-1 rounded-r-control bg-surface px-2 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/20"
                />
              </div>
              <Button type="button" variant="secondary" loading={saveSlug.pending} disabled={slug === form.slug} onClick={() => saveSlug.run({ id: form.id, slug })}>
                Update link
              </Button>
            </div>
            {saveSlug.errorFor("slug") && <p className="mt-1.5 text-xs text-danger">{saveSlug.errorFor("slug")}</p>}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
