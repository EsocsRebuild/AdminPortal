"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

type Variant = "line" | "pill";
const VariantContext = React.createContext<Variant>("line");

/** Tab row with an indicator that glides to the active tab. Scrolls on narrow screens. */
export function TabsList({
  className,
  variant = "line",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: Variant }) {
  const { ref, rect } = useSlidingIndicator<HTMLDivElement>("[role=tab][data-state=active]");
  return (
    <VariantContext value={variant}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "relative scrollbar-none flex max-w-full items-center overflow-x-auto",
          variant === "line"
            ? "gap-5 border-b border-border sm:gap-7"
            : "w-fit gap-0.5 rounded-control bg-surface-muted p-0.5",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 left-0 transition-[transform,width,opacity] duration-300 ease-out-expo",
            variant === "line"
              ? "h-0.5 rounded-full bg-primary"
              : "rounded-[calc(var(--radius-control)-2px)] bg-surface shadow-sm",
            !rect.animate && "transition-none",
          )}
          style={{
            opacity: rect.visible ? 1 : 0,
            width: rect.width,
            height: variant === "line" ? undefined : rect.height,
            transform:
              variant === "line"
                ? `translate(${rect.x}px, ${rect.y + rect.height - 2}px)`
                : `translate(${rect.x}px, ${rect.y}px)`,
          }}
        />
        {children}
      </TabsPrimitive.List>
    </VariantContext>
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.use(VariantContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative z-10 inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-muted-foreground transition-colors duration-200",
        "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:size-4",
        variant === "line"
          ? "h-11 text-base font-medium"
          : "h-[calc(var(--control-md)-4px)] rounded-[calc(var(--radius-control)-2px)] px-3 text-sm font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("pt-5 focus-visible:outline-none data-[state=active]:animate-rise-in", className)}
      {...props}
    />
  );
}

/** Small count shown inside a tab trigger. */
export function TabsCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-muted px-1.5 tabular text-2xs font-semibold text-muted-foreground">
      {children}
    </span>
  );
}
