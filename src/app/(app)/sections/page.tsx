import * as React from "react";
import { ArrowRight, Building2, CalendarCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";
import { listSections } from "@/features/sections/queries";

export const metadata: Metadata = { title: "Autonomous Sections & Fellowships" };

export default async function SectionsPage() {
  const session = await requireSession();
  const userUnit = await resolveUserUnit(session.scopeUnitId);
  const sections = await listSections();

  return (
    <Page>
      <PageHeader
        title="Autonomous Sections & Fellowships"
        description={`Dedicated architectural workspaces for Church wings, directorates, and specialized ministerial arms in ${userUnit.unitName}.`}
      />

      {sections.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-6">
            <EmptyState
              icon={<Building2 className="size-6 text-amber-500" />}
              title="No Autonomous Sections Configured"
              description={`Autonomous fellowship wings, youth societies, and ministerial directorates for ${userUnit.unitName} will appear here once provisioned.`}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {sections.map((sec) => (
            <Card
              key={sec.id}
              className={`border-l-4 ${sec.accentColor} flex flex-col justify-between overflow-hidden`}
            >
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
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground italic">
                    &ldquo;{sec.motto}&rdquo;
                  </p>
                }
              />

              <CardContent className="mt-auto space-y-3 pt-2">
                <div className="space-y-1 rounded-control bg-surface-muted/40 p-2.5 text-xs">
                  <div className="text-muted-foreground">
                    Presiding Leader: <strong className="text-foreground">{sec.headLeader}</strong>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-subtle pt-1 text-2xs">
                    <span>
                      Active Roster: <strong className="text-foreground">{sec.memberCount} members</strong>
                    </span>
                    <span>{sec.activeEventsCount} upcoming events</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CalendarCheck className="size-3.5 shrink-0" />
                  <span className="truncate">{sec.nextMajorEvent}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/members?fellowship=${sec.slug}`}>View Roster</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/sections/${sec.slug}`} className="flex items-center gap-1">
                      Portal View
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
