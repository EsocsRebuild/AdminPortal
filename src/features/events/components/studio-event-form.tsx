"use client";

import * as React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitEventAction } from "@/features/web-cms/actions";
import type { EventCategory } from "@/features/web-cms/types";

export function StudioEventForm({ unitName }: { unitName: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [defaultStartDate] = React.useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as EventCategory) || "REVIVAL";
    const startDate = formData.get("startDate") as string;
    const venue = (formData.get("venue") as string)?.trim() || `${unitName} Sanctuary`;
    const bannerUrl = (formData.get("bannerUrl") as string)?.trim() || undefined;
    const capacityRaw = formData.get("ticketCapacity") as string;
    const ticketCapacity = capacityRaw ? Number(capacityRaw) : undefined;
    const registrationOpen = formData.get("registrationOpen") === "on";

    try {
      const res = await submitEventAction({
        title,
        description,
        category,
        startDate,
        venue,
        bannerUrl,
        ticketCapacity,
        registrationOpen,
      });

      setLoading(false);
      if (res.ok) {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || "Failed to publish event");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred while publishing the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Event submitted and published successfully!</span>
        </div>
      )}

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
          defaultValue={defaultStartDate}
          className="border-slate-800 bg-slate-950/60 text-white focus-visible:ring-emerald-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="evt-venue" className="font-medium text-slate-300">
          Venue / Location *
        </label>
        <Input
          id="evt-venue"
          name="venue"
          defaultValue={`${unitName} Sanctuary`}
          required
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
          placeholder="Details of speakers, liturgy programme, expected attendees..."
          className="w-full rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="evt-reg"
          name="registrationOpen"
          defaultChecked
          className="size-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
        />
        <label htmlFor="evt-reg" className="text-xs text-slate-300 cursor-pointer">
          Open Registration for Pilgrims
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-1.5 bg-emerald-600 text-xs font-semibold text-white shadow-md hover:bg-emerald-500"
      >
        <Sparkles className="size-3.5" />
        {loading ? "Publishing Event..." : "Publish Event"}
      </Button>
    </form>
  );
}
