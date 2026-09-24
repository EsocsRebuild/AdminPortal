import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5.5 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      tone: {
        neutral: "bg-surface-muted text-muted-foreground",
        primary: "bg-primary-soft text-primary-soft-foreground",
        success: "bg-success-soft text-success-soft-foreground",
        warning: "bg-warning-soft text-warning-soft-foreground",
        danger: "bg-danger-soft text-danger-soft-foreground",
        info: "bg-info-soft text-info-soft-foreground",
        outline: "border border-border bg-transparent text-muted-foreground",
        solid: "bg-inverse text-inverse-foreground",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-xs",
      },
    },
    defaultVariants: { tone: "neutral", shape: "pill" },
  },
);

const dotColor = {
  neutral: "bg-subtle-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  outline: "bg-subtle-foreground",
  solid: "bg-inverse-foreground",
} as const;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Leading status dot. `pulse` animates it for live states. */
  dot?: boolean | "pulse";
}

export function Badge({ className, tone, shape, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, shape }), className)} {...props}>
      {dot && (
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            dotColor[tone ?? "neutral"],
            dot === "pulse" && "animate-pulse-ring text-current",
          )}
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
