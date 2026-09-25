"use client";

import { Tabs, TabsCount, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlQuery } from "@/hooks/use-url-query";

/** Status views stored in the URL (`?status=`). The first tab clears the filter. */
export function UrlTabs({
  param,
  tabs,
  label,
}: {
  param: string;
  tabs: { value: string | null; label: string; count?: number }[];
  label: string;
}) {
  const url = useUrlQuery();
  const current = url.get(param) ?? "__all";
  return (
    <Tabs value={current} onValueChange={(v) => url.set({ [param]: v === "__all" ? null : v })}>
      <TabsList aria-label={label}>
        {tabs.map((t) => (
          <TabsTrigger key={t.value ?? "__all"} value={t.value ?? "__all"}>
            {t.label}
            {t.count !== undefined && <TabsCount>{t.count}</TabsCount>}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
