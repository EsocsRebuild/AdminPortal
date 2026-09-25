import {
  FormInput,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Palette,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/lib/permissions";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Hidden unless the user holds this permission. The page re-checks on the server. */
  permission?: Permission;
  /** Extra words the command menu matches on. */
  keywords?: string[];
  /** Only listed when the design system is enabled. */
  devOnly?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard:view",
        keywords: ["home"],
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        title: "Members",
        href: "/members",
        icon: Users,
        permission: "members:view",
        keywords: ["people", "congregation"],
      },
    ],
  },
  {
    title: "Email marketing",
    items: [
      {
        title: "Campaigns",
        href: "/campaigns",
        icon: Mail,
        permission: "campaigns:view",
        keywords: ["newsletter", "email", "send"],
      },
      {
        title: "Audiences",
        href: "/audiences",
        icon: UsersRound,
        permission: "audiences:view",
        keywords: ["lists", "contacts", "subscribers"],
      },
      {
        title: "Templates",
        href: "/templates",
        icon: LayoutTemplate,
        permission: "templates:manage",
        keywords: ["design", "layout"],
      },
    ],
  },
  {
    title: "Forms",
    items: [
      {
        title: "Forms",
        href: "/forms",
        icon: FormInput,
        permission: "forms:view",
        keywords: ["survey", "registration", "responses"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users & roles",
        href: "/users",
        icon: ShieldCheck,
        permission: "users:view",
        keywords: ["admins", "invite", "permissions"],
      },
      {
        title: "Audit log",
        href: "/audit-log",
        icon: ScrollText,
        permission: "audit:view",
        keywords: ["history", "activity"],
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        keywords: ["profile", "password", "security", "two-factor"],
      },
      {
        title: "Design system",
        href: "/design-system",
        icon: Palette,
        devOnly: true,
        keywords: ["components"],
      },
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
