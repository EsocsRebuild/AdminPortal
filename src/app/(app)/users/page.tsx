import type { Metadata } from "next";

import { AdminsTable } from "@/features/users/components/admins-table";
import { listAdmins, listRoles } from "@/features/users/queries";
import { adminStatuses } from "@/features/users/types";
import { enumParam, idParam, parseListParams } from "@/lib/list-params";

export const metadata: Metadata = { title: "Administrators" };

export default async function AdminsPage({ searchParams }: PageProps<"/users">) {
  const params = parseListParams(await searchParams, { status: enumParam(adminStatuses), roleId: idParam });
  const [result, roles] = await Promise.all([listAdmins(params), listRoles()]);
  return (
    <AdminsTable
      page={result.data}
      roles={roles}
      server={{
        total: result.meta.total,
        page: result.meta.page,
        pageSize: result.meta.pageSize,
        q: params.q,
        sort: params.sort,
        dir: params.dir,
        filtered: Boolean(params.status || params.roleId),
      }}
    />
  );
}
