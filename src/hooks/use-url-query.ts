"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

/**
 * Read and update list state kept in the URL (page, search, sort, filters).
 * Updates are transitions, so the current page stays visible while the next
 * one loads. Changing anything except `page` returns to page 1.
 */
export function useUrlQuery() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const set = React.useCallback(
    (patch: Record<string, string | number | null | undefined>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      if (!("page" in patch)) next.delete("page");
      const qs = next.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [params, pathname, router],
  );

  const get = React.useCallback((key: string) => params.get(key) ?? undefined, [params]);

  return { get, set, isPending, params };
}
