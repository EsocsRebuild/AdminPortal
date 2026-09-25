import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { AuditEvent, Period, Severity } from "./types";

const periodMs: Record<Period, number> = { "24h": 86_400_000, "7d": 7 * 86_400_000, "30d": 30 * 86_400_000, "90d": 90 * 86_400_000 };

export async function listAuditEvents(params: ListParams & { severity?: Severity; period?: Period; actorId?: string }) {
  await requirePermission("audit:view");
  const { period, ...rest } = params;
  const from = period ? new Date(Date.now() - periodMs[period]).toISOString() : undefined;
  return backendRaw<Page<AuditEvent>>("/audit-events", { query: { ...rest, from } });
}

/** Small feed for the dashboard; returns [] instead of failing when not allowed. */
export async function recentAuditEvents(limit = 6) {
  return backendRaw<Page<AuditEvent>>("/audit-events", { query: { pageSize: limit, page: 1 } }).then((r) => r.data);
}
