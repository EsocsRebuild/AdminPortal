import "server-only";

import { backend } from "@/server/backend";
import { requirePermission } from "@/server/session";
import { getLocalEvents } from "./event-store";

export interface ChurchEvent {
  id: string;
  title: string;
  category: "service" | "conference" | "revival" | "fellowship";
  date: string;
  time: string;
  location: string;
  unitName: string;
  capacity?: number;
  registeredCount?: number;
  isRecurring: boolean;
  status: "scheduled" | "live" | "completed";
}

export async function listEvents(): Promise<ChurchEvent[]> {
  await requirePermission("events:view");
  try {
    interface RawEventItem {
      id: string;
      title: string;
      description?: string;
      location?: string;
      startsAt: string;
      endsAt?: string;
      type?: string;
      isRecurring?: boolean;
      capacity?: number;
      registrationEnabled?: boolean;
      recurrenceRule?: string;
      status?: string;
    }
    const raw = await backend<{ items?: RawEventItem[] } | RawEventItem[]>("/events");
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    let backendMapped: ChurchEvent[] = [];
    if (Array.isArray(items) && items.length > 0) {
      backendMapped = items.map((evt) => {
        const startsAt = new Date(evt.startsAt);
        const dateStr = startsAt.toISOString().split("T")[0];
        const timeStr = startsAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const typeLower = evt.type ? evt.type.toLowerCase() : "";
        const category = (
          ["service", "conference", "revival", "fellowship"].includes(typeLower) ? typeLower : "service"
        ) as "service" | "conference" | "revival" | "fellowship";

        return {
          id: evt.id,
          title: evt.title,
          category,
          date: dateStr,
          time: timeStr,
          location: evt.location || "Main Sanctuary",
          unitName: evt.location || "Local Assembly",
          capacity: evt.capacity ?? undefined,
          registeredCount: evt.registrationEnabled ? 0 : undefined,
          isRecurring: !!evt.recurrenceRule,
          status: (evt.status?.toLowerCase() === "live"
            ? "live"
            : evt.status?.toLowerCase() === "completed"
              ? "completed"
              : "scheduled") as "scheduled" | "live" | "completed",
        };
      });
    }

    const mappedLocal: ChurchEvent[] = getLocalEvents().map((e) => {
      const startsAt = new Date(e.startDate);
      const catLower = e.category.toLowerCase();
      const cat = (
        catLower === "conference"
          ? "conference"
          : catLower === "revival"
            ? "revival"
            : catLower === "fellowship_rally"
              ? "fellowship"
              : "service"
      ) as "service" | "conference" | "revival" | "fellowship";

      return {
        id: e.id,
        title: e.title,
        category: cat,
        date: startsAt.toISOString().split("T")[0],
        time: startsAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        location: e.venue,
        unitName: e.unitName,
        capacity: e.ticketCapacity,
        registeredCount: e.registrationOpen ? 0 : undefined,
        isRecurring: false,
        status: "scheduled",
      };
    });

    const seenIds = new Set(backendMapped.map((e) => e.id));
    for (const loc of mappedLocal) {
      if (!seenIds.has(loc.id)) {
        backendMapped.unshift(loc);
      }
    }
    return backendMapped;
  } catch {
    // Network fallback
  }

  return getLocalEvents().map((e) => {
    const startsAt = new Date(e.startDate);
    const catLower = e.category.toLowerCase();
    const cat = (
      catLower === "conference"
        ? "conference"
        : catLower === "revival"
          ? "revival"
          : catLower === "fellowship_rally"
            ? "fellowship"
            : "service"
    ) as "service" | "conference" | "revival" | "fellowship";

    return {
      id: e.id,
      title: e.title,
      category: cat,
      date: startsAt.toISOString().split("T")[0],
      time: startsAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      location: e.venue,
      unitName: e.unitName,
      capacity: e.ticketCapacity,
      registeredCount: e.registrationOpen ? 0 : undefined,
      isRecurring: false,
      status: "scheduled",
    };
  });
}
