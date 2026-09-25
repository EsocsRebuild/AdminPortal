import "server-only";

import { backend } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { DashboardSummary } from "./types";

export async function getDashboardSummary() {
  await requirePermission("dashboard:view");
  return backend<DashboardSummary>("/dashboard/summary");
}
