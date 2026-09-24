"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function Checkbox({ className, label, description, id, ...props }: CheckboxProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const box = (
    <CheckboxPrimitive.Root
      id={inputId}
      className={cn(
        "peer relative grid size-4 shrink-0 cursor-pointer place-items-center rounded-[0.3rem] border border-border-strong bg-surface shadow-xs",
        "transition-colors duration-100",
        // Larger invisible hit area for touch.
        "after:absolute after:-inset-2.5 after:content-['']",
        "hover:border-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !label && className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="group grid animate-scale-in place-items-center">
        <Check className="size-3 group-data-[state=indeterminate]:hidden" strokeWidth={3} />
        <Minus className="hidden size-3 group-data-[state=indeterminate]:block" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !description) return box;
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="flex h-5 items-center">{box}</span>
      <label htmlFor={inputId} className="grid cursor-pointer gap-0.5 peer-disabled:cursor-not-allowed">
        {label && <span className="text-base font-medium text-foreground">{label}</span>}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </label>
    </div>
  );
}
