import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Building2,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getOrdinationCandidates, type CandidateSortOption } from "@/features/ordination/queries";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";
import { NominateCandidateModal } from "@/features/ordination/components/nominate-candidate-modal";
import { OrdinationFilters } from "@/features/ordination/components/ordination-filters";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const hasFilterParams = Boolean(
    searchQuery ||
    (selectedStage && selectedStage !== "ALL") ||
    (selectedDues && selectedDues !== "ALL") ||
    (isGlobalAdmin && selectedProvince && selectedProvince !== "ALL")
  );

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Executive Header */}
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Award className="size-4" />
              <span>Ecclesiastical Vetting Docket</span>
              <span>•</span>
              <span>{isGlobalAdmin && selectedProvince === "ALL" ? "All Provinces Oversight" : selectedProvince}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ordination & Ministerial Pipeline
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              4-Tier canonical screening docket and vetting register for clergy and church worker rank elevations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Church Records Synchronized</span>
            </span>
            <NominateCandidateModal defaultParishName={userUnit.unitName} />
          </div>
        </div>

        {/* 4-Stage Liturgical Stepper Funnel Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Docket */}
          <div className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Tier 01 • Total Docket
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Building2 className="size-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              {summary.totalCandidates}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active candidates nominated in {selectedProvince}
            </p>
          </div>

          {/* Card 2: District Review */}
          <div className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-amber-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Tier 02 • District Review
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight text-amber-700 dark:text-amber-400">
              {summary.stage2DistrictCount ?? summary.stage2Count}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Pastoral council & local district screening
            </p>
          </div>

          {/* Card 3: Provincial Review */}
          <div className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-indigo-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-indigo-700 dark:text-indigo-400">
                Tier 03 • Provincial Conclave
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                <Award className="size-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
              {summary.stage3ProvincialCount ?? summary.stage3Count}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Provincial advisory council conclave vetting
            </p>
          </div>

          {/* Card 4: National Level */}
          <div className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Tier 04 • Synod Ratified
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <UserCheck className="size-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              {summary.stage4NationalCount ?? summary.stage4ApprovedCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Holy Synod final canonical investiture
            </p>
          </div>
        </div>

        {/* Filtering & Sorting Toolbar */}
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
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-foreground">
              Candidate Vetting Register ({candidates.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              All promotions are synchronized with the central ecclesiastical records.
            </span>
          </div>

          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface-muted/20 px-6 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-700 shadow-xs dark:text-amber-400">
                <Award className="size-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">No Candidates in Vetting Docket</h3>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                {selectedProvince === "ALL"
                  ? "There are currently no candidates matching the active filter criteria across the church."
                  : `There are currently no ordination candidates matching your criteria under ${selectedProvince}. When parishes submit nominations, they will appear here.`}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasFilterParams && (
                  <Link href="/ordination">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      Clear Active Filters
                    </Button>
                  </Link>
                )}
                <NominateCandidateModal defaultParishName={userUnit.unitName} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{c.fullName}</span>
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-800 dark:text-amber-300">
                            TARGET: {c.rankTarget}
                          </span>
                          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-2xs font-semibold text-indigo-700 dark:text-indigo-300">
                            <Building className="mr-1 inline-block size-3" />
                            {c.provinceName}
                          </span>
                          {c.isProvincialWorshipper && (
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary">
                              Provincial Seat Branch
                            </span>
                          )}
                          {c.duesStatus === "cleared" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="size-3" /> Dues Cleared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-2xs font-semibold text-amber-800 dark:text-amber-300">
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
                            Branch: <strong className="text-foreground">{c.parishName}</strong>
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
                              className="hover:bg-muted gap-1.5 border-border text-xs font-semibold"
                            >
                              Open Candidate Docket
                              <ChevronRight className="size-3.5" />
                            </Button>
                          </Link>
                        </Tooltip>
                      </div>
                    </div>

                    {/* 4-Stage Progress Line */}
                    <CandidateStageBar
                      currentStage={c.stageCurrent}
                      isProvincialWorshipper={c.isProvincialWorshipper}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
