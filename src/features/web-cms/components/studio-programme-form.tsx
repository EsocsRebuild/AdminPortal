"use client";

import * as React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
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
import { submitProgrammeAction } from "../actions";
import type { WebProgramme } from "../types";

export function StudioProgrammeForm({ unitName }: { unitName: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdProg, setCreatedProg] = React.useState<WebProgramme | null>(null);
  const [defaultScheduleDate] = React.useState(() => {
    return new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim();
    const theme = (formData.get("theme") as string)?.trim();
    const scheduleDate = (formData.get("scheduleDate") as string)?.trim();
    const speakersRaw = (formData.get("speakers") as string)?.trim();
    const speakers = speakersRaw
      ? speakersRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Presiding Clergy"];
    const bulletinPdfUrl = (formData.get("bulletinPdfUrl") as string)?.trim() || undefined;
    const livestreamUrl = (formData.get("livestreamUrl") as string)?.trim() || undefined;

    const res = await submitProgrammeAction({
      title,
      theme,
      scheduleDate,
      speakers,
      bulletinPdfUrl,
      livestreamUrl,
    });

    setLoading(false);
    if (res.ok && res.data) {
      setCreatedProg(res.data);
      form.reset();
      router.refresh();
    } else {
      setError(res.message || "Failed to submit programme schedule");
    }
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
          <label htmlFor="p-title" className="font-semibold text-slate-200">
            Programme Title *
          </label>
          <Input
            id="p-title"
            name="title"
            required
            placeholder="e.g. 2026 Centenary Prayer Convocation"
            className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="p-theme" className="font-semibold text-slate-200">
            Scriptural Theme *
          </label>
          <Input
            id="p-theme"
            name="theme"
            required
            placeholder="e.g. Behold I Make All Things New (Revelation 21:5)"
            className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="p-date" className="font-semibold text-slate-200">
            Commencement Date & Time *
          </label>
          <Input
            id="p-date"
            name="scheduleDate"
            type="datetime-local"
            required
            defaultValue={defaultScheduleDate}
            className="border-slate-800 bg-slate-950/60 text-white focus-visible:ring-teal-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="p-speakers" className="font-semibold text-slate-200">
            Keynote Speakers / Ministers (comma-separated) *
          </label>
          <Input
            id="p-speakers"
            name="speakers"
            required
            placeholder="e.g. Baba Aladura, Apostle S. O. Briggs, Mother B. K. George"
            className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="p-stream" className="font-semibold text-slate-200">
              Livestream Link (Optional)
            </label>
            <Input
              id="p-stream"
              name="livestreamUrl"
              placeholder="https://youtube.com/live/..."
              className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="p-pdf" className="font-semibold text-slate-200">
              Bulletin PDF URL (Optional)
            </label>
            <Input
              id="p-pdf"
              name="bulletinPdfUrl"
              placeholder="https://esocs.org/docs/..."
              className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-teal-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-950/50 hover:bg-teal-500"
        >
          <Sparkles className="size-4" />
          {loading ? "Publishing Schedule..." : "Submit Programme Schedule"}
        </Button>
      </form>

      {createdProg && (
        <Dialog open={Boolean(createdProg)} onOpenChange={() => setCreatedProg(null)}>
          <DialogContent className="max-w-md border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/20 text-teal-400">
                <CheckCircle2 className="size-8" />
              </div>
              <DialogTitle className="text-lg font-bold text-white">
                Programme Schedule Published!
              </DialogTitle>
              <p className="mt-1 text-xs text-slate-400">
                The liturgy schedule has been saved and made available for {unitName}.
              </p>
            </DialogHeader>

            <div className="my-3 space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
              <h4 className="font-bold text-white">{createdProg.title}</h4>
              <p className="italic text-teal-300">&ldquo;{createdProg.theme}&rdquo;</p>
              <p className="text-2xs text-slate-400">
                Ministers: {createdProg.speakers.join(", ")}
              </p>
              <p className="text-2xs text-slate-400">
                Date: {new Date(createdProg.scheduleDate).toLocaleString()}
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                size="sm"
                onClick={() => setCreatedProg(null)}
                className="w-full bg-teal-600 text-xs font-semibold text-white hover:bg-teal-500"
              >
                Close & View Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
