"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

type Variant = "line" | "pill";
const VariantContext = React.createContext<Variant>("line");

/** Scrolls horizontally on narrow screens instead of wrapping. */
export function TabsList({
  className,
  variant = "line",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: Variant }) {
  return (
    <VariantContext value={variant}>
      <TabsPrimitive.List
        className={cn(
          "flex max-w-full items-center overflow-x-auto scrollbar-none",
          variant === "line" ? "gap-4 border-b border-border sm:gap-6" : "w-fit gap-0.5 rounded-control bg-surface-muted p-0.5",
          className,
        )}
        {...props}
      />
    </VariantContext>
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.use(VariantContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-2 font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150",
        "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        variant === "line"
          ? "relative -mb-px h-10 border-b-2 border-transparent text-base data-[state=active]:border-primary data-[state=active]:text-foreground"
          : "h-[calc(var(--control-md)-4px)] rounded-[calc(var(--radius-control)-2px)] px-3 text-sm data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("pt-5 focus-visible:outline-none data-[state=active]:animate-fade-in", className)}
      {...props}
    />
  );
}

/** Small count shown inside a tab trigger. */
export function TabsCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-muted px-1.5 text-2xs font-semibold text-muted-foreground tabular">
      {children}
    </span>
  );
}
