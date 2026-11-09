import fs from "node:fs";
import path from "node:path";
import type { WebEvent, ContentStatus } from "@/features/web-cms/types";

const DB_PATH = path.join(process.cwd(), "src/features/events/events-db.json");

declare global {
  var __esocs_local_events: WebEvent[] | undefined;
}

function loadEventsFromDisk(): WebEvent[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // If disk read fails, continue to fallback
  }
  return [];
}

function saveEventsToDisk(events: WebEvent[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(events, null, 2), "utf-8");
  } catch {
    // Write fallback
  }
}

export function getLocalEvents(): WebEvent[] {
  return loadEventsFromDisk();
}

export function addLocalEvent(event: WebEvent): void {
  const list = getLocalEvents();
  const existingIdx = list.findIndex((e) => e.id === event.id);
  if (existingIdx !== -1) {
    list[existingIdx] = event;
  } else {
    list.unshift(event);
  }
  globalThis.__esocs_local_events = list;
  saveEventsToDisk(list);
}

export function updateLocalEventStatus(id: string, status: ContentStatus, reviewNotes?: string): boolean {
  const list = getLocalEvents();
  const target = list.find((e) => e.id === id);
  if (target) {
    target.status = status;
    if (reviewNotes !== undefined) {
      target.reviewNotes = reviewNotes;
    }
    target.vettedAt = new Date().toISOString();
    globalThis.__esocs_local_events = list;
    saveEventsToDisk(list);
    return true;
  }
  return false;
}

export function deleteLocalEvent(id: string): boolean {
  const list = getLocalEvents();
  const nextList = list.filter((e) => e.id !== id);
  if (nextList.length !== list.length) {
    globalThis.__esocs_local_events = nextList;
    saveEventsToDisk(nextList);
    return true;
  }
  return false;
}
