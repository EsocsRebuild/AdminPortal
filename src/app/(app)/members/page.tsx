import type { Metadata } from "next";

import { Can } from "@/components/auth/session-provider";
import { Page, PageHeader } from "@/components/layout/page";
import { ContextualTipCard } from "@/components/ui/contextual-tip-card";
import { getParishes } from "@/features/lookups/queries";
import { MemberCreateLauncher } from "@/features/members/components/member-create-launcher";
import { MembersTable } from "@/features/members/components/members-table";
import { listMembers } from "@/features/members/queries";
import { memberStatuses } from "@/features/members/types";
import { enumParam, idParam, parseListParams } from "@/lib/list-params";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({ searchParams }: PageProps<"/members">) {
  const params = parseListParams(await searchParams, {
    status: enumParam(memberStatuses),
    parishId: idParam,
  });
  const [result, parishes] = await Promise.all([listMembers(params), getParishes()]);

  return (
    <Page>
      <PageHeader
        title="Members"
        description={`${pluralize(result.meta.total, "person", "people")}${params.q || params.status || params.parishId ? " match your filters" : " registered"}.`}
        actions={
          <Can permission="members:manage">
            <MemberCreateLauncher parishes={parishes} />
          </Can>
        }
      />
      <ContextualTipCard
        id="members_fast_intake"
        title="Fast Member Registration & Visitor Tracking"
        description="During Sunday service, quickly record first-time visitors with Alt+N. Scoped to your active parish automatically."
        actionText="View Guide"
        className="mb-4"
      />
      <MembersTable

        page={result.data}
        parishes={parishes}
        server={{
          total: result.meta.total,
          page: result.meta.page,
          pageSize: result.meta.pageSize,
          q: params.q,
          sort: params.sort,
          dir: params.dir,
          filtered: Boolean(params.status || params.parishId),
        }}
      />
    </Page>
  );
}
