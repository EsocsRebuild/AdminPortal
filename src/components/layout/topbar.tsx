"use client";

import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { activeNavItem } from "@/config/navigation";

import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

function titleCase(segment: string) {
  const s = decodeURIComponent(segment).replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function useCrumbs(): Crumb[] {
  const pathname = usePathname();
  const item = activeNavItem(pathname);
  if (!item) return [];
  const rest = pathname.slice(item.href.length).split("/").filter(Boolean);
  return [
    { label: item.title, href: item.href },
    ...rest.map((seg, i) => ({
      label: titleCase(seg),
      href: `${item.href}/${rest.slice(0, i + 1).join("/")}`,
    })),
  ];
}

export function Topbar() {
  const crumbs = useCrumbs();
  return (
    <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center gap-2 border-b border-border bg-background/80 px-gutter backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(0))]:bg-background">
      <MobileNav />
      <Breadcrumb items={crumbs} className="flex-1" />
      <div className="flex items-center gap-1">
        <CommandMenu />
        <Separator orientation="vertical" className="mx-1.5 hidden h-5 md:block" />
        <Notifications />
        <ThemeToggle className="max-sm:hidden" />
        <div className="ml-1.5">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
