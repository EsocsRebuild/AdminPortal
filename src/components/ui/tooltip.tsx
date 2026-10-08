"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({
  children,
}: {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-full z-50 mb-1.5 hidden rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-2xs whitespace-nowrap text-slate-100 shadow-xl group-hover:block",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TooltipProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  shortcut?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({ content, children, disabled, className }: TooltipProps) {
  if (disabled) return <>{children}</>;
  if (content !== undefined) {
    return (
      <div className="group relative inline-flex items-center">
        {children}
        <TooltipContent className={className}>{content}</TooltipContent>
      </div>
    );
  }
  return <div className="group relative inline-flex items-center">{children}</div>;
}
