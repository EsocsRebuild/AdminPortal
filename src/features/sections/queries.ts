import "server-only";

import { backend, backendRaw } from "@/server/backend";
import { requireSession } from "@/server/session";

export interface FellowshipSection {
  id: string;
  slug: string;
  name: string;
  motto: string;
  headLeader: string;
  memberCount: number;
  activeEventsCount: number;
  nextMajorEvent: string;
  accentColor: string;
  badgeTone: "success" | "warning" | "info" | "primary";
}

export async function listSections(): Promise<FellowshipSection[]> {
  await requireSession();
  try {
    interface RawUnitItem {
      id: string;
      slug: string;
      name: string;
      tagline?: string;
      about?: string[];
      leaders?: { name: string }[];
      childCount?: number;
    }
    const raw = await backend<{ items?: RawUnitItem[] } | RawUnitItem[]>("/units");
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((u, i) => {
        const leader = u.leaders?.[0]?.name ?? "Executive Directorate";
        const tones: ("success" | "warning" | "info" | "primary")[] = ["success", "warning", "info", "primary"];
        const colors = ["border-l-emerald-500", "border-l-amber-500", "border-l-purple-500", "border-l-blue-500"];
        return {
          id: u.id,
          slug: u.slug,
          name: u.name,
          motto: u.tagline || (Array.isArray(u.about) ? u.about[0] : "") || "Living a life of holiness and fellowship.",
          headLeader: leader,
          memberCount: u.childCount || 100,
          activeEventsCount: 2,
          nextMajorEvent: "Annual Directorate Assembly & Conference",
          accentColor: colors[i % colors.length],
          badgeTone: tones[i % tones.length],
        };
      });
    }
  } catch {
    // Network fallback
  }
  return [];
}
