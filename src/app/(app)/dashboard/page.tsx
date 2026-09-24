import { ArrowRight, Church, HandCoins, Users, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/blocks/stat-card";
import { Page } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { activity, demoUser, kpis, tasks } from "@/lib/fixtures";
import { formatCompact, formatCurrency, formatRelative } from "@/lib/format";

import { GettingStarted } from "./_components/getting-started";
import { GivingChart } from "./_components/giving-chart";
import { Greeting } from "./_components/greeting";
import { QuickActions } from "./_components/quick-actions";
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
      <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-page" gap={0.07}>
        <StaggerItem>
          <Greeting name={firstName} />
        </StaggerItem>

        <StaggerItem>
          <QuickActions />
        </StaggerItem>

        <StaggerItem>
          <GettingStarted />
        </StaggerItem>

        <StaggerItem>
          <section aria-label="Key numbers" className="grid gap-page sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k, i) => (
              <StatCard
                key={k.label}
                label={k.label}
                value={k.value}
                format={"currency" in k ? "currency" : "number"}
                delta={k.delta}
                trend={k.trend}
                icon={kpiIcons[i]}
              />
            ))}
          </section>
        </StaggerItem>

        <StaggerItem className="grid gap-page xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader
              title="Giving"
              description="Tithes and offerings received across all parishes"
              actions={<RangeControl />}
            />
            <CardContent>
              <GivingChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Needs your attention" description="Things waiting for you" />
            <CardContent className="grid content-start gap-1">
              {tasks.map((t) => (
                <Link
                  key={t.id}
                  href={t.href}
                  className="group -mx-2 flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className={`size-2 shrink-0 rounded-full ${toneDot[t.tone]}`} aria-hidden />
                  <span className="flex-1 text-base">{t.title}</span>
                  <Badge tone={t.tone} className="tabular">
                    {t.count}
                  </Badge>
                  <ArrowRight className="size-4 text-faint-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </CardContent>
            <CardFooter>You’re up to date on last week’s approvals.</CardFooter>
          </Card>
        </StaggerItem>

        <StaggerItem className="grid gap-page lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Recent activity"
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/audit-log">See all</Link>
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
            <CardHeader title="Top parishes" description="September giving compared with their target" />
            <CardContent className="grid content-start gap-5">
              {topParishes.map((p, i) => {
                const pct = p.amount / p.target;
                return (
                  <div key={p.name} className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-muted text-2xs font-semibold text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="truncate">{p.name}</span>
                      </span>
                      <span className="shrink-0 tabular text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCurrency(p.amount, { compact: true })}
                        </span>{" "}
                        of {formatCompact(p.target)}
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
        </StaggerItem>
      </Stagger>
    </Page>
  );
}
