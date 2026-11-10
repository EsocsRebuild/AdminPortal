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
  Church,
} from "lucide-react";
import { Page } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getOrdinationCandidates, type CandidateSortOption } from "@/features/ordination/queries";
import { CandidateStageBar } from "@/features/ordination/components/candidate-stage-bar";
import { NominateCandidateModal } from "@/features/ordination/components/nominate-candidate-modal";
import { OrdinationFilters } from "@/features/ordination/components/ordination-filters";
import { formatDate } from "@/lib/format";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Ordination Pipeline · ESOCS Admin" };

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
    (isGlobalAdmin && selectedProvince && selectedProvince !== "ALL"),
  );

  return (
    <Page>
      <TooltipProvider>
        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-page" gap={0.07}>
          {/* Executive Header — Visual twin of DashboardHeader */}
          <StaggerItem>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-r from-amber-500/10 via-card to-card p-5 shadow-xs sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Profile Info & Ecclesiastical Scope */}
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20 text-amber-600 shadow-xs sm:size-16 dark:text-amber-400">
                    <Award className="size-7" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-2xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                      <span>Ecclesiastical Docket</span>
                      <span>•</span>
                      <span>
                        {isGlobalAdmin && selectedProvince === "ALL"
                          ? "All Provinces Oversight"
                          : selectedProvince}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
                        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                        Live Records Synchronized
                      </span>
                    </div>

                    <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                      Ordination & Ministerial Pipeline
                    </h1>

                    <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                      4-Tier canonical vetting register for rank elevations across {selectedProvince}. Review
                      candidate dossiers, audit clerical recommendations, and advance vetting stages.
                    </p>
                  </div>
                </div>

                {/* Primary Action Shortcut */}
                <div className="flex shrink-0 items-center gap-2.5 pt-2 lg:pt-0">
                  <NominateCandidateModal defaultParishName={userUnit.unitName} />
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Canonical 4-Tier Pipeline Stepper Cards */}
          <StaggerItem>
            <div className="grid grid-cols-1 gap-page sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Total Docket */}
              <Card interactive className="p-card shadow-xs transition-all hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold tracking-widest text-muted-foreground uppercase">
                    Tier 01 • Active Docket
                  </span>
                  <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-soft-foreground">
                    <Building2 className="size-4" />
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="tabular text-metric font-semibold text-foreground">
                    {summary.totalCandidates}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedProvince === "ALL"
                      ? "Total Nominated Candidates"
                      : `${selectedProvince} Active Docket`}
                  </p>
                </div>
              </Card>

              {/* Card 2: District Review */}
              <Card interactive className="p-card shadow-xs transition-all hover:border-amber-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                    Tier 02 • District Review
                  </span>
                  <span className="grid size-8 place-items-center rounded-control bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <ShieldCheck className="size-4" />
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="tabular text-metric font-semibold text-amber-700 dark:text-amber-400">
                    {summary.stage2DistrictCount ?? summary.stage2Count}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">District council screening</p>
                </div>
              </Card>

              {/* Card 3: Provincial Conclave */}
              <Card interactive className="p-card shadow-xs transition-all hover:border-indigo-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold tracking-widest text-indigo-700 uppercase dark:text-indigo-400">
                    Tier 03 • Provincial Conclave
                  </span>
                  <span className="grid size-8 place-items-center rounded-control bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                    <Award className="size-4" />
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="tabular text-metric font-semibold text-indigo-700 dark:text-indigo-400">
                    {summary.stage3ProvincialCount ?? summary.stage3Count}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Advisory council conclave vetting</p>
                </div>
              </Card>

              {/* Card 4: Synod Ratified */}
              <Card interactive className="p-card shadow-xs transition-all hover:border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
                    Tier 04 • Synod Ratified
                  </span>
                  <span className="grid size-8 place-items-center rounded-control bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <UserCheck className="size-4" />
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="tabular text-metric font-semibold text-emerald-700 dark:text-emerald-400">
                    {summary.stage4NationalCount ?? summary.stage4ApprovedCount}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Holy Synod final ratification</p>
                </div>
              </Card>
            </div>
          </StaggerItem>

          {/* Filtering & Sorting Toolbar */}
          <StaggerItem>
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
          </StaggerItem>

          {/* Candidates Roster */}
          <StaggerItem>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-sm font-semibold text-foreground">
                    Candidate Vetting Register
                  </h2>
                  <Badge tone="neutral" shape="pill" className="font-mono text-2xs">
                    {candidates.length}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  All promotions are synchronized with central ecclesiastical records.
                </span>
              </div>

              {candidates.length === 0 ? (
                <Card className="border-border bg-card shadow-xs">
                  <EmptyState
                    icon={<Award />}
                    title="No Candidates in Vetting Docket"
                    description={
                      selectedProvince === "ALL"
                        ? "There are currently no candidates matching the active filter criteria across the church."
                        : `There are currently no ordination candidates matching your criteria under ${selectedProvince}. When parishes submit nominations, they will appear here.`
                    }
                    action={
                      <div className="flex flex-wrap gap-2">
                        {hasFilterParams && (
                          <Link href="/ordination">
                            <Button variant="outline" size="sm">
                              Clear Filters
                            </Button>
                          </Link>
                        )}
                        <NominateCandidateModal defaultParishName={userUnit.unitName} />
                      </div>
                    }
                  />
                </Card>
              ) : (
                <div className="grid grid-cols-[minmax(0,1fr)] gap-page">
                  {candidates.map((c) => (
                    <Card
                      key={c.id}
                      className="border-border bg-card p-card shadow-xs transition-colors hover:border-primary/40"
                    >
                      <CardContent className="space-y-4 p-0">
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-base font-bold text-foreground">{c.fullName}</span>
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-800 dark:text-amber-300">
                                TARGET: {c.rankTarget}
                              </span>
                              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-2xs font-semibold text-indigo-700 dark:text-indigo-300">
                                <Church className="mr-1 inline-block size-3" />
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
                                Reg Number:{" "}
                                <strong className="font-mono text-foreground">{c.memberId}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Current Rank:{" "}
                                <strong className="text-foreground">{c.churchRankCurrent}</strong>
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
                              <span suppressHydrationWarning>Nominated on: {formatDate(c.nominatedAt)}</span>
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

                        {/* 4-Stage Progress Stepper */}
                        <CandidateStageBar
                          currentStage={c.stageCurrent}
                          isProvincialWorshipper={c.isProvincialWorshipper}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>
        </Stagger>
      </TooltipProvider>
    </Page>
  );
}
