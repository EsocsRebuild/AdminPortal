"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
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
} from "lucide-react";

import { useSession } from "@/components/auth/session-provider";
import { Crest } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpdeskDrawer } from "@/features/support/components/helpdesk-drawer";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/layout/user-menu";
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
  const sessionUser = useSession();
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
      badge: "Main",
    },
    {
      href: "/admin-web/events",
      label: "Events Studio",
      icon: Calendar,
      active: pathname.startsWith("/admin-web/events"),
      badge: "Services",
    },
    {
      href: "/admin-web/programmes",
      label: "Programmes Schedule",
      icon: Megaphone,
      active: pathname.startsWith("/admin-web/programmes"),
      badge: null,
    },
    {
      href: "/admin-web/media",
      label: "Media Asset Library",
      icon: ImageIcon,
      active: pathname.startsWith("/admin-web/media"),
      badge: "Assets",
    },
    ...(isPlatformAdmin
      ? [
          {
            href: "/admin-web/vetting",
            label: "Super Vetting Queue",
            icon: CheckCircle2,
            active: pathname.startsWith("/admin-web/vetting"),
            badge: "Admin",
          },
        ]
      : []),
  ];

  const churchGovernanceLinks = [
    {
      href: "/dashboard",
      label: "Main Governance Portal",
      icon: Church,
      badge: "Portal",
    },
    {
      href: "/members",
      label: "Member Directory",
      icon: Users,
      badge: null,
    },
    {
      href: "/attendance",
      label: "Attendance & Headcount",
      icon: UserCheck,
      badge: null,
    },
    {
      href: "/giving",
      label: "Giving & Stewardship",
      icon: Wallet,
      badge: null,
    },
    {
      href: "/ordination",
      label: "Ordination Pipeline",
      icon: Award,
      badge: "Dossier",
    },
  ];

  const renderNavLinks = (isDrawer = false, onSelect?: () => void) => {
    const isCompact = collapsed && !isDrawer;

    return (
      <div className="space-y-6">
        {/* Group 1: Content Studio */}
        <div>
          {!isCompact && (
            <div className="px-2 pb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Studio Management
            </div>
          )}
          <nav className="space-y-1">
            {studioLinks.map((item) => {
              const Icon = item.icon;
              const linkNode = (
                <Link
                  href={item.href}
                  onClick={onSelect}
                  className={cn(
                    "group relative flex h-10 items-center gap-3 rounded-control px-3 text-xs font-medium transition-colors",
                    item.active
                      ? "bg-primary font-semibold text-primary-foreground shadow-xs shadow-primary/25"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                    isCompact && "mx-auto size-10 justify-center px-0",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      item.active
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  {!isCompact && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-3xs rounded px-1.5 py-0.5 font-bold tracking-wider uppercase",
                            item.active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-surface-muted text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );

              return isCompact ? (
                <Tooltip key={item.href} content={item.label} side="right">
                  {linkNode}
                </Tooltip>
              ) : (
                <React.Fragment key={item.href}>{linkNode}</React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Group 2: Public Church Site Preview */}
        <div>
          {!isCompact && (
            <div className="px-2 pb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Live Public Web
            </div>
          )}
          <nav className="space-y-1">
            {(() => {
              const liveNode = (
                <Link
                  href={`/church/${userUnit.unitSlug}`}
                  target="_blank"
                  onClick={onSelect}
                  className={cn(
                    "group flex h-10 items-center gap-3 rounded-control px-3 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400",
                    isCompact && "mx-auto size-10 justify-center px-0",
                  )}
                >
                  <Globe className="size-4 shrink-0 text-emerald-500" />
                  {!isCompact && (
                    <>
                      <span className="flex-1 truncate">Parish Live Website</span>
                      <ExternalLink className="size-3 text-emerald-500/70" />
                    </>
                  )}
                </Link>
              );

              return isCompact ? (
                <Tooltip content={`Live Preview (${userUnit.unitName})`} side="right">
                  {liveNode}
                </Tooltip>
              ) : (
                liveNode
              );
            })()}
          </nav>
        </div>

        {/* Group 3: Ecclesiastical Governance Cross-Links */}
        <div>
          {!isCompact && (
            <div className="px-2 pb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Church Governance
            </div>
          )}
          <nav className="space-y-1">
            {churchGovernanceLinks.map((item) => {
              const Icon = item.icon;
              const linkNode = (
                <Link
                  href={item.href}
                  onClick={onSelect}
                  className={cn(
                    "group flex h-10 items-center gap-3 rounded-control px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
                    isCompact && "mx-auto size-10 justify-center px-0",
                  )}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-amber-500" />
                  {!isCompact && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-3xs rounded bg-surface-muted px-1.5 py-0.5 font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );

              return isCompact ? (
                <Tooltip key={item.href} content={item.label} side="right">
                  {linkNode}
                </Tooltip>
              ) : (
                <React.Fragment key={item.href}>{linkNode}</React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "min-h-dvh bg-background text-foreground lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:ease-emphasized",
          collapsed ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]" : "lg:grid-cols-[16.5rem_minmax(0,1fr)]",
        )}
      >
        {/* Desktop Sidebar (Persistent) */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
            collapsed ? "w-18" : "w-66",
          )}
        >
          {/* Studio Brand Header */}
          <div
            className={cn(
              "flex h-topbar shrink-0 items-center border-b border-sidebar-border px-4",
              collapsed ? "justify-center px-0" : "justify-between",
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Link href="/admin-web/dashboard" className="shrink-0" aria-label="Web Studio Home">
                <Crest size={34} priority className="shadow-md ring-2 ring-amber-400/80" />
              </Link>
              {!collapsed && (
                <div className="min-w-0">
                  <span className="block truncate font-brand text-xs font-black tracking-wider text-foreground uppercase">
                    ESOCS WEB STUDIO
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-3xs block truncate font-semibold text-primary uppercase">
                      {userUnit.unitName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <Tooltip content="Collapse sidebar" shortcut="⌘B" side="right">
                <button
                  type="button"
                  onClick={toggle}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="size-4" />
                </button>
              </Tooltip>
            )}
          </div>

          {/* Navigation Area */}
          <div className="scrollbar-none min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
            {renderNavLinks(false)}
          </div>

          {/* Sidebar Footer */}
          <div className="grid shrink-0 gap-1 border-t border-sidebar-border p-3">
            {!collapsed && (
              <div className="mb-2 flex items-center gap-2.5 rounded-lg border border-border/60 bg-surface/60 p-2">
                <Avatar
                  name={sessionUser?.name || "Content Editor"}
                  src={sessionUser?.avatarUrl}
                  size="sm"
                  status="online"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {sessionUser?.name || "Content Editor"}
                  </p>
                  <p className="text-3xs truncate font-medium text-primary">
                    {sessionUser?.role?.name || "Parish Content Editor"}
                  </p>
                </div>
              </div>
            )}

            <Tooltip content="Help & Support Desk" side="right" disabled={!collapsed}>
              <div>
                <HelpdeskDrawer
                  trigger={
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-active-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <LifeBuoy className="size-4 shrink-0 text-sidebar-muted" />
                      {!collapsed && <span className="flex-1 truncate text-left">Help & Support</span>}
                    </button>
                  }
                />
              </div>
            </Tooltip>

            <Tooltip
              content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              shortcut="⌘B"
              side="right"
              disabled={!collapsed}
            >
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-active-foreground",
                  collapsed && "justify-center px-0",
                )}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4 shrink-0 text-sidebar-muted" />
                ) : (
                  <PanelLeftClose className="size-4 shrink-0 text-sidebar-muted" />
                )}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left">Collapse Sidebar</span>
                    <Kbd keys={["⌘", "B"]} />
                  </>
                )}
              </button>
            </Tooltip>
          </div>
        </aside>

        {/* Content Area with Responsive Topbar */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
            {/* Left: Mobile Nav & Desktop Sidebar Toggle & Scope */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Trigger (< lg) */}
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
                <SheetContent side="left" className="w-80 max-w-[85vw] bg-sidebar p-0">
                  <SheetTitle className="sr-only">Web Studio Navigation</SheetTitle>
                  <div className="flex h-topbar shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
                    <Crest size={34} priority className="shrink-0 shadow-md ring-2 ring-amber-400/80" />
                    <div className="min-w-0">
                      <span className="block font-brand text-xs font-black text-foreground uppercase">
                        ESOCS WEB STUDIO
                      </span>
                      <span className="text-3xs block font-semibold text-primary uppercase">
                        {userUnit.unitName}
                      </span>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                    {renderNavLinks(true, () => setMobileOpen(false))}
                  </div>
                  <div className="border-t border-sidebar-border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={sessionUser?.name || "Content Editor"}
                        src={sessionUser?.avatarUrl}
                        size="md"
                        status="online"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-foreground">
                          {sessionUser?.name || "Content Editor"}
                        </p>
                        <p className="truncate text-2xs text-muted-foreground">
                          {sessionUser?.email || "admin@esocs.org"}
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Sidebar Toggle (shown on lg+) */}
              <Tooltip content={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className="hidden size-8 text-muted-foreground hover:text-foreground lg:flex"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                </Button>
              </Tooltip>

              <Separator orientation="vertical" className="hidden h-5 lg:block" />

              {/* Breadcrumb / Scope Title */}
              <div className="flex items-center gap-2">
                <Badge tone="primary" className="text-2xs uppercase">
                  Web Studio
                </Badge>
                <span className="hidden text-xs text-muted-foreground sm:inline">/</span>
                <span className="max-w-40 truncate text-xs font-bold text-foreground sm:max-w-xs md:max-w-md">
                  {userUnit.unitName}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Tooltip content="Switch to Ecclesiastical Governance & Admin Portal">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-2xs font-bold text-amber-500 transition-all hover:bg-amber-500/20 sm:text-xs"
                >
                  <Church className="size-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Main Church Admin</span>
                </Link>
              </Tooltip>

              <Tooltip content={`View live public site for ${userUnit.unitName}`}>
                <Link
                  href={`/church/${userUnit.unitSlug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-2xs font-semibold text-emerald-600 transition-all hover:bg-emerald-500/20 sm:text-xs dark:text-emerald-400"
                >
                  <Globe className="size-3.5" />
                  <span className="hidden sm:inline">Live Web Preview</span>
                  <ExternalLink className="size-3 opacity-70" />
                </Link>
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
