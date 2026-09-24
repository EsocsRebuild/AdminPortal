import { Quote } from "lucide-react";

import { LogoMark } from "@/components/icons/logo";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <main id="main" className="flex flex-col px-gutter py-8">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-brand text-xl font-semibold tracking-wide">{siteConfig.name}</span>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</div>
        <p className="text-center text-xs text-subtle-foreground">
          © {new Date().getFullYear()} {siteConfig.fullName}
        </p>
      </main>

      <aside className="dark relative hidden overflow-hidden bg-royal-950 p-12 text-foreground lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden className="absolute inset-0 bg-aurora" />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid mask-radial-from-0% mask-radial-to-80% mask-radial-at-top-right opacity-40"
        />
        <svg
          aria-hidden
          viewBox="0 0 32 32"
          className="absolute -top-24 -right-24 size-[34rem] text-gold-400/[0.06]"
        >
          <path d="M14.6 4h2.8v7.6h7.6v2.8h-7.6V28h-2.8V14.4H7v-2.8h7.6z" fill="currentColor" />
        </svg>
        <figure className="relative grid max-w-lg gap-6">
          <Quote className="size-8 text-gold-400" />
          <blockquote className="font-brand text-4xl leading-tight font-medium text-balance">
            Let all things be done decently and in order.
          </blockquote>
          <figcaption className="text-overline font-semibold text-gold-300 uppercase">
            1 Corinthians 14:40
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
