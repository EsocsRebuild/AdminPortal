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
    <div className="relative overflow-hidden rounded-card border border-border-strong bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 shadow-xl text-white">
      {/* Background Crest Watermark & Ambient Glow */}
      <div className="pointer-events-none absolute -right-6 -bottom-10 opacity-10">
        <Crest size={220} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-2xs font-extrabold text-amber-300 uppercase tracking-widest backdrop-blur-xl">
              <Sparkles className="size-3 text-amber-400 animate-pulse" />
              Executive Command Hub
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 text-2xs font-extrabold text-emerald-300 uppercase tracking-widest backdrop-blur-xl">
              <Activity className="size-3 text-emerald-400" />
              System Status: Active
            </span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {mounted ? partOfDay(hour) : "Welcome"}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400">{name}</span>
          </h1>

          <p className="text-xs text-slate-300 font-medium">
            Welcome to your unified ESOCS administration command center.
          </p>
        </div>

        {/* Date & System Clock Widget */}
        <div className="flex items-center gap-3 shrink-0 rounded-control border border-slate-800 bg-slate-950/80 p-3 backdrop-blur-xl shadow-inner">
          <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <CalendarDays className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Operational Date</span>
            <span className="text-xs font-extrabold text-white font-mono">{mounted ? dateStr : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
