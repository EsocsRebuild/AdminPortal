import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Crown,
  HeartHandshake,
  Layers,
  Music,
  Sparkles,
  Users2,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextualTipCard } from "@/components/ui/contextual-tip-card";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Autonomous Sections & Fellowships" };

interface FellowshipSection {
  id: string;
  slug: string;
  name: string;
  motto: string;
  headLeader: string;
  memberCount: number;
  activeEventsCount: number;
  nextMajorEvent: string;
  accentColor: string;
  badgeTone: "success" | "warning" | "info" | "primary";
}

const mockSections: FellowshipSection[] = [
  {
    id: "sec-women",
    slug: "women",
    name: "Women Fellowship (Mothers' Directorate)",
    motto: "Encourage women of all ages to grow in their relationship with Christ through learning, sharing, and serving.",
    headLeader: "Senior Mother Adeleke (National President)",
    memberCount: 165,
    activeEventsCount: 2,
    nextMajorEvent: "Annual Mothers' Summit & Conference (Oct 24)",
    accentColor: "border-l-emerald-500",
    badgeTone: "success",
  },
  {
    id: "sec-youth",
    slug: "youth",
    name: "Youth Fellowship (Mount Zion Youth Society - MZYS)",
    motto: "Directing the minds of the youth towards living a life of holiness, righteousness, and integrity.",
    headLeader: "Special Apostle Adeyemi (Youth Coordinator)",
    memberCount: 98,
    activeEventsCount: 3,
    nextMajorEvent: "National Youth Leadership Camp (Nov 12-15)",
    accentColor: "border-l-amber-500",
    badgeTone: "warning",
  },
  {
    id: "sec-choir",
    slug: "music",
    name: "Music Directorate & Central Choir",
    motto: "Singing unto the Lord with psalms, hymns, and spiritual songs.",
    headLeader: "Choir Master General Olumide",
    memberCount: 64,
    activeEventsCount: 2,
    nextMajorEvent: "Advent Hymn Festival & Carol Concert (Dec 20)",
    accentColor: "border-l-purple-500",
    badgeTone: "info",
  },
  {
    id: "sec-welfare",
    slug: "welfare",
    name: "Welfare, Mercy & Evangelical Directorate",
    motto: "Pure religion before God and the Father is this: to visit orphans and widows in their affliction.",
    headLeader: "Elder Mrs. Folashade (Director of Welfare)",
    memberCount: 42,
    activeEventsCount: 1,
    nextMajorEvent: "Harvest Mercy Food Bank Distribution (Nov 01)",
    accentColor: "border-l-blue-500",
    badgeTone: "primary",
  },
];

export default async function SectionsPage() {
  const user = await requireSession();

  return (
    <Page>
      <PageHeader
        title="Autonomous Sections & Fellowships"
        description="Dedicated architectural workspaces for Church wings, directorates, and specialized ministerial arms."
      />

      <ContextualTipCard
        id="sections_architecture_tip"
        title="Decentralized Leadership & Scoped Feeds"
        description="Each fellowship maintains its own executive roster, conference registration desk, and dynamic feed published automatically to the public website."
        actionText="View Documentation"
        className="mb-4"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {mockSections.map((sec) => (
          <Card key={sec.id} className={`border-l-4 ${sec.accentColor} flex flex-col justify-between overflow-hidden`}>
            <CardHeader
              title={
                <div className="flex items-start justify-between gap-2">
                  <span className="text-base font-bold text-foreground">{sec.name}</span>
                  <Badge tone={sec.badgeTone} className="text-2xs uppercase">
                    Active
                  </Badge>
                </div>
              }
              description={
                <p className="mt-1 italic text-xs text-muted-foreground line-clamp-2">
                  "{sec.motto}"
                </p>
              }
            />

            <CardContent className="mt-auto space-y-3 pt-2">
              <div className="rounded-control bg-surface-muted/40 p-2.5 text-xs space-y-1">
                <div className="text-muted-foreground">
                  Presiding Leader: <strong className="text-foreground">{sec.headLeader}</strong>
                </div>
                <div className="flex items-center justify-between text-2xs pt-1 border-t border-border-subtle">
                  <span>Active Roster: <strong className="text-foreground">{sec.memberCount} members</strong></span>
                  <span>{sec.activeEventsCount} upcoming events</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <CalendarCheck className="size-3.5 shrink-0" />
                <span className="truncate">{sec.nextMajorEvent}</span>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/members?fellowship=${sec.slug}`}>View Roster</Link>
                </Button>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
                  Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  );
}
