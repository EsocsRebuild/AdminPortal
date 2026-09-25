import type { Metadata } from "next";

import { AccessRequests } from "@/features/users/components/access-requests";
import { listAccessRequests, listRoles } from "@/features/users/queries";

export const metadata: Metadata = { title: "Access requests" };

export default async function RequestsPage() {
  const [requests, roles] = await Promise.all([listAccessRequests(), listRoles()]);
  return <AccessRequests requests={requests} roles={roles} />;
}
