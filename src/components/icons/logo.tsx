import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Placeholder mark. Replace with the official crest (SVG using currentColor).
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-control bg-gradient-to-br from-royal-700 to-royal-950 text-gold-300 shadow-button ring-1 ring-white/10",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-[62%]">
        <path d="M14.6 4h2.8v7.6h7.6v2.8h-7.6V28h-2.8V14.4H7v-2.8h7.6z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ className, collapsible = false }: { className?: string; collapsible?: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label={`${siteConfig.product} home`}
      className={cn("flex min-w-0 items-center gap-2.5 rounded-control", className)}
    >
      <LogoMark />
      <span className={cn("grid min-w-0 leading-none", collapsible && "lg:rail:hidden")}>
        <span className="font-brand text-[1.3rem] font-semibold tracking-wide text-sidebar-active-foreground">
          {siteConfig.name}
        </span>
        <span className="mt-0.5 text-overline font-semibold text-sidebar-muted uppercase">Admin</span>
      </span>
    </Link>
  );
}
