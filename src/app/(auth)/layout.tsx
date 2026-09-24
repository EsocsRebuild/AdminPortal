import { CalendarHeart, HandCoins, ShieldCheck, UsersRound } from "lucide-react";

import { LogoMark } from "@/components/icons/logo";
import { siteConfig } from "@/config/site";

const benefits = [
  {
    icon: UsersRound,
    title: "Every member in one place",
    text: "Find anyone in seconds, across every parish.",
  },
  { icon: HandCoins, title: "Giving you can trust", text: "Tithes and offerings, reconciled and clear." },
  {
    icon: CalendarHeart,
    title: "Events without the stress",
    text: "Plan services and share them with one click.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <main id="main" className="relative flex flex-col overflow-hidden px-gutter py-6 sm:py-8">
        {/* Soft glow behind the form on small screens */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-aurora opacity-70 lg:hidden"
        />

        <div className="relative flex items-center gap-2.5">
          <LogoMark />
          <span className="font-brand text-xl font-semibold tracking-wide">{siteConfig.name}</span>
        </div>

        <div className="relative mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-10">
          {children}
        </div>

        <p className="relative flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-subtle-foreground">
          <ShieldCheck className="size-3.5" /> Your information is encrypted and kept private.
          <span aria-hidden>·</span> © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </main>

      <aside className="dark relative hidden overflow-hidden bg-royal-950 text-foreground lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Slow-drifting light */}
        <div
          aria-hidden
          className="absolute -top-1/4 -left-1/4 size-[70%] animate-float rounded-full bg-royal-500/35 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -right-1/4 -bottom-1/4 size-[60%] animate-float rounded-full bg-gold-500/20 blur-[120px] [animation-delay:-7s]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid mask-radial-from-0% mask-radial-to-75% opacity-[0.12]"
        />

        <div className="relative flex items-center gap-2 text-sm text-royal-200">
          <span className="size-1.5 animate-pulse-ring rounded-full bg-gold-400 text-gold-400" />
          Administration portal
        </div>

        <div className="relative grid max-w-md gap-10">
          <h2 className="font-brand text-5xl leading-[1.05] font-medium text-balance text-white">
            One calm place to care for your <span className="text-gold-gradient">church</span>.
          </h2>
          <ul className="grid gap-5">
            {benefits.map((b, i) => (
              <li
                key={b.title}
                className="flex animate-rise-in gap-4"
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-card bg-white/[0.07] text-gold-300 ring-1 ring-white/10 backdrop-blur">
                  <b.icon className="size-5" />
                </span>
                <span className="grid gap-0.5">
                  <span className="font-medium text-white">{b.title}</span>
                  <span className="text-sm text-royal-200">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative grid gap-2 border-t border-white/10 pt-6">
          <blockquote className="font-brand text-xl text-royal-100 italic">
            “Let all things be done decently and in order.”
          </blockquote>
          <figcaption className="text-overline font-semibold text-gold-300 uppercase">
            1 Corinthians 14:40
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
