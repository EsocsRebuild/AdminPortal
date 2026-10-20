"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-2xs font-medium text-slate-100 outline-none",
          "origin-(--radix-tooltip-content-transform-origin) animate-fade-in data-[state=closed]:animate-fade-out",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export interface TooltipProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  shortcut,
  disabled,
  className,
}: TooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipPrimitive.Root delayDuration={120}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={10}
          className={cn(
            "z-50 flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-2xs font-medium text-slate-100 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
            "animate-fade-in data-[state=closed]:animate-fade-out",
            className,
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <span className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-300">
              {shortcut}
            </span>
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
