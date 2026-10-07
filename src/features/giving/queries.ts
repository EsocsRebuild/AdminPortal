import "server-only";

import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

export interface FundLedger {
  id: string;
  name: string;
  code: string;
  description: string;
  currentBalance: number;
  monthToDate: number;
  status: "active" | "restricted";
}

export interface GivingBatch {
  id: string;
  batchNumber: string;
  date: string;
  cashTotal: number;
  posTotal: number;
  onlineTotal: number;
  total: number;
  status: "open" | "verified" | "reconciled";
  verifiedBy: string;
}

export interface GivingSummary {
  from: string;
  to: string;
  currency: string;
  total: number;
  giftCount: number;
  giverCount: number;
  averageGift: number;
  byFund: { name: string; total: number; count: number }[];
  byMethod: { name: string; total: number; count: number }[];
  byMonth: { name: string; total: number; count: number }[];
}

export async function listFunds(): Promise<FundLedger[]> {
  await requirePermission("giving:view");
  try {
    interface RawFundItem {
      id: string;
      name: string;
      code: string;
      description?: string;
      currentBalance?: number;
      monthToDate?: number;
      isActive?: boolean;
    }
    const raw = await backend<RawFundItem[]>("/funds");
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((f) => ({
        id: f.id,
        name: f.name,
        code: f.code,
        description: f.description || "",
        currentBalance: f.currentBalance ?? 0,
        monthToDate: f.monthToDate ?? 0,
        status: f.isActive ? "active" : "restricted",
      }));
    }
  } catch {
    // Fallback to empty if offline/unreachable
  }
  return [];
}

export async function listBatches(): Promise<GivingBatch[]> {
  await requirePermission("giving:view");
  try {
    interface RawBatchItem {
      id: string;
      name?: string;
      batchDate: string;
      recordedTotal?: number;
      expectedTotal?: number;
      status?: string;
      recordedCount?: number;
    }
    const raw = await backendRaw<{ items?: RawBatchItem[] }>("/batches");
    const items = raw?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((b) => ({
        id: b.id,
        batchNumber: b.name || `BAT-${b.id.slice(0, 8)}`,
        date: b.batchDate,
        cashTotal: b.recordedTotal ?? 0,
        posTotal: 0,
        onlineTotal: 0,
        total: b.recordedTotal ?? (b.expectedTotal ?? 0),
        status: (b.status?.toLowerCase() === "closed" ? "reconciled" : "open") as "open" | "verified" | "reconciled",
        verifiedBy: b.status === "Closed" ? "Parish Finance Committee" : "Pending Reconciliation",
      }));
    }
  } catch {
    // Fallback
  }
  return [];
}

export async function getGivingSummary(): Promise<GivingSummary | null> {
  try {
    return await backend<GivingSummary>("/giving/reports/summary");
  } catch {
    return null;
  }
}
