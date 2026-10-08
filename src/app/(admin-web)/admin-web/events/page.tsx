import type { Metadata } from "next";
import { Calendar, Plus, Sparkles, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getBranchEvents } from "@/features/web-cms/queries";
import { submitEventAction } from "@/features/web-cms/actions";
import type { EventCategory } from "@/features/web-cms/types";

export const metadata: Metadata = { title: "Events Publishing Studio · ESOCS Web Admin" };

export default async function EventsStudioPage() {
  const events = await getBranchEvents();

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
              Create, manage, and submit church events for public web listing.
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
              description="Form data is automatically tagged with parish-mount-zion and sent to the Vetting Board."
            />
            <CardContent>
              <form
                action={async (formData) => {
                  "use server";
                  await submitEventAction({
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    category: (formData.get("category") as EventCategory) || "REVIVAL",
                    startDate: formData.get("startDate") as string,
                    venue: formData.get("venue") as string,
                    bannerUrl: formData.get("bannerUrl") as string,
                    registrationOpen: formData.get("registrationOpen") === "on",
                  });
                }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1.5">
                  <label htmlFor="evt-title" className="font-medium text-slate-300">
                    Event Title *
                  </label>
                  <Input
                    id="evt-title"
                    name="title"
                    placeholder="e.g. 2026 Anointing Night Revival"
                    required
                    className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="evt-category" className="font-medium text-slate-300">
                    Category *
                  </label>
                  <select
                    id="evt-category"
                    name="category"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="REVIVAL">Revival Service</option>
                    <option value="SUNDAY_SERVICE">Sunday Service</option>
                    <option value="FELLOWSHIP_RALLY">Fellowship Rally</option>
                    <option value="CONFERENCE">Leadership Conference</option>
                    <option value="SPECIAL_PROGRAMME">Special Programme</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="evt-date" className="font-medium text-slate-300">
                    Start Date & Time *
                  </label>
                  <Input
                    id="evt-date"
                    name="startDate"
                    type="datetime-local"
                    required
                    className="border-slate-800 bg-slate-950/60 text-white focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="evt-venue" className="font-medium text-slate-300">
                    Venue Location *
                  </label>
                  <Input
                    id="evt-venue"
                    name="venue"
                    placeholder="e.g. Mount Zion Main Sanctuary"
                    required
                    className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="evt-banner" className="font-medium text-slate-300">
                    Banner Image URL
                  </label>
                  <Input
                    id="evt-banner"
                    name="bannerUrl"
                    placeholder="https://..."
                    className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="evt-desc" className="font-medium text-slate-300">
                    Event Description *
                  </label>
                  <textarea
                    id="evt-desc"
                    name="description"
                    rows={3}
                    required
                    placeholder="Provide event details, schedule highlights, and instructions for attendees..."
                    className="w-full rounded-md border border-slate-800 bg-slate-950/60 p-2.5 text-xs text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="reg-open"
                    name="registrationOpen"
                    className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="reg-open" className="text-xs text-slate-300">
                    Enable Public Registration Form
                  </label>
                </div>

                <Tooltip content="Submits event to Super Admin queue with status PENDING_REVIEW">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 py-2 text-xs font-medium text-white shadow-md shadow-emerald-950 hover:bg-emerald-500"
                  >
                    <Sparkles className="mr-1.5 size-3.5" />
                    Submit Event for Vetting
                  </Button>
                </Tooltip>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Events Roster & Status */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 px-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Filter className="size-3.5 text-emerald-400" />
                Active Unit Events ({events.length})
              </span>
              <span className="text-2xs text-slate-400">Tagged: Mount Zion Parish</span>
            </div>

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
                          <strong>Vetting Feedback:</strong> {evt.reviewNotes}
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
                          Pending Vetting
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
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
