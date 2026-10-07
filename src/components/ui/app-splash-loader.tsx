"use client";

import * as React from "react";
import Image from "next/image";
import { Crest } from "@/components/icons/logo";
import { ArrowRight, Sparkles } from "lucide-react";

const steps = [
  { at: 0, text: "Initializing Ecclesiastical Governance Engine..." },
  { at: 25, text: "Connecting to Holy Order Unit & Parish Ledger..." },
  { at: 50, text: "Verifying Handler Workspace & Audit Traceability..." },
  { at: 75, text: "Loading Member & Ordination Candidate Records..." },
  { at: 95, text: "Preparing The ESOCS Portal Interface..." },
  { at: 100, text: "Welcome to The ESOCS Administration Portal" },
];

export function AppSplashLoader() {
  const [mounted, setMounted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [currentStepText, setCurrentStepText] = React.useState(steps[0].text);
  const [bgIndex, setBgIndex] = React.useState(0);
  const [fadingOut, setFadingOut] = React.useState(false);

  const images = ["/brand/hero-mount-zion.webp", "/brand/splash-bg.webp", "/brand/hero-youth.webp"];

  React.useEffect(() => {
    // Check if already shown in this browser session
    const hasLoaded = sessionStorage.getItem("esocs_splash_shown");
    if (hasLoaded === "true") {
      const tInit = setTimeout(() => setMounted(false), 0);
      return () => clearTimeout(tInit);
    }

    // Background switcher interval
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    // Progress counter (0 to 100 over ~4.5 seconds for a smooth, high-end experience)
    const startTime = Date.now();
    const duration = 4200; // 4.2s smooth loader duration

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Update status message based on progress
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
            sessionStorage.setItem("esocs_splash_shown", "true");
            setMounted(false);
          }, 500);
        }, 400);
      }
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(bgInterval);
    };
  }, [images.length]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem("esocs_splash_shown", "true");
      setMounted(false);
    }, 300);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col justify-between bg-slate-950 text-white transition-opacity duration-500 overflow-hidden ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Cinematic Media Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {images.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex ? "opacity-30 scale-105" : "opacity-0 scale-100"
            }`}
          >
            <Image
              src={src}
              alt="ESOCS Sanctuary Background"
              fill
              priority
              className="object-cover object-center filter contrast-125 saturate-110"
            />
          </div>
        ))}
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Crest size={40} priority className="ring-2 ring-amber-400/80 shadow-lg shadow-amber-950/60" />
          <div className="flex flex-col">
            <span className="font-brand text-lg font-bold tracking-tight text-white">THE ESOCS</span>
            <span className="text-2xs font-semibold tracking-wider text-amber-400 uppercase">Administration System</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-amber-400 border border-amber-400/30 backdrop-blur-md shadow-lg transition-all"
        >
          <span>Skip to Portal</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* Center Cinematic Loader Box */}
      <div className="relative z-10 mx-auto flex flex-col items-center text-center max-w-md px-4 my-auto">
        {/* Outer Pulsing & Rotating Gold Emblem Rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute size-32 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
          <div className="absolute size-40 rounded-full border border-amber-400/10 border-b-amber-400/50 animate-spin [animation-direction:reverse] [animation-duration:8s]" />
          <div className="absolute size-48 rounded-full bg-amber-400/5 blur-xl animate-pulse" />
          
          <Crest size={84} priority className="ring-4 ring-amber-400/90 shadow-[0_0_40px_rgba(251,191,36,0.6)]" />
        </div>

        {/* Brand Title */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-2xs font-bold uppercase tracking-widest">
            <Sparkles className="size-3 animate-pulse" />
            Ecclesiastical Platform Loader
          </div>
          <h1 className="font-brand text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Care for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">Church</span>
          </h1>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="truncate max-w-[260px] text-amber-300">{currentStepText}</span>
            <span className="font-mono text-sm text-amber-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_#FBBF24]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Scripture Banner */}
      <div className="relative z-10 p-6 md:p-8 text-center border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <p className="font-brand text-sm md:text-base text-slate-300 italic">
          “Let all things be done decently and in order.”
        </p>
        <span className="text-2xs font-bold text-amber-400 uppercase tracking-widest mt-0.5 block">
          1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim
        </span>
      </div>
    </div>
  );
}
