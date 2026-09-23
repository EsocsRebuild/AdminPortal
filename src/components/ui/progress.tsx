"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function Progress({
  value,
  max = 100,
  tone = "primary",
  size = "md",
  className,
  "aria-label": ariaLabel,
}: {
  value: number;
  max?: number;
  tone?: keyof typeof tones;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      aria-label={ariaLabel}
      className={cn("relative w-full overflow-hidden rounded-full bg-surface-muted", size === "sm" ? "h-1" : "h-1.5", className)}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-[width] duration-500 ease-emphasized", tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
