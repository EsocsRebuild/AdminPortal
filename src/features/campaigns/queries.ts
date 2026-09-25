import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { Campaign, CampaignReport, CampaignStatus, CampaignSummary, SenderProfile } from "./types";

export async function listCampaigns(params: ListParams & { status?: CampaignStatus }) {
  await requirePermission("campaigns:view");
  return backendRaw<Page<CampaignSummary>>("/campaigns", { query: { ...params } });
}

export async function getCampaign(id: string) {
  await requirePermission("campaigns:view");
  return backend<Campaign>(`/campaigns/${id}`);
}

export async function getCampaignReport(id: string) {
  await requirePermission("campaigns:view");
  return backend<CampaignReport>(`/campaigns/${id}/report`);
}

export async function getSenderProfile() {
  await requirePermission("campaigns:view");
  return backend<SenderProfile>("/email/sender-profile");
}
