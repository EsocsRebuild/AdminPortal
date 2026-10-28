import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, CheckCircle2, Clock, User, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCandidateDocket } from "@/features/ordination/queries";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";
import {
  CandidateClearanceForm,
  CandidateRecordUpdateForm,
} from "@/features/ordination/components/docket-action-forms";

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
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Ordination Candidate Roster
          </Link>
          <span className="font-mono text-2xs text-muted-foreground">Candidate Reference: {candidate.memberId || candidate.id}</span>
        </div>

        {/* Candidate Header Dossier Card */}
        <Card className="bg-card border-border shadow-xs">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col items-start justify-between gap-5 border-b border-border pb-5 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                {candidate.passportPhotoUrl ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-primary/40 shadow-sm">
                    <Image
                      src={candidate.passportPhotoUrl}
                      alt={candidate.fullName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <User className="size-8" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-bold text-foreground">{candidate.fullName}</span>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-500 uppercase">
                      TARGET: {candidate.rankTarget}
                    </span>
                    {candidate.duesStatus === "cleared" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Dues Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-2xs font-semibold text-amber-500">
                        <Clock className="size-3" /> Dues Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reg Number: <strong className="font-mono text-foreground">{candidate.memberId}</strong> •
                    Current Rank: <strong className="text-foreground">{candidate.churchRankCurrent}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Branch: <strong className="text-foreground">{candidate.parishName}</strong> • District:{" "}
                    <strong className="text-foreground">{candidate.districtName}</strong> • Province:{" "}
                    <strong className="text-foreground">
                      {candidate.provinceName || "Provincial Headquarters"}
                    </strong>
                    {candidate.isProvincialWorshipper && (
                      <span className="text-3xs ml-2 inline-block rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-bold text-primary">
                        Provincial Seat Branch
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 self-start md:self-auto">
                <span className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  {candidate.yearsOfService} Years Active Service
                </span>
                <span className="text-2xs text-muted-foreground">
                  Nominated on {new Date(candidate.nominatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Candidate Metadata Strip */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-muted/30 p-3.5 text-xs sm:grid-cols-4">
              <div>
                <span className="block text-2xs font-semibold text-muted-foreground uppercase">
                  Email Address
                </span>
                <span className="mt-0.5 block truncate font-medium text-foreground">
                  {candidate.email || "Not recorded"}
                </span>
              </div>
              <div>
                <span className="block text-2xs font-semibold text-muted-foreground uppercase">
                  Phone Number
                </span>
                <span className="mt-0.5 block font-medium text-foreground">
                  {candidate.phone || "Not recorded"}
                </span>
              </div>
              <div>
                <span className="block text-2xs font-semibold text-muted-foreground uppercase">
                  Conduct Rating
                </span>
                <span className="mt-0.5 block font-semibold text-emerald-600 capitalize dark:text-emerald-400">
                  {candidate.conductRating || "Exemplary"}
                </span>
              </div>
              <div>
                <span className="block text-2xs font-semibold text-muted-foreground uppercase">
                  Ordination Fee
                </span>
                <span className="mt-0.5 block font-bold text-foreground">
                  {candidate.duesAmountPaid
                    ? `₦${candidate.duesAmountPaid.toLocaleString()}`
                    : "Pending Payment"}
                </span>
              </div>
            </div>

            {/* 4-Stage Progress Visualizer */}
            <div className="pt-1">
              <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Vetting Pipeline Stage
              </h3>
              <CandidateStageBar
                currentStage={candidate.stageCurrent}
                isProvincialWorshipper={candidate.isProvincialWorshipper}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stage Advancement Clearance Action */}
        {candidate.stageCurrent !== "STAGE_4_NATIONAL" &&
        candidate.stageCurrent !== "STAGE_4_SUPREME_APPROVED" ? (
          <Card className="border-amber-500/20 bg-amber-500/5 shadow-xs">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="size-4 text-amber-500" />
                  Ecclesiastical Board Stage Clearance Action
                </div>
              }
              description="Authorize advancement to the next screening stage after examining doctrinal fitness, character references, and ministry contributions."
            />
            <CardContent>
              <CandidateClearanceForm
                candidateId={candidate.id}
                candidateName={candidate.fullName}
                currentStage={candidate.stageCurrent}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-500/30 bg-emerald-500/5 p-6 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
              <BadgeCheck className="size-7" />
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground">
              National Level Final Ratification Granted
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Candidate has passed all ecclesiastical canonical vetting tiers and is ratified for official
              ordination and investiture by the Holy Synod.
            </p>
          </Card>
        )}

        {/* Update Candidate Record Card */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader
            title="Update Candidate Record & Financial Clearance"
            description="Update financial dues status or conduct assessment directly in the Ordination Portal database."
          />
          <CardContent>
            <CandidateRecordUpdateForm
              candidateId={candidate.id}
              initialDuesStatus={candidate.duesStatus}
              initialConductRating={candidate.conductRating}
            />
          </CardContent>
        </Card>

        {/* Signed Clearance Log & Audit History */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Clock className="size-4 text-primary" />
                Signed Clearance Log & Vetting History ({candidate.vettingHistory.length})
              </div>
            }
            description="Every stage approval is formally recorded with the Officer in-charge and approval date."
          />
          <CardContent className="space-y-3">
            {candidate.vettingHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No tier clearances have been granted yet. Submit stage 1 clearance above to start vetting.
              </p>
            ) : (
              candidate.vettingHistory.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-muted/40 space-y-1.5 rounded-xl border border-border p-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{log.stage}</span>
                    <span className="font-mono text-2xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{log.notes}</p>
                  <div className="pt-1 font-medium text-2xs text-primary">Verified by: {log.handlerId || "Secretariat Directorate"}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
