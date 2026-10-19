"server-only";

import { backend } from "@/server/backend";
import { resolveUserUnit } from "@/server/units";
import type { WebEvent, WebProgramme, MediaAsset, VettingSummary, EventCategory } from "./types";

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

  try {
    const raw = await backend<{ items?: BackendEventResponse[] } | BackendEventResponse[]>("/events", {
      query: scopeUnitId ? { unitId: scopeUnitId } : undefined,
    });

    const items = Array.isArray(raw) ? raw : raw?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((evt) => ({
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
        status: evt.status === "Published" ? "APPROVED_LIVE" : evt.status === "Cancelled" ? "NEEDS_REVISION" : "PENDING_REVIEW",
        submittedByHandlerId: evt.id,
        submittedAt: evt.startsAt,
      }));
    }
  } catch {
    // If backend /events returns empty or is unpopulated for this unit, return empty array.
  }

  // Gracefully return empty array so new accounts show their clean empty state rather than mock data from another parish
  return [];
}

export async function getVettingQueue(): Promise<{
  events: WebEvent[];
  programmes: WebProgramme[];
  summary: VettingSummary;
}> {
  try {
    const data = await backend<{ events: WebEvent[]; programmes: WebProgramme[]; summary: VettingSummary }>(
      "/web-cms/vetting",
    );
    if (data && Array.isArray(data.events)) {
      return data;
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

    return {
      events,
      programmes: [],
      summary: {
        pendingEventsCount: events.length,
        pendingProgrammesCount: 0,
        approvedCount: 0,
        revisionRequestedCount: 0,
      },
    };
  } catch {
    return {
      events: [],
      programmes: [],
      summary: {
        pendingEventsCount: 0,
        pendingProgrammesCount: 0,
        approvedCount: 0,
        revisionRequestedCount: 0,
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
    // Return empty array
  }
  return [];
}
