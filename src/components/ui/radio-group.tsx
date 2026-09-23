"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({
  className,
  label,
  description,
  id,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Item> & { label?: React.ReactNode; description?: React.ReactNode }) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="flex h-5 items-center">
        <RadioPrimitive.Item
          id={inputId}
          className={cn(
            "relative grid size-4 cursor-pointer place-items-center rounded-full border border-border-strong bg-surface shadow-xs",
            "after:absolute after:-inset-2.5 after:content-['']",
            "hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          {...props}
        >
          <RadioPrimitive.Indicator className="size-1.5 rounded-full bg-primary-foreground" />
        </RadioPrimitive.Item>
      </span>
      {(label || description) && (
        <label htmlFor={inputId} className="grid cursor-pointer gap-0.5">
          {label && <span className="text-base font-medium">{label}</span>}
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </label>
      )}
    </div>
  );
}

/** Large selectable card, e.g. for plan or theme choice. */
export function RadioCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Item>) {
  return (
    <RadioPrimitive.Item
      className={cn(
        "relative cursor-pointer rounded-card border border-border bg-surface p-3 text-left shadow-xs transition-[border-color,box-shadow]",
        "hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-[state=checked]:border-primary data-[state=checked]:ring-3 data-[state=checked]:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </RadioPrimitive.Item>
  );
}
