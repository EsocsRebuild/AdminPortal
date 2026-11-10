import fs from "node:fs";
import path from "node:path";
import type { WebBulletin } from "./types";

const DB_PATH = path.join(process.cwd(), "src/features/web-cms/posts-db.json");

function loadDb(): WebBulletin[] {
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

function saveDb(posts: WebBulletin[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2), "utf-8");
  } catch {
    // Write fallback
  }
}

export function getLocalPosts(): WebBulletin[] {
  return loadDb();
}

export function addLocalPost(post: WebBulletin): void {
  const list = loadDb();
  list.unshift(post);
  saveDb(list);
}

export function deleteLocalPost(id: string): boolean {
  const list = loadDb();
  const nextList = list.filter((p) => p.id !== id);
  if (nextList.length !== list.length) {
    saveDb(nextList);
    return true;
  }
  return false;
}
