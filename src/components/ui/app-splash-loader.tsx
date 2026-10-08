"use client";

import * as React from "react";
import Image from "next/image";
import { Crest } from "@/components/icons/logo";
import { ArrowRight, CheckCircle2, Sparkles, Building2, ShieldCheck, Award, UsersRound } from "lucide-react";

const steps = [
  {
    at: 0,
    title: "Engine Initialization",
    text: "Initializing Ecclesiastical Governance Core...",
    icon: Building2,
  },
  {
    at: 20,
    title: "Unit & Ledger Sync",
    text: "Connecting to Holy Order Unit & Parish Ledger...",
    icon: ShieldCheck,
  },
  {
    at: 45,
    title: "Audit Traceability",
    text: "Verifying Handler Workspace & Audit Traceability...",
    icon: Award,
  },
  {
    at: 70,
    title: "Record Management",
    text: "Loading Member & Ordination Candidate Records...",
    icon: UsersRound,
  },
  { at: 90, title: "Portal Interface", text: "Preparing The ESOCS Administration System...", icon: Sparkles },
  {
    at: 100,
    title: "Platform Ready",
    text: "Welcome to The ESOCS Administration Portal",
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
    // Brisk 6.5-second duration for optimal loading speed and visual polish
    const startTime = Date.now();
    const duration = 6500; // 6.5s energetic pace

    // Fast 1.4-second image cross-fade interval
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 1400);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Update active status milestone
      const matchedStep = [...steps].reverse().find((s) => pct >= s.at);
      if (matchedStep) {
        setCurrentStepText(matchedStep.text);
      }

      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(bgInterval);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            setMounted(false);
          }, 500);
        }, 300);
      }
    }, 20);

    return () => {
      clearInterval(progressInterval);
      clearInterval(bgInterval);
    };
  }, [images.length]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      setMounted(false);
    }, 300);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-999999 flex flex-col justify-between overflow-hidden bg-slate-950 text-white transition-opacity duration-500 ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Cinematic Media Background Slideshow with Ultra Deep Frosted Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {images.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex ? "scale-110 opacity-45" : "scale-100 opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="ESOCS Sanctuary Background"
              fill
              priority
              className="object-cover object-center blur-2xl contrast-125 saturate-125 filter"
            />
          </div>
        ))}
        {/* Ultra Deep Backdrop Blur & Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[80px]" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
        <div className="bg-radial-vignette absolute inset-0 opacity-95" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Crest size={44} priority className="shadow-xl ring-2 shadow-amber-950/60 ring-amber-400/80" />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-extrabold tracking-tight text-white">THE ESOCS</span>
            <span className="text-2xs font-bold tracking-widest text-amber-400 uppercase">
              Administration System
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-slate-900/90 px-4 py-2 text-xs font-bold text-amber-400 shadow-xl backdrop-blur-xl transition-all hover:bg-slate-800"
        >
          <span>Enter Portal Now</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* Center Cinematic Loader Box */}
      <div className="relative z-10 mx-auto my-auto flex max-w-xl flex-col items-center px-4 text-center">
        {/* Outer Pulsing & Rotating Gold Emblem Rings */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute size-36 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
          <div className="absolute size-48 animate-spin rounded-full border border-amber-400/20 border-b-amber-400/60 [animation-direction:reverse] [animation-duration:8s]" />
          <div className="absolute size-56 animate-pulse rounded-full bg-amber-400/10 blur-3xl" />

          <Crest
            size={96}
            priority
            className="shadow-[0_0_60px_rgba(251,191,36,0.7)] ring-4 ring-amber-400/90"
          />
        </div>

        {/* Brand Title */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-extrabold tracking-widest text-amber-400 uppercase shadow-inner backdrop-blur-xl">
            <Sparkles className="size-3.5 animate-pulse" />
            Ecclesiastical Platform Loader
          </div>
          <h1 className="font-brand text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Care for your{" "}
            <span className="bg-linear-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Church
            </span>
          </h1>
        </div>

        {/* Progress Bar & Percentage Card */}
        <div className="w-full space-y-4 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-3xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="max-w-[320px] truncate font-semibold text-amber-300">{currentStepText}</span>
            <span className="font-mono text-base font-extrabold text-amber-400">{progress}%</span>
          </div>

          {/* Shimmering Progress Bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_20px_#FBBF24] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stage Milestones Checklist */}
          <div className="grid grid-cols-5 gap-1.5 pt-2">
            {steps.slice(0, 5).map((s) => {
              const active = progress >= s.at;
              return (
                <div
                  key={s.at}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    active
                      ? "border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-md"
                      : "border-slate-800 bg-slate-950/70 text-slate-500 opacity-60"
                  }`}
                >
                  <s.icon
                    className={`size-4 ${active ? "animate-pulse text-amber-400" : "text-slate-600"}`}
                  />
                  <span className="w-full truncate text-2xs font-semibold">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Scripture Banner */}
      <div className="relative z-10 border-t border-slate-800/80 bg-slate-900/80 p-6 text-center backdrop-blur-xl md:p-8">
        <p className="font-brand text-base font-medium text-white italic md:text-lg">
          “Let all things be done decently and in order.”
        </p>
        <span className="mt-1 block text-2xs font-extrabold tracking-widest text-amber-400 uppercase">
          1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim
        </span>
      </div>
    </div>
  );
}
