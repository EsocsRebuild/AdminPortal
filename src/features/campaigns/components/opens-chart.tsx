"use client";

import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { formatNumber, formatTime } from "@/lib/format";

import type { CampaignReport } from "../types";

/** Unique opens per hour for the first day after sending. */
export function OpensChart({ timeline }: { timeline: CampaignReport["timeline"] }) {
  return (
    <StackedBarChart
      title="Opens per hour"
      data={timeline.slice(0, 24).map((t) => ({ label: formatTime(t.at), opens: t.opens }))}
      series={[{ key: "opens", label: "Opens", color: "var(--chart-1)" }]}
      formatValue={(n) => formatNumber(Math.round(n))}
    />
  );
}
