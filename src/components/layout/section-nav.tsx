"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/components/auth/session-provider";
import { can, type Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  href: string;
  label: string;
  description?: string;
  permission?: Permission;
}

/** Vertical section menu on desktop, scrolling pills on phones. */
export function SectionNav({ items, label }: { items: SectionNavItem[]; label: string }) {
  const pathname = usePathname();
  const user = useSession();
  return (
    <nav aria-label={label} className="lg:sticky lg:top-[calc(var(--spacing-topbar)+1.5rem)] lg:self-start">
      <ul className="scrollbar-none flex gap-1 overflow-x-auto mask-fade-x px-1 lg:grid lg:[mask-image:none] lg:px-0">
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
                    "block rounded-control px-3 py-2 text-base whitespace-nowrap transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-ring",
                    active
                      ? "bg-surface font-medium text-foreground shadow-xs ring-1 ring-border"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  {i.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
