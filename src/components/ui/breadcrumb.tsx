import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** On phones only the parent crumb is shown, as a back link. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;
  const parent = items.length > 1 ? items[items.length - 2] : undefined;
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0 text-sm", className)}>
      {parent?.href && (
        <Link
          href={parent.href}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground sm:hidden"
        >
          <ChevronRight className="size-3.5 rotate-180" />
          {parent.label}
        </Link>
      )}
      <ol className="hidden min-w-0 items-center gap-1.5 sm:flex">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="truncate text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="truncate font-medium text-foreground">
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-faint-foreground" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
