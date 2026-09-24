import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import * as React from "react";

import { Sparkline } from "@/components/charts/sparkline";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
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
    <Card className={cn("@container gap-3 p-card", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <span className="text-subtle-foreground [&_svg]:size-4">{icon}</span>}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="grid gap-1.5">
          <p className="tabular text-metric font-semibold">{value}</p>
          {delta !== undefined && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-xs px-1 py-px tabular font-semibold",
                  good
                    ? "bg-success-soft text-success-soft-foreground"
                    : "bg-danger-soft text-danger-soft-foreground",
                )}
              >
                <Arrow className="size-3" aria-hidden />
                <span className="sr-only">{up ? "Up" : "Down"}</span>
                {formatPercent(Math.abs(delta))}
              </span>
              {deltaLabel}
            </p>
          )}
        </div>
        {trend && (
          <Sparkline data={trend} tone={good ? "primary" : "danger"} className="hidden w-24 @[15rem]:block" />
        )}
      </div>
    </Card>
  );
}
