"use client";

import * as React from "react";
import Image from "next/image";
import { Crest } from "@/components/icons/logo";
import { ArrowRight, CheckCircle2, Sparkles, Building2, ShieldCheck, UsersRound } from "lucide-react";

const steps = [
  {
    at: 0,
    title: "Holy Order Connection",
    text: "Connecting to Holy Order Unit & Parish Ledger...",
    icon: Building2,
  },
  {
    at: 25,
    title: "Ecclesiastical Security",
    text: "Verifying Handler Credentials & Audit Traceability...",
    icon: ShieldCheck,
  },
  {
    at: 55,
    title: "Registry & Records",
    text: "Synchronizing Member & Ordination Candidate Records...",
    icon: UsersRound,
  },
  {
    at: 80,
    title: "Interface Assembly",
    text: "Preparing Administration & Content Publishing Core...",
    icon: Sparkles,
  },
  {
    at: 100,
    title: "Platform Ready",
    text: "Welcome to The Eternal Sacred Order of the Cherubim and Seraphim",
    icon: CheckCircle2,
  },
];

export function AppSplashLoader() {
  const [mounted, setMounted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [currentStepText, setCurrentStepText] = React.useState(steps[0].text);
  const [bgIndex, setBgIndex] = React.useState(0);
  const [fadingOut, setFadingOut] = React.useState(false);

  const images = [
    "/brand/hero-mount-zion.webp",
    "/brand/splash-bg.webp",
    "/brand/hero-youth.webp",
    "/brand/hero-women.webp",
    "/brand/hero-fathers.webp",
  ];

  React.useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // Crisp, prompt pace

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawPct);

      const activeStep = steps
        .slice()
        .reverse()
        .find((s) => rawPct >= s.at);
      if (activeStep) {
        setCurrentStepText(activeStep.text);
      }

      const nextBg = Math.floor((rawPct / 100) * images.length) % images.length;
      setBgIndex(nextBg);

      if (rawPct >= 100) {
        clearInterval(interval);
        setFadingOut(true);
        setTimeout(() => {
          setMounted(false);
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-label="Loading platform"
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center overflow-hidden bg-slate-950 transition-opacity duration-300 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background imagery with solid high-contrast dark overlay - no blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={images[bgIndex]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/90" />
      </div>

      {/* Main Solid Architectural Content Card - Sharp 1px Border, No Heavy Box-Shadow */}
      <div className="relative z-10 mx-4 flex max-w-lg flex-col items-center rounded-xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-10">
        {/* Sacred Official Crest */}
        <div className="relative mb-5 flex size-24 items-center justify-center rounded-xl border border-amber-500/30 bg-slate-950 p-3 sm:size-28">
          <Crest className="size-full text-amber-400" />
        </div>

        {/* Full Complete Name of the Holy Order */}
        <h1 className="text-sm font-bold tracking-wider text-amber-400 uppercase sm:text-base">
          The Eternal Sacred Order of the Cherubim and Seraphim
        </h1>
        <p className="mt-1 text-xs font-medium tracking-wide text-slate-400 uppercase">
          Administration & Governance Portal
        </p>

        {/* Crisp Progress Bar */}
        <div className="mt-6 w-full max-w-xs space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-amber-300 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[0.6875rem] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Loading</span>
            <span className="font-mono text-amber-400">{progress}%</span>
          </div>
        </div>

        {/* Dynamic status line */}
        <p className="mt-4 min-h-[1.5rem] text-xs font-medium text-slate-300">{currentStepText}</p>

        {/* Quick Dismiss / Skip Button for Returning Admins */}
        <button
          type="button"
          onClick={() => setMounted(false)}
          className="hover:bg-slate-750 mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
        >
          <span>Continue</span>
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
