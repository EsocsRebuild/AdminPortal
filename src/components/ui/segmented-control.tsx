"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

/** Compact single-choice toggle, e.g. "Day / Week / Month". */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  id,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption<T>[];
  size?: "sm" | "md";
  className?: string;
  "aria-label": string;
}) {
  return (
    <RadioPrimitive.Root
      id={id}
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      orientation="horizontal"
      aria-label={ariaLabel}
      className={cn(
        "scrollbar-none inline-flex w-fit max-w-full items-center gap-0.5 justify-self-start overflow-x-auto rounded-control bg-surface-muted p-0.5",
        className,
      )}
    >
      {options.map((o) => (
        <RadioPrimitive.Item
          key={o.value}
          value={o.value}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[calc(var(--radius-control)-2px)] px-2.5 font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] duration-150",
            "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            "data-[state=checked]:bg-surface data-[state=checked]:text-foreground data-[state=checked]:shadow-sm",
            "[&_svg]:size-3.5",
            size === "sm"
              ? "h-[calc(var(--control-sm)-4px)] text-xs"
              : "h-[calc(var(--control-md)-4px)] text-sm",
          )}
        >
          {o.icon}
          {o.label}
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}
