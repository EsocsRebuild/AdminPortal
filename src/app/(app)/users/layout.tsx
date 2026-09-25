import { PageHeader } from "@/components/layout/page";
import { Page } from "@/components/layout/page";
import { RouteTabs } from "@/components/layout/route-tabs";
import { InviteButton } from "@/features/users/components/invite-button";
import { listAccessRequests, listRoles } from "@/features/users/queries";
import { requirePermission } from "@/server/session";

export default async function UsersLayout({ children }: LayoutProps<"/users">) {
  await requirePermission("users:view");
  const [roles, requests] = await Promise.all([listRoles(), listAccessRequests()]);
  return (
    <Page>
      <PageHeader title="Users & roles" description="Who can use the portal, and what they’re allowed to do." actions={<InviteButton roles={roles} />}>
        <RouteTabs
          label="Users sections"
          tabs={[
            { href: "/users", label: "Administrators" },
            { href: "/users/requests", label: "Access requests", count: requests.length || undefined },
            { href: "/users/roles", label: "Roles", prefix: true },
          ]}
        />
      </PageHeader>
      {children}
    </Page>
  );
}
