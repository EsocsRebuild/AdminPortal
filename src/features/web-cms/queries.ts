"server-only";

import { backend } from "@/server/backend";
import { resolveUserUnit } from "@/server/units";
import { getLocalEvents } from "@/features/events/event-store";
import { getLocalProgrammes } from "./programmes-store";
import { getLocalMediaAssets } from "./media-store";
import type { WebEvent, WebProgramme, WebBulletin, MediaAsset, VettingSummary, EventCategory } from "./types";

interface BackendEventResponse {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  visibility: string;
  summary?: string;
  description?: string;
  coverImageUrl?: string;
  unitId?: string | null;
  location?: string | null;
  isOnline: boolean;
  onlineUrl?: string | null;
  startsAt: string;
  endsAt: string;
  registrationEnabled: boolean;
  capacity?: number | null;
}

function mapBackendTypeToCategory(type?: string): EventCategory {
  const t = (type ?? "").toLowerCase();
  if (t === "conference") return "CONFERENCE";
  if (t === "outreach") return "REVIVAL";
  if (t === "social" || t === "rehearsal") return "FELLOWSHIP_RALLY";
  if (t === "service") return "SUNDAY_SERVICE";
  return "SPECIAL_PROGRAMME";
}

export async function getBranchEvents(scopeUnitId?: string | null): Promise<WebEvent[]> {
  const unitInfo = await resolveUserUnit(scopeUnitId);
  const localList = getLocalEvents();
  const filteredLocal = scopeUnitId
    ? localList.filter((e) => {
        if (!e.unitId) return true;
        if (e.unitId === scopeUnitId) return true;
        if (
          e.unitName &&
          unitInfo.unitName &&
          (e.unitName.toLowerCase().includes(unitInfo.unitName.toLowerCase()) ||
            unitInfo.unitName.toLowerCase().includes(e.unitName.toLowerCase()))
        ) {
          return true;
        }
        return false;
      })
    : localList;

  try {
    const raw = await backend<{ items?: BackendEventResponse[] } | BackendEventResponse[]>("/events", {
      query: scopeUnitId ? { unitId: scopeUnitId } : undefined,
    });

    const items = Array.isArray(raw) ? raw : raw?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      const backendEvents: WebEvent[] = items.map((evt) => ({
        id: evt.id,
        unitId: evt.unitId ?? scopeUnitId ?? "",
        unitName: unitInfo.unitName,
        title: evt.title,
        description: evt.description ?? evt.summary ?? "",
        category: mapBackendTypeToCategory(evt.type),
        startDate: evt.startsAt,
        endDate: evt.endsAt,
        venue: evt.location || `${unitInfo.unitName} Auditorium`,
        bannerUrl: evt.coverImageUrl || undefined,
        registrationOpen: Boolean(evt.registrationEnabled),
        ticketCapacity: evt.capacity ?? undefined,
        status:
          evt.status === "Published"
            ? "APPROVED_LIVE"
            : evt.status === "Cancelled"
              ? "NEEDS_REVISION"
              : "PENDING_REVIEW",
        submittedByHandlerId: evt.id,
        submittedAt: evt.startsAt,
      }));

      // Combine backend events with any locally submitted events
      const seenIds = new Set(backendEvents.map((e) => e.id));
      for (const loc of filteredLocal) {
        if (!seenIds.has(loc.id)) {
          backendEvents.unshift(loc);
        }
      }
      return backendEvents;
    }
  } catch {
    // Backend API unavailable; return live local events
  }

  return filteredLocal;
}

export async function getBranchProgrammes(scopeUnitId?: string | null): Promise<WebProgramme[]> {
  const unitInfo = await resolveUserUnit(scopeUnitId);
  const localList = getLocalProgrammes();
  const filtered = scopeUnitId
    ? localList.filter((p) => {
        if (!p.unitId) return true;
        if (p.unitId === scopeUnitId) return true;
        if (
          p.unitName &&
          unitInfo.unitName &&
          (p.unitName.toLowerCase().includes(unitInfo.unitName.toLowerCase()) ||
            unitInfo.unitName.toLowerCase().includes(p.unitName.toLowerCase()))
        ) {
          return true;
        }
        return false;
      })
    : localList;
  return filtered;
}

