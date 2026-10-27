import * as React from "react";
import { CalendarDays, Clock, MapPin, QrCode } from "lucide-react";
import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/server/session";
import { resolveUserUnit } from "@/server/units";
import { listEvents } from "@/features/events/queries";
import { CreateEventDialog } from "@/features/events/components/create-event-dialog";

export const metadata: Metadata = { title: "Events & Calendar" };

export default async function EventsPage() {
  const session = await requirePermission("events:view");
  const userUnit = await resolveUserUnit(session.scopeUnitId);
  const events = await listEvents();

  return (
    <Page>
      <PageHeader
        title="Events & Calendar"
        description={`Parish worship services, liturgical celebrations, and fellowship rallies for ${userUnit.unitName}.`}
        actions={<CreateEventDialog unitName={userUnit.unitName} triggerButtonText="Create Event" />}
      />

      {events.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-6">
            <EmptyState
              icon={<CalendarDays className="size-6 text-amber-500" />}
              title="No Church Events Scheduled"
              description={`There are currently no liturgical services, revival conferences, or fellowship events scheduled for ${userUnit.unitName}.`}
              action={
                <CreateEventDialog
                  unitName={userUnit.unitName}
                  triggerButtonText="Create First Event"
                />
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((evt) => {
            const isCapacityCapped = evt.capacity !== undefined;
            const percentFilled = isCapacityCapped
              ? Math.round(((evt.registeredCount ?? 0) / evt.capacity!) * 100)
              : null;

            return (
              <Card key={evt.id} className="flex flex-col justify-between overflow-hidden">
                <CardHeader
                  title={
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-bold text-foreground">{evt.title}</span>
                      <Badge
                        tone={evt.category === "service" ? "primary" : "info"}
                        className="shrink-0 text-2xs uppercase"
                      >
                        {evt.category}
                      </Badge>
                    </div>
                  }
                  description={
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5 text-primary" />
                        {formatDate(evt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-muted-foreground" />
                        {evt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {evt.location}
                      </span>
                    </div>
                  }
                />
                <CardContent className="mt-auto space-y-3 pt-2">
                  <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
                    <span className="font-medium text-muted-foreground">
                      {evt.unitName || userUnit.unitName}
                    </span>
                    {isCapacityCapped ? (
                      <span className="font-semibold text-foreground">
                        {evt.registeredCount} / {evt.capacity} registered ({percentFilled}%)
                      </span>
                    ) : (
                      <span className="font-semibold text-foreground">
                        {evt.registeredCount ?? 0} expected attendees
                      </span>
                    )}
                  </div>

                  {isCapacityCapped && (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(100, percentFilled ?? 0)}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Button variant="outline" size="sm" leftIcon={<QrCode className="size-3.5" />}>
                      Check-in Desk
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Roster
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
