import * as React from "react";
import { cn } from "@/lib/utils";

/** Icon/Logo, title and supporting line at the top of every auth screen. */
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
    <div className={cn("grid gap-3.5", className)}>
      {icon && <div className="flex items-center">{icon}</div>}
      <div className="grid gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white dark:text-white font-brand">{title}</h1>
        {description && <p className="text-sm font-semibold text-slate-200 dark:text-slate-200">{description}</p>}
      </div>
    </div>
  );
}
