import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Page } from "@/components/layout/page";
import { listAudiences } from "@/features/audiences/queries";
import { CampaignComposer } from "@/features/campaigns/components/campaign-composer";
import { getCampaign, getSenderProfile } from "@/features/campaigns/queries";
import { listTemplatesForPicker } from "@/features/templates/queries";
import { assertId, findOrNotFound } from "@/server/query";
import { requirePermission } from "@/server/session";

export const metadata: Metadata = { title: "Edit campaign" };

export default async function EditCampaignPage({ params }: PageProps<"/campaigns/[id]/edit">) {
  await requirePermission("campaigns:manage");
  const id = assertId((await params).id);
  const campaign = await findOrNotFound(getCampaign(id));
  if (campaign.status !== "draft") redirect(`/campaigns/${id}`);
  const [audiences, sender, templates] = await Promise.all([
    listAudiences(),
    getSenderProfile(),
    listTemplatesForPicker(),
  ]);

  return (
    <Page width="full" className="max-w-[88rem]">
      <CampaignComposer campaign={campaign} audiences={audiences} sender={sender} templates={templates} />
    </Page>
  );
}
