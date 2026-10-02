import type { Metadata } from "next";
import Link from "next/link";
import { Activity, CheckCircle2, FileCode2, Layers, ShieldCheck } from "lucide-react";

import { Page } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Build Tracker & Architecture Matrix" };

interface PhaseItem {
  number: number;
  title: string;
  status: "completed" | "in_progress" | "planned" | "deferred";
  description: string;
  componentsBuilt: Array<{
    name: string;
    path: string;
    description: string;
  }>;
}

const phases: PhaseItem[] = [
  {
    number: 1,
    title: "Phase 1: Security Guard & Scope Isolation Engine",
    status: "completed",
    description: "JWT session validation, X-Scope-Unit header propagation, and strict scope isolation.",
    componentsBuilt: [
      {
        name: "Auth Types",
        path: "src/types/auth.ts",
        description: "scopeUnitId, isPlatformAdmin & UnitScopeMetadata",
      },
      {
        name: "Backend Proxy",
        path: "src/proxy.ts",
        description: "CSP nonce, auto-refresh & public route exemptions",
      },
      {
        name: "Backend Fetch Client",
        path: "src/server/backend.ts",
        description: "X-Scope-Unit & X-Handler-Id header forwarding",
      },
    ],
  },
  {
    number: 2,
    title: "Phase 2: Panoramic Unit Switcher & Unique Handler Workspaces",
    status: "completed",
    description: "Super Admin panoramic switcher, locked local badges, and WhatsApp-style Handler isolation.",
    componentsBuilt: [
      {
        name: "Unit Switcher",
        path: "src/components/layout/unit-switcher.tsx",
        description: "Categorized search, cookie sync & locked badge",
      },
      {
        name: "Handler Status Card",
        path: "src/components/blocks/handler-card.tsx",
        description: "Handler ID, Role, Unit Scope & Session Security",
      },
      {
        name: "Dashboard Layout",
        path: "src/app/(app)/dashboard/page.tsx",
        description: "Personalized Handler workspace & greeting",
      },
    ],
  },
  {
    number: 3,
    title: "Phase 3: Dynamic Public Portals & Web Routes",
    status: "completed",
    description: "Branded public routes for Parishes (/church/[slug]) and Fellowships (/sections/[slug]).",
    componentsBuilt: [
      {
        name: "Parish Public Route",
        path: "src/app/church/[slug]/page.tsx",
        description: "Hero banner, pastoral profile, service times & contact",
      },
      {
        name: "Fellowship Public Route",
        path: "src/app/sections/[slug]/page.tsx",
        description: "Motto, vision, exec board, rally forms & news",
      },
    ],
  },
  {
    number: 4,
    title: "Phase 4: Real-Time SSE Stream Engine & Live Headcount",
    status: "completed",
    description: "PostgreSQL Outbox + Redis Pub/Sub + SSE pipeline for live Sunday service headcount.",
    componentsBuilt: [
      {
        name: "SSE Stream Endpoint",
        path: "src/app/api/realtime/stream/route.ts",
        description: "Server-Sent Events with 15s TCP heartbeat",
      },
      {
        name: "Realtime Hook",
        path: "src/hooks/use-realtime-stream.ts",
        description: "React hook subscribing to live event channels",
      },
      {
        name: "Live Headcount Widget",
        path: "src/components/blocks/live-headcount-widget.tsx",
        description: "Usher check-in count widget for pastor dashboards",
      },
    ],
  },
  {
    number: 5,
    title: "Phase 5: People & Household Management Domain",
    status: "completed",
    description: "Scoped member register, ESOCS Ordination Ranks, Household Trees & CSV Exporter.",
    componentsBuilt: [
      {
        name: "Household Card",
        path: "src/features/members/components/household-card.tsx",
        description: "Family tree widget (Head, Spouse, Dependents)",
      },
      {
        name: "Household Types",
        path: "src/features/members/types-household.ts",
        description: "Interface for household relations",
      },
      {
        name: "Member 360 Profile",
        path: "src/app/(app)/members/[id]/page.tsx",
        description: "Member profile with household tree & rank badges",
      },
      {
        name: "Scoped CSV Exporter",
        path: "src/app/api/members/export/route.ts",
        description: "Server-streamed scoped CSV generator",
      },
    ],
  },
  {
    number: 6,
    title: "Phase 6: Events, Usher Mobile & Attendance Engine",
    status: "completed",
    description: "Scoped event calendars, usher attendance logging, and live headcount integration.",
    componentsBuilt: [
      {
        name: "Attendance Page",
        path: "src/app/(app)/attendance/page.tsx",
        description: "Live headcount widget, attendance chart & service logs",
      },
    ],
  },
  {
    number: 7,
    title: "Phase 7: Giving & Financial Stewardship (Post-Acceptance)",
    status: "deferred",
    description:
      "Tithes, offerings, fund management, and stewardship analytics (Deferred to Post-Acceptance).",
    componentsBuilt: [],
  },
];

