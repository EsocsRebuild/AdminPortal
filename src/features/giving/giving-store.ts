import type { FundLedger, GivingBatch } from "./queries";

interface GivingDb {
  funds: FundLedger[];
  batches: GivingBatch[];
}

const inMemoryDb: GivingDb = { funds: [], batches: [] };

export function getLocalFunds(): FundLedger[] {
  return inMemoryDb.funds;
}

export function addLocalFund(fund: FundLedger): void {
  inMemoryDb.funds.unshift(fund);
}

export function getLocalBatches(): GivingBatch[] {
  return inMemoryDb.batches;
}

export function addLocalBatch(batch: GivingBatch): void {
  inMemoryDb.batches.unshift(batch);
}

export function updateBatchStatus(
  batchId: string,
  status: "open" | "verified" | "reconciled",
  verifiedBy?: string,
): boolean {
  const b = inMemoryDb.batches.find((item) => item.id === batchId);
  if (b) {
    b.status = status;
    if (verifiedBy) b.verifiedBy = verifiedBy;
    return true;
  }
  return false;
}
