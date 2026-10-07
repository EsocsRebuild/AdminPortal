import Image from "next/image";
import { CalendarHeart, HandCoins, ShieldCheck, UsersRound, Award } from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { siteConfig } from "@/config/site";

const benefits = [
  {
    icon: UsersRound,
    title: "Every member in one place",
    text: "Find anyone in seconds, across every parish, district, and province.",
  },
  {
    icon: HandCoins,
    title: "Giving you can trust",
    text: "Tithes and offerings, reconciled with bank-grade auditability.",
  },
  {
    icon: CalendarHeart,
    title: "Events & Services without stress",
    text: "Plan ecclesiastical services and publish to the web with one click.",
  },
  {
    icon: Award,
    title: "Ordination Vetting Pipeline",
    text: "4-stage candidate tracking from Parish to Supreme Council approval.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <main id="main" className="relative flex flex-col overflow-hidden px-gutter py-6 sm:py-8 bg-slate-950 text-slate-100">
        {/* Ambient aurora glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-royal-700/20 blur-3xl opacity-70 lg:hidden"
        />

        {/* Top Header Branding with Official Crest */}
        <div className="relative flex items-center gap-3.5">
          <Crest size={46} priority className="ring-2 ring-amber-400/80 shadow-md shadow-amber-950/40" />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-bold tracking-tight text-white">{siteConfig.name}</span>
            <span className="text-2xs font-semibold tracking-wider text-amber-400 uppercase">Main Governance Portal</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-10">
          {children}
        </div>

        {/* Footer info */}
        <p className="relative flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs font-medium text-slate-300">
          <ShieldCheck className="size-3.5 text-emerald-400" /> Your information is encrypted and kept private.
          <span aria-hidden>·</span> © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </main>

      {/* Right Side Panel with Official Web Hero Background & Glassmorphic Highlights */}
      <aside className="relative hidden overflow-hidden bg-slate-950 text-foreground lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16 border-l border-slate-800">
        {/* Background Image from Web Repo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/hero-mount-zion.webp"
            alt="ESOCS Cathedral"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 filter contrast-125 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
        </div>

        {/* Slow-drifting ambient light */}
        <div
          aria-hidden
          className="absolute -top-1/4 -left-1/4 size-[70%] animate-float rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -right-1/4 -bottom-1/4 size-[60%] animate-float rounded-full bg-amber-500/15 blur-[120px] [animation-delay:-7s] pointer-events-none"
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-slate-900/90 border border-amber-400/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md">
            <span className="size-2 animate-ping rounded-full bg-amber-400" />
            Ecclesiastical Administration
          </div>
          <Crest size={52} className="ring-2 ring-amber-400/80 shadow-xl shadow-amber-950/60" />
        </div>

        <div className="relative z-10 grid max-w-lg gap-8 my-auto py-8">
          <div className="space-y-3">
            <span className="text-2xs font-bold uppercase tracking-widest text-amber-400">Holy Order Digital System</span>
            <h2 className="font-brand text-4xl xl:text-5xl leading-[1.1] font-bold text-balance text-white">
              One calm place to care for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">church</span>.
            </h2>
          </div>

          <ul className="grid gap-4">
            {benefits.map((b) => (
              <li
                key={b.title}
                className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-slate-900/95"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/40">
                  <b.icon className="size-5" />
                </span>
                <span className="grid gap-0.5">
                  <span className="font-bold text-white text-sm">{b.title}</span>
                  <span className="text-xs font-medium text-slate-200">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative z-10 grid gap-2 border-t border-slate-700/80 pt-6 bg-slate-900/80 p-4 rounded-xl backdrop-blur-md border border-slate-700/60">
          <blockquote className="font-brand text-lg text-white font-medium italic">
            “Let all things be done decently and in order.”
          </blockquote>
          <figcaption className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
