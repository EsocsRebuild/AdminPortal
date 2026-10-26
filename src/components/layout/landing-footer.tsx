import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Globe2 } from "lucide-react";

import { Crest } from "@/components/icons/logo";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-slate-800 bg-[#050811] text-xs text-slate-400">
      {/* Subtle top ambient separator */}
      <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Secretariat Identity (2 cols on large screens) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <Crest
                size={36}
                priority
                className="ring-1 ring-amber-400/80 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col text-left">
                <span className="font-brand text-xs font-extrabold tracking-tight text-white transition-colors group-hover:text-amber-300 sm:text-sm">
                  THE ETERNAL SACRED ORDER OF THE CHERUBIM & SERAPHIM
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  Central Secretariat & Administration Worldwide
                </span>
              </div>
            </Link>

            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              The apex executive platform for ecclesiastical governance, holy order ordination vetting, parish
              directory synchronization, diocesan stewardship, and global digital communications worldwide.
            </p>

            {/* Gateway Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-[#0c1222] px-3 py-1 text-[11px] font-medium text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Central Secretariat Gateway • Operational</span>
            </div>
          </div>

          {/* Column 1: Governance & Portals */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
              Ecclesiastical Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-amber-400">
                  Central Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ordination" className="transition-colors hover:text-amber-400">
                  Ordination Directorate
                </Link>
              </li>
              <li>
                <Link href="/members" className="transition-colors hover:text-amber-400">
                  Parishes & Registry
                </Link>
              </li>
              <li>
                <Link href="/giving" className="transition-colors hover:text-amber-400">
                  Church Stewardship
                </Link>
              </li>
              <li>
                <Link href="/audit-log" className="transition-colors hover:text-amber-400">
                  Audit Trail
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Communications & Studio */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
              Communications
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/admin-web/dashboard" className="transition-colors hover:text-amber-400">
                  Web Content Studio
                </Link>
              </li>
              <li>
                <Link href="/admin-web/programmes" className="transition-colors hover:text-amber-400">
                  Programmes & Sermons
                </Link>
              </li>
              <li>
                <Link href="/admin-web/media" className="transition-colors hover:text-amber-400">
                  Media Library
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition-colors hover:text-amber-400">
                  Ecclesiastical Events
                </Link>
              </li>
              <li>
                <Link href="/forms" className="transition-colors hover:text-amber-400">
                  Digital Forms & Surveys
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance Standards */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
              Governance & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400"
                >
                  <ShieldCheck className="size-3 text-amber-400/80" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400"
                >
                  <Lock className="size-3 text-amber-400/80" />
                  <span>Terms of Governance</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400"
                >
                  <Globe2 className="size-3 text-amber-400/80" />
                  <span>Security Protocols</span>
                </Link>
              </li>
              <li>
                <Link href="/settings/security" className="transition-colors hover:text-amber-400">
                  Access Safeguards
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-amber-400">
                  Authorized Clergy Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-[11px] text-slate-500 sm:flex-row">
          <div>
            &copy; {currentYear} The Eternal Sacred Order of the Cherubim & Seraphim. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/legal" className="transition-colors hover:text-slate-300">
              Terms of Governance
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/security" className="transition-colors hover:text-slate-300">
              Security Protocol
            </Link>
            <span className="text-slate-700">&bull;</span>
            <span className="font-mono text-slate-400">Central Secretariat Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
