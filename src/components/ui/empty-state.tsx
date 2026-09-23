import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** `compact` for inside cards and tables. */
  size?: "compact" | "default";
}

export function EmptyState({ icon, title, description, action, className, size = "default" }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "default" ? "gap-4 px-6 py-16" : "gap-3 px-4 py-10",
        className,
      )}
    >
      {icon && (
        <div className="relative">
          <div aria-hidden className="absolute -inset-8 bg-grid mask-radial-from-10% mask-radial-to-70% opacity-70" />
          <span className="relative grid size-12 place-items-center rounded-card border border-border bg-surface text-muted-foreground shadow-sm [&_svg]:size-5">
            {icon}
          </span>
        </div>
      )}
      <div className="grid max-w-sm gap-1">
        <p className="text-md font-semibold">{title}</p>
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
