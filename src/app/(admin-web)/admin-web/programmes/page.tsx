import type { Metadata } from "next";
import { Megaphone, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { submitProgrammeAction } from "@/features/web-cms/actions";

export const metadata: Metadata = { title: "Programmes Schedule · ESOCS Web Admin" };

export default function ProgrammesSchedulePage() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="size-5 text-teal-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Programmes & Bulletin Schedule</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Manage church annual summits, quarterly theme schedules, and bulletin attachments.
            </p>
          </div>
        </div>

        <Card className="max-w-2xl border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-base font-semibold text-white">
                <Plus className="size-4 text-teal-400" />
                Submit Programme Schedule
              </div>
            }
            description="Submit quarterly themes, keynote speakers, and downloadable bulletin links."
          />
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await submitProgrammeAction({
                  title: formData.get("title") as string,
                  theme: formData.get("theme") as string,
                  scheduleDate: formData.get("scheduleDate") as string,
                  speakers: (formData.get("speakers") as string).split(",").map((s) => s.trim()),
                  livestreamUrl: formData.get("livestreamUrl") as string,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label htmlFor="prog-title" className="font-medium text-slate-300">
                  Programme Title *
                </label>
                <Input
                  id="prog-title"
                  name="title"
                  placeholder="e.g. Q4 District Ministerial Summit"
                  required
                  className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prog-theme" className="font-medium text-slate-300">
                  Theme / Motto *
                </label>
                <Input
                  id="prog-theme"
                  name="theme"
                  placeholder="e.g. Expanding Kingdom Boundaries"
                  required
                  className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prog-speakers" className="font-medium text-slate-300">
                  Keynote Speakers (Comma Separated) *
                </label>
                <Input
                  id="prog-speakers"
                  name="speakers"
                  placeholder="His Eminence Elder Johnson, Senior Apostle Adeleke"
                  required
                  className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prog-date" className="font-medium text-slate-300">
                  Schedule Date & Time *
                </label>
                <Input
                  id="prog-date"
                  name="scheduleDate"
                  type="datetime-local"
                  required
                  className="border-slate-800 bg-slate-950/60 text-white focus-visible:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prog-stream" className="font-medium text-slate-300">
                  Livestream Embed URL
                </label>
                <Input
                  id="prog-stream"
                  name="livestreamUrl"
                  placeholder="https://youtube.com/live/..."
                  className="border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>

              <Tooltip content="Submits programme for Vetting Review">
                <Button
                  type="submit"
                  className="w-full bg-teal-600 py-2 text-xs font-medium text-white shadow-md shadow-teal-950 hover:bg-teal-500"
                >
                  <Sparkles className="mr-1.5 size-3.5" />
                  Submit Programme Schedule
                </Button>
              </Tooltip>
            </form>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
