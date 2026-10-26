import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { LandingFooter } from "@/components/layout/landing-footer";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy · ESOCS Central Secretariat",
  description:
    "Official ecclesiastical data privacy, protection, and record governance policy for the Eternal Sacred Order of the Cherubim & Seraphim Worldwide.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="size-3.5" />
            <span>Ecclesiastical Data Protection Standard</span>
          </div>
          <h1 className="mt-4 font-brand text-3xl font-black tracking-tight text-white sm:text-4xl">
            Privacy & Data Protection Policy
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Last Ratified by the Central Secretariat:{" "}
            <span className="font-mono text-slate-300">October 2026</span> &bull; Worldwide Ecclesiastical
            Jurisdiction
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">01.</span>
              Preamble & Sovereign Stewardship
            </h2>
            <p className="mt-3 text-slate-300">
              The Eternal Sacred Order of the Cherubim & Seraphim (ESOCS Worldwide) is committed to preserving
              the sanctity, confidentiality, and integrity of all digital records entrusted to the Church.
              This Privacy Policy governs the collection, processing, storage, and transmission of clerical,
              member, financial, and sacramental data across all ecclesiastical provinces, districts, and
              parishes globally.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">02.</span>
              Scope of Data Collection
            </h2>
            <p className="mt-3 text-slate-300">
              The Central Secretariat administers systems that collect and maintain only the essential data
              necessary for canonical governance and church life:
            </p>
            <ul className="mt-4 space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  <strong className="text-white">Ordination & Vetting Dossiers:</strong> Candidate
                  identification, ministerial rank progression history, theological examination evaluations,
                  sponsor attestations, and Advisory Board recommendations.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  <strong className="text-white">Parish Registry Data:</strong> Member enrollment records,
                  baptismal records, Holy Order seniority numbers, and jurisdictional contact references.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  <strong className="text-white">Stewardship & Financial Audits:</strong> Remittance batch
                  reconciliations, statutory dues verification, and branch reporting ledger entries (excluding
                  raw card numbers or private banking credentials).
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">03.</span>
              Role-Based Access Control (RBAC)
            </h2>
            <p className="mt-3 text-slate-300">
              Access to personal member dossiers and vetting files is strictly partitioned by ecclesiastical
              jurisdiction. An ordained officer or administrator in one province or parish has zero
              authorization to view records outside their ratified canonical assignment. Every read,
              modification, and export action is permanently cryptographically logged in the Central Audit
              Log.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">04.</span>
              Data Retention & Archival Canon
            </h2>
            <p className="mt-3 text-slate-300">
              Sacramental ordinations and historical rolls of the Holy Order are preserved in perpetuity as
              living church history. Temporary operational tokens, session cookies, and ephemeral inquiry
              submissions are systematically purged in accordance with our data-minimization schedule.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-brand text-lg font-bold text-white">
              <span className="font-mono text-xs font-bold text-amber-400">05.</span>
              Inquiries & Data Rectification
            </h2>
            <p className="mt-3 text-slate-300">
              Members seeking verification of church registry details or ordination certificate records may
              submit a formal inquiry via their Parish Supervising Officer or directly to the Central
              Secretariat through the Secretariat portal.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-800/80 pt-4 text-xs">
              <span className="text-slate-400">Office:</span>
              <span className="text-slate-200">The Central Secretariat, ESOCS Worldwide</span>
              <span className="text-slate-700">&bull;</span>
              <span className="text-slate-400">Channel:</span>
              <Link
                href="/forms"
                className="font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
              >
                Submit Official Secretariat Inquiry
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
