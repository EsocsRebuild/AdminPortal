import "server-only";

import { cache } from "react";
import { backend } from "./backend";

export interface UnitInfo {
  id: string;
  slug: string;
  kind: string;
  name: string;
  parentId?: string | null;
  parentName?: string | null;
  locality?: string | null;
  address?: string | null;
  tagline?: string | null;
}

export const getAllUnits = cache(async (): Promise<UnitInfo[]> => {
  try {
    const res = await backend<UnitInfo[]>("/public/units", { auth: false });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
});

export const getUnitByIdOrSlug = cache(async (idOrSlug?: string | null): Promise<UnitInfo | null> => {
  if (!idOrSlug) return null;
  const units = await getAllUnits();
  return units.find((u) => u.id === idOrSlug || u.slug === idOrSlug) ?? null;
});

export async function resolveUserUnit(scopeUnitId?: string | null): Promise<{
  unitName: string;
  unitSlug: string;
  unitId?: string | null;
  isGlobal: boolean;
}> {
  if (!scopeUnitId) {
    return {
      unitName: "The Holy Order (Global Headquarters)",
      unitSlug: "headquarters",
      unitId: null,
      isGlobal: true,
    };
  }
  const unit = await getUnitByIdOrSlug(scopeUnitId);
  if (unit) {
    return {
      unitName: unit.name,
      unitSlug: unit.slug,
      unitId: unit.id,
      isGlobal: unit.kind === "headquarters" && !unit.parentId,
    };
  }
  return {
    unitName: "Local Church Unit",
    unitSlug: "headquarters",
    unitId: scopeUnitId,
    isGlobal: false,
  };
}

