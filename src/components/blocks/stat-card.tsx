import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import * as React from "react";

import { Sparkline } from "@/components/charts/sparkline";
import { CountUp } from "@/components/motion/count-up";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  /** A number animates up on first view; pass a node for custom content. */
  value: number | React.ReactNode;
  format?: "number" | "currency";
  /** Change as a ratio, e.g. 0.042 for +4.2%. */
  delta?: number;
  deltaLabel?: string;
  /** Set when a fall is good news, e.g. churn or failed payments. */
  invertDelta?: boolean;
  trend?: readonly number[];
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  format = "number",
  delta,
  deltaLabel = "vs last month",
  invertDelta,
  trend,
  icon,
  className,
}: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  const good = invertDelta ? !up : up;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <Card interactive className={cn("gap-4 p-card", className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-soft-foreground [&_svg]:size-4">
            {icon}
          </span>
        )}
        <p className="flex-1 truncate text-sm text-muted-foreground">{label}</p>
      </div>
      <div>
        <div className="grid min-w-0 gap-1.5">
          <div className="flex items-end justify-between gap-3">
            <p className="tabular text-metric font-semibold">
              {typeof value === "number" ? <CountUp value={value} preset={format} /> : value}
            </p>
            {trend && (
              <Sparkline data={trend} tone={good ? "primary" : "danger"} className="mb-1 h-7 w-16 shrink-0" />
            )}
          </div>
          {delta !== undefined && (
            <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 tabular font-semibold",
                  good ? "text-success-soft-foreground" : "text-danger-soft-foreground",
                )}
              >
                <Arrow className="size-3.5" aria-hidden />
                <span className="sr-only">{up ? "Up" : "Down"}</span>
                {formatPercent(Math.abs(delta))}
              </span>
              {deltaLabel}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