export async function getVettingQueue(): Promise<{
  events: WebEvent[];
  programmes: WebProgramme[];
  summary: VettingSummary;
}> {
  const localList = getLocalEvents();
  const localPending = localList.filter((e) => e.status === "PENDING_REVIEW");
  const localApproved = localList.filter((e) => e.status === "APPROVED_LIVE");
  const localRevision = localList.filter((e) => e.status === "NEEDS_REVISION");

  try {
    const data = await backend<{ events: WebEvent[]; programmes: WebProgramme[]; summary: VettingSummary }>(
      "/web-cms/vetting",
    );
    if (data && Array.isArray(data.events)) {
      const seenIds = new Set(data.events.map((e) => e.id));
      const mergedEvents = [...data.events];
      for (const lp of localPending) {
        if (!seenIds.has(lp.id)) {
          mergedEvents.unshift(lp);
        }
      }
      return {
        events: mergedEvents,
        programmes: data.programmes || [],
        summary: {
          pendingEventsCount: mergedEvents.length,
          pendingProgrammesCount: data.summary?.pendingProgrammesCount || 0,
          approvedCount: (data.summary?.approvedCount || 0) + localApproved.length,
          revisionRequestedCount: (data.summary?.revisionRequestedCount || 0) + localRevision.length,
        },
      };
    }
  } catch {
    // Fall back to querying draft events from backend
  }

  try {
    const rawEvents = await backend<{ items?: BackendEventResponse[] }>("/events", {
      query: { status: "Draft" },
    });
    const items = rawEvents?.items || [];
    const events: WebEvent[] = items.map((evt) => ({
      id: evt.id,
      unitId: evt.unitId ?? "",
      unitName: "Assigned Unit",
      title: evt.title,
      description: evt.description ?? evt.summary ?? "",
      category: mapBackendTypeToCategory(evt.type),
      startDate: evt.startsAt,
      endDate: evt.endsAt,
      venue: evt.location || "Auditorium",
      bannerUrl: evt.coverImageUrl || undefined,
      registrationOpen: Boolean(evt.registrationEnabled),
      ticketCapacity: evt.capacity ?? undefined,
      status: "PENDING_REVIEW",
      submittedByHandlerId: evt.id,
      submittedAt: evt.startsAt,
    }));

    const seenIds = new Set(events.map((e) => e.id));
    const merged = [...events];
    for (const lp of localPending) {
      if (!seenIds.has(lp.id)) {
        merged.unshift(lp);
      }
    }

    return {
      events: merged,
      programmes: [],
      summary: {
        pendingEventsCount: merged.length,
        pendingProgrammesCount: 0,
        approvedCount: localApproved.length,
        revisionRequestedCount: localRevision.length,
      },
    };
  } catch {
    return {
      events: localPending,
      programmes: [],
      summary: {
        pendingEventsCount: localPending.length,
        pendingProgrammesCount: 0,
        approvedCount: localApproved.length,
        revisionRequestedCount: localRevision.length,
      },
    };
  }
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  try {
    interface BackendMediaItem {
      id: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      url: string;
      createdAt: string;
    }
    const res = await backend<{ items?: BackendMediaItem[] } | BackendMediaItem[]>("/content/media");
    const items = Array.isArray(res) ? res : res?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((m) => ({
        id: m.id,
        fileName: m.fileName,
        fileSize: m.fileSize,
        mimeType: m.mimeType,
        cdnUrl: m.url,
        uploadedAt: m.createdAt,
        uploadedByHandlerId: "system",
      }));
    }
  } catch {
    // Fallback to local store
  }
  return getLocalMediaAssets();
}

export async function getPublishedBulletins(): Promise<WebBulletin[]> {
  try {
    const data = await backend<{ items?: WebBulletin[] } | WebBulletin[]>("/content/bulletins");
    const items = Array.isArray(data) ? data : data?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
  } catch {
    // Fallback
  }
  return [];
}
