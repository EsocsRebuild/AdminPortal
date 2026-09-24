import { ArrowRight, Download, HandCoins, Plus, Users, UsersRound, Church } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/blocks/stat-card";
import { Page, PageHeader } from "@/components/layout/page";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { activity, demoUser, kpis, tasks } from "@/lib/fixtures";
import { formatCompact, formatCurrency, formatNumber, formatRelative } from "@/lib/format";

import { GivingChart } from "./_components/giving-chart";
import { RangeControl } from "./_components/range-control";

export const metadata: Metadata = { title: "Dashboard" };

const kpiIcons = [<Users key="u" />, <HandCoins key="h" />, <UsersRound key="r" />, <Church key="c" />];

const topParishes = [
  { name: "Mount Zion, Lagos", amount: 3_820_000, target: 4_000_000 },
  { name: "Seraph Temple, Abuja", amount: 2_940_000, target: 3_500_000 },
  { name: "Holy Trinity, Ibadan", amount: 2_110_000, target: 3_000_000 },
  { name: "Grace Parish, Port Harcourt", amount: 1_480_000, target: 2_500_000 },
];

const toneDot = {
  success: "bg-success",
  primary: "bg-primary",
  danger: "bg-danger",
  info: "bg-info",
  warning: "bg-warning",
} as const;

export default function DashboardPage() {
  const firstName = demoUser.name.split(" ")[0];
  return (
    <Page>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening across the church today."
        actions={
          <>
            <Button variant="secondary" leftIcon={<Download />}>
              Export
            </Button>
            <Button leftIcon={<Plus />} asChild>
              <Link href="/members?new=1">Add member</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Key metrics" className="grid gap-page sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={"currency" in k ? formatCurrency(k.value, { compact: true }) : formatNumber(k.value)}
            delta={k.delta}
            trend={k.trend}
            icon={kpiIcons[i]}
          />
        ))}
      </section>

      <div className="grid gap-page xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Giving"
            description="Tithes and offerings received, all parishes"
            actions={<RangeControl />}
          />
          <CardContent>
            <GivingChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Needs attention" description="Items waiting on you" />
          <CardContent className="grid content-start gap-2">
            {tasks.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className="group flex items-center gap-3 rounded-control border border-border p-3 transition-colors hover:border-border-strong hover:bg-surface-hover"
              >
                <span className={`size-2 shrink-0 rounded-full ${toneDot[t.tone]}`} aria-hidden />
                <span className="flex-1 font-medium">{t.title}</span>
                <Badge tone={t.tone} className="tabular">
                  {t.count}
                </Badge>
                <ArrowRight className="size-4 text-faint-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </CardContent>
          <CardFooter>
            <span>All caught up on approvals from last week.</span>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-page lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent activity"
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/audit-log">View all</Link>
              </Button>
            }
          />
          <CardContent className="pt-2">
            <ol className="relative grid gap-5 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-px before:bg-border">
              {activity.map((a) => (
                <li key={a.id} className="relative flex gap-3">
                  <Avatar name={a.actor} size="sm" className="ring-4 ring-surface" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-subtle-foreground" suppressHydrationWarning>
                      {formatRelative(a.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Top parishes" description="September giving against target" />
          <CardContent className="grid content-start gap-5">
            {topParishes.map((p) => {
              const pct = p.amount / p.target;
              return (
                <div key={p.name} className="grid gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-medium">{p.name}</span>
                    <span className="shrink-0 tabular text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {formatCurrency(p.amount, { compact: true })}
                      </span>{" "}
                      / {formatCompact(p.target)}
                    </span>
                  </div>
                  <Progress
                    value={pct * 100}
                    tone={pct >= 0.9 ? "success" : pct < 0.6 ? "warning" : "primary"}
                    aria-label={`${p.name}: ${Math.round(pct * 100)}% of target`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
