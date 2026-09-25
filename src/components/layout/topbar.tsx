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

/** Readable names for sub-pages. Record ids are skipped: the page title already names the record. */
const segmentLabels: Record<string, string> = {
  edit: "Edit",
  new: "New",
  settings: "Settings",
  share: "Share",
  responses: "Responses",
  requests: "Access requests",
  roles: "Roles",
  profile: "Profile",
  security: "Security",
  appearance: "Appearance",
  notifications: "Notifications",
  email: "Email sending",
};

function useCrumbs(): Crumb[] {
  const pathname = usePathname();
  const item = activeNavItem(pathname);
  if (!item) return [];
  const rest = pathname.slice(item.href.length).split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: item.title, href: item.href }];
  rest.forEach((seg, i) => {
    const label = segmentLabels[seg];
    if (label) crumbs.push({ label, href: `${item.href}/${rest.slice(0, i + 1).join("/")}` });
  });
  return crumbs;
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
