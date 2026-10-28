"use client";

import * as React from "react";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Share2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { submitEventAction } from "@/features/web-cms/actions";
import type { EventCategory, WebEvent } from "@/features/web-cms/types";

interface StudioEventFormProps {
  unitName: string;
  onEventCreated?: (event: WebEvent) => void;
}

export function StudioEventForm({ unitName, onEventCreated }: StudioEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = React.useState<WebEvent | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [defaultStartDate] = React.useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 86400000);
    nextWeek.setHours(9, 0, 0, 0);
    return nextWeek.toISOString().slice(0, 16);
  });
  const [bannerUrl, setBannerUrl] = React.useState("");
  const [publishDirectly, setPublishDirectly] = React.useState(true);

  const bannerPresets = [
    { label: "Revival", url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80" },
    { label: "Fellowship", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80" },
    { label: "Conference", url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as EventCategory) || "REVIVAL";
    const startDate = (formData.get("startDate") as string) || defaultStartDate;
    const venue = (formData.get("venue") as string)?.trim() || `${unitName} Sanctuary`;
    const finalBannerUrl = (formData.get("bannerUrl") as string)?.trim() || bannerUrl || undefined;
    const capacityRaw = formData.get("ticketCapacity") as string;
    const ticketCapacity = capacityRaw ? Number(capacityRaw) : undefined;
    const registrationOpen = formData.get("registrationOpen") === "on";

    if (!title || title.length < 3) {
      setError("Please provide an event title of at least 3 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await submitEventAction({
        title,
        description,
        category,
        startDate,
        venue,
        bannerUrl: finalBannerUrl,
        ticketCapacity,
        registrationOpen,
        publishDirectly,
      });

      setLoading(false);
      if (res.ok && res.data) {
        setCreatedEvent(res.data);
        if (onEventCreated) {
          onEventCreated(res.data);
        }
        form.reset();
        setBannerUrl("");
        router.refresh();
      } else {
        setError(res.message || "Failed to publish event");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred while communicating with the server.");
    }
  };

  const handleCopyCreatedLink = () => {
    if (!createdEvent) return;
    const url = `${window.location.origin}/events?highlight=${createdEvent.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="evt-title" className="font-semibold text-slate-200">
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
          <label htmlFor="evt-category" className="font-semibold text-slate-200">
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
          <label htmlFor="evt-date" className="font-semibold text-slate-200">
            Start Date & Time *
          </label>
          <Input
            id="evt-date"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={defaultStartDate}
            className="border-slate-800 bg-slate-950/60 text-white focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="evt-venue" className="font-semibold text-slate-200">
            Venue / Location *
          </label>
          <Input
            id="evt-venue"
            name="venue"
            defaultValue={`${unitName} Auditorium`}
            required
            className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="evt-desc" className="font-semibold text-slate-200">
              Event Description
            </label>
            <span className="text-3xs text-slate-500">Optional (auto-generated if empty)</span>
          </div>
          <textarea
            id="evt-desc"
            name="description"
            rows={2}
            placeholder="Brief programme details, guest ministers, scripture theme..."
            className="w-full rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="evt-banner" className="font-semibold text-slate-200">
            Banner / Flyer Image URL (Optional)
          </label>
          <Input
            id="evt-banner"
            name="bannerUrl"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
          />
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-3xs text-slate-500">Presets:</span>
            {bannerPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setBannerUrl(p.url)}
                className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-3xs font-medium text-slate-400 hover:border-slate-700 hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Publication Protocol */}
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Publication Mode
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPublishDirectly(true)}
              className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-2xs font-semibold transition-all ${
                publishDirectly
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              Direct Live Publish
            </button>
            <button
              type="button"
              onClick={() => setPublishDirectly(false)}
              className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-2xs font-semibold transition-all ${
                !publishDirectly
                  ? "border-amber-500/40 bg-amber-500/20 text-amber-400"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="size-3.5" />
              Vetting Clearance
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="evt-reg"
            name="registrationOpen"
            defaultChecked
            className="size-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="evt-reg" className="cursor-pointer text-xs text-slate-300">
            Enable Public Pilgrim Registration Form
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500"
        >
          <Sparkles className="size-4" />
          {loading ? "Publishing to Church Network..." : "Submit & Publish Event"}
        </Button>
      </form>

      {/* High-End Event Created Confirmation Modal */}
      {createdEvent && (
        <Dialog open={Boolean(createdEvent)} onOpenChange={() => setCreatedEvent(null)}>
          <DialogContent className="max-w-md border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-950/60">
                <CheckCircle2 className="size-8" />
              </div>
              <DialogTitle className="text-lg font-bold text-white">
                Church Event Successfully Created!
              </DialogTitle>
              <p className="mt-1 text-xs text-slate-400">
                Your event has been recorded and synchronized with the ecclesiastical network.
              </p>
            </DialogHeader>

            <div className="my-3 space-y-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">{createdEvent.title}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-3xs font-semibold text-emerald-400">
                  {createdEvent.category.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-1 text-2xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-amber-400" />
                  <span>{createdEvent.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-emerald-400" />
                  <span>{new Date(createdEvent.startDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-cyan-400" />
                  <span>
                    Status:{" "}
                    {createdEvent.status === "APPROVED_LIVE"
                      ? "Live on Church Network"
                      : "Pending Super Vetting Clearance"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCreatedLink}
                className="border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                <Share2 className="mr-1.5 size-3.5" />
                {copiedLink ? "Link Copied!" : "Copy Public Link"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setCreatedEvent(null)}
                className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                View in Events Roster
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
