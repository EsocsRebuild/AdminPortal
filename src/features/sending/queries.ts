import "server-only";

import { backend } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { SendingSettings } from "./types";

export async function getSendingSettings() {
  await requirePermission("settings:manage");
  return backend<SendingSettings>("/email/sending");
}
