import type { Metadata } from "next";
import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBranchEvents } from "@/features/web-cms/queries";
import { StudioEventForm } from "@/features/events/components/studio-event-form";
import { StudioEventsRoster } from "@/features/events/components/studio-events-roster";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Events Publishing Studio · ESOCS Web Admin" };

export default async function EventsStudioPage() {
  const user = await requireSession();
  const unitInfo = await resolveUserUnit(user.scopeUnitId);
  const events = await getBranchEvents(user.scopeUnitId);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Events Publishing Studio</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Create, manage, and publish church events for{" "}
              <span className="font-semibold text-amber-300">{unitInfo.unitName}</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Event Submission Form */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl lg:col-span-1">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <Plus className="size-4 text-emerald-400" />
                  Submit New Event
                </div>
              }
              description={`Form data is automatically associated with ${unitInfo.unitName} and saved directly.`}
            />
            <CardContent>
              <StudioEventForm unitName={unitInfo.unitName} />
            </CardContent>
          </Card>

          {/* Right Column: Interactive Events Roster & Status */}
          <div className="lg:col-span-2">
            <StudioEventsRoster
              key={events.map((e) => `${e.id}_${e.status}`).join(":")}
              initialEvents={events}
              unitName={unitInfo.unitName}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
