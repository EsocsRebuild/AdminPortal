"use client";

import * as React from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";

export function RangeControl() {
  const [range, setRange] = React.useState<"7d" | "30d" | "12m">("12m");
  return (
    <SegmentedControl
      aria-label="Date range"
      value={range}
      onValueChange={setRange}
      options={[
        { value: "7d", label: "7 days" },
        { value: "30d", label: "30 days" },
        { value: "12m", label: "12 months" },
      ]}
    />
  );
}
