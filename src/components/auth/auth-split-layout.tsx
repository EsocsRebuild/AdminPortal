import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import * as React from "react";

import { Crest } from "@/components/icons/logo";
import { siteConfig } from "@/config/site";

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

interface AuthSplitLayoutProps {
  portalBadge: string;
  pillTag: string;
  eyebrow?: string;
  headlineMain: string;
  headlineHighlight: string;
  benefits: BenefitItem[];
  quote?: {
    text: string;
    caption: string;
  };
  children: React.ReactNode;
}

export function AuthSplitLayout({
  portalBadge,
  pillTag,
  eyebrow = "Holy Order Digital System",
  headlineMain,
  headlineHighlight,
  benefits,
  quote = {
    text: "“Let all things be done decently and in order.”",
    caption: "1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim",
  },
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-dvh bg-slate-950 font-sans text-slate-100 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Left Form Panel */}
      <main
        id="main"
        className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-6 sm:px-10 sm:py-8 lg:px-12"
      >
        {/* Ambient top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-blue-900/20 opacity-70 blur-3xl lg:hidden"
        />

        {/* Top Header Branding with Official Crest */}
        <div className="relative flex items-center gap-3.5">
          <Crest size={46} priority className="shadow-md ring-2 shadow-amber-950/40 ring-amber-400/80" />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-bold tracking-tight text-white">{siteConfig.name}</span>
            <span className="text-2xs font-semibold tracking-wider text-amber-400 uppercase">
              {portalBadge}
            </span>
          </div>
        </div>

        {/* Centered Form Area */}
        <div className="relative mx-auto flex w-full max-w-104 flex-1 flex-col justify-center py-8">
          {children}
        </div>

        {/* Footer info */}
        <p className="relative flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs font-medium text-slate-400">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          Your information is encrypted and kept private.
          <span aria-hidden>·</span> © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </main>

      {/* Right Side Panel with Official Web Hero Background & Glassmorphic Highlights */}
      <aside className="relative hidden overflow-hidden border-l border-slate-800 bg-slate-950 text-foreground lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Background Image from Web Brand */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/splash-bg.webp"
            alt="ESOCS Cathedral"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            className="scale-105 object-cover object-center opacity-30 contrast-125 saturate-110 filter"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/85 to-slate-950/45" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
        </div>

        {/* Slow-drifting ambient light */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/4 -left-1/4 size-[70%] animate-float rounded-full bg-blue-600/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1/4 -bottom-1/4 size-[60%] animate-float rounded-full bg-amber-500/15 blur-[120px] [animation-delay:-7s]"
        />

        {/* Header Tag Pill & Crest */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-slate-900 px-3.5 py-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
            <span className="size-2 animate-ping rounded-full bg-amber-400" />
            {pillTag}
          </div>
          <Crest size={52} className="ring-2 ring-amber-400/80" />
        </div>

        {/* Core Narrative & Feature Highlights */}
        <div className="relative z-10 my-auto grid max-w-lg gap-8 py-8">
          <div className="space-y-3">
            <span className="text-2xs font-bold tracking-widest text-amber-400 uppercase">{eyebrow}</span>
            <h2 className="font-brand text-4xl leading-[1.1] font-bold text-balance text-white xl:text-5xl">
              {headlineMain}{" "}
              <span className="bg-linear-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                {headlineHighlight}
              </span>
              .
            </h2>
          </div>

          <ul className="grid gap-3.5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.title}
                  className="flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-900 p-3.5 transition-all hover:border-amber-500/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/40">
                    <Icon className="size-5" />
                  </span>
                  <span className="grid gap-0.5">
                    <span className="text-sm font-bold text-white">{b.title}</span>
                    <span className="text-xs font-medium text-slate-200">{b.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Ecclesiastical Scripture Card */}
        {quote && (
          <figure className="relative z-10 grid gap-2 rounded-xl border border-slate-700 bg-slate-900 p-4 pt-5">
            <blockquote className="font-brand text-base font-medium text-white italic">
              {quote.text}
            </blockquote>
            <figcaption className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              {quote.caption}
            </figcaption>
          </figure>
        )}
      </aside>
    </div>
  );
}
