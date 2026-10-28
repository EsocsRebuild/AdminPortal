"use client";

import * as React from "react";
import {
  Calendar,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  Mic,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteProgrammeAction } from "../actions";
import type { WebProgramme } from "../types";

interface StudioProgrammesRosterProps {
  initialProgrammes: WebProgramme[];
  unitName: string;
}

export function StudioProgrammesRoster({
  initialProgrammes,
  unitName,
}: StudioProgrammesRosterProps) {
  const router = useRouter();
  const [programmes, setProgrammes] = React.useState<WebProgramme[]>(initialProgrammes);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this programme schedule?")) return;
    setDeletingId(id);
    const res = await deleteProgrammeAction({ id });
    setDeletingId(null);
    if (res.ok) {
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3 px-4">
        <span className="text-xs font-semibold text-white">
          Active Programme Schedules ({programmes.length})
        </span>
        <span className="flex items-center gap-1.5 text-2xs text-slate-400">
          <Building2 className="size-3 text-teal-400" />
          {unitName}
        </span>
      </div>

      {programmes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <Calendar className="size-8 text-teal-400" />
          <h4 className="mt-3 text-sm font-bold text-white">No active programmes scheduled</h4>
          <p className="mt-1 max-w-md text-xs text-slate-400">
            Submit your quarterly liturgy themes and ministerial speakers using the form.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {programmes.map((prog) => {
            const dateObj = new Date(prog.scheduleDate);
            const dateStr = isNaN(dateObj.getTime())
              ? prog.scheduleDate
              : dateObj.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

            return (
              <Card
                key={prog.id}
                className="overflow-hidden border-slate-800 bg-slate-900/80 p-5 shadow-md transition-all hover:border-slate-700"
              >
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{prog.title}</span>
                      <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-3xs font-semibold text-teal-400">
                        {dateStr}
                      </span>
                    </div>

                    <p className="text-xs italic text-teal-300">&ldquo;{prog.theme}&rdquo;</p>

                    <div className="flex items-center gap-1.5 text-2xs text-slate-400">
                      <Mic className="size-3 text-amber-400 shrink-0" />
                      <span>Ministers: {prog.speakers.join(", ")}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-2xs">
                      {prog.livestreamUrl && (
                        <a
                          href={prog.livestreamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-teal-400 hover:underline"
                        >
                          <Video className="size-3" />
                          <span>Livestream Link</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}

                      {prog.bulletinPdfUrl && (
                        <a
                          href={prog.bulletinPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-amber-400 hover:underline"
                        >
                          <FileText className="size-3" />
                          <span>Bulletin PDF</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDelete(prog.id)}
                      disabled={deletingId === prog.id}
                      className="h-7 text-slate-500 hover:text-rose-400"
                      title="Delete Programme"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
