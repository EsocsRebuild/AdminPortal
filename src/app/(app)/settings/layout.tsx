import { User, ShieldCheck, Palette, Bell, Mail, Layers } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/page";
import { SectionNav, type SectionNavItem } from "@/components/layout/section-nav";

const items: SectionNavItem[] = [
  {
    href: "/settings/profile",
    label: "Profile",
    description: "Personal credentials & handler ID",
    icon: <User className="size-4" />,
  },
  {
    href: "/settings/security",
    label: "Security",
    description: "Password & 2FA protection",
    icon: <ShieldCheck className="size-4" />,
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    description: "Theme preferences & visual display",
    icon: <Palette className="size-4" />,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    description: "Alert preferences & activity summaries",
    icon: <Bell className="size-4" />,
  },
  {
    href: "/settings/email",
    label: "Email sending",
    description: "SMTP configuration & email templates",
    icon: <Mail className="size-4" />,
    permission: "settings:manage",
  },
  {
    href: "/settings/build-tracker",
    label: "Build Tracker",
    description: "Phase progress & component registry",
    icon: <Layers className="size-4" />,
  },
];

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <Page>
      <PageHeader title="Settings" description="Your account, security and how the portal works for you." />
      <div className="grid gap-page lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <SectionNav items={items} label="Settings sections" />
        <div className="grid max-w-3xl min-w-0 content-start gap-page">{children}</div>
      </div>
    </Page>
  );
}
