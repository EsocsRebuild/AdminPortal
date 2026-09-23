"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md";
}

export function Switch({ className, label, description, size = "md", id, ...props }: SwitchProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const control = (
    <SwitchPrimitive.Root
      id={inputId}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-border-strong p-0.5 transition-colors duration-150",
        "after:absolute after:-inset-2 after:content-['']",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-4.5 w-8" : "h-5.5 w-10",
        !label && className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-spring",
          size === "sm"
            ? "size-3.5 data-[state=checked]:translate-x-3.5"
            : "size-4.5 data-[state=checked]:translate-x-4.5",
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) return control;
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <label htmlFor={inputId} className="grid cursor-pointer gap-0.5">
        {label && <span className="text-base font-medium">{label}</span>}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </label>
      <span className="flex h-5.5 items-center">{control}</span>
    </div>
  );
}
