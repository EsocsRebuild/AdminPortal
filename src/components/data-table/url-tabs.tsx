"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";
import { cn } from "@/lib/utils";

/**
 * Status views stored in the URL (`?status=`), rendered as links so each view
 * has its own address. The first tab (value null) clears the filter.
 */
export function UrlTabs({
  param,
  tabs,
  label,
}: {
  param: string;
  tabs: { value: string | null; label: string; count?: number }[];
  label: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get(param);
  const { ref, rect } = useSlidingIndicator<HTMLElement>("[data-state=active]");

  const hrefFor = (value: string | null) => {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    if (value) next.set(param, value);
    else next.delete(param);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav
      ref={ref}
      aria-label={label}
      className="relative scrollbar-none flex max-w-full gap-5 overflow-x-auto border-b border-border sm:gap-7"
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
        const active = (t.value ?? null) === current;
        return (
          <Link
            key={t.value ?? "__all"}
            href={hrefFor(t.value)}
            replace
            scroll={false}
            data-state={active ? "active" : "inactive"}
            aria-current={active ? "page" : undefined}
            className="relative inline-flex h-11 shrink-0 items-center gap-2 text-base font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=active]:text-foreground"
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
