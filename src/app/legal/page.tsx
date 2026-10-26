import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, AlertCircle, CheckCircle2 } from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { LandingFooter } from "@/components/layout/landing-footer";

export const metadata: Metadata = {
  title: "Terms of Governance & Service · ESOCS Central Secretariat",
  description:
    "Official ecclesiastical terms of digital governance, canon adherence, and authorized clerical portal use for the Eternal Sacred Order of the Cherubim & Seraphim Worldwide.",
};

export default function LegalGovernancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#070b14] font-sans text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-linear-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-25" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#070b14]/95 px-4 backdrop-blur-md sm:h-20 sm:px-8 md:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <Crest
            size={38}
            priority
            className="ring-2 ring-amber-400/80 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-brand text-sm font-extrabold tracking-tight text-white transition-colors group-hover:text-amber-300 sm:text-base">
              THE ESOCS
            </span>
            <span className="font-mono text-[9px] font-bold tracking-widest text-amber-400 uppercase sm:text-[10px]">
              Central Administration
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0c1222] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Portal</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
          >
            Clergy Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber-400 uppercase">
            <Scale className="size-3.5" />
            <span>Ecclesiastical Governance Charter</span>
          </div>
          <h1 className="mt-4 font-brand text-3xl font-black tracking-tight text-white sm:text-4xl">
            Terms of Ecclesiastical Governance & Service
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Promulgated by the Advisory Board & Central Secretariat &bull;{" "}
            <span className="font-mono text-slate-300">2026 Edition</span> &bull; Applicable Worldwide
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">01.</span>
              Authority & Canonical Standing
            </h2>
            <p className="mt-3 text-slate-300">
              The Central Secretariat platform is an official ecclesiastical tool operated under the sovereign
              canonical authority of the Supreme Head (Baba Aladura) and the Advisory Board of The Eternal
              Sacred Order of the Cherubim & Seraphim. Use of this platform is restricted to authorized
              clergy, vetted secretariat officers, provincial coordinators, and designated parish
              administrators.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">02.</span>
              Clerical Oath & Digital Integrity
            </h2>
            <p className="mt-3 text-slate-300">
              Every officer logging into this platform covenants by ministerial oath that:
            </p>
            <ul className="mt-4 space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  All ordination candidate appraisals, exam scores, and background vetting notes are
                  truthfully and objectively recorded without bias or favor.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  Parish financial ledgers and statutory remittance numbers submitted via the portal
                  faithfully reflect the physical bank transfers and audit dockets of the branch.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  Credentials, MFA devices, and temporary session keys shall remain strictly personal and
                  never shared with unauthorized individuals.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">03.</span>
              Prohibited Conduct & Sanctions
            </h2>
            <div className="mt-3 flex items-start gap-3 rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-xs text-red-200">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <p>
                Any falsification of ordination records, unauthorized rank alteration, fabrication of dues
                receipts, or extraction of church registry lists for commercial solicitation constitutes gross
                canonical misconduct and will lead to immediate revocation of portal access, referral to the
                Disciplinary Tribunal, and civil reporting where applicable.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">04.</span>
              Intellectual Property & Liturgical Assets
            </h2>
            <p className="mt-3 text-slate-300">
              The Holy Order crest, the ESOCS brand mark, liturgical manuals, hymn compositions, Synod
              resolutions, and publication materials remain the exclusive intellectual property of The Eternal
              Sacred Order of the Cherubim & Seraphim Worldwide.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
