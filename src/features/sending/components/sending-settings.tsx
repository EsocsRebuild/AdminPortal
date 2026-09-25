"use client";

import { CheckCircle2, Clock, Globe, Plus, RefreshCw, Save, Trash2, XCircle } from "lucide-react";
import * as React from "react";

import { useModals } from "@/components/modals/modal-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { formatRelative } from "@/lib/format";
import { resultErrors, validate, type Errors } from "@/lib/validate";

import { addSendingDomain, removeSendingDomain, updateSendingSettings, verifySendingDomain } from "../actions";
import { domainInput, sendingSettingsInput } from "../schemas";
import type { DnsStatus, SendingDomain, SendingSettings } from "../types";

const statusLabel: Record<DnsStatus, string> = { pending: "Waiting for DNS", verified: "Verified", failed: "Not found" };
const recordIcon: Record<DnsStatus, React.ReactNode> = {
  verified: <CheckCircle2 className="size-4 text-success" aria-label="Found" />,
  pending: <Clock className="size-4 text-warning" aria-label="Waiting" />,
  failed: <XCircle className="size-4 text-danger" aria-label="Not found" />,
};

function DomainCard({ domain }: { domain: SendingDomain }) {
  const modals = useModals();
  const verify = useAction(verifySendingDomain, {
    success: (r) => (r.status === "verified" ? "Domain verified. You can send from it now." : "Not verified yet. DNS changes can take up to 48 hours."),
  });
  const remove = useAction(removeSendingDomain, { success: "Domain removed" });
  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" /> {domain.domain}
            <StatusBadge status={domain.status === "verified" ? "verified" : domain.status === "failed" ? "failed" : "pending"} label={statusLabel[domain.status]} />
          </span>
        }
        description={domain.lastCheckedAt ? <span suppressHydrationWarning>Last checked {formatRelative(domain.lastCheckedAt)}</span> : undefined}
      />
      {domain.status !== "verified" && (
        <CardContent className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Add these records where your domain is managed (for example your web host or registrar), then select <span className="font-medium text-foreground">Check now</span>. Your IT person will know what to do.
          </p>
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="w-8 px-3 py-2" />
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {domain.records.map((r) => (
                  <tr key={`${r.type}-${r.host}`} className="border-t border-border-subtle align-top">
                    <td className="px-3 py-2.5">{recordIcon[r.status]}</td>
                    <td className="px-3 py-2.5 font-mono text-xs">{r.type}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <code className="font-mono text-xs break-all">{r.host}</code>
                        <CopyButton value={r.host} iconOnly variant="ghost" label="Copy name" />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.purpose}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-start gap-1">
                        <code className="max-w-md font-mono text-xs break-all">{r.value}</code>
                        <CopyButton value={r.value} iconOnly variant="ghost" label="Copy value" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
      <CardFooter className="justify-end">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Trash2 />}
          onClick={async () => {
            if (await modals.confirm({ tone: "danger", title: `Remove ${domain.domain}?`, description: "Campaigns can no longer be sent from addresses on this domain.", confirmLabel: "Remove domain" }))
              await remove.run({ id: domain.id });
          }}
        >
          Remove
        </Button>
        {domain.status !== "verified" && (
          <Button size="sm" leftIcon={<RefreshCw />} loading={verify.pending} onClick={() => verify.run({ id: domain.id })}>
            Check now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AddDomain() {
  const [open, setOpen] = React.useState(false);
  const [domain, setDomain] = React.useState("");
  const [error, setError] = React.useState<string>();
  const add = useAction(addSendingDomain, { success: "Domain added. Now add the DNS records.", onSuccess: () => { setOpen(false); setDomain(""); } });
  return (
    <>
      <Button variant="secondary" leftIcon={<Plus />} onClick={() => setOpen(true)}>
        Add a domain
      </Button>
      <Dialog open={open} onOpenChange={(o) => !add.pending && setOpen(o)}>
        <DialogContent size="sm">
          <form
            noValidate
            className="flex min-h-0 flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              const check = validate(domainInput, { domain });
              if (!check.ok) return setError(check.errors.domain);
              const res = await add.run({ domain });
              if (!res.ok) setError(res.fieldErrors?.domain?.[0]);
            }}
          >
            <DialogHeader>
              <DialogTitle>Add a sending domain</DialogTitle>
              <DialogDescription>The part after the @ in the address you want to send from.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Field label="Domain" htmlFor="dom" error={error}>
                <Input id="dom" autoFocus placeholder="esocs.org" value={domain} onChange={(e) => { setDomain(e.target.value); setError(undefined); }} aria-invalid={!!error} aria-describedby="dom-msg" />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={add.pending}>
                Cancel
              </Button>
              <Button type="submit" loading={add.pending}>
                Add domain
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SendingSettingsView({ settings }: { settings: SendingSettings }) {
  const [v, setV] = React.useState({
    organisationName: settings.organisationName,
    postalAddress: settings.postalAddress ?? "",
    defaultFromName: settings.defaultFromName ?? "",
    defaultFromEmail: settings.defaultFromEmail ?? "",
    defaultReplyTo: settings.defaultReplyTo ?? "",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const save = useAction(updateSendingSettings, { success: "Sending details saved" });

  return (
    <div className="grid gap-page">
      {!settings.postalAddress && (
        <Alert tone="warning" title="Add your postal address">
          It’s legally required in every marketing email, and campaigns can’t be sent without it.
        </Alert>
      )}
      <Card>
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const check = validate(sendingSettingsInput, v);
            if (!check.ok) return setErrors(check.errors);
            const res = await save.run(v);
            setErrors(resultErrors(res));
          }}
        >
          <CardHeader title="Organisation details" description="Shown in the footer of every email." />
          <CardContent className="grid gap-5">
            <Field label="Organisation name" htmlFor="s-org" error={errors.organisationName} inline>
              <Input id="s-org" value={v.organisationName} onChange={(e) => setV({ ...v, organisationName: e.target.value })} aria-invalid={!!errors.organisationName} aria-describedby="s-org-msg" maxLength={120} />
            </Field>
            <Field label="Postal address" htmlFor="s-addr" error={errors.postalAddress} inline>
              <Textarea id="s-addr" rows={2} value={v.postalAddress} onChange={(e) => setV({ ...v, postalAddress: e.target.value })} aria-invalid={!!errors.postalAddress} aria-describedby="s-addr-msg" maxLength={300} />
            </Field>
            <Field label="Default sender name" htmlFor="s-from" optional inline>
              <Input id="s-from" value={v.defaultFromName} onChange={(e) => setV({ ...v, defaultFromName: e.target.value })} maxLength={80} />
            </Field>
            <Field label="Default sender address" htmlFor="s-fromEmail" optional error={errors.defaultFromEmail} hint="Must be on a verified domain below." inline>
              <Input id="s-fromEmail" type="email" value={v.defaultFromEmail} onChange={(e) => setV({ ...v, defaultFromEmail: e.target.value })} aria-describedby="s-fromEmail-msg" />
            </Field>
            <Field label="Replies go to" htmlFor="s-reply" optional error={errors.defaultReplyTo} inline>
              <Input id="s-reply" type="email" value={v.defaultReplyTo} onChange={(e) => setV({ ...v, defaultReplyTo: e.target.value })} aria-describedby="s-reply-msg" />
            </Field>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" leftIcon={<Save />} loading={save.pending}>
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-0.5">
          <h2 className="text-heading-sm font-semibold">Sending domains</h2>
          <p className="text-sm text-muted-foreground">Verifying your domain stops your emails landing in spam.</p>
        </div>
        <AddDomain />
      </div>
      {settings.domains.length === 0 ? (
        <Card variant="outline">
          <EmptyState size="compact" icon={<Globe />} title="No domains yet" description="Add the domain your church’s email addresses use, for example esocs.org." />
        </Card>
      ) : (
        settings.domains.map((d) => <DomainCard key={d.id} domain={d} />)
      )}
    </div>
  );
}
