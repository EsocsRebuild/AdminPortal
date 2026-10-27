"use client";

import * as React from "react";
import { Plus, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { submitEventAction } from "@/features/web-cms/actions";
import type { EventCategory } from "@/features/web-cms/types";

interface CreateEventDialogProps {
  unitName?: string;
  triggerButtonText?: string;
}

export function CreateEventDialog({
  unitName = "Local Branch",
  triggerButtonText = "Create Event",
}: CreateEventDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [defaultStartDate] = React.useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as EventCategory) || "REVIVAL";
    const startDate = formData.get("startDate") as string;
    const venue = (formData.get("venue") as string)?.trim();
    const bannerUrl = (formData.get("bannerUrl") as string)?.trim() || undefined;
    const capacityRaw = formData.get("capacity") as string;
    const ticketCapacity = capacityRaw ? Number(capacityRaw) : undefined;
    const registrationOpen = formData.get("registrationOpen") === "on";

    if (!title || !description || !startDate || !venue) {
      setError("Please fill in all required fields.");
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
        bannerUrl,
        ticketCapacity,
        registrationOpen,
      });

      setLoading(false);
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1200);
      } else {
        setError(res.message || "Failed to create event");
      }
    } catch {
      setLoading(false);
      setError("Unexpected error creating event. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" leftIcon={<Plus className="size-4" />}>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="size-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Create New Church Event
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Schedule a liturgical service, revival, conference, or fellowship rally for{" "}
            <span className="font-semibold text-foreground">{unitName}</span>.
          </p>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <CheckCircle2 className="size-10 text-emerald-500 animate-bounce" />
            <h4 className="text-sm font-bold text-foreground">Event Published Successfully!</h4>
            <p className="text-xs text-muted-foreground">
              The event is now live on the calendar and timeline feed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            {error && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-500">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="ev-title" className="font-medium text-foreground">
                Event Title *
              </label>
              <Input
                id="ev-title"
                name="title"
                required
                placeholder="e.g. 2026 Annual Holy Mount Spiritual Revival"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="ev-category" className="font-medium text-foreground">
                  Category *
                </label>
                <select
                  id="ev-category"
                  name="category"
                  className="h-control-md w-full rounded-control border border-input bg-surface px-3 text-xs text-foreground focus-visible:border-ring focus-visible:outline-none"
                >
                  <option value="REVIVAL">Revival Service</option>
                  <option value="SUNDAY_SERVICE">Sunday Service</option>
                  <option value="CONFERENCE">Leadership Conference</option>
                  <option value="FELLOWSHIP_RALLY">Fellowship Rally</option>
                  <option value="SPECIAL_PROGRAMME">Special Programme</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ev-capacity" className="font-medium text-foreground">
                  Capacity Limit
                </label>
                <Input
                  id="ev-capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="ev-start" className="font-medium text-foreground">
                  Date & Start Time *
                </label>
                <Input
                  id="ev-start"
                  name="startDate"
                  type="datetime-local"
                  required
                  defaultValue={defaultStartDate}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ev-venue" className="font-medium text-foreground">
                  Venue / Location *
                </label>
                <Input
                  id="ev-venue"
                  name="venue"
                  required
                  defaultValue={`${unitName} Sanctuary`}
                  placeholder="e.g. Main Cathedral Hall"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ev-desc" className="font-medium text-foreground">
                Description & Programme Order *
              </label>
              <textarea
                id="ev-desc"
                name="description"
                rows={3}
                required
                placeholder="Detail sermon theme, presiding elders, ministers, and attendance directives..."
                className="w-full rounded-control border border-input bg-surface p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="ev-reg"
                name="registrationOpen"
                defaultChecked
                className="size-4 rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="ev-reg" className="text-xs text-foreground cursor-pointer">
                Enable Online Pilgrim Registration & Attendance Count
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Sparkles className="size-4" />
                {loading ? "Publishing Event..." : "Publish Event to Congregation"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
