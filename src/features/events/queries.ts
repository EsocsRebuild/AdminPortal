import "server-only";

import { backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

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
    const raw = await backendRaw<{ items?: RawEventItem[] }>("/events");
    const items = raw?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((evt) => {
        const startsAt = new Date(evt.startsAt);
        const dateStr = startsAt.toISOString().split("T")[0];
        const timeStr = startsAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const typeLower = evt.type ? evt.type.toLowerCase() : "";
        const category = (
          ["service", "conference", "revival", "fellowship"].includes(typeLower)
            ? typeLower
            : "service"
        ) as "service" | "conference" | "revival" | "fellowship";

        return {
          id: evt.id,
          title: evt.title,
          category,
          date: dateStr,
          time: timeStr,
          location: evt.location || "Main Sanctuary",
          unitName: "Mount Zion Parish",
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
  } catch {
    // Network fallback
  }
  return [];
}
