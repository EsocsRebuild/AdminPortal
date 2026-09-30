"use client";

import * as React from "react";
import { Users2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface FellowshipSlice {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

const defaultSlices: FellowshipSlice[] = [
  { id: "women", name: "Women Fellowship", count: 165, color: "#10b981", description: "Mothers' summit, prayer circle" },
  { id: "men", name: "Men Fellowship", count: 124, color: "#3b82f6", description: "Elders, men's breakfast" },
  { id: "youth", name: "Youth Fellowship", count: 98, color: "#f59e0b", description: "Campus rally, music, sports" },
  { id: "children", name: "Children Department", count: 53, color: "#8b5cf6", description: "Sunday school, choir cubs" },
];

export function DistributionDonutChart({
  slices = defaultSlices,
  className,
}: {
  slices?: FellowshipSlice[];
  className?: string;
}) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const total = slices.reduce((acc, s) => acc + s.count, 0);

  // SVG Donut geometry
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeSlice = hoveredId ? slices.find((s) => s.id === hoveredId) : null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        title="Fellowship & Department Roster"
        description="Active congregation distribution by autonomous section."
      />
      <CardContent className="space-y-4 pt-1">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          {/* Donut Graphic */}
          <div className="relative grid place-items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
              {slices.map((slice) => {
                const percent = slice.count / total;
                const strokeDasharray = `${percent * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedPercent * circumference;
                accumulatedPercent += percent;

                const isHovered = hoveredId === slice.id;

                return (
                  <circle
                    key={slice.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredId(slice.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Metric */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {activeSlice ? formatNumber(activeSlice.count) : formatNumber(total)}
              </span>
              <span className="text-2xs font-medium uppercase text-muted-foreground">
                {activeSlice ? activeSlice.name.split(" ")[0] : "Members"}
              </span>
            </div>
          </div>

          {/* Slices Legend & Detail */}
          <div className="grid flex-1 gap-2.5">
            {slices.map((slice) => {
              const percent = Math.round((slice.count / total) * 100);
              const isHovered = hoveredId === slice.id;

              return (
                <div
                  key={slice.id}
                  className={cn(
                    "flex items-center justify-between rounded-control border p-2.5 transition-colors cursor-pointer",
                    isHovered
                      ? "border-primary bg-primary-soft/30"
                      : "border-border bg-surface-muted/30 hover:border-border-strong hover:bg-surface-hover"
                  )}
                  onMouseEnter={() => setHoveredId(slice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-foreground">{slice.name}</div>
                      <div className="text-2xs text-muted-foreground">{slice.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-foreground">{slice.count}</span>
                    <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-2xs font-semibold text-muted-foreground shadow-2xs">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
