import "server-only";

import { backend } from "@/server/backend";
import { requireSession } from "@/server/session";
import { listEvents } from "@/features/events/queries";

export interface FellowshipSection {
  id: string;
  slug: string;
  name: string;
  motto: string;
  headLeader: string;
  memberCount: number;
  activeEventsCount: number;
  nextMajorEvent?: string;
  accentColor: string;
  badgeTone: "success" | "warning" | "info" | "primary";
}

export interface ListSectionsOptions {
  scopeUnitId?: string | null;
  isGlobalAdmin?: boolean;
  userUnitName?: string;
}

export async function listSections(options?: ListSectionsOptions): Promise<FellowshipSection[]> {
  await requireSession();
  const isGlobal = Boolean(options?.isGlobalAdmin);
  const scopeId = options?.scopeUnitId;
  const userUnitName = (options?.userUnitName || "").toLowerCase().trim();

  try {
    interface RawUnitItem {
      id: string;
      slug: string;
      name: string;
      kind?: string;
      type?: string;
      parentId?: string | null;
      parentName?: string | null;
      tagline?: string;
      about?: string[];
      leaders?: { name: string; role?: string }[];
      childCount?: number;
    }

    const raw = await backend<{ items?: RawUnitItem[] } | RawUnitItem[]>("/units");
    const items = Array.isArray(raw) ? raw : raw?.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    // List real church events to dynamically count active events per section
    let allEvents: Awaited<ReturnType<typeof listEvents>> = [];
    try {
      allEvents = await listEvents();
    } catch {
      allEvents = [];
    }

    // Identify genuine Fellowship Sections & Specialized Ministerial Arms
    // (Explicitly excluding territorial provinces, dioceses, and geographic headquarters)
    const isFellowshipOrWing = (u: RawUnitItem): boolean => {
      const kind = (u.kind || u.type || "").toLowerCase().trim();
      const name = (u.name || "").toLowerCase().trim();
      const slug = (u.slug || "").toLowerCase().trim();

      // Administrative units are never fellowship wings
      if (
        name.endsWith("province") ||
        name.includes("provincial headquarters") ||
        name.includes("general headquarters") ||
        name.includes("annex abuja") ||
        name.startsWith("cmc ") ||
        slug.includes("cmc-") ||
        slug === "headquarters"
      ) {
        return false;
      }

      if (["headquarters", "province", "diocese", "district"].includes(kind)) {
        return false;
      }

      // Fellowship and departmental keywords
      const wingKeywords = [
        "fellowship",
        "wing",
        "women",
        "youth",
        "choir",
        "father",
        "men",
        "children",
        "directorate",
        "brigade",
        "society",
        "guild",
        "department",
        "affairs",
      ];

      return wingKeywords.some((kw) => name.includes(kw) || slug.includes(kw) || kind.includes(kw));
    };

    // Apply strict multi-tenant isolation
    const filteredUnits = items.filter((u) => {
      if (!isFellowshipOrWing(u)) {
        return false;
      }

      if (isGlobal) {
        return true;
      }

      if (scopeId && (u.parentId === scopeId || u.id === scopeId)) {
        return true;
      }

      if (userUnitName) {
        const uParent = (u.parentName || "").toLowerCase();
        const uName = u.name.toLowerCase();
        const normJurisdiction = userUnitName
          .replace(/\b(headquarters|cathedral|provincial|district|parish|diocese)\b/gi, "")
          .trim();
        if (normJurisdiction && (uParent.includes(normJurisdiction) || uName.includes(normJurisdiction))) {
          return true;
        }
      }

      return false;
    });

    const tones: ("success" | "warning" | "info" | "primary")[] = [
      "success",
      "warning",
      "info",
      "primary",
    ];
    const colors = [
      "border-l-emerald-500",
      "border-l-amber-500",
      "border-l-purple-500",
      "border-l-blue-500",
    ];

    return filteredUnits.map((u, i) => {
      const leader = u.leaders?.[0]?.name ?? "Executive Directorate";

      // Match real events for this section
      const sectionEvents = allEvents.filter((e) => {
        const titleLower = e.title.toLowerCase();
        const unitLower = e.unitName.toLowerCase();
        const sectionNameLower = u.name.toLowerCase();
        const sectionSlug = u.slug.toLowerCase();
        return (
          titleLower.includes(sectionNameLower) ||
          unitLower.includes(sectionNameLower) ||
          titleLower.includes(sectionSlug)
        );
      });

      const nextEvent = sectionEvents[0]?.title;

      return {
        id: u.id,
        slug: u.slug,
        name: u.name,
        motto:
          u.tagline ||
          (Array.isArray(u.about) && u.about[0] ? u.about[0] : "Autonomous ministerial directorate of the Holy Order."),
        headLeader: leader,
        memberCount: typeof u.childCount === "number" ? u.childCount : 0,
        activeEventsCount: sectionEvents.length,
        nextMajorEvent: nextEvent,
        accentColor: colors[i % colors.length],
        badgeTone: tones[i % tones.length],
      };
    });
  } catch {
    return [];
  }
}
