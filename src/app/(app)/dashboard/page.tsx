import { ArrowRight, CheckCircle2, FormInput, Mail, MailOpen, Users, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/blocks/stat-card";
import { StatusBadge } from "@/components/blocks/status-badge";
import { Page } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { recentAuditEvents } from "@/features/audit/queries";
import { listCampaigns } from "@/features/campaigns/queries";
import { campaignStatusLabels, openRate } from "@/features/campaigns/types";
import { getDashboardSummary } from "@/features/dashboard/queries";
import { formatNumber, formatPercent, formatRelative } from "@/lib/format";
import { can } from "@/lib/permissions";
import { requirePermission } from "@/server/session";

import { GettingStarted, type SetupStep } from "./_components/getting-started";
import { Greeting } from "./_components/greeting";
import { QuickActions } from "./_components/quick-actions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requirePermission("dashboard:view");
  const [summary, campaigns, activity] = await Promise.all([
    getDashboardSummary(),
    can(user, "campaigns:view") ? listCampaigns({ page: 1, pageSize: 5, sort: "updatedAt", dir: "desc" }).then((r) => r.data) : null,
    can(user, "audit:view") ? recentAuditEvents(6) : null,
  ]);

  const steps: SetupStep[] = [
    { id: "mfa", title: "Turn on two-step verification", href: "/settings/security", done: user.mfaEnabled },
    ...(can(user, "settings:manage")
      ? [
          { id: "domain", title: "Verify your email domain", href: "/settings/email", done: summary.setup.domainVerified },
          { id: "address", title: "Add your postal address", href: "/settings/email", done: summary.setup.postalAddressSet },
        ]
      : []),
    ...(can(user, "audiences:manage") ? [{ id: "audience", title: "Create your first audience", href: "/audiences", done: summary.setup.hasAudience }] : []),
    ...(can(user, "forms:manage") ? [{ id: "form", title: "Build your first form", href: "/forms/new", done: summary.setup.hasForm }] : []),
  ];

  const tasks = [
    can(user, "users:manage") && summary.pending.accessRequests > 0
      ? { title: "Approve account requests", count: summary.pending.accessRequests, href: "/users/requests", tone: "warning" as const }
      : null,
    can(user, "members:manage") && summary.pending.memberApprovals > 0
      ? { title: "Review new members", count: summary.pending.memberApprovals, href: "/members?status=pending", tone: "info" as const }
      : null,
    can(user, "campaigns:view") && summary.pending.scheduledCampaigns > 0
      ? { title: "Campaigns scheduled to send", count: summary.pending.scheduledCampaigns, href: "/campaigns?status=scheduled", tone: "primary" as const }
      : null,
  ].filter((t) => t !== null);

  const stats = [
    summary.members && <StatCard key="m" label="Members" value={summary.members.total} delta={summary.members.delta ?? undefined} trend={summary.members.trend} icon={<Users />} />,
    summary.audience && <StatCard key="a" label="Email subscribers" value={summary.audience.subscribers} delta={summary.audience.delta ?? undefined} trend={summary.audience.trend} icon={<UsersRound />} />,
    summary.campaigns && (
      <StatCard
        key="c"
        label="Average open rate"
        value={summary.campaigns.averageOpenRate === null ? "—" : formatPercent(summary.campaigns.averageOpenRate)}
        deltaLabel=""
        icon={<MailOpen />}
      />
    ),
    summary.forms && <StatCard key="f" label="Form responses (30 days)" value={summary.forms.responsesLast30Days} icon={<FormInput />} />,
  ].filter(Boolean);

  return (
    <Page>
      <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-page" gap={0.07}>
        <StaggerItem>
          <Greeting name={user.name.split(" ")[0]} />
        </StaggerItem>

        <StaggerItem>
          <QuickActions user={user} />
        </StaggerItem>

        <StaggerItem>
          <GettingStarted steps={steps} />
        </StaggerItem>

        {stats.length > 0 && (
          <StaggerItem>
            <section aria-label="Key numbers" className="grid gap-page sm:grid-cols-2 xl:grid-cols-4">
              {stats}
            </section>
          </StaggerItem>
        )}

        <StaggerItem className="grid gap-page xl:grid-cols-3">
          <Card className={campaigns ? "xl:col-span-2" : "xl:col-span-3"}>
            <CardHeader
              title="Needs your attention"
              description="Things waiting on you right now."
            />
            <CardContent className="grid content-start gap-1">
              {tasks.length === 0 ? (
                <div className="flex items-center gap-3 rounded-control bg-success-soft/50 p-4 text-sm">
                  <CheckCircle2 className="size-5 text-success" /> You’re all caught up.
                </div>
              ) : (
                tasks.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group -mx-2 flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="flex-1 text-base">{t.title}</span>
                    <Badge tone={t.tone} className="tabular">
                      {formatNumber(t.count)}
                    </Badge>
                    <ArrowRight className="size-4 text-faint-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {campaigns && (
            <Card>
              <CardHeader
                title="Recent campaigns"
                actions={
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/campaigns">See all</Link>
                  </Button>
                }
              />
              <CardContent className="grid content-start gap-1 pt-2">
                {campaigns.length === 0 ? (
                  <EmptyState size="compact" icon={<Mail />} title="No campaigns yet" />
                ) : (
                  campaigns.map((c) => (
                    <Link
                      key={c.id}
                      href={c.status === "draft" ? `/campaigns/${c.id}/edit` : `/campaigns/${c.id}`}
                      className="-mx-2 grid gap-1 rounded-control px-2 py-2.5 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{c.name}</span>
                        <StatusBadge status={c.status} label={campaignStatusLabels[c.status]} />
                      </span>
                      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {c.stats ? `${formatPercent(openRate(c.stats))} opened · ` : ""}
                        {formatRelative(c.sentAt ?? c.updatedAt)}
                      </span>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </StaggerItem>

        {activity && (
          <StaggerItem>
            <Card>
              <CardHeader
                title="Recent activity"
                actions={
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/audit-log">Full history</Link>
                  </Button>
                }
              />
              <CardContent className="pt-2">
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  <ol className="relative grid gap-5 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-px before:bg-border">
                    {activity.map((a) => (
                      <li key={a.id} className="relative flex gap-3">
                        <Avatar name={a.actor?.name ?? "System"} size="sm" className="ring-4 ring-surface" />
                        <div className="min-w-0 flex-1">
                          <p className="text-base">
                            {a.actor && <span className="font-medium">{a.actor.name} </span>}
                            <span className="text-muted-foreground">{a.summary}</span>
                          </p>
                          <p className="text-xs text-subtle-foreground" suppressHydrationWarning>
                            {formatRelative(a.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        )}
      </Stagger>
    </Page>
  );
}
