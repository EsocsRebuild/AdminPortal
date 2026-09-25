"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend, BackendError } from "@/server/backend";

import {
  campaignIdInput,
  createCampaignInput,
  estimateInput,
  readyToSendSchema,
  scheduleInput,
  sendNowInput,
  sendTestInput,
  updateCampaignInput,
} from "./schemas";
import type { Campaign } from "./types";

export const createCampaign = secureAction({ schema: createCampaignInput, permission: "campaigns:manage" }, async (input) => {
  const c = await backend<Campaign>("/campaigns", { method: "POST", body: input });
  revalidatePath("/campaigns");
  return { id: c.id };
});

export const updateCampaign = secureAction(
  { schema: updateCampaignInput, permission: "campaigns:manage" },
  async ({ id, ...patch }) => {
    await backend(`/campaigns/${id}`, { method: "PATCH", body: patch });
    return null;
  },
);

export const estimateRecipients = secureAction({ schema: estimateInput, permission: "campaigns:manage" }, async ({ listIds }) =>
  listIds.length ? backend<{ count: number }>("/audiences/estimate", { method: "POST", body: { listIds } }) : { count: 0 },
);

export const sendTestEmail = secureAction({ schema: sendTestInput, permission: "campaigns:manage" }, async ({ id, emails }) => {
  await backend(`/campaigns/${id}/test`, { method: "POST", body: { emails } });
  return null;
});

/** Re-validates the saved campaign on the server before scheduling or sending. */
async function assertReady(id: string) {
  const c = await backend<Campaign>(`/campaigns/${id}`);
  const check = readyToSendSchema.safeParse({ ...c, listIds: c.audience.listIds });
  if (!check.success) throw new BackendError("VALIDATION", check.error.issues[0]?.message ?? "This campaign isn’t ready yet.", 422);
  if (c.status !== "draft") throw new BackendError("CONFLICT", "This campaign has already been scheduled or sent.", 409);
}

export const scheduleCampaign = secureAction(
  { schema: scheduleInput, permission: "campaigns:send", sudo: true },
  async ({ id, sendAt }, { sudoHeaders }) => {
    await assertReady(id);
    await backend(`/campaigns/${id}/schedule`, { method: "POST", body: { sendAt }, headers: sudoHeaders });
    revalidatePath("/campaigns");
    return null;
  },
);

export const sendCampaignNow = secureAction(
  { schema: sendNowInput, permission: "campaigns:send", sudo: true },
  async ({ id, expectedRecipients }, { sudoHeaders }) => {
    await assertReady(id);
    await backend(`/campaigns/${id}/send`, { method: "POST", body: { expectedRecipients }, headers: sudoHeaders });
    revalidatePath("/campaigns");
    return null;
  },
);

export const unscheduleCampaign = secureAction({ schema: campaignIdInput, permission: "campaigns:send" }, async ({ id }) => {
  await backend(`/campaigns/${id}/unschedule`, { method: "POST" });
  revalidatePath("/campaigns");
  return null;
});

export const duplicateCampaign = secureAction({ schema: campaignIdInput, permission: "campaigns:manage" }, async ({ id }) => {
  const c = await backend<Campaign>(`/campaigns/${id}/duplicate`, { method: "POST" });
  revalidatePath("/campaigns");
  return { id: c.id };
});

export const deleteCampaign = secureAction({ schema: campaignIdInput, permission: "campaigns:manage" }, async ({ id }) => {
  await backend(`/campaigns/${id}`, { method: "DELETE" });
  revalidatePath("/campaigns");
  return null;
});
