import {
  BarChart3,
  Building2,
  CalendarDays,
  Church,
  FileText,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  Palette,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/types/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Hidden unless the user has this permission. */
  permission?: Permission;
  /** Small count or label on the right, e.g. pending approvals. */
  badge?: string;
  /** Shown in the command palette. */
  keywords?: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
      { title: "Reports", href: "/reports", icon: BarChart3, permission: "reports:view", keywords: ["analytics"] },
    ],
  },
  {
    title: "Church",
    items: [
      { title: "Members", href: "/members", icon: Users, permission: "members:view", badge: "12", keywords: ["people"] },
      { title: "Parishes", href: "/parishes", icon: Church, permission: "parishes:view", keywords: ["branches"] },
      { title: "Clergy", href: "/clergy", icon: Building2, permission: "clergy:view" },
      { title: "Events", href: "/events", icon: CalendarDays, permission: "events:view", keywords: ["calendar"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Finance", href: "/finance", icon: HandCoins, permission: "finance:view", keywords: ["tithes", "giving"] },
      { title: "Content", href: "/content", icon: FileText, permission: "content:view", keywords: ["sermons", "news"] },
      { title: "Communications", href: "/communications", icon: Megaphone, permission: "communications:send" },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users & roles", href: "/users", icon: ShieldCheck, permission: "users:manage" },
      { title: "Audit log", href: "/audit-log", icon: ScrollText, permission: "audit:view" },
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Design system", href: "/design-system", icon: Palette, keywords: ["components", "ui"] },
    ],
  },
];

export const allNavItems = navigation.flatMap((g) => g.items);

/** The nav item whose href best matches `pathname`. */
export function activeNavItem(pathname: string) {
  return allNavItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
