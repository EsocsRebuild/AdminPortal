"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CircleAlert,
  LayoutTemplate,
  Send,
  SendHorizontal,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { useModals } from "@/components/modals/modal-provider";
import { easeOutExpo } from "@/components/motion/reveal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SaveStatus } from "@/components/ui/save-status";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Stepper } from "@/components/ui/stepper";
import type { AudienceList } from "@/features/audiences/types";
import { EmailEditor } from "@/features/email-builder/email-editor";
import { EmailPreview } from "@/features/email-builder/email-preview";
import { EmailThumbnail } from "@/features/email-builder/email-thumbnail";
import { mergeTags } from "@/features/email-builder/merge-tags";
import type { EmailDocument } from "@/features/email-builder/types";
import type { Template } from "@/features/templates/types";
import { useAction } from "@/hooks/use-action";
import { useAutosave } from "@/hooks/use-autosave";
import { formatDateTime, formatNumber } from "@/lib/format";
import { cn, pluralize } from "@/lib/utils";

import {
  estimateRecipients,
  scheduleCampaign,
  sendCampaignNow,
  sendTestEmail,
  updateCampaign,
} from "../actions";
import { readyToSendSchema } from "../schemas";
import type { Campaign, SenderProfile } from "../types";

const steps = [
  { id: "setup", label: "Set-up" },
  { id: "audience", label: "Audience" },
  { id: "content", label: "Content" },
  { id: "review", label: "Review & send" },
] as const;
type StepId = (typeof steps)[number]["id"];

/** Which step fixes each readiness problem. */
const issueStep: Record<string, StepId> = {
  subject: "setup",
  fromName: "setup",
  fromEmail: "setup",
  listIds: "audience",
  content: "content",
};

