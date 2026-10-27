import type { Metadata } from "next";
import { Calendar, Plus, Filter, CheckCircle2, Clock, AlertCircle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBranchEvents } from "@/features/web-cms/queries";
import { StudioEventForm } from "@/features/events/components/studio-event-form";
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

          {/* Right Column: Events Roster & Status */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 px-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Filter className="size-3.5 text-emerald-400" />
                Active Unit Events ({events.length})
              </span>
              <span className="flex items-center gap-1.5 text-2xs text-slate-400">
                <Building2 className="size-3 text-amber-400" />
                {unitInfo.unitName}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Calendar className="size-6" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-white">
                  No active events for {unitInfo.unitName}
                </h4>
                <p className="mt-1 max-w-md text-xs text-slate-400">
                  Your unit does not have any active events yet. Use the form on the left to submit an event
                  for publication.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => (
                  <Card
                    key={evt.id}
                    className="overflow-hidden border-slate-800 bg-slate-900/80 transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-col items-start justify-between gap-4 p-4 sm:p-5 md:flex-row">
                      <div className="max-w-xl space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">{evt.title}</span>
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-2xs text-emerald-400">
                            {evt.category}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300">{evt.description}</p>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2 text-2xs text-slate-400">
                          <div>📍 Venue: {evt.venue}</div>
                          <div>📅 Date: {new Date(evt.startDate).toLocaleDateString()}</div>
                        </div>

                        {evt.reviewNotes && (
                          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                            <strong>Review Feedback:</strong> {evt.reviewNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {evt.status === "APPROVED_LIVE" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            Approved Live
                          </span>
                        )}
                        {evt.status === "PENDING_REVIEW" && (
                          <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                            <Clock className="size-3.5" />
                            Pending Clearance
                          </span>
                        )}
                        {evt.status === "NEEDS_REVISION" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                            <AlertCircle className="size-3.5" />
                            Needs Revision
                          </span>
                        )}

                        <span className="text-2xs text-slate-500">ID: {evt.id}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
