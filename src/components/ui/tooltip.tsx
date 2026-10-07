"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number; skipDelayDuration?: number }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-full mb-1.5 text-2xs px-2.5 py-1 bg-slate-900 text-slate-100 border border-slate-700 rounded-md shadow-xl pointer-events-none hidden group-hover:block z-50 whitespace-nowrap",
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
      <div className="relative group inline-flex items-center">
        {children}
        <TooltipContent className={className}>{content}</TooltipContent>
      </div>
    );
  }
  return <div className="relative group inline-flex items-center">{children}</div>;
}
