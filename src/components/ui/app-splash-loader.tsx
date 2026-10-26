"use client";

import * as React from "react";
import { Crest } from "@/components/icons/logo";

interface AppSplashLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function AppSplashLoader({
  message = "Loading Central Administration Portal...",
  subMessage = "The Eternal Sacred Order of the Cherubim and Seraphim • Mount Zion Worldwide",
  fullScreen = true,
}: AppSplashLoaderProps) {
  const [mounted, setMounted] = React.useState(true);
  const [fadingOut, setFadingOut] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setMounted(false), 240);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const content = (
    <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-6 p-6 text-center sm:p-8">
      {/* Animated Stately Crest Container */}
      <div className="relative flex size-28 items-center justify-center">
        {/* Soft Ambient Pulse Aura */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-xl" />

        {/* Outer Counter-Clockwise Thin Dashed Ring */}
        <div
          className="absolute inset-0 animate-spin rounded-full border border-dashed border-amber-500/40"
          style={{ animationDuration: "14s", animationDirection: "reverse" }}
        />

        {/* Inner Clockwise Golden Orbit Ring */}
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-slate-800 border-t-amber-500"
          style={{ animationDuration: "1.8s" }}
        />

        {/* Core Official Crest Badge */}
        <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1222] p-2 shadow-xl transition-transform hover:scale-105">
          <Crest size={36} className="text-amber-400" />
        </div>
      </div>

      {/* Narrative Progress Message */}
      <div className="space-y-1.5 px-4">
        <h3 className="font-sans text-sm font-bold tracking-tight text-white sm:text-base">{message}</h3>
        <p className="font-sans text-xs leading-relaxed text-slate-400">{subMessage}</p>
      </div>

      {/* High-Precision Continuous Progress Shimmer */}
      <div className="relative h-1 w-44 overflow-hidden rounded-full bg-slate-800">
        <div className="absolute inset-0 h-full w-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-amber-500 to-transparent" />
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div
      role="status"
      aria-label="Loading platform"
      className={`fixed inset-0 z-99999 flex items-center justify-center bg-[#070b14]/98 transition-opacity duration-200 ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {content}
    </div>
  );
}
