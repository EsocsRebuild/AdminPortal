"use client";

import * as React from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Church,
  Globe2,
  Lock,
  Search,
  Sparkles,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/components/auth/session-provider";
import { Badge } from "@/components/ui/badge";
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

export interface UnitScopeOption {
  id: string | null;
  name: string;
  type: "global" | "parish" | "fellowship";
  code?: string;
}

const defaultUnits: UnitScopeOption[] = [
  { id: null, name: "Global HQ (All Parishes)", type: "global" },
  { id: "parish-mount-zion", name: "Mount Zion Parish", type: "parish", code: "MZP" },
  { id: "parish-surulere", name: "Surulere Parish", type: "parish", code: "SLP" },
  { id: "parish-london", name: "London Central Parish", type: "parish", code: "LCP" },
  { id: "section-women", name: "Women Fellowship", type: "fellowship", code: "WF" },
  { id: "section-youth", name: "Youth Fellowship", type: "fellowship", code: "YF" },
  { id: "section-choir", name: "Music Directorate / Choir", type: "fellowship", code: "MD" },
];

export function UnitSwitcher() {
  const user = useSession();
  const isSuperAdmin = user?.isPlatformAdmin || user?.role?.name?.toLowerCase().includes("super");

  // Load from cookie or localStorage
  const [activeUnit, setActiveUnit] = React.useState<UnitScopeOption>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("esocs_active_unit");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    // Default to Mount Zion if Parish Admin, or Global if Super Admin
    return isSuperAdmin ? defaultUnits[0] : defaultUnits[1];
  });

  const [search, setSearch] = React.useState("");

  const filteredUnits = defaultUnits.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.code && u.code.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSelect(unit: UnitScopeOption) {
    setActiveUnit(unit);
    if (typeof window !== "undefined") {
      localStorage.setItem("esocs_active_unit", JSON.stringify(unit));
      document.cookie = `esocs_scope_unit=${unit.id || ""}; path=/; max-age=2592000; SameSite=Lax`;
    }
    toast.success(`Active scope: ${unit.name}`);
    // Refresh page state to reload data for the newly selected scope
    window.location.reload();
  }

  // If user is a locked local parish admin (not super admin), show locked status badge
  if (!isSuperAdmin) {
    return (
      <Tooltip content="Your administrative account is scoped exclusively to Mount Zion Parish.">
        <div className="flex items-center gap-1.5 rounded-control border border-border bg-surface-muted/60 px-2.5 py-1 text-xs font-medium text-foreground">
          <Church className="size-3.5 text-primary" />
          <span className="font-semibold">Mount Zion Parish</span>
          <span className="flex items-center gap-1 text-2xs text-muted-foreground">
            <Lock className="size-3" /> Scoped
          </span>
        </div>
      </Tooltip>
    );
  }

  // Super Admin dropdown switcher
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-control-sm cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-2.5 text-xs font-medium text-foreground shadow-xs transition-colors",
            "hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
          )}
        >
          {activeUnit.type === "global" ? (
            <Globe2 className="size-3.5 text-blue-500" />
          ) : activeUnit.type === "parish" ? (
            <Church className="size-3.5 text-emerald-500" />
          ) : (
            <Users2 className="size-3.5 text-amber-500" />
          )}
          <span className="max-w-[130px] truncate sm:max-w-[180px] font-semibold">
            {activeUnit.name}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-1.5">
        <div className="flex items-center gap-2 border-b border-border-subtle px-2 pb-2 pt-1">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parish or section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <DropdownMenuGroup className="mt-1 max-h-60 overflow-y-auto">
          <DropdownMenuLabel className="px-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
            Administrative Units
          </DropdownMenuLabel>

          {filteredUnits.map((u) => {
            const isSelected = activeUnit.id === u.id;
            return (
              <DropdownMenuItem
                key={u.id ?? "global"}
                onClick={() => handleSelect(u)}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  {u.type === "global" ? (
                    <Globe2 className="size-3.5 text-blue-500 shrink-0" />
                  ) : u.type === "parish" ? (
                    <Church className="size-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Users2 className="size-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={cn(isSelected && "font-semibold text-primary")}>
                    {u.name}
                  </span>
                </div>
                {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="px-2 py-1 text-2xs text-muted-foreground">
          Tip: Switching units applies an active filter to all statistics, lists, and forms.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
