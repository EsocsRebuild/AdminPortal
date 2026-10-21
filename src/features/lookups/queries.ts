import "server-only";

import { cache } from "react";

import { backend } from "@/server/backend";

export interface Parish {
  id: string;
  name: string;
}

export const getParishes = cache(async () => {
  try {
    return await backend<Parish[]>("/lookups/parishes");
  } catch {
    return await backend<Parish[]>("/public/parishes", { auth: false });
  }
});
