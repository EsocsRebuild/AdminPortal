import * as React from "react";

import { cn } from "@/lib/utils";

/** Icon, title and supporting line at the top of every auth screen. */
export function AuthHeader({
  icon,
  title,
  description,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)}>
      {icon && (
        <span className="grid size-11 place-items-center rounded-card border border-border bg-surface text-primary shadow-sm [&_svg]:size-5">
          {icon}
        </span>
      )}
      <div className="grid gap-1.5">
        <h1 className="text-heading-lg font-semibold">{title}</h1>
        {description && <p className="text-md text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
