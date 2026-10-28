import type { WebEvent } from "@/features/web-cms/types";

declare global {
  var __esocs_local_events: WebEvent[] | undefined;
}

export function getLocalEvents(): WebEvent[] {
  if (!globalThis.__esocs_local_events) {
    globalThis.__esocs_local_events = [];
  }
  return globalThis.__esocs_local_events;
}

export function addLocalEvent(event: WebEvent): void {
  const list = getLocalEvents();
  list.unshift(event);
}
