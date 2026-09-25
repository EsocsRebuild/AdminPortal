import "server-only";

import { cache } from "react";

import { backend } from "@/server/backend";

export interface Parish {
  id: string;
  name: string;
}

/** Reference data used by forms and filters. Memoised per request. */
export const getParishes = cache(() => backend<Parish[]>("/lookups/parishes"));
