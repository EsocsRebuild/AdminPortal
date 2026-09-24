"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/components/auth/session-provider";
import { Tooltip } from "@/components/ui/tooltip";
import { activeNavItem, navigation } from "@/config/navigation";
import { usePreference } from "@/hooks/use-preference";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

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

  return (
    <nav aria-label="Main" className="grid gap-5">
      {navigation.map((group) => {
        const items = group.items.filter((item) => !item.permission || can(user, item.permission));
        if (items.length === 0) return null;
        return (
          <div key={group.title} className="grid gap-0.5">
            <p
              className={cn(
                "flex h-7 items-center px-2.5 text-overline font-semibold text-sidebar-muted uppercase",
                rail && "lg:rail:justify-center lg:rail:px-0",
              )}
            >
              <span className={cn(rail && "lg:rail:sr-only")}>{group.title}</span>
              {rail && <span aria-hidden className="hidden h-px w-4 bg-sidebar-border lg:rail:block" />}
            </p>
            {items.map((item) => {
              const isActive = item.href === active?.href;
              const Icon = item.icon;
              return (
                <Tooltip key={item.href} content={item.title} side="right" disabled={!collapsed}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex h-control-md items-center gap-2.5 rounded-control px-2.5 text-base font-medium text-sidebar-foreground transition-colors duration-150",
                      "hover:bg-sidebar-hover hover:text-sidebar-active-foreground",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                      "aria-[current=page]:bg-sidebar-active aria-[current=page]:text-sidebar-active-foreground aria-[current=page]:shadow-xs",
                      "pointer-coarse:h-11",
                      rail && "lg:rail:justify-center lg:rail:px-0",
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 -left-3 h-4 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                      />
                    )}
                    <Icon
                      className={cn(
                        "size-4 shrink-0 text-sidebar-muted transition-colors group-hover:text-sidebar-active-foreground",
                        isActive && "text-primary",
                      )}
                      strokeWidth={isActive ? 2.25 : 2}
                    />
                    <span className={cn("flex-1 truncate", rail && "lg:rail:sr-only")}>{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full bg-primary-soft px-1.5 tabular text-2xs font-semibold text-primary-soft-foreground",
                          rail &&
                            "lg:rail:absolute lg:rail:top-1 lg:rail:right-1 lg:rail:size-2 lg:rail:bg-primary lg:rail:p-0 lg:rail:text-[0px]",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
