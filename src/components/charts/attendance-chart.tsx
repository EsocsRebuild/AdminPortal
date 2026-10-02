"use client";

import * as React from "react";
import { ArrowUpRight, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface AttendancePoint {
  date: string;
  label: string;
  total: number;
  men: number;
  women: number;
  children: number;
  notes?: string;
}

const mockWeeklyAttendance: AttendancePoint[] = [
  {
    date: "2026-08-02",
    label: "Aug 2",
    total: 320,
    men: 110,
    women: 140,
    children: 70,
    notes: "Regular Sunday service",
  },
  {
    date: "2026-08-09",
    label: "Aug 9",
    total: 345,
    men: 118,
    women: 152,
    children: 75,
    notes: "Youth Sunday",
  },
  { date: "2026-08-16", label: "Aug 16", total: 310, men: 105, women: 135, children: 70 },
  {
    date: "2026-08-23",
    label: "Aug 23",
    total: 360,
    men: 122,
    women: 160,
    children: 78,
    notes: "Thanksgiving service",
  },
  { date: "2026-08-30", label: "Aug 30", total: 375, men: 128, women: 165, children: 82 },
  {
    date: "2026-09-06",
    label: "Sep 6",
    total: 390,
    men: 135,
    women: 170,
    children: 85,
    notes: "First Sunday of the Month",
  },
  { date: "2026-09-13", label: "Sep 13", total: 382, men: 130, women: 168, children: 84 },
  {
    date: "2026-09-20",
    label: "Sep 20",
    total: 410,
    men: 142,
    women: 178,
    children: 90,
    notes: "Annual Mothers' Day Service",
  },
  {
    date: "2026-09-27",
    label: "Sep 27",
    total: 425,
    men: 146,
    women: 185,
    children: 94,
    notes: "Record attendance",
  },
];

export function AttendanceChart({
  data = mockWeeklyAttendance,
  className,
}: {
  data?: AttendancePoint[];
  className?: string;
}) {
  const [activeSeries, setActiveSeries] = React.useState<"total" | "breakdown">("total");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.total)) * 1.15;
  const width = 640;
  const height = 220;
  const paddingBottom = 30;
  const paddingTop = 20;
  const usableHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => (index / (data.length - 1)) * (width - 40) + 20;
  const getY = (val: number) => height - paddingBottom - (val / maxVal) * usableHeight;

  // Build curved path (Monotone cubic spline or line)
  const createPath = (key: keyof AttendancePoint) => {
    const pts = data.map((d, i) => [getX(i), getY(d[key] as number)] as const);
    return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  };

  const totalPath = createPath("total");
  const menPath = createPath("men");
  const womenPath = createPath("women");
  const childrenPath = createPath("children");

  const averageAttendance = Math.round(data.reduce((acc, d) => acc + d.total, 0) / data.length);
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const delta = (latest.total - previous.total) / previous.total;

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : latest;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        title="Sunday Worship Attendance"
        description="Weekly congregation attendance trend and demographics breakdown."
        actions={
          <div className="flex items-center gap-1.5 rounded-control bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => setActiveSeries("total")}
              className={cn(
                "rounded-xs px-2.5 py-1 text-xs font-medium transition-colors",
                activeSeries === "total"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Total
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries("breakdown")}
              className={cn(
                "rounded-xs px-2.5 py-1 text-xs font-medium transition-colors",
                activeSeries === "breakdown"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Men / Women / Children
            </button>
          </div>
        }
      />
      <CardContent className="space-y-4 pt-1">
        {/* Metric Overview Callouts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-muted-foreground uppercase">Latest Service</span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {formatNumber(latest.total)}
              </span>
              <span className="flex items-center text-xs font-semibold text-success">
                <ArrowUpRight className="size-3" />
                {formatPercent(delta)}
              </span>
            </div>
            <span className="text-2xs text-muted-foreground">{latest.label}</span>
          </div>

          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-muted-foreground uppercase">12-Week Average</span>
            <div className="mt-0.5">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {formatNumber(averageAttendance)}
              </span>
            </div>
            <span className="text-2xs text-muted-foreground">attendees / service</span>
          </div>

          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-emerald-600 uppercase dark:text-emerald-400">
              Women
            </span>
            <div className="mt-0.5">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {formatNumber(latest.women)}
              </span>
            </div>
            <span className="text-2xs text-muted-foreground">
              {Math.round((latest.women / latest.total) * 100)}% of total
            </span>
          </div>

          <div className="rounded-control border border-border bg-surface-muted/30 p-2.5">
            <span className="text-2xs font-medium text-blue-600 uppercase dark:text-blue-400">
              Men & Children
            </span>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-sm font-bold text-blue-600">{latest.men} Men</span>
              <span className="text-sm font-bold text-amber-500">{latest.children} Kids</span>
            </div>
            <span className="text-2xs text-muted-foreground">Combined: {latest.men + latest.children}</span>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Horizontal Lines */}
            {[0, 0.33, 0.66, 1].map((ratio) => {
              const y = height - paddingBottom - ratio * usableHeight;
              const val = Math.round(ratio * maxVal);
              return (
                <g key={ratio}>
                  <line
                    x1="20"
                    y1={y}
                    x2={width - 20}
                    y2={y}
                    stroke="var(--color-border, #e2e8f0)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  <text
                    x="15"
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground tabular text-[9px]"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Total Area & Path */}
            {activeSeries === "total" && (
              <>
                <path
                  d={`${totalPath} L${getX(data.length - 1)},${height - paddingBottom} L${getX(0)},${height - paddingBottom} Z`}
                  fill="url(#totalGradient)"
                />
                <path
                  d={totalPath}
                  fill="none"
                  stroke="var(--color-primary, #2563eb)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Breakdown Paths */}
            {activeSeries === "breakdown" && (
              <>
                {/* Women */}
                <path
                  d={womenPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Men */}
                <path
                  d={menPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Children */}
                <path
                  d={childrenPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* X Axis Labels & Interactive Columns */}
            {data.map((d, i) => {
              const x = getX(i);
              const isHovered = hoveredIndex === i;
              return (
                <g key={d.date}>
                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={height - paddingBottom}
                      stroke="var(--color-primary, #2563eb)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Dot on active point */}
                  <circle
                    cx={x}
                    cy={getY(d.total)}
                    r={isHovered ? 5 : 3.5}
                    className={cn(
                      "transition-all duration-150",
                      isHovered
                        ? "fill-primary stroke-background stroke-2 shadow-md"
                        : "fill-surface stroke-primary stroke-2",
                    )}
                  />

                  {/* X label */}
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className={cn(
                      "tabular text-[10px] transition-colors",
                      isHovered ? "fill-foreground font-semibold" : "fill-muted-foreground",
                    )}
                  >
                    {d.label}
                  </text>

                  {/* Invisible hit target for hover */}
                  <rect
                    x={x - width / data.length / 2}
                    y={0}
                    width={width / data.length}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Info Banner */}
          {hoveredIndex !== null && (
            <div className="animate-in fade-in mt-2 flex items-center justify-between rounded-control border border-border bg-surface px-3 py-2 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-primary" />
                <span className="font-semibold text-foreground">
                  {activePoint.date} ({activePoint.label})
                </span>
                {activePoint.notes && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs text-primary">
                    {activePoint.notes}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">Total: {activePoint.total}</span>
                <span className="text-emerald-600 dark:text-emerald-400">Women: {activePoint.women}</span>
                <span className="text-blue-600 dark:text-blue-400">Men: {activePoint.men}</span>
                <span className="text-amber-600 dark:text-amber-400">Children: {activePoint.children}</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-border-subtle pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary" />
            <span>Total Attendees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span>Women Fellowship</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-blue-500" />
            <span>Men Fellowship</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span>Children Department</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
