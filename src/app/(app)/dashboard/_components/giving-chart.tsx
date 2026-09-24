"use client";

import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { givingByMonth } from "@/lib/fixtures";

const data = givingByMonth.map((d) => ({ label: d.month, tithes: d.tithes, offerings: d.offerings }));

export function GivingChart() {
  return (
    <StackedBarChart
      title="Giving by month, in millions of naira"
      data={data}
      series={[
        { key: "tithes", label: "Tithes", color: "var(--chart-1)" },
        { key: "offerings", label: "Offerings", color: "var(--chart-2)" },
      ]}
      formatValue={(n) => `₦${Number(n.toFixed(1))}M`}
    />
  );
}
