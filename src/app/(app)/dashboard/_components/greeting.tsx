"use client";

import * as React from "react";
import { Sparkles, Activity, CalendarDays } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { siteConfig } from "@/config/site";
import { Crest } from "@/components/icons/logo";

function partOfDay(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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
  const dateStr = new Intl.DateTimeFormat(siteConfig.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: siteConfig.timeZone,
  }).format(now);

  return (
    <div className="relative overflow-hidden rounded-card border border-border-strong bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl">
      {/* Background Crest Watermark & Ambient Glow */}
      <div className="pointer-events-none absolute -right-6 -bottom-10 opacity-10">
        <Crest size={220} />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-2xs font-extrabold tracking-widest text-amber-300 uppercase backdrop-blur-xl">
              <Sparkles className="size-3 animate-pulse text-amber-400" />
              Executive Command Hub
            </span>

            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-2xs font-extrabold tracking-widest text-emerald-300 uppercase backdrop-blur-xl sm:inline-flex">
              <Activity className="size-3 text-emerald-400" />
              System Status: Active
            </span>
          </div>

          <h1 className="font-brand text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            {mounted ? partOfDay(hour) : "Welcome"},{" "}
            <span className="bg-linear-to-r from-amber-300 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>

          <p className="text-xs font-medium text-slate-300">
            Welcome to your unified ESOCS administration command center.
          </p>
        </div>

        {/* Date & System Clock Widget */}
        <div className="flex shrink-0 items-center gap-3 rounded-control border border-slate-800 bg-slate-950/80 p-3 shadow-inner backdrop-blur-xl">
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-2 text-amber-400">
            <CalendarDays className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xs font-semibold tracking-wider text-slate-400 uppercase">
              Operational Date
            </span>
            <span className="font-mono text-xs font-extrabold text-white">{mounted ? dateStr : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
