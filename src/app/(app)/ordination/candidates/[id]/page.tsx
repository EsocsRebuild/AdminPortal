import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCandidateDocket } from "@/features/ordination/queries";
import { advanceVettingStageAction } from "@/features/ordination/actions";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";

export const metadata: Metadata = { title: "Candidate Vetting Docket · ESOCS Ordination" };

export default async function CandidateDocketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = await getCandidateDocket(id);

  if (!candidate) notFound();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/ordination"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Ordination Candidate Roster
          </Link>
          <span className="font-mono text-2xs text-muted-foreground">Candidate ID: {candidate.id}</span>
        </div>

        {/* Candidate Header Card */}
        <Card className="bg-card border-border">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{candidate.fullName}</span>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-500">
                    TARGET RANK: {candidate.rankTarget}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Member ID: {candidate.memberId} • Parish:{" "}
                  <strong className="text-foreground">{candidate.parishName}</strong> (
                  {candidate.districtName})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  {candidate.yearsOfService} Years Service
                </span>
              </div>
            </div>

            {/* 4-Stage Progress Visualizer */}
            <div className="pt-2">
              <h3 className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Clearance Pipeline Progress
              </h3>
              <CandidateStageBar currentStage={candidate.stageCurrent} />
            </div>
          </CardContent>
        </Card>

        {/* Stage Advancement Clearance Action */}
        {candidate.stageCurrent !== "STAGE_4_SUPREME_APPROVED" && (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="size-4 text-amber-500" />
                  Vetting Board Clearance Action
                </div>
              }
              description="Advance candidate to the next clearance stage after reviewing certificates and character reports."
            />
            <CardContent>
              <form
                action={async (formData) => {
                  "use server";
                  await advanceVettingStageAction({
                    candidateId: candidate.id,
                    currentStage: candidate.stageCurrent,
                    action: "APPROVED",
                    clearanceNotes:
                      (formData.get("notes") as string) || "Vetting clearance granted by board.",
                  });
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label htmlFor="clearance-notes" className="text-xs font-medium text-foreground">
                    Clearance Audit Notes *
                  </label>
                  <textarea
                    id="clearance-notes"
                    name="notes"
                    rows={2}
                    required
                    placeholder="Provide justification and verification details for this clearance stage..."
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    className="gap-1.5 bg-emerald-600 text-xs font-medium text-white shadow-md hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="size-4" />
                    Grant Stage Clearance & Advance
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vetting History & Audit Log */}
        <Card className="bg-card border-border">
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Clock className="size-4 text-primary" />
                Signed Clearance Log & Audit History
              </div>
            }
            description="Every stage approval is permanently recorded with Handler ID (`X-Handler-Id`)."
          />
          <CardContent className="space-y-3">
            {candidate.vettingHistory.map((log, idx) => (
              <div key={idx} className="bg-muted/40 space-y-1 rounded-xl border border-border p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{log.stage}</span>
                  <span className="font-mono text-2xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{log.notes}</p>
                <div className="pt-1 font-mono text-2xs text-primary">Signed by Handler: {log.handlerId}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
