import { ArrowLeft, CalendarClock, ExternalLink, Loader } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/blocks/stat-card";
import { StatusBadge } from "@/components/blocks/status-badge";
import { Page, PageHeader } from "@/components/layout/page";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { OpensChart } from "@/features/campaigns/components/opens-chart";
import { UnscheduleButton } from "@/features/campaigns/components/schedule-actions";
import { getCampaign, getCampaignReport, getSenderProfile } from "@/features/campaigns/queries";
import { campaignStatusLabels, clickRate, openRate } from "@/features/campaigns/types";
import { EmailPreview } from "@/features/email-builder/email-preview";
import { formatDateTime, formatNumber, formatPercent } from "@/lib/format";
import { assertId, findOrNotFound } from "@/server/query";

export async function generateMetadata({ params }: PageProps<"/campaigns/[id]">): Promise<Metadata> {
  const c = await getCampaign(assertId((await params).id)).catch(() => null);
  return { title: c?.name ?? "Campaign" };
}

export default async function CampaignPage({ params }: PageProps<"/campaigns/[id]">) {
  const id = assertId((await params).id);
  const campaign = await findOrNotFound(getCampaign(id));
  if (campaign.status === "draft") redirect(`/campaigns/${id}/edit`);
  const hasReport = ["sent", "sending", "paused"].includes(campaign.status);
  const [report, sender] = await Promise.all([hasReport ? getCampaignReport(id) : null, getSenderProfile()]);
  const s = report?.stats;

  return (
    <Page>
      <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
        <Link href="/campaigns">All campaigns</Link>
      </Button>
      <PageHeader
        eyebrow={
          <StatusBadge
            status={campaign.status}
            label={campaignStatusLabels[campaign.status]}
            className="w-fit"
          />
        }
        title={campaign.name}
        description={campaign.subject ?? undefined}
        actions={campaign.status === "scheduled" ? <UnscheduleButton id={id} /> : undefined}
      />

      {campaign.status === "scheduled" && campaign.scheduledAt && (
        <Alert tone="info" title={`Scheduled for ${formatDateTime(campaign.scheduledAt)}`}>
          It will go to {formatNumber(campaign.recipientCount ?? 0)} people. Cancel the schedule to make
          changes.
        </Alert>
      )}
      {campaign.status === "sending" && (
        <Alert tone="info" title="Sending now">
          <span className="inline-flex items-center gap-2">
            <Loader className="size-4 animate-spin" /> Large audiences can take a few minutes. Numbers below
            update as it goes.
          </span>
        </Alert>
      )}
      {campaign.status === "failed" && (
        <Alert tone="danger" title="This campaign couldn’t be sent">
          Nothing went out. Duplicate it to try again, or check Settings → Email sending.
        </Alert>
      )}

      {s && (
        <section aria-label="Results" className="grid gap-page sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Delivered" value={s.delivered} />
          <StatCard label="Opened" value={<>{formatPercent(openRate(s))}</>} />
          <StatCard label="Clicked" value={<>{formatPercent(clickRate(s))}</>} />
          <StatCard label="Unsubscribed" value={s.unsubscribes} />
        </section>
      )}

      <div className="grid gap-page xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
        <div className="grid content-start gap-page">
          {report && (
            <Card>
              <CardHeader title="Opens over time" description="Unique opens per hour after sending." />
              <CardContent>
                {report.timeline.length ? (
                  <OpensChart timeline={report.timeline} />
                ) : (
                  <EmptyState
                    size="compact"
                    title="No opens yet"
                    description="Most opens happen in the first day."
                  />
                )}
              </CardContent>
            </Card>
          )}
          {report && (
            <Card>
              <CardHeader title="Most clicked links" />
              <CardContent className="grid gap-1">
                {report.links.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No clicks yet.</p>
                ) : (
                  report.links.slice(0, 10).map((l) => (
                    <div
                      key={l.url}
                      className="flex items-center gap-3 rounded-control px-2 py-2 hover:bg-surface-hover"
                    >
                      <ExternalLink className="size-4 shrink-0 text-subtle-foreground" />
                      <span className="min-w-0 flex-1 truncate text-sm" title={l.url}>
                        {l.url.replace(/^https?:\/\//, "")}
                      </span>
                      <span className="tabular text-sm font-medium">{formatNumber(l.clicks)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader title="Details" />
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  [
                    "From",
                    campaign.fromName && campaign.fromEmail
                      ? `${campaign.fromName} <${campaign.fromEmail}>`
                      : "—",
                  ],
                  ["Recipients", formatNumber(campaign.recipientCount ?? 0)],
                  ["Sent", campaign.sentAt ? formatDateTime(campaign.sentAt) : "—"],
                  ["Created by", campaign.createdBy?.name ?? "—"],
                  ...(s
                    ? [
                        ["Bounced", formatNumber(s.bounces)],
                        ["Marked as spam", formatNumber(s.complaints)],
                      ]
                    : []),
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-0.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
        <div className="grid content-start gap-3">
          <h2 className="flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4 text-muted-foreground" /> What recipients see
          </h2>
          <EmailPreview
            document={campaign.content}
            subject={campaign.subject ?? ""}
            previewText={campaign.previewText ?? undefined}
            fromName={campaign.fromName ?? undefined}
            organisation={{ name: sender.organisationName, address: sender.postalAddress }}
          />
        </div>
      </div>
    </Page>
  );
}
