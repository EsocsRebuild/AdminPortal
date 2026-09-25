import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { AuditTable } from "@/features/audit/components/audit-table";
import { listAuditEvents } from "@/features/audit/queries";
import { periods, severities } from "@/features/audit/types";
import { enumParam, idParam, parseListParams } from "@/lib/list-params";
import { can } from "@/lib/permissions";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Audit log" };

export default async function AuditLogPage({ searchParams }: PageProps<"/audit-log">) {
  const user = await requireSession();
  const params = parseListParams(await searchParams, { severity: enumParam(severities), period: enumParam(periods), actorId: idParam });
  const result = await listAuditEvents({ ...params, sort: params.sort ?? "createdAt", dir: params.dir ?? "desc" });
  return (
    <Page>
      <PageHeader title="Audit log" description="Every sign-in, change and export, kept for accountability. Entries can’t be edited or deleted." />
      <AuditTable
        page={result.data}
        canExport={can(user, "audit:view")}
        server={{ total: result.meta.total, page: result.meta.page, pageSize: result.meta.pageSize, q: params.q, sort: params.sort, dir: params.dir, filtered: Boolean(params.severity || params.period || params.actorId) }}
      />
    </Page>
  );
}
