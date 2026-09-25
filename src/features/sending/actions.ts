"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend } from "@/server/backend";

import { domainIdInput, domainInput, sendingSettingsInput } from "./schemas";
import type { SendingDomain } from "./types";

export const updateSendingSettings = secureAction(
  { schema: sendingSettingsInput, permission: "settings:manage" },
  async (values) => {
    await backend("/email/sending", { method: "PUT", body: values });
    revalidatePath("/settings/email");
    return null;
  },
);

export const addSendingDomain = secureAction(
  { schema: domainInput, permission: "settings:manage", sudo: true },
  async ({ domain }, { sudoHeaders }) => {
    const d = await backend<SendingDomain>("/email/domains", {
      method: "POST",
      body: { domain },
      headers: sudoHeaders,
    });
    revalidatePath("/settings/email");
    return { id: d.id };
  },
);

export const verifySendingDomain = secureAction(
  { schema: domainIdInput, permission: "settings:manage" },
  async ({ id }) => {
    const d = await backend<SendingDomain>(`/email/domains/${id}/verify`, { method: "POST" });
    revalidatePath("/settings/email");
    return { status: d.status };
  },
);

export const removeSendingDomain = secureAction(
  { schema: domainIdInput, permission: "settings:manage", sudo: true },
  async ({ id }, { sudoHeaders }) => {
    await backend(`/email/domains/${id}`, { method: "DELETE", headers: sudoHeaders });
    revalidatePath("/settings/email");
    return null;
  },
);
