"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";
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
  const { ref, rect } = useSlidingIndicator<HTMLDivElement>("[role=radio][data-state=checked]");
  return (
    <RadioPrimitive.Root
      ref={ref}
      id={id}
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      orientation="horizontal"
      aria-label={ariaLabel}
      className={cn(
        "relative scrollbar-none inline-flex w-fit max-w-full items-center gap-0.5 justify-self-start overflow-x-auto rounded-control bg-surface-muted p-0.5",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 rounded-[calc(var(--radius-control)-2px)] bg-surface shadow-sm transition-[transform,width,opacity] duration-300 ease-out-expo",
          !rect.animate && "transition-none",
        )}
        style={{
          opacity: rect.visible ? 1 : 0,
          width: rect.width,
          height: rect.height,
          transform: `translate(${rect.x}px, ${rect.y}px)`,
        }}
      />
      {options.map((o) => (
        <RadioPrimitive.Item
          key={o.value}
          value={o.value}
          className={cn(
            "relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[calc(var(--radius-control)-2px)] px-2.5 font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200",
            "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            "data-[state=checked]:text-foreground",
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
