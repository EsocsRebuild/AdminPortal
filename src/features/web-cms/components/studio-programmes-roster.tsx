"use client";

import * as React from "react";
import { Calendar, Trash2, ExternalLink, FileText, Video, Mic, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/modal-provider";
import { deleteProgrammeAction } from "../actions";
import type { WebProgramme } from "../types";

interface StudioProgrammesRosterProps {
  initialProgrammes: WebProgramme[];
  unitName: string;
}

export function StudioProgrammesRoster({ initialProgrammes, unitName }: StudioProgrammesRosterProps) {
  const router = useRouter();
  const modals = useModals();
  const [programmes, setProgrammes] = React.useState<WebProgramme[]>(initialProgrammes);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const target = programmes.find((p) => p.id === id);
    const confirmed = await modals.confirm({
      title: "Remove Programme Schedule?",
      description: target
        ? `Are you sure you want to remove "${target.title}"? This will unpublish the schedule from the church bulletin.`
        : "Are you sure you want to remove this programme schedule?",
      confirmLabel: "Remove Schedule",
      cancelLabel: "Keep Schedule",
      tone: "danger",
    });
    if (!confirmed) return;

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
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 px-4 shadow-xs">
        <span className="text-xs font-semibold text-foreground">
          Active Programme Schedules ({programmes.length})
        </span>
        <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
          <Building2 className="size-3 text-teal-600 dark:text-teal-400" />
          {unitName}
        </span>
      </div>

      {programmes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-xs">
          <Calendar className="size-8 text-teal-600 dark:text-teal-400" />
          <h4 className="mt-3 text-sm font-bold text-foreground">No active programmes scheduled</h4>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
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
                className="overflow-hidden border-border bg-card p-5 shadow-xs transition-all hover:border-border/80"
              >
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="max-w-xl space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{prog.title}</span>
                      <span className="text-3xs rounded-full bg-teal-500/10 px-2 py-0.5 font-semibold text-teal-600 dark:text-teal-400">
                        {dateStr}
                      </span>
                    </div>

                    <p className="text-xs text-teal-600 italic dark:text-teal-400">
                      &ldquo;{prog.theme}&rdquo;
                    </p>

                    <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                      <Mic className="size-3 shrink-0 text-amber-500" />
                      <span>Ministers: {prog.speakers.join(", ")}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-2xs">
                      {prog.livestreamUrl && (
                        <a
                          href={prog.livestreamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-teal-600 hover:underline dark:text-teal-400"
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
                          className="flex items-center gap-1 text-amber-600 hover:underline dark:text-amber-400"
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
                      className="h-7 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
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
