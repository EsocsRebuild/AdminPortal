"use client";

import { useMounted } from "@/hooks/use-mounted";
import { siteConfig } from "@/config/site";

function partOfDay(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Time-aware greeting. Renders a neutral greeting until the client knows the hour. */
export function Greeting({ name }: { name: string }) {
  const mounted = useMounted();
  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: siteConfig.timeZone,
    }).format(now),
  );
  const date = new Intl.DateTimeFormat(siteConfig.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: siteConfig.timeZone,
  }).format(now);

  return (
    <div className="grid gap-1">
      <p className="text-sm text-muted-foreground" suppressHydrationWarning>
        {mounted ? date : " "}
      </p>
      <h1 className="text-heading-lg font-semibold">
        {mounted ? partOfDay(hour) : "Welcome"}, {name}
      </h1>
    </div>
  );
}
