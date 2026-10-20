"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Church,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  UserCheck,
  Wallet,
  Award,
} from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/layout/user-menu";
import { siteConfig } from "@/config/site";
import { useHotkey } from "@/hooks/use-hotkey";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

interface WebStudioShellProps {
  userUnit: { unitName: string; unitSlug: string };
  isPlatformAdmin: boolean;
  children: React.ReactNode;
}

export function WebStudioShell({ userUnit, isPlatformAdmin, children }: WebStudioShellProps) {
  const pathname = usePathname();
  const [sidebar, setSidebar] = usePreference("sidebar");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const collapsed = sidebar === "collapsed";
  const toggle = () => setSidebar(collapsed ? "expanded" : "collapsed");
  useHotkey("mod+b", toggle);

  const studioLinks = [
    {
      href: "/admin-web/dashboard",
      label: "Studio Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin-web/dashboard",
    },
    {
      href: "/admin-web/events",
      label: "Events Studio",
      icon: Calendar,
      active: pathname.startsWith("/admin-web/events"),
    },
    {
      href: "/admin-web/programmes",
      label: "Programmes Schedule",
      icon: Megaphone,
      active: pathname.startsWith("/admin-web/programmes"),
    },
    ...(isPlatformAdmin
      ? [
          {
            href: "/admin-web/vetting",
            label: "Super Vetting Queue",
            icon: CheckCircle2,
            active: pathname.startsWith("/admin-web/vetting"),
          },
        ]
      : []),
    {
      href: "/admin-web/media",
      label: "Media Gallery",
      icon: ImageIcon,
      active: pathname.startsWith("/admin-web/media"),
    },
  ];

  const churchGovernanceLinks = [
    {
      href: "/dashboard",
      label: "Main Governance Dashboard",
      icon: Church,
    },
    {
      href: "/members",
      label: "Member Directory",
      icon: Users,
    },
    {
      href: "/attendance",
      label: "Attendance & Headcount",
      icon: UserCheck,
    },
    {
      href: "/giving",
      label: "Giving & Stewardship",
      icon: Wallet,
    },
    {
      href: "/ordination",
      label: "Ordination Pipeline",
      icon: Award,
    },
  ];

  const renderNavLinks = (onSelect?: () => void) => (
    <div className="space-y-6">
      {/* Group 1: Content Studio */}
      <div>
        <div className="px-2 pb-2 text-2xs font-semibold tracking-wider text-muted-foreground uppercase lg:rail:sr-only">
          Content Studio
        </div>
        <nav className="space-y-1">
          {studioLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.href} content={item.label} side="right" disabled={!collapsed}>
                <Link
                  href={item.href}
                  onClick={onSelect}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-control px-2.5 text-xs font-medium transition-colors",
                    item.active
                      ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                    "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0",
                  )}
                >
                  <Icon className={item.active ? "text-primary-foreground" : "text-primary"} />
                  <span className="flex-1 truncate lg:rail:sr-only">{item.label}</span>
                </Link>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Group 2: Public Church Site */}
      <div>
        <div className="px-2 pb-2 text-2xs font-semibold tracking-wider text-muted-foreground uppercase lg:rail:sr-only">
          Public Web
        </div>
        <nav className="space-y-1">
          <Tooltip content={`Preview ${userUnit.unitName} Live Site`} side="right" disabled={!collapsed}>
            <Link
              href={`/church/${userUnit.unitSlug}`}
              target="_blank"
              onClick={onSelect}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400",
                "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0",
              )}
            >
              <Globe className="text-emerald-500" />
              <span className="flex-1 truncate lg:rail:sr-only">Live Web Preview</span>
              <ExternalLink className="size-3 text-emerald-500/70 lg:rail:sr-only" />
            </Link>
          </Tooltip>
        </nav>
      </div>

      {/* Group 3: Church Governance Cross-Links */}
      <div>
        <div className="px-2 pb-2 text-2xs font-semibold tracking-wider text-muted-foreground uppercase lg:rail:sr-only">
          Ecclesiastical Governance
        </div>
        <nav className="space-y-1">
          {churchGovernanceLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.href} content={item.label} side="right" disabled={!collapsed}>
                <Link
                  href={item.href}
                  onClick={onSelect}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
                    "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0",
                  )}
                >
                  <Icon className="text-muted-foreground" />
                  <span className="flex-1 truncate lg:rail:sr-only">{item.label}</span>
                </Link>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[var(--spacing-sidebar)_minmax(0,1fr)] lg:transition-[grid-template-columns] lg:duration-200 lg:ease-emphasized lg:rail:grid-cols-[var(--spacing-rail)_minmax(0,1fr)]">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
          {/* Studio Brand Header */}
          <div className="flex h-topbar shrink-0 items-center justify-between border-b border-sidebar-border px-4 lg:rail:justify-center lg:rail:px-0">
            <Link href="/admin-web/dashboard" className="flex items-center gap-2.5 overflow-hidden">
              <Crest size={32} priority className="shrink-0 shadow-xs ring-1 ring-amber-500/50" />
              <div className="min-w-0 lg:rail:hidden">
                <span className="block truncate font-brand text-xs font-black tracking-wide text-foreground">
                  ESOCS WEB STUDIO
                </span>
                <span className="text-3xs block truncate font-semibold text-primary uppercase">
                  {userUnit.unitName}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Area */}
          <div className="scrollbar-none min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
            {renderNavLinks()}
          </div>

          {/* Sidebar Footer */}
          <div className="grid shrink-0 gap-1 border-t border-sidebar-border p-3">
            <Tooltip content="Help & Support" side="right" disabled={!collapsed}>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className={cn(
                  "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-active-foreground",
                  "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-muted",
                )}
              >
                <LifeBuoy />
                <span className="flex-1 truncate lg:rail:sr-only">Help & Support</span>
              </a>
            </Tooltip>
            <Tooltip content="Collapse Sidebar" shortcut="⌘B" side="right" disabled={!collapsed}>
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-active-foreground",
                  "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-muted",
                )}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                <span className="flex-1 truncate text-left lg:rail:sr-only">Collapse</span>
                <Kbd keys={["⌘", "B"]} className="lg:rail:hidden" />
              </button>
            </Tooltip>
          </div>
        </aside>

        {/* Content Area with Responsive Topbar */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
            {/* Left: Mobile Nav & Scope */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-ml-1.5 lg:hidden"
                    aria-label="Open navigation drawer"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-0">
                  <SheetTitle className="sr-only">Web Studio Navigation</SheetTitle>
                  <div className="flex h-topbar shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
                    <Crest size={32} priority className="shrink-0 shadow-xs ring-1 ring-amber-500/50" />
                    <div>
                      <span className="block font-brand text-xs font-black text-foreground">
                        ESOCS WEB STUDIO
                      </span>
                      <span className="text-3xs block font-semibold text-primary uppercase">
                        {userUnit.unitName}
                      </span>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    {renderNavLinks(() => setMobileOpen(false))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Breadcrumb / Title */}
              <div className="flex items-center gap-2">
                <Badge tone="primary" className="hidden text-2xs uppercase sm:inline-flex">
                  Web Studio
                </Badge>
                <span className="max-w-50 truncate text-xs font-bold text-foreground sm:max-w-xs md:max-w-md">
                  {userUnit.unitName}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-2xs font-bold text-amber-500 transition-all hover:bg-amber-500/20 sm:text-xs"
                  >
                    <Church className="size-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Main Church Admin</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Switch to Ecclesiastical Governance & Admin Portal</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/church/${userUnit.unitSlug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-2xs font-semibold text-emerald-600 transition-all hover:bg-emerald-500/20 sm:text-xs dark:text-emerald-400"
                  >
                    <Globe className="size-3.5" />
                    <span className="hidden sm:inline">Live Web Preview</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>View live public site for {userUnit.unitName}</TooltipContent>
              </Tooltip>

              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          {/* Main Studio Body */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
