import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getVettingQueue } from "@/features/web-cms/queries";
import { vetContentAction } from "@/features/web-cms/actions";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Super Admin Vetting Queue · ESOCS Web Admin" };

export default async function SuperVettingQueuePage() {
  await requireSession();
  const { events, programmes, summary } = await getVettingQueue();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Super Admin Vetting Inbox</h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Central content clearance board for Parishes, Districts, and Provinces.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-semibold text-amber-600 dark:text-amber-400">
              🟡 {summary.pendingEventsCount + summary.pendingProgrammesCount} Pending Review
            </span>
            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
              🟢 {summary.approvedCount} Approved Live
            </span>
          </div>
        </div>

        {/* Vetting Stream */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="size-4 text-amber-500" />
            Pending Submissions Queue
          </h2>

          {events.length === 0 && programmes.length === 0 ? (
            <Card className="border-border bg-card p-8 text-center shadow-xs">
              <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-foreground">Vetting Queue Clean!</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                All branch submissions have been reviewed and processed.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-border bg-card shadow-xs transition-all hover:border-border/80"
                >
                  <div className="flex flex-col items-start justify-between gap-5 p-5 lg:flex-row lg:items-center">
                    <div className="max-w-2xl space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-2xs font-semibold text-foreground">
                          EVENT SUBMISSION
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Unit: {item.unitName}
                        </span>
                        <span className="text-2xs text-muted-foreground">
                          Submitted by: {item.submittedByHandlerId}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>

                      <div className="flex items-center gap-4 pt-1 text-2xs text-muted-foreground">
                        <span>📍 {item.venue}</span>
                        <span>📅 {new Date(item.startDate).toLocaleString()}</span>
                        {item.registrationOpen && (
                          <span className="text-emerald-600 dark:text-emerald-400">✓ Registration Open</span>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Action Buttons */}
                    <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
                      <form
                        action={async () => {
                          "use server";
                          await vetContentAction({
                            contentId: item.id,
                            contentType: "EVENT",
                            action: "REJECT_REVISION",
                            reviewNotes: "Please update venue capacity and upload banner.",
                          });
                        }}
                      >
                        <Tooltip content="Returns submission to branch handler for revision">
                          <Button
                            type="submit"
                            variant="outline"
                            className="gap-1.5 border-rose-500/30 bg-rose-500/10 text-xs text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                          >
                            <X className="size-3.5" />
                            Request Changes
                          </Button>
                        </Tooltip>
                      </form>

                      <form
                        action={async () => {
                          "use server";
                          await vetContentAction({
                            contentId: item.id,
                            contentType: "EVENT",
                            action: "APPROVE",
                          });
                        }}
                      >
                        <Tooltip content={`Publishes content instantly to public ${item.unitName} web page`}>
                          <Button
                            type="submit"
                            className="gap-1.5 bg-emerald-600 text-xs text-white shadow-md hover:bg-emerald-500"
                          >
                            <Check className="size-3.5" />
                            Approve & Publish Live
                          </Button>
                        </Tooltip>
                      </form>
                    </div>
                  </div>
                </Card>
              ))}

              {programmes.map((prog) => (
                <Card
                  key={prog.id}
                  className="overflow-hidden border-border bg-card shadow-xs transition-all hover:border-border/80"
                >
                  <div className="flex flex-col items-start justify-between gap-5 p-5 lg:flex-row lg:items-center">
                    <div className="max-w-2xl space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 font-mono text-2xs font-semibold text-foreground">
                          PROGRAMME SUBMISSION
                        </span>
                        <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-2xs font-semibold text-teal-600 dark:text-teal-400">
                          Unit: {prog.unitName}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground">{prog.title}</h3>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Theme: &quot;{prog.theme}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Keynote Speakers: {prog.speakers.join(", ")}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
                      <form
                        action={async () => {
                          "use server";
                          await vetContentAction({
                            contentId: prog.id,
                            contentType: "PROGRAMME",
                            action: "APPROVE",
                          });
                        }}
                      >
                        <Button
                          type="submit"
                          className="gap-1.5 bg-emerald-600 text-xs text-white shadow-md hover:bg-emerald-500"
                        >
                          <Check className="size-3.5" />
                          Approve & Publish Live
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
