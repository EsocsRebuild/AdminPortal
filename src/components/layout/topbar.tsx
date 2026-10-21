"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { activeNavItem } from "@/config/navigation";
import { usePreference } from "@/hooks/use-preference";

import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { Notifications } from "./notifications";
import { QuickActionButton } from "./quick-actions-button";
import { QuickTipsTrigger } from "./quick-tips-button";
import { UnitSwitcher } from "./unit-switcher";
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
  events: "Events & Calendar",
  attendance: "Attendance & Headcount",
  sections: "Fellowships & Wings",
  "build-tracker": "Build Tracker",
  ordination: "Ordination Pipeline",
  candidates: "Candidates",
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
  const [sidebar, setSidebar] = usePreference("sidebar");
  const collapsed = sidebar === "collapsed";
  const toggleSidebar = () => setSidebar(collapsed ? "expanded" : "collapsed");

  return (
    <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center gap-2 border-b border-border bg-background px-gutter">
      <MobileNav />
      <Tooltip content={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden size-8 text-muted-foreground hover:text-foreground lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </Tooltip>
      <UnitSwitcher />
      <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
      <Breadcrumb items={crumbs} className="flex-1" />
      <div className="flex items-center gap-1.5">
        <QuickActionButton />
        <QuickTipsTrigger />
        <CommandMenu />
        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
        <Notifications />
        <ThemeToggle className="max-sm:hidden" />
        <div className="ml-1">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
