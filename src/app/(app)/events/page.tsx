import * as React from "react";
import { CalendarDays, Clock, MapPin, Plus, QrCode } from "lucide-react";
import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextualTipCard } from "@/components/ui/contextual-tip-card";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/server/session";

export const metadata: Metadata = { title: "Events & Calendar" };

interface ChurchEvent {
  id: string;
  title: string;
  category: "service" | "conference" | "revival" | "fellowship";
  date: string;
  time: string;
  location: string;
  unitName: string;
  capacity?: number;
  registeredCount?: number;
  isRecurring: boolean;
  status: "scheduled" | "live" | "completed";
}

const mockEvents: ChurchEvent[] = [
  {
    id: "evt-sunday-worship",
    title: "Sunday Divine Worship & Thanksgiving",
    category: "service",
    date: "2026-10-04",
    time: "09:00 AM - 12:30 PM",
    location: "Main Sanctuary",
    unitName: "Mount Zion Parish",
    isRecurring: true,
    status: "scheduled",
    registeredCount: 385,
  },
  {
    id: "evt-midweek-prayer",
    title: "Midweek Spiritual Awakening & Deliverance",
    category: "service",
    date: "2026-10-07",
    time: "05:30 PM - 07:30 PM",
    location: "Main Sanctuary & Online",
    unitName: "Mount Zion Parish",
    isRecurring: true,
    status: "scheduled",
    registeredCount: 140,
  },
  {
    id: "evt-youth-camp-2026",
    title: "National Youth Conference & Leadership Camp",
    category: "conference",
    date: "2026-11-12",
    time: "08:00 AM Daily",
    location: "International Conference Camp, Lagos",
    unitName: "Youth Fellowship (MZYS)",
    capacity: 500,
    registeredCount: 342,
    isRecurring: false,
    status: "scheduled",
  },
  {
    id: "evt-mothers-summit",
    title: "Annual Mothers' Summit: Virtuous & Victorious",
    category: "fellowship",
    date: "2026-10-24",
    time: "10:00 AM - 03:00 PM",
    location: "Cathedral Auditorium",
    unitName: "Women Fellowship",
    capacity: 350,
    registeredCount: 290,
    isRecurring: false,
    status: "scheduled",
  },
];

import { listEvents } from "@/features/events/queries";

export default async function EventsPage() {
  await requirePermission("events:view");

  const backendEvents = await listEvents();
  const events = backendEvents.length > 0 ? backendEvents : mockEvents;

  return (
    <Page>
      <PageHeader
        title="Events & Calendar"
        description="Parish worship services, liturgical celebrations, fellowship rallies, and conferences."
        actions={
          <Button variant="primary" leftIcon={<Plus className="size-4" />}>
            Create Event
          </Button>
        }
      />

      <ContextualTipCard
        id="events_checkin_guide"
        title="Sunday Usher Check-in Desk"
        description="Ushers can launch the fast check-in terminal on tablets to scan member QR passes or record headcount in real-time."
        actionText="View Guide"
        className="mb-4"
      />

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
                  <span className="font-medium text-muted-foreground">{evt.unitName}</span>
                  {isCapacityCapped ? (
                    <span className="font-semibold text-foreground">
                      {evt.registeredCount} / {evt.capacity} registered ({percentFilled}%)
                    </span>
                  ) : (
                    <span className="font-semibold text-foreground">
                      {evt.registeredCount} expected attendees
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
    </Page>
  );
}
