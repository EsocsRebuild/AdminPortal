"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Eye,
  Trash2,
  Share2,
  Flame,
  Check,
  Search,
  Users,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { vetContentAction, deleteEventAction } from "@/features/web-cms/actions";
import { useModals } from "@/components/modals/modal-provider";
import type { WebEvent } from "@/features/web-cms/types";

interface StudioEventsRosterProps {
  initialEvents: WebEvent[];
  unitName: string;
}

export function StudioEventsRoster({ initialEvents, unitName }: StudioEventsRosterProps) {
  const router = useRouter();
  const modals = useModals();
  const [events, setEvents] = React.useState<WebEvent[]>(initialEvents);
  const [filterTab, setFilterTab] = React.useState<"all" | "approved" | "pending">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState<WebEvent | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [amens, setAmens] = React.useState<Record<string, number>>({});
  const [amened, setAmened] = React.useState<Record<string, boolean>>({});
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleAmen = (id: string) => {
    setAmened((prev) => {
      const next = !prev[id];
      setAmens((counts) => ({
        ...counts,
        [id]: (counts[id] || 48) + (next ? 1 : -1),
      }));
      return { ...prev, [id]: next };
    });
  };

  const handleCopyLink = (event: WebEvent) => {
    const url = `${window.location.origin}/events?highlight=${event.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApprove = async (eventId: string) => {
    setProcessingId(eventId);
    const res = await vetContentAction({
      contentId: eventId,
      contentType: "EVENT",
      action: "APPROVE",
    });
    setProcessingId(null);
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: "APPROVED_LIVE" as const } : e)),
      );
      router.refresh();
    }
  };

  const handleDelete = async (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    const confirmed = await modals.confirm({
      title: "Remove Church Event?",
      description: target
        ? `Are you sure you want to remove "${target.title}" from the church calendar? This action cannot be undone.`
        : "Are you sure you want to remove this church event?",
      confirmLabel: "Remove Event",
      cancelLabel: "Keep Event",
      tone: "danger",
    });
    if (!confirmed) return;

    setProcessingId(eventId);
    const res = await deleteEventAction({ id: eventId });
    setProcessingId(null);
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
      router.refresh();
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filterTab === "approved" && e.status !== "APPROVED_LIVE") return false;
    if (filterTab === "pending" && e.status !== "PENDING_REVIEW") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchVenue = e.venue.toLowerCase().includes(q);
      const matchCategory = e.category.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchCategory) return false;
    }
    return true;
  });

  const pendingCount = events.filter((e) => e.status === "PENDING_REVIEW").length;
  const approvedCount = events.filter((e) => e.status === "APPROVED_LIVE").length;

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterTab("all")}
            className={`rounded-lg px-3 text-xs font-semibold ${
              filterTab === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Events ({events.length})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterTab("approved")}
            className={`rounded-lg px-3 text-xs font-semibold ${
              filterTab === "approved"
                ? "bg-emerald-500/20 text-emerald-400 shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Approved ({approvedCount})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterTab("pending")}
            className={`rounded-lg px-3 text-xs font-semibold ${
              filterTab === "pending"
                ? "bg-amber-500/20 text-amber-400 shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending Clearance ({pendingCount})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="absolute top-2.5 left-2.5 size-3.5 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roster..."
              className="h-8 pl-8 text-xs border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
            />
          </div>
          <span className="hidden items-center gap-1 rounded-md border border-slate-800 bg-slate-950/40 px-2 py-1 text-2xs font-medium text-slate-400 sm:flex">
            <Building2 className="size-3 text-amber-400" />
            {unitName}
          </span>
        </div>
      </div>

      {/* Events Roster List */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Calendar className="size-6" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-white">No church events matching your filter</h4>
          <p className="mt-1 max-w-md text-xs text-slate-400">
            {events.length === 0
              ? `No active events recorded yet for ${unitName}. Use the form on the left to submit an event.`
              : "Try switching filters or clearing your search term to see other events."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const dateObj = new Date(evt.startDate);
            const formattedDate = isNaN(dateObj.getTime())
              ? evt.startDate
              : dateObj.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
            const formattedTime = isNaN(dateObj.getTime())
              ? ""
              : dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return (
              <Card
                key={evt.id}
                className="overflow-hidden border-slate-800 bg-slate-900/80 shadow-md transition-all hover:border-slate-700"
              >
                <div className="flex flex-col items-start justify-between gap-4 p-4 sm:p-5 md:flex-row">
                  <div className="max-w-xl space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{evt.title}</span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-2xs font-semibold text-emerald-400">
                        {evt.category.replace(/_/g, " ")}
                      </span>
                      {evt.registrationOpen && (
                        <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-3xs font-medium text-cyan-400">
                          <Users className="size-2.5" />
                          Registration Open
                        </span>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300">{evt.description}</p>

                    <div className="grid grid-cols-1 gap-2 border-t border-slate-800/60 pt-2 text-2xs text-slate-400 sm:grid-cols-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3 text-amber-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-emerald-400 shrink-0" />
                        <span>
                          {formattedDate} {formattedTime && `• ${formattedTime}`}
                        </span>
                      </div>
                    </div>

                    {/* Social Engagement Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAmen(evt.id)}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-semibold transition-all ${
                          amened[evt.id]
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-amber-400"
                        }`}
                      >
                        <Flame className={`size-3 ${amened[evt.id] ? "fill-amber-400 text-amber-400" : ""}`} />
                        <span>{amens[evt.id] || 48} Amen / Praises</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(evt)}
                        className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-2xs font-medium text-slate-400 transition-colors hover:text-white"
                      >
                        {copiedId === evt.id ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied Link!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="size-3" />
                            <span>Share</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedEvent(evt)}
                        className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-2xs font-medium text-slate-400 transition-colors hover:text-white"
                      >
                        <Eye className="size-3" />
                        <span>Preview Flyer</span>
                      </button>
                    </div>
                  </div>

                  {/* Status & Control Actions */}
                  <div className="flex shrink-0 flex-col items-end gap-2.5">
                    {evt.status === "APPROVED_LIVE" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        Approved Live
                      </span>
                    )}
                    {evt.status === "PENDING_REVIEW" && (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                          <Clock className="size-3.5" />
                          Pending Clearance
                        </span>
                        <Button
                          type="button"
                          size="xs"
                          disabled={processingId === evt.id}
                          onClick={() => handleApprove(evt.id)}
                          className="h-6 gap-1 bg-emerald-600 px-2.5 text-3xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <Check className="size-3" />
                          <span>Approve Live</span>
                        </Button>
                      </div>
                    )}
                    {evt.status === "NEEDS_REVISION" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                        <AlertCircle className="size-3.5" />
                        Needs Revision
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDelete(evt.id)}
                        disabled={processingId === evt.id}
                        className="h-6 text-slate-500 hover:text-rose-400"
                        title="Delete Event"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* High-End Event Preview Modal */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-lg border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-semibold text-emerald-400">
                  {selectedEvent.category.replace(/_/g, " ")}
                </span>
                <span className="text-2xs text-slate-400">{selectedEvent.unitName}</span>
              </div>
              <DialogTitle className="mt-2 text-lg font-bold text-white">
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {selectedEvent.bannerUrl ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                  <Image
                    src={selectedEvent.bannerUrl}
                    alt={selectedEvent.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50">
                  <div className="text-center text-xs text-slate-500">
                    <Calendar className="mx-auto mb-1.5 size-6 text-slate-600" />
                    <span>Official Liturgical Programme</span>
                  </div>
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-300">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-xs">
                <div>
                  <span className="text-3xs uppercase tracking-wider text-slate-500">Date & Time</span>
                  <p className="font-semibold text-white">
                    {new Date(selectedEvent.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-3xs uppercase tracking-wider text-slate-500">Venue</span>
                  <p className="font-semibold text-white truncate">{selectedEvent.venue}</p>
                </div>
                <div>
                  <span className="text-3xs uppercase tracking-wider text-slate-500">Registration</span>
                  <p className="font-semibold text-emerald-400">
                    {selectedEvent.registrationOpen ? "Open to Public" : "Closed / Private"}
                  </p>
                </div>
                <div>
                  <span className="text-3xs uppercase tracking-wider text-slate-500">Capacity</span>
                  <p className="font-semibold text-white">
                    {selectedEvent.ticketCapacity ? `${selectedEvent.ticketCapacity} Seats` : "Open Sanctuary"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(selectedEvent)}
                className="border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                <Share2 className="mr-1.5 size-3.5" />
                Copy Share Link
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="bg-emerald-600 text-xs text-white hover:bg-emerald-500"
              >
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
