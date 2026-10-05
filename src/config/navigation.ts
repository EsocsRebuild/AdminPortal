import {
  BookOpen,
  CalendarDays,
  CheckCheck,
  FileText,
  FormInput,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Newspaper,
  Palette,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  Video,
  Wallet,
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
        keywords: ["home", "analytics"],
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
        keywords: ["people", "congregation", "roster"],
      },
    ],
  },
  {
    title: "Services & Events",
    items: [
      {
        title: "Events & Calendar",
        href: "/events",
        icon: CalendarDays,
        permission: "events:view",
        keywords: ["services", "calendar", "schedule", "revivals"],
      },
      {
        title: "Attendance & Headcount",
        href: "/attendance",
        icon: CheckCheck,
        permission: "attendance:view",
        keywords: ["checkin", "sunday", "headcount"],
      },
    ],
  },
  {
    title: "Stewardship",
    items: [
      {
        title: "Giving & Batches",
        href: "/giving",
        icon: Wallet,
        permission: "giving:view",
        keywords: ["tithes", "offering", "donations", "finance"],
      },
    ],
  },
  {
    title: "Fellowships & Wings",
    items: [
      {
        title: "Autonomous Sections",
        href: "/sections",
        icon: Layers,
        keywords: ["women", "youth", "mzys", "choir", "directorates"],
      },
    ],
  },
  {
    title: "Website & Content",
    items: [
      {
        title: "Sermons & Media",
        href: "/content/sermons",
        icon: Video,
        permission: "content:view",
        keywords: ["sermons", "messages", "preaching", "audio", "video", "media"],
      },
      {
        title: "Sermon Series",
        href: "/content/series",
        icon: BookOpen,
        permission: "content:view",
        keywords: ["series", "teachings", "themes"],
      },
      {
        title: "Articles & News",
        href: "/content/posts",
        icon: Newspaper,
        permission: "content:view",
        keywords: ["news", "articles", "blog", "posts", "announcements"],
      },
      {
        title: "Pages & Hero",
        href: "/content/pages",
        icon: FileText,
        permission: "content:view",
        keywords: ["pages", "cms", "website", "hero", "landing"],
      },
    ],
  },
  {
    title: "Communications",
    items: [
      {
        title: "Campaigns",
        href: "/campaigns",
        icon: Mail,
        permission: "campaigns:view",
        keywords: ["newsletter", "email", "send", "sms"],
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