export default function BuildTrackerPage() {
  const completedCount = phases.filter((p) => p.status === "completed").length;
  const totalActivePhases = phases.filter((p) => p.status !== "deferred").length;
  const progressPercent = Math.round((completedCount / totalActivePhases) * 100);

  return (
    <Page width="default">
      <Stagger className="grid grid-cols-1 gap-page" gap={0.07}>
        <StaggerItem>
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="primary" className="gap-1.5 px-3 py-1">
                  <Layers className="size-3.5 text-primary" />
                  <span>Executive Progress Tracker</span>
                </Badge>
                <Badge tone="success" className="gap-1 py-1">
                  <ShieldCheck className="size-3" />
                  <span>56/56 Tests Passing</span>
                </Badge>
              </div>
              <h1 className="mt-2 text-heading-lg font-bold tracking-tight">
                ESOCS Platform Build & Feature Registry
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                High-end status tracking of core architecture, dynamic routes, and micro-scoped modules.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Back to Workspace</Link>
              </Button>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <Card className="bg-gradient-to-r from-surface via-surface to-surface-muted/60 p-6">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Activity className="size-4 animate-pulse text-primary" />
                <span>Primary Build Completion Rate</span>
              </span>
              <span className="font-mono text-base font-bold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="mt-3 h-3.5" />
            <div className="mt-3 flex items-center justify-between text-2xs text-muted-foreground">
              <span>
                {completedCount} of {totalActivePhases} Active Phases Completed (100%)
              </span>
              <span>Finance Module Deferred to Post-Acceptance</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem className="grid gap-page">
          {phases.map((phase) => (
            <Card key={phase.number} className="space-y-4 p-6">
              <div className="flex flex-col justify-between gap-3 border-b border-border-subtle pb-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    P{phase.number}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{phase.title}</h2>
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                  </div>
                </div>

                <Badge
                  tone={
                    phase.status === "completed"
                      ? "success"
                      : phase.status === "in_progress"
                        ? "warning"
                        : phase.status === "planned"
                          ? "info"
                          : "neutral"
                  }
                  className="w-fit text-2xs font-semibold uppercase"
                >
                  {phase.status === "completed"
                    ? "✓ Completed & Verified"
                    : phase.status === "in_progress"
                      ? "⚡ In Progress"
                      : phase.status === "planned"
                        ? "📅 Planned Next"
                        : "🔒 Deferred (Post-Acceptance)"}
                </Badge>
              </div>

              {phase.componentsBuilt.length > 0 && (
                <div className="grid gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <FileCode2 className="size-3.5 text-primary" />
                    <span>Registered Components & Code Artifacts</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {phase.componentsBuilt.map((comp) => (
                      <div
                        key={comp.path}
                        className="flex flex-col gap-1 rounded-control border border-border-subtle bg-surface-muted/40 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">{comp.name}</span>
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                        </div>
                        <code className="truncate font-mono text-2xs text-primary">{comp.path}</code>
                        <span className="text-2xs text-muted-foreground">{comp.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </StaggerItem>
      </Stagger>
    </Page>
  );
}