export function CampaignComposer({
  campaign,
  audiences,
  sender,
  templates,
}: {
  campaign: Campaign;
  audiences: AudienceList[];
  sender: SenderProfile;
  templates: Template[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const modals = useModals();
  const canSend = usePermission("campaigns:send");

  const current = (steps.find((s) => s.id === params.get("step"))?.id ?? "setup") as StepId;
  const stepIndex = steps.findIndex((s) => s.id === current);
  const [direction, setDirection] = React.useState(1);

  const [setup, setSetup] = React.useState({
    name: campaign.name,
    subject: campaign.subject ?? "",
    previewText: campaign.previewText ?? "",
    fromName: campaign.fromName ?? sender.defaultFromName ?? sender.organisationName,
    fromEmail: campaign.fromEmail ?? sender.fromAddresses.find((a) => a.verified)?.email ?? "",
    replyTo: campaign.replyTo ?? sender.defaultReplyTo ?? "",
  });
  const [listIds, setListIds] = React.useState<string[]>(campaign.audience.listIds);
  const [content, setContent] = React.useState<EmailDocument>(campaign.content);

  const draft = React.useMemo(() => ({ setup, listIds, content }), [setup, listIds, content]);
  const save = useAutosave(draft, (d) =>
    updateCampaign({ id: campaign.id, setup: d.setup, audience: { listIds: d.listIds }, content: d.content }),
  );

  // Live recipient estimate.
  const [estimate, setEstimate] = React.useState<{ count: number; loading: boolean }>({
    count: campaign.recipientCount ?? 0,
    loading: false,
  });
  React.useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setEstimate((e) => ({ ...e, loading: true }));
      const res = await estimateRecipients({ listIds });
      if (!cancelled) setEstimate({ count: res.ok ? res.data.count : 0, loading: false });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [listIds]);

  const readiness = React.useMemo(() => {
    const r = readyToSendSchema.safeParse({ ...setup, listIds, content });
    const issues = r.success
      ? []
      : r.error.issues.map((i) => ({ step: issueStep[String(i.path[0])] ?? "content", message: i.message }));
    // One message per field keeps the checklist short.
    return issues.filter((i, idx) => issues.findIndex((j) => j.message === i.message) === idx);
  }, [setup, listIds, content]);

  const go = (id: StepId) => {
    const next = steps.findIndex((s) => s.id === id);
    setDirection(next > stepIndex ? 1 : -1);
    const q = new URLSearchParams(params.toString());
    q.set("step", id);
    router.replace(`?${q}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function applyTemplate(t: Template) {
    if (content.blocks.length > 0) {
      const ok = await modals.confirm({
        title: `Use “${t.name}”?`,
        description:
          "This replaces the current content of the email. Your set-up and audience stay the same.",
        confirmLabel: "Replace content",
      });
      if (!ok) return;
    }
    setContent(structuredClone(t.content));
  }

  return (
    <div className="grid gap-page pb-24">
      {/* Header */}
      <div className="grid gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back to campaigns">
            <Link href="/campaigns">
              <ArrowLeft />
            </Link>
          </Button>
          <div className="grid min-w-0 flex-1">
            <span className="text-xs text-muted-foreground">Draft campaign</span>
            <h1 className="truncate text-heading-md font-semibold">{setup.name || "Untitled campaign"}</h1>
          </div>
          <SaveStatus state={save.state} onRetry={save.flush} />
        </div>
        <nav aria-label="Campaign steps">
          <Stepper steps={steps.map((s) => s.label)} current={stepIndex} />
        </nav>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.28, ease: easeOutExpo }}
        >
          {current === "setup" && <SetupStep setup={setup} onChange={setSetup} sender={sender} />}
          {current === "audience" && (
            <AudienceStep audiences={audiences} listIds={listIds} onChange={setListIds} estimate={estimate} />
          )}
          {current === "content" && (
            <div className="grid gap-5">
              {templates.length > 0 && <TemplateStrip templates={templates} onPick={applyTemplate} />}
              <EmailEditor
                value={content}
                onChange={setContent}
                preview={{
                  subject: setup.subject,
                  previewText: setup.previewText,
                  fromName: setup.fromName,
                  organisation: { name: sender.organisationName, address: sender.postalAddress },
                }}
              />
            </div>
          )}
          {current === "review" && (
            <ReviewStep
              campaign={campaign}
              setup={setup}
              content={content}
              audiences={audiences.filter((a) => listIds.includes(a.id))}
              recipients={estimate.count}
              issues={readiness}
              sender={sender}
              canSend={canSend}
              saving={save.state !== "saved"}
              onFix={go}
              beforeSend={save.flush}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step navigation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl lg:left-[var(--spacing-sidebar)] lg:rail:left-[var(--spacing-rail)]">
        <div className="mx-auto flex max-w-app items-center justify-between gap-3 px-gutter py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft />}
            disabled={stepIndex === 0}
            onClick={() => go(steps[stepIndex - 1].id)}
          >
            Back
          </Button>
          <span className="hidden text-sm text-muted-foreground sm:block">
            Step {stepIndex + 1} of {steps.length}
          </span>
          {stepIndex < steps.length - 1 ? (
            <Button rightIcon={<ArrowRight />} onClick={() => go(steps[stepIndex + 1].id)}>
              {steps[stepIndex + 1].label}
            </Button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

function SetupStep({
  setup,
  onChange,
  sender,
}: {
  setup: {
    name: string;
    subject: string;
    previewText: string;
    fromName: string;
    fromEmail: string;
    replyTo: string;
  };
  onChange: (s: typeof setup) => void;
  sender: SenderProfile;
}) {
  const set = (k: keyof typeof setup, v: string) => onChange({ ...setup, [k]: v });
  const verified = sender.fromAddresses.filter((a) => a.verified);
  return (
    <div className="grid gap-page lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card>
        <CardHeader title="The basics" description="What people see in their inbox before they open it." />
        <CardContent className="grid gap-5">
          <Field label="Campaign name" htmlFor="c-name" hint="Only you and your team see this.">
            <Input
              id="c-name"
              value={setup.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={100}
              aria-describedby="c-name-msg"
            />
          </Field>
          <Field
            label="Subject line"
            htmlFor="c-subject"
            hint={`${setup.subject.length}/150 · Short and specific works best.`}
          >
            <Input
              id="c-subject"
              autoFocus
              placeholder="e.g. Join us for Harvest Thanksgiving this Sunday"
              value={setup.subject}
              onChange={(e) => set("subject", e.target.value)}
              maxLength={150}
              aria-describedby="c-subject-msg"
            />
          </Field>
          <div className="-mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Personalise:</span>
            {mergeTags.slice(0, 1).map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => set("subject", `${setup.subject}${setup.subject ? " " : ""}${t.tag}`)}
                className="cursor-pointer rounded-full border border-border px-2 py-0.5 text-xs hover:border-primary hover:text-primary"
              >
                {t.label}
              </button>
            ))}
          </div>
          <Field
            label="Preview text"
            htmlFor="c-preview"
            optional
            hint="Shown after the subject in most inboxes."
          >
            <Input
              id="c-preview"
              value={setup.previewText}
              onChange={(e) => set("previewText", e.target.value)}
              maxLength={150}
              aria-describedby="c-preview-msg"
            />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Sender" />
        <CardContent className="grid gap-5">
          <Field label="From name" htmlFor="c-fromName">
            <Input
              id="c-fromName"
              value={setup.fromName}
              onChange={(e) => set("fromName", e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="From address" htmlFor="c-fromEmail">
            {verified.length ? (
              <Select value={setup.fromEmail || undefined} onValueChange={(v) => set("fromEmail", v)}>
                <SelectTrigger id="c-fromEmail">
                  <SelectValue placeholder="Choose an address" />
                </SelectTrigger>
                <SelectContent>
                  {verified.map((a) => (
                    <SelectItem key={a.email} value={a.email}>
                      {a.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert tone="warning" title="No verified sending address">
                Ask an administrator to verify your domain in{" "}
                <Link href="/settings/email" className="underline">
                  Settings → Email sending
                </Link>
                .
              </Alert>
            )}
          </Field>
          <Field label="Replies go to" htmlFor="c-replyTo" optional>
            <Input
              id="c-replyTo"
              type="email"
              value={setup.replyTo}
              onChange={(e) => set("replyTo", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function AudienceStep({
  audiences,
  listIds,
  onChange,
  estimate,
}: {
  audiences: AudienceList[];
  listIds: string[];
  onChange: (ids: string[]) => void;
  estimate: { count: number; loading: boolean };
}) {
  const toggle = (id: string, on: boolean) =>
    onChange(on ? [...listIds, id] : listIds.filter((x) => x !== id));
  return (
    <div className="grid gap-page lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card>
        <CardHeader title="Who should receive it?" description="Choose one or more audiences." />
        <CardContent className="grid gap-2">
          {audiences.length === 0 ? (
            <Alert tone="info" title="You don’t have any audiences yet">
              <Link href="/audiences" className="underline">
                Create an audience
              </Link>{" "}
              first, then come back. Your draft is saved.
            </Alert>
          ) : (
            audiences.map((a) => {
              const on = listIds.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-card border p-3.5 transition-[border-color,background-color] duration-200",
                    on ? "border-primary/50 bg-primary-soft/40" : "border-border hover:border-border-strong",
                  )}
                >
                  <Checkbox
                    checked={on}
                    onCheckedChange={(v) => toggle(a.id, v === true)}
                    aria-label={a.name}
                  />
                  <span className="grid flex-1">
                    <span className="font-medium">{a.name}</span>
                    {a.description && <span className="text-sm text-muted-foreground">{a.description}</span>}
                  </span>
                  <span className="tabular text-sm text-muted-foreground">
                    {formatNumber(a.subscriberCount)}
                  </span>
                </label>
              );
            })
          )}
        </CardContent>
      </Card>
      <Card variant="muted" className="h-fit">
        <CardContent className="grid gap-3">
          <span className="grid size-10 place-items-center rounded-card bg-surface text-primary shadow-xs">
            <UsersRound className="size-5" />
          </span>
          <p className="text-sm text-muted-foreground">This email will go to</p>
          <p className="flex items-center gap-2 tabular text-metric font-semibold" aria-live="polite">
            {formatNumber(estimate.count)}
            {estimate.loading && <Spinner className="size-4 text-muted-foreground" />}
          </p>
          <p className="text-sm text-muted-foreground">
            people. Anyone on more than one list gets it once, and people who unsubscribed are left out
            automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TemplateStrip({ templates, onPick }: { templates: Template[]; onPick: (t: Template) => void }) {
  return (
    <section aria-label="Start from a template" className="grid gap-2">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <LayoutTemplate className="size-4 text-muted-foreground" /> Start from a template
      </h3>
      <div className="-mx-1 scrollbar-none flex gap-3 overflow-x-auto mask-fade-x px-1 pb-1">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPick(t)}
            className="w-44 shrink-0 cursor-pointer overflow-hidden rounded-card border border-border bg-surface text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
          >
            <EmailThumbnail document={t.content} className="h-24" size="sm" />
            <span className="block truncate border-t border-border-subtle px-3 py-2 text-sm font-medium">
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ReviewStep({
  campaign,
  setup,
  content,
  audiences,
  recipients,
  issues,
  sender,
  canSend,
  saving,
  onFix,
  beforeSend,
}: {
  campaign: Campaign;
  setup: { subject: string; previewText: string; fromName: string; fromEmail: string };
  content: EmailDocument;
  audiences: AudienceList[];
  recipients: number;
  issues: { step: StepId; message: string }[];
  sender: SenderProfile;
  canSend: boolean;
  saving: boolean;
  onFix: (s: StepId) => void;
  beforeSend: () => Promise<void>;
}) {
  const router = useRouter();
  const modals = useModals();
  const [mode, setMode] = React.useState<"now" | "schedule">("now");
  const [when, setWhen] = React.useState("");
  const [testTo, setTestTo] = React.useState("");
  const ready = issues.length === 0;

  const test = useAction(sendTestEmail, { success: "Test email sent. Check your inbox." });
  const send = useAction(sendCampaignNow, {
    success: `Sending to ${formatNumber(recipients)} people`,
    onSuccess: () => router.replace(`/campaigns/${campaign.id}`),
  });
  const schedule = useAction(scheduleCampaign, {
    success: "Campaign scheduled",
    onSuccess: () => router.replace(`/campaigns/${campaign.id}`),
  });

  async function onSend() {
    await beforeSend();
    if (mode === "schedule") {
      const at = new Date(when);
      if (Number.isNaN(at.getTime())) return;
      const ok = await modals.confirm({
        title: "Schedule this campaign?",
        description: `It will go to ${pluralize(recipients, "person", "people")} on ${formatDateTime(at)}. You can cancel any time before then.`,
        confirmLabel: "Schedule",
      });
      if (ok) await schedule.run({ id: campaign.id, sendAt: at.toISOString() });
      return;
    }
    const ok = await modals.confirm({
      tone: "danger",
      title: `Send to ${pluralize(recipients, "person", "people")} now?`,
      description: "Once it starts sending it can’t be recalled. Make sure you’ve sent yourself a test.",
      confirmLabel: "Send now",
      confirmText: "SEND",
    });
    if (ok) await send.run({ id: campaign.id, expectedRecipients: recipients });
  }

  // Earliest allowed schedule time, fixed when the step opens.
  const [minWhen] = React.useState(() =>
    new Date(Date.now() + 10 * 60_000 - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16),
  );

  return (
    <div className="grid gap-page lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="grid content-start gap-page">
        <Card>
          <CardHeader title="Checklist" />
          <CardContent className="grid gap-2">
            {ready ? (
              <p className="flex items-center gap-2 text-success-soft-foreground">
                <span className="grid size-6 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                Everything looks good.
              </p>
            ) : (
              issues.map((i) => (
                <button
                  key={i.message}
                  type="button"
                  onClick={() => onFix(i.step)}
                  className="flex cursor-pointer items-center gap-3 rounded-control px-2 py-2 text-left hover:bg-surface-hover"
                >
                  <CircleAlert className="size-4 shrink-0 text-warning" />
                  <span className="flex-1">{i.message}</span>
                  <span className="text-sm text-primary">Fix</span>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Summary" />
          <CardContent>
            <dl className="grid gap-4 text-base">
              {[
                ["Subject", setup.subject || "—"],
                ["From", setup.fromName && setup.fromEmail ? `${setup.fromName} <${setup.fromEmail}>` : "—"],
                ["Audience", audiences.map((a) => a.name).join(", ") || "—"],
                ["Recipients", formatNumber(recipients)],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-0.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Send a test"
            description="See exactly what people will get. Up to 5 addresses, separated by commas."
          />
          <CardContent>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                await beforeSend();
                await test.run({ id: campaign.id, emails: testTo.split(/[,\s]+/).filter(Boolean) });
              }}
            >
              <Input
                type="text"
                inputMode="email"
                placeholder="you@example.com"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                aria-label="Test email addresses"
              />
              <Button
                type="submit"
                variant="secondary"
                leftIcon={<SendHorizontal />}
                loading={test.pending}
                disabled={!testTo.trim()}
              >
                Send test
              </Button>
            </form>
            {test.errorFor("emails") && (
              <p className="mt-1.5 text-xs text-danger">{test.errorFor("emails")}</p>
            )}
          </CardContent>
        </Card>

        <Card className={cn(ready && canSend && "border-primary/30 ring-4 ring-primary/5")}>
          <CardHeader title="Send it" />
          <CardContent className="grid gap-4">
            {!canSend ? (
              <Alert tone="info">
                Your role can prepare campaigns but not send them. Ask an administrator with sending rights to
                review and send it.
              </Alert>
            ) : (
              <>
                <SegmentedControl
                  aria-label="When to send"
                  value={mode}
                  onValueChange={setMode}
                  options={[
                    { value: "now", label: "Send now", icon: <Send /> },
                    { value: "schedule", label: "Schedule", icon: <CalendarClock /> },
                  ]}
                />
                {mode === "schedule" && (
                  <Field
                    label="Date and time"
                    htmlFor="c-when"
                    hint={`In your local time zone (${Intl.DateTimeFormat().resolvedOptions().timeZone}).`}
                  >
                    <Input
                      id="c-when"
                      type="datetime-local"
                      min={minWhen}
                      value={when}
                      onChange={(e) => setWhen(e.target.value)}
                      aria-describedby="c-when-msg"
                    />
                  </Field>
                )}
                <Button
                  size="lg"
                  leftIcon={mode === "now" ? <Send /> : <CalendarClock />}
                  disabled={!ready || saving || recipients === 0 || (mode === "schedule" && !when)}
                  loading={send.pending || schedule.pending}
                  onClick={onSend}
                >
                  {mode === "now" ? `Send to ${formatNumber(recipients)} people` : "Schedule campaign"}
                </Button>
                {saving && <p className="text-xs text-muted-foreground">Saving your latest changes first…</p>}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--spacing-topbar)+1rem)] lg:self-start">
        <EmailPreview
          document={content}
          subject={setup.subject}
          previewText={setup.previewText}
          fromName={setup.fromName}
          organisation={{ name: sender.organisationName, address: sender.postalAddress }}
        />
      </div>
    </div>
  );
}
