import type { Metadata } from "next";
import Link from "next/link";
import { Award, Plus, Building2, ShieldCheck, UserCheck, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getOrdinationCandidates } from "@/features/ordination/queries";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";

export const metadata: Metadata = { title: "Ordination Portal System · ESOCS Admin" };

export default async function OrdinationOverviewPage() {
  const { candidates, summary } = await getOrdinationCandidates();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Award className="size-6 text-amber-500" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Ordination Portal System</h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              4-Stage Ecclesiastical Rank Promotion Screening Docket & Vetting Register.
            </p>
          </div>

          <Button className="gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-md hover:bg-primary/90">
            <Plus className="size-4" />
            Nominate Candidate for Rank Promotion
          </Button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">Total Candidates</span>
                <Building2 className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{summary.totalCandidates}</div>
              <p className="text-2xs text-muted-foreground">Active in Vetting Pipeline</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">District Vetting</span>
                <ShieldCheck className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-500">{summary.stage2Count}</div>
              <p className="text-2xs text-muted-foreground">Stage 2 Screening</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">Zonal Clearance</span>
                <Award className="size-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-indigo-500">{summary.stage3Count}</div>
              <p className="text-2xs text-muted-foreground">Stage 3 Exam Passed</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">Supreme Approved</span>
                <UserCheck className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-500">{summary.stage4ApprovedCount}</div>
              <p className="text-2xs text-muted-foreground">Approved for Ordination</p>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Roster */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="size-4 text-primary" />
              Candidate Vetting Docket Roster
            </h2>
            <span className="font-mono text-2xs text-muted-foreground">Audit Scope: All Church Units</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {candidates.map((c) => (
              <Card
                key={c.id}
                className="bg-card overflow-hidden border-border transition-all hover:border-primary/40"
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-foreground">{c.fullName}</span>
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-500">
                          TARGET RANK: {c.rankTarget}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Current Rank: <strong className="text-foreground">{c.churchRankCurrent}</strong> •
                        Parish: <strong className="text-foreground">{c.parishName}</strong> ({c.districtName})
                      </p>
                      <p className="text-2xs text-muted-foreground">
                        Service Tenure: {c.yearsOfService} Years • Nominated on:{" "}
                        {new Date(c.nominatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Tooltip content="Inspect vetting history and advance clearance stage">
                        <Link href={`/ordination/candidates/${c.id}`}>
                          <Button variant="outline" className="hover:bg-muted gap-1.5 border-border text-xs">
                            Open Candidate Docket
                            <ChevronRight className="size-3.5" />
                          </Button>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>

                  {/* 4-Stage Progress Line */}
                  <CandidateStageBar currentStage={c.stageCurrent} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
