"use client";

import * as React from "react";
import { Check, ChevronDown, Church, Globe2, Lock, Search, Users2 } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/components/auth/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UnitScopeMetadata } from "@/types/auth";

export type UnitScopeOption = UnitScopeMetadata;

const defaultUnits: UnitScopeOption[] = [
  { id: null, name: "Global HQ (All Church Units)", type: "global" },
  { id: "parish-mount-zion", name: "Mount Zion Parish", type: "parish", code: "MZP", slug: "mount-zion" },
  { id: "parish-surulere", name: "Surulere Parish", type: "parish", code: "SLP", slug: "surulere" },
  { id: "parish-london", name: "London Central Parish", type: "parish", code: "LCP", slug: "london-central" },
  { id: "section-women", name: "Women Fellowship", type: "fellowship", code: "WF", slug: "women-fellowship" },
  { id: "section-youth", name: "Youth Fellowship", type: "fellowship", code: "YF", slug: "youth-fellowship" },
  {
    id: "section-choir",
    name: "Music Directorate / Choir",
    type: "fellowship",
    code: "MD",
    slug: "music-directorate",
  },
];

function saveUnitScopeCookie(unitId: string) {
  if (typeof document !== "undefined") {
    document.cookie = `esocs_scope_unit=${unitId}; path=/; max-age=2592000; SameSite=Lax`;
  }
}

export function UnitSwitcher() {
  const user = useSession();
  const isSuperAdmin = Boolean(
    user?.isPlatformAdmin ||
    user?.role?.name?.toLowerCase().includes("super") ||
    user?.role?.name?.toLowerCase().includes("prelate"),
  );

  const [units, setUnits] = React.useState<UnitScopeOption[]>(defaultUnits);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/lookups/parishes")
      .then((res) => (res.ok ? res.json() : []))
      .then((parishes: Array<{ id: string; name: string }>) => {
        if (isMounted && Array.isArray(parishes) && parishes.length > 0) {
          const mapped: UnitScopeOption[] = [
            defaultUnits[0], // Global HQ
            ...parishes.map((p) => ({
              id: p.id,
              name: p.name,
              type: "parish" as const,
              slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            })),
          ];
          setUnits(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Load active unit from cookie or localStorage
  const [activeUnit, setActiveUnit] = React.useState<UnitScopeOption>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("esocs_active_unit");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore parsing error
        }
      }
    }
    return isSuperAdmin ? defaultUnits[0] : defaultUnits[1];
  });

  const [search, setSearch] = React.useState("");

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.code && u.code.toLowerCase().includes(search.toLowerCase())),
  );

  function handleSelect(unit: UnitScopeOption) {
    setActiveUnit(unit);
    if (typeof window !== "undefined") {
      localStorage.setItem("esocs_active_unit", JSON.stringify(unit));
      saveUnitScopeCookie(unit.id || "");
    }
    toast.success(`Active scope switched: ${unit.name}`);
    window.location.reload();
  }

  // Non-Super Admin: view locked to parish/unit
  if (!isSuperAdmin) {
    const scopeId = user?.scopeUnitId || user?.parishId;
    const currentUnit = units.find((u) => u.id === scopeId);
    const parishName = currentUnit?.name ?? (user?.role?.name ? `${user.role.name} Jurisdiction` : "Local Parish");

    return (
      <Tooltip content={`Your administrative account is scoped exclusively to ${parishName}.`}>
        <div className="flex items-center gap-1.5 rounded-control border border-border bg-surface-muted/60 px-2.5 py-1 text-xs font-medium text-foreground">
          <Church className="size-3.5 text-primary" />
          <span className="font-semibold">{parishName}</span>
          <span className="flex items-center gap-1 text-2xs text-muted-foreground">
            <Lock className="size-3" /> Scoped
          </span>
        </div>
      </Tooltip>
    );
  }

  // Super Admin: panoramic dropdown switcher
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch active administrative unit scope"
          className={cn(
            "flex h-control-sm cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-2.5 text-xs font-medium text-foreground shadow-xs transition-colors",
            "hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring",
          )}
        >
          {activeUnit.type === "global" ? (
            <Globe2 className="size-3.5 shrink-0 text-blue-500" />
          ) : activeUnit.type === "parish" ? (
            <Church className="size-3.5 shrink-0 text-emerald-500" />
          ) : (
            <Users2 className="size-3.5 shrink-0 text-amber-500" />
          )}
          <span className="max-w-[130px] truncate font-semibold sm:max-w-[180px]">{activeUnit.name}</span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-1.5">
        <div className="flex items-center gap-2 border-b border-border-subtle px-2 pt-1 pb-2">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parish or fellowship..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <DropdownMenuGroup className="mt-1 max-h-64 overflow-y-auto">
          <DropdownMenuLabel className="px-2 py-1 text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            Church Governance Scope
          </DropdownMenuLabel>

          {filteredUnits.map((u) => {
            const isSelected = activeUnit.id === u.id;
            return (
              <DropdownMenuItem
                key={u.id ?? "global"}
                onClick={() => handleSelect(u)}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  {u.type === "global" ? (
                    <Globe2 className="size-3.5 shrink-0 text-blue-500" />
                  ) : u.type === "parish" ? (
                    <Church className="size-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Users2 className="size-3.5 shrink-0 text-amber-500" />
                  )}
                  <span className={cn(isSelected && "font-semibold text-primary")}>{u.name}</span>
                </div>
                {isSelected && <Check className="size-3.5 shrink-0 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-2xs text-muted-foreground">
          <span className="font-semibold text-foreground">Act-as-Unit:</span> Requests will transmit{" "}
          <code className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 text-2xs">
            X-Scope-Unit
          </code>{" "}
          header automatically.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
