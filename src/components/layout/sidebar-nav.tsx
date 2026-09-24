"use client";

import { LayoutGroup, motion } from "motion/react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { useSession } from "@/components/auth/session-provider";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { activeNavItem, navigation, type NavItem } from "@/config/navigation";
import { usePreference } from "@/hooks/use-preference";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

/** Spinner shown while a clicked link's page is still loading. */
function PendingHint({ badge, rail }: { badge?: string; rail: boolean }) {
  const { pending } = useLinkStatus();
  if (pending) return <Spinner className="size-3.5 text-sidebar-muted" label="Loading page" />;
  if (!badge) return null;
  return (
    <span
      className={cn(
        "rounded-full bg-primary-soft px-1.5 tabular text-2xs font-semibold text-primary-soft-foreground",
        rail &&
          "lg:rail:absolute lg:rail:top-1.5 lg:rail:right-1.5 lg:rail:size-2 lg:rail:bg-primary lg:rail:p-0 lg:rail:text-[0px]",
      )}
    >
      {badge}
    </span>
  );
}

function NavLink({
  item,
  active,
  rail,
  collapsed,
  indicatorId,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  rail: boolean;
  collapsed: boolean;
  indicatorId: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Tooltip content={item.title} side="right" disabled={!collapsed}>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-control-md items-center gap-3 rounded-control px-2.5 text-base text-sidebar-foreground transition-colors duration-200",
          "hover:text-sidebar-active-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          "aria-[current=page]:font-medium aria-[current=page]:text-sidebar-active-foreground",
          "pointer-coarse:h-11",
          rail && "lg:rail:justify-center lg:rail:px-0",
        )}
      >
        {/* Hover wash */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-control bg-sidebar-hover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
        {/* Active pill glides between items */}
        {active && (
          <motion.span
            layoutId={indicatorId}
            aria-hidden
            className="absolute inset-0 rounded-control bg-sidebar-active shadow-xs ring-1 ring-sidebar-border"
            transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.8 }}
          />
        )}
        <Icon
          className={cn(
            "relative size-[1.125rem] shrink-0 text-sidebar-muted transition-colors duration-200 group-hover:text-sidebar-active-foreground",
            active && "text-primary group-hover:text-primary",
          )}
        />
        <span className={cn("relative flex-1 truncate", rail && "lg:rail:sr-only")}>{item.title}</span>
        <span className="relative flex items-center">
          <PendingHint badge={item.badge} rail={rail} />
        </span>
      </Link>
    </Tooltip>
  );
}

/**
 * Navigation list shared by the desktop sidebar and the mobile drawer.
 * `rail` enables icon-only mode when the desktop sidebar is collapsed.
 */
export function SidebarNav({ rail = false, onNavigate }: { rail?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useSession();
  const [sidebar] = usePreference("sidebar");
  const collapsed = rail && sidebar === "collapsed";
  const active = activeNavItem(pathname);
  const indicatorId = rail ? "nav-active-desktop" : "nav-active-mobile";

  return (
    <LayoutGroup id={indicatorId}>
      <nav aria-label="Main" className="grid gap-6">
        {navigation.map((group) => {
          const items = group.items.filter((item) => !item.permission || can(user, item.permission));
          if (items.length === 0) return null;
          return (
            <div key={group.title} className="grid gap-0.5">
              <p
                className={cn(
                  "flex h-6 items-center px-2.5 text-xs font-medium text-sidebar-muted",
                  rail && "lg:rail:justify-center lg:rail:px-0",
                )}
              >
                <span className={cn(rail && "lg:rail:sr-only")}>{group.title}</span>
                {rail && <span aria-hidden className="hidden h-px w-5 bg-sidebar-border lg:rail:block" />}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={item.href === active?.href}
                  rail={rail}
                  collapsed={collapsed}
                  indicatorId={indicatorId}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
