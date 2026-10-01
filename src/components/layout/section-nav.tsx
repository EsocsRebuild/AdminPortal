"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/components/auth/session-provider";
import { can, type Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  href: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  permission?: Permission;
}

/** High-end vertical section menu on desktop, scrolling pills on mobile. */
export function SectionNav({ items, label }: { items: SectionNavItem[]; label: string }) {
  const pathname = usePathname();
  const user = useSession();

  return (
    <nav aria-label={label} className="lg:sticky lg:top-[calc(var(--spacing-topbar)+1.5rem)] lg:self-start">
      <ul className="scrollbar-none flex gap-1.5 overflow-x-auto mask-fade-x px-1 lg:grid lg:[mask-image:none] lg:px-0 lg:gap-2">
        {items
          .filter((i) => !i.permission || can(user, i.permission))
          .map((i) => {
            const active = pathname === i.href;
            return (
              <li key={i.href} className="shrink-0">
                <Link
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-control px-3.5 py-2.5 text-sm transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-ring",
                    active
                      ? "bg-surface font-semibold text-foreground shadow-xs ring-1 ring-border border-l-4 border-l-primary"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  {i.icon && (
                    <span
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {i.icon}
                    </span>
                  )}
                  <div className="grid min-w-0">
                    <span className="truncate">{i.label}</span>
                    {i.description && (
                      <span className="truncate text-2xs font-normal text-muted-foreground hidden lg:block">
                        {i.description}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
