import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Building2,
  ShieldCheck,
  UserCheck,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Lock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { getOrdinationCandidates, type CandidateSortOption } from "@/features/ordination/queries";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";
import { NominateCandidateModal } from "@/features/ordination/components/nominate-candidate-modal";
import { OrdinationFilters } from "@/features/ordination/components/ordination-filters";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Ordination Portal System · ESOCS Admin" };

interface OrdinationPageProps {
  searchParams?: Promise<{
    province?: string;
    stage?: string;
    dues?: string;
    q?: string;
    sort?: CandidateSortOption;
  }>;
}

export default async function OrdinationOverviewPage({ searchParams }: OrdinationPageProps) {
  const session = await requireSession();
  const userUnit = await resolveUserUnit(session.scopeUnitId);
  const isGlobalAdmin = Boolean(userUnit.isGlobal || session.isPlatformAdmin);

  // Derive ecclesiastical provincial jurisdiction
  let userProvince = "Diobu Province";
  if (userUnit.unitName.toLowerCase().includes("diobu")) {
    userProvince = "Diobu Province";
  } else if (userUnit.unitName.toLowerCase().includes("lagos central")) {
    userProvince = "Lagos Central Province";
  } else if (userUnit.unitName.toLowerCase().includes("lagos")) {
    userProvince = "Lagos Province";
  } else if (userUnit.unitName.toLowerCase().includes("province")) {
    userProvince = userUnit.unitName;
  }

  const rawParams = searchParams ? await searchParams : {};
  // Provincial administrators are strictly locked to their jurisdiction
  const selectedProvince = !isGlobalAdmin ? userProvince : (rawParams.province ?? "ALL");
  const selectedStage = rawParams.stage ?? "ALL";
  const selectedDues = rawParams.dues ?? "ALL";
  const searchQuery = rawParams.q ?? "";
  const selectedSort = (rawParams.sort as CandidateSortOption) ?? "date-desc";

  const { candidates, summary, allProvinces } = await getOrdinationCandidates({
    province: selectedProvince,
    stage: selectedStage,
    duesStatus: selectedDues,
    search: searchQuery,
    sort: selectedSort,
  });

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
              4-Stage Ecclesiastical Rank Promotion Screening Docket & Vetting Register synchronized with live
              Ordination Portal.
            </p>
          </div>

          <NominateCandidateModal defaultParishName={userUnit.unitName} />
        </div>

        {/* Ecclesiastical Jurisdiction Scope Banner */}
        <div className="bg-card flex flex-col gap-3 rounded-lg border border-border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Ecclesiastical Jurisdiction
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary">
                  {isGlobalAdmin ? "Global Directorate Oversight" : "Provincial Jurisdiction"}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {isGlobalAdmin && selectedProvince === "ALL"
                  ? "Worldwide Central Administration • All Ecclesiastical Provinces"
                  : `${selectedProvince} • Exclusive Candidate Screening Docket`}
              </p>
            </div>
          </div>

          {!isGlobalAdmin && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-2xs font-medium text-amber-500">
              <Lock className="size-3" />
              <span>Strictly Scoped to {userUnit.unitName}</span>
            </div>
          )}
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-card border-border shadow-xs">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">
                  {selectedProvince === "ALL" ? "Total Candidates" : `${selectedProvince} Docket`}
                </span>
                <Building2 className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{summary.totalCandidates}</div>
              <p className="text-2xs text-muted-foreground">
                {selectedProvince === "ALL"
                  ? "Active in Vetting Pipeline"
                  : `Active Candidates in ${selectedProvince}`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-xs">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">District Vetting</span>
                <ShieldCheck className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-500">{summary.stage2Count}</div>
              <p className="text-2xs text-muted-foreground">Stage 2 Screening</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-xs">
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-2xs font-semibold tracking-wider uppercase">Zonal Clearance</span>
                <Award className="size-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-indigo-500">{summary.stage3Count}</div>
              <p className="text-2xs text-muted-foreground">Stage 3 Exam Passed</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-xs">
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

        {/* Professional Filtering & Sorting Toolbar */}
        <OrdinationFilters
          allProvinces={allProvinces}
          currentProvince={selectedProvince}
          currentStage={selectedStage}
          currentDues={selectedDues}
          currentSort={selectedSort}
          currentSearch={searchQuery}
          isGlobalAdmin={isGlobalAdmin}
          userJurisdictionName={userUnit.unitName}
          totalResults={candidates.length}
        />

        {/* Candidates Roster */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="size-4 text-primary" />
              Candidate Vetting Docket Roster ({candidates.length})
            </h2>
            <span className="font-mono text-2xs text-muted-foreground">
              Sync Mode: Two-Way Realtime Ordination API
            </span>
          </div>

          {candidates.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-6">
                <EmptyState
                  icon={<Award className="size-6 text-amber-500" />}
                  title="No Candidates Found"
                  description={
                    selectedProvince === "ALL"
                      ? "There are currently no candidates matching the active filter criteria in the vetting pipeline."
                      : `There are currently no ordination candidates matching your criteria under ${selectedProvince}.`
                  }
                  action={
                    <div className="flex gap-2">
                      <Link href="/ordination">
                        <Button variant="outline" size="sm">
                          Clear Filters
                        </Button>
                      </Link>
                      <NominateCandidateModal defaultParishName={userUnit.unitName} />
                    </div>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {candidates.map((c) => (
                <Card
                  key={c.id}
                  className="bg-card overflow-hidden border-border shadow-xs transition-all hover:border-primary/40"
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{c.fullName}</span>
                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-500">
                            TARGET: {c.rankTarget}
                          </span>
                          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-2xs font-semibold text-indigo-400">
                            <Building className="mr-1 inline-block size-3" />
                            {c.provinceName}
                          </span>
                          {c.duesStatus === "cleared" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="size-3" /> Dues Cleared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-2xs font-semibold text-amber-500">
                              <Clock className="size-3" /> Dues Pending
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            Reg Number: <strong className="font-mono text-foreground">{c.memberId}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Current Rank: <strong className="text-foreground">{c.churchRankCurrent}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Parish: <strong className="text-foreground">{c.parishName}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            District: <strong className="text-foreground">{c.districtName}</strong>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-muted-foreground">
                          <span>
                            Service Tenure:{" "}
                            <strong className="text-foreground">{c.yearsOfService} Years</strong>
                          </span>
                          {c.conductRating && (
                            <>
                              <span>•</span>
                              <span>
                                Conduct Rating:{" "}
                                <strong className="text-foreground capitalize">{c.conductRating}</strong>
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>Nominated on: {new Date(c.nominatedAt).toLocaleDateString()}</span>
                          {c.email && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mail className="size-3" /> {c.email}
                              </span>
                            </>
                          )}
                          {c.phone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="size-3" /> {c.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Tooltip content="Inspect vetting history and advance clearance stage">
                          <Link href={`/ordination/candidates/${c.id}`}>
                            <Button
                              variant="outline"
                              className="hover:bg-muted gap-1.5 border-border text-xs"
                            >
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
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
