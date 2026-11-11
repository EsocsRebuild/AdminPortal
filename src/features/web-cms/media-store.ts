import fs from "node:fs";
import path from "node:path";
import type { MediaAsset } from "./types";

const DB_PATH = path.join(process.cwd(), "src/features/web-cms/media-db.json");

function loadDb(): MediaAsset[] {
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

function saveDb(assets: MediaAsset[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(assets, null, 2), "utf-8");
    if (process.env.NODE_ENV !== "production") {
      const candidateSyncDirs = [
        "/app/web-sync",
        path.resolve(process.cwd(), "../web/src/data/sync"),
        path.resolve(process.cwd(), "web/src/data/sync"),
        "/Users/testapp/Documents/TechDev/EsocsRebuild/web/src/data/sync",
      ];
      for (const dir of candidateSyncDirs) {
        try {
          if (fs.existsSync(/*turbopackIgnore: true*/ dir)) {
            fs.writeFileSync(path.join(dir, "media-db.json"), JSON.stringify(assets, null, 2), "utf-8");
          }
        } catch {}
      }
    }
  } catch {
    // Write fallback
  }
}

export function getLocalMediaAssets(): MediaAsset[] {
  return loadDb();
}

export function addLocalMediaAsset(asset: MediaAsset): void {
  const list = loadDb();
  list.unshift(asset);
  saveDb(list);
}

export function deleteLocalMediaAsset(id: string): boolean {
  const list = loadDb();
  const nextList = list.filter((a) => a.id !== id);
  if (nextList.length !== list.length) {
    saveDb(nextList);
    return true;
  }
  return false;
}
