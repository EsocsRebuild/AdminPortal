import type { Metadata } from "next";

import { UrlTabs } from "@/components/data-table/url-tabs";
import { Page, PageHeader } from "@/components/layout/page";
import { CampaignsTable } from "@/features/campaigns/components/campaigns-table";
import { NewCampaignButton } from "@/features/campaigns/components/new-campaign-dialog";
import { listCampaigns } from "@/features/campaigns/queries";
import { campaignStatuses } from "@/features/campaigns/types";
import { listTemplatesForPicker } from "@/features/templates/queries";
import { can } from "@/lib/permissions";
import { enumParam, parseListParams } from "@/lib/list-params";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Campaigns" };

export default async function CampaignsPage({ searchParams }: PageProps<"/campaigns">) {
  const user = await requireSession();
  const params = parseListParams(await searchParams, { status: enumParam(campaignStatuses) });
  const [result, templates] = await Promise.all([
    listCampaigns({ ...params, sort: params.sort ?? "updatedAt", dir: params.dir ?? "desc" }),
    can(user, "campaigns:manage") ? listTemplatesForPicker() : Promise.resolve([]),
  ]);
  const newButton = <NewCampaignButton templates={templates} />;

  return (
    <Page>
      <PageHeader title="Email campaigns" description="Create, send and measure emails to your audiences." actions={newButton}>
        <UrlTabs
          param="status"
          label="Campaign status"
          tabs={[
            { value: null, label: "All" },
            { value: "draft", label: "Drafts" },
            { value: "scheduled", label: "Scheduled" },
            { value: "sent", label: "Sent" },
          ]}
        />
      </PageHeader>
      <CampaignsTable
        page={result.data}
        emptyAction={newButton}
        server={{
          total: result.meta.total,
          page: result.meta.page,
          pageSize: result.meta.pageSize,
          q: params.q,
          sort: params.sort,
          dir: params.dir,
          filtered: Boolean(params.status),
        }}
      />
    </Page>
  );
}
