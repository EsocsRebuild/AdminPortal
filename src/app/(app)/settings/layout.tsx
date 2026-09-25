import { Page, PageHeader } from "@/components/layout/page";
import { SectionNav } from "@/components/layout/section-nav";

const items = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/email", label: "Email sending", permission: "settings:manage" as const },
];

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <Page>
      <PageHeader title="Settings" description="Your account, security and how the portal works for you." />
      <div className="grid gap-page lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <SectionNav items={items} label="Settings sections" />
        <div className="grid max-w-3xl min-w-0 content-start gap-page">{children}</div>
      </div>
    </Page>
  );
}
