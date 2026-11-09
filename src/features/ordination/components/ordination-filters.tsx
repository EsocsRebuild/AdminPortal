"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Lock, Building, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CandidateSortOption } from "../queries";

interface OrdinationFiltersProps {
  allProvinces: string[];
  currentProvince: string;
  currentStage: string;
  currentDues: string;
  currentSort: CandidateSortOption;
  currentSearch: string;
  isGlobalAdmin: boolean;
  userJurisdictionName: string;
  totalResults: number;
}

export function OrdinationFilters({
  allProvinces,
  currentProvince,
  currentStage,
  currentDues,
  currentSort,
  currentSearch,
  isGlobalAdmin,
  userJurisdictionName,
  totalResults,
}: OrdinationFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [prevSearch, setPrevSearch] = React.useState(currentSearch);
  const [searchValue, setSearchValue] = React.useState(currentSearch);
  const [isPending, startTransition] = React.useTransition();

  // Sync internal state when currentSearch prop changes
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setSearchValue(currentSearch);
  }

  const updateFilters = React.useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams ? searchParams.toString() : "");

      for (const [key, val] of Object.entries(updates)) {
        if (!val || val === "ALL" || (key === "sort" && val === "date-desc")) {
          current.delete(key);
        } else {
          current.set(key, val);
        }
      }

      startTransition(() => {
        const query = current.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchValue.trim() || null });
  };

  const handleReset = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    searchValue.trim() ||
    (currentStage && currentStage !== "ALL") ||
    (currentDues && currentDues !== "ALL") ||
    (isGlobalAdmin && currentProvince && currentProvince !== "ALL") ||
    (currentSort && currentSort !== "date-desc"),
  );

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs sm:p-6">
      {/* Search Input Row */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search candidates by name, target ecclesiastical rank, parish, or district..."
          prefix={<Search className="size-4 text-muted-foreground" />}
          suffix={
            searchValue ? (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateFilters({ q: null });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : undefined
          }
          className="h-11 w-full rounded-xl border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
        />
      </form>

      {/* Filter Dropdowns Grid - Generous, perfectly responsive 4-column layout */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Province / Jurisdiction Filter */}
        <div className="relative">
          <select
            value={currentProvince}
            disabled={!isGlobalAdmin}
            onChange={(e) => updateFilters({ province: e.target.value })}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-85"
          >
            {isGlobalAdmin ? (
              <>
                <option value="ALL">All Ecclesiastical Provinces</option>
                {allProvinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </>
            ) : (
              <option value={currentProvince}>{currentProvince} (Assigned Jurisdiction)</option>
            )}
          </select>
          {!isGlobalAdmin && (
            <div
              className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center gap-1 text-2xs text-amber-700 dark:text-amber-400"
              title={`Locked to your assigned jurisdiction: ${userJurisdictionName}`}
            >
              <Lock className="size-3.5" />
            </div>
          )}
        </div>

        {/* Vetting Pipeline Stage Filter */}
        <div>
          <select
            value={currentStage}
            onChange={(e) => updateFilters({ stage: e.target.value })}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Vetting Stages</option>
            <option value="STAGE_1_BRANCH">Stage 1: Branch Level</option>
            <option value="STAGE_2_DISTRICT">Stage 2: District Review</option>
            <option value="STAGE_3_PROVINCIAL">Stage 3: Provincial Review</option>
            <option value="STAGE_4_NATIONAL">Stage 4: National Level</option>
          </select>
        </div>

        {/* Dues Status Filter */}
        <div>
          <select
            value={currentDues}
            onChange={(e) => updateFilters({ dues: e.target.value })}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Dues Status</option>
            <option value="cleared">Dues Cleared</option>
            <option value="pending">Dues Pending</option>
            <option value="exempt">Dues Exempt</option>
          </select>
        </div>

        {/* Sort Order Selector */}
        <div>
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="date-desc">Sort: Newest First</option>
            <option value="date-asc">Sort: Oldest First</option>
            <option value="name-asc">Sort: Name (A → Z)</option>
            <option value="name-desc">Sort: Name (Z → A)</option>
            <option value="rank">Sort: Target Rank</option>
            <option value="tenure-desc">Sort: Service Tenure</option>
            <option value="stage">Sort: Pipeline Stage</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges and Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-3.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">
            {isPending ? "Filtering..." : `Showing ${totalResults} candidate${totalResults === 1 ? "" : "s"}`}
          </span>

          {/* Only show province badge as active filter if global admin intentionally selected one */}
          {isGlobalAdmin && currentProvince && currentProvince !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-2xs font-semibold text-primary">
              <Building className="size-3" />
              {currentProvince}
              <button
                type="button"
                onClick={() => updateFilters({ province: null })}
                className="hover:opacity-75"
              >
                <X className="size-2.5" />
              </button>
            </span>
          )}

          {currentStage && currentStage !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-2xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Filter className="size-3" />
              {currentStage === "STAGE_1_BRANCH" || currentStage === "STAGE_1_PARISH"
                ? "Stage 1: Branch"
                : currentStage === "STAGE_2_DISTRICT"
                  ? "Stage 2: District"
                  : currentStage === "STAGE_3_PROVINCIAL" || currentStage === "STAGE_3_ZONAL"
                    ? "Stage 3: Provincial"
                    : "Stage 4: National"}
              <button
                type="button"
                onClick={() => updateFilters({ stage: null })}
                className="hover:opacity-75"
              >
                <X className="size-2.5" />
              </button>
            </span>
          )}

          {currentDues && currentDues !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-semibold text-amber-800 dark:text-amber-300">
              {currentDues === "cleared" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
              Dues: {currentDues}
              <button
                type="button"
                onClick={() => updateFilters({ dues: null })}
                className="hover:opacity-75"
              >
                <X className="size-2.5" />
              </button>
            </span>
          )}

          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-2xs font-semibold text-foreground">
              Search: &quot;{currentSearch}&quot;
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateFilters({ q: null });
                }}
                className="hover:opacity-75"
              >
                <X className="size-2.5" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 gap-1.5 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
