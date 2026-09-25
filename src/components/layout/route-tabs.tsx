"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";
import { cn } from "@/lib/utils";

export interface RouteTab {
  href: string;
  label: string;
  /** Match nested paths too (default: exact match). */
  prefix?: boolean;
  count?: number;
}

/** Tabs that are real links (sub-pages), with the gliding underline. */
export function RouteTabs({ tabs, className, label }: { tabs: RouteTab[]; className?: string; label: string }) {
  const pathname = usePathname();
  const { ref, rect } = useSlidingIndicator<HTMLElement>("[data-state=active]");
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn("scrollbar-none relative flex max-w-full gap-5 overflow-x-auto border-b border-border sm:gap-7", className)}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width,opacity] duration-300 ease-out-expo",
          !rect.animate && "transition-none",
        )}
        style={{
          opacity: rect.visible ? 1 : 0,
          width: rect.width,
          transform: `translate(${rect.x}px, ${rect.y + rect.height - 2}px)`,
        }}
      />
      {tabs.map((t) => {
        const active = t.prefix ? pathname === t.href || pathname.startsWith(`${t.href}/`) : pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            data-state={active ? "active" : "inactive"}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex h-11 shrink-0 items-center gap-2 text-base font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200",
              "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "data-[state=active]:text-foreground",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="rounded-full bg-surface-muted px-1.5 tabular text-2xs font-semibold text-muted-foreground">
                {t.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
