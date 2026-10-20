"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface GivingWeeklyPoint {
  week: string;
  tithes: number;
  offering: number;
  welfare: number;
  building: number;
}

function formatCurrency(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function GivingChart({
  data = [],
  className,
}: {
  data?: GivingWeeklyPoint[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (!data || data.length === 0) {
    return null;
  }

  const totals = data.map((d) => d.tithes + d.offering + d.welfare + d.building);
  const maxTotal = Math.max(...totals) * 1.15;

  const currentWeek = data[data.length - 1];
  const currentTotal = currentWeek.tithes + currentWeek.offering + currentWeek.welfare + currentWeek.building;
  const previousWeek = data[data.length - 2];
  const previousTotal =
    previousWeek.tithes + previousWeek.offering + previousWeek.welfare + previousWeek.building;
  const growthRate = (currentTotal - previousTotal) / previousTotal;

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : currentWeek;
  const activeTotal = activePoint.tithes + activePoint.offering + activePoint.welfare + activePoint.building;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        title="Weekly Collections & Stewardship"
        description="Parish tithes, Sunday offerings, welfare funds, and building donations."
        actions={
          <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <ArrowUpRight className="size-3.5" />
            <span>{formatPercent(growthRate)} this week</span>
          </div>
        }
      />
      <CardContent className="space-y-4 pt-1">
        {/* Metric summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-muted-foreground uppercase">Total Collections</span>
            <div className="mt-0.5 text-lg font-bold text-foreground">{formatCurrency(activeTotal)}</div>
            <span className="text-2xs text-muted-foreground">{activePoint.week}</span>
          </div>
          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-primary uppercase">Tithes (10%)</span>
            <div className="mt-0.5 text-lg font-bold text-foreground">
              {formatCurrency(activePoint.tithes)}
            </div>
            <span className="text-2xs text-muted-foreground">
              {Math.round((activePoint.tithes / activeTotal) * 100)}% of total
            </span>
          </div>
          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-emerald-600 uppercase dark:text-emerald-400">
              Sunday Offering
            </span>
            <div className="mt-0.5 text-lg font-bold text-foreground">
              {formatCurrency(activePoint.offering)}
            </div>
            <span className="text-2xs text-muted-foreground">
              {Math.round((activePoint.offering / activeTotal) * 100)}% of total
            </span>
          </div>
          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-purple-600 uppercase dark:text-purple-400">
              Projects & Welfare
            </span>
            <div className="mt-0.5 text-lg font-bold text-foreground">
              {formatCurrency(activePoint.building + activePoint.welfare)}
            </div>
            <span className="text-2xs text-muted-foreground">Building & Charity</span>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-44 pt-4">
          <div className="flex h-36 items-end justify-between gap-3 px-2 sm:gap-6">
            {data.map((d, i) => {
              const weekTotal = d.tithes + d.offering + d.welfare + d.building;
              const heightPercent = (weekTotal / maxTotal) * 100;
              const isHovered = hoveredIndex === i;

              // Proportions within the bar
              const titheH = (d.tithes / weekTotal) * 100;
              const offeringH = (d.offering / weekTotal) * 100;
              const buildingH = (d.building / weekTotal) * 100;
              const welfareH = (d.welfare / weekTotal) * 100;

              return (
                <div
                  key={d.week}
                  className="group relative flex flex-1 cursor-pointer flex-col items-center"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Top value callout on hover */}
                  <div
                    className={cn(
                      "absolute -top-7 rounded-xs bg-surface-raised px-1.5 py-0.5 text-2xs font-bold whitespace-nowrap shadow-xs transition-opacity",
                      isHovered ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {formatCurrency(weekTotal)}
                  </div>

                  {/* Stacked Bar */}
                  <div
                    className={cn(
                      "flex w-full max-w-[42px] flex-col overflow-hidden rounded-t-control transition-all duration-200",
                      isHovered
                        ? "scale-105 ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "opacity-90",
                    )}
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div style={{ height: `${buildingH}%` }} className="bg-purple-500" title="Building" />
                    <div style={{ height: `${welfareH}%` }} className="bg-amber-500" title="Welfare" />
                    <div style={{ height: `${offeringH}%` }} className="bg-emerald-500" title="Offering" />
                    <div style={{ height: `${titheH}%` }} className="flex-1 bg-primary" title="Tithes" />
                  </div>

                  {/* X Label */}
                  <span
                    className={cn(
                      "mt-2 tabular text-2xs font-medium transition-colors",
                      isHovered ? "font-bold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {d.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 border-t border-border-subtle pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" />
            <span>Tithes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span>Sunday Offering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span>Welfare & Mercy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-purple-500" />
            <span>Building / Projects</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
