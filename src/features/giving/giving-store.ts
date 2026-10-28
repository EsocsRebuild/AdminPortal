import fs from "node:fs";
import path from "node:path";
import type { FundLedger, GivingBatch } from "./queries";

const DB_PATH = path.join(process.cwd(), "src/features/giving/giving-db.json");

interface GivingDb {
  funds: FundLedger[];
  batches: GivingBatch[];
}

function loadDb(): GivingDb {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(content);
      return {
        funds: Array.isArray(parsed.funds) ? parsed.funds : [],
        batches: Array.isArray(parsed.batches) ? parsed.batches : [],
      };
    }
  } catch {
    // Fallback
  }
  return { funds: [], batches: [] };
}

function saveDb(db: GivingDb): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // Write fallback
  }
}

export function getLocalFunds(): FundLedger[] {
  return loadDb().funds;
}

export function addLocalFund(fund: FundLedger): void {
  const db = loadDb();
  db.funds.unshift(fund);
  saveDb(db);
}

export function getLocalBatches(): GivingBatch[] {
  return loadDb().batches;
}

export function addLocalBatch(batch: GivingBatch): void {
  const db = loadDb();
  db.batches.unshift(batch);
  saveDb(db);
}

export function updateBatchStatus(
  batchId: string,
  status: "open" | "verified" | "reconciled",
  verifiedBy: string,
): boolean {
  const db = loadDb();
  const target = db.batches.find((b) => b.id === batchId);
  if (target) {
    target.status = status;
    target.verifiedBy = verifiedBy;
    saveDb(db);
    return true;
  }
  return false;
}

