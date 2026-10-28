import fs from "node:fs";
import path from "node:path";
import type { HeadcountRecord } from "./queries";

const DB_PATH = path.join(process.cwd(), "src/features/attendance/attendance-db.json");

function loadDb(): HeadcountRecord[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return [];
}

function saveDb(records: HeadcountRecord[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    // Write fallback
  }
}

export function getLocalHeadcounts(): HeadcountRecord[] {
  return loadDb();
}

export function addLocalHeadcount(record: HeadcountRecord): void {
  const records = loadDb();
  records.unshift(record);
  saveDb(records);
}

export function updateLatestLiveCount(delta: number): number {
  const records = loadDb();
  if (records.length > 0) {
    records[0].total = Math.max(0, records[0].total + delta);
    saveDb(records);
    return records[0].total;
  }
  return 0;
}
