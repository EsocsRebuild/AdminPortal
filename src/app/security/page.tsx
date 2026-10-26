import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, KeyRound, Server, Eye } from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { LandingFooter } from "@/components/layout/landing-footer";

export const metadata: Metadata = {
  title: "Security Protocols & Architecture · ESOCS Central Secretariat",
  description:
    "Security architecture, encryption standards, and clerical audit enforcement for the Central Administration Portal of the Eternal Sacred Order of the Cherubim & Seraphim.",
};

export default function SecurityProtocolPage() {
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
            <Shield className="size-3.5" />
            <span>Secured Ecclesiastical Infrastructure</span>
          </div>
          <h1 className="mt-4 font-brand text-3xl font-black tracking-tight text-white sm:text-4xl">
            Secretariat Security Protocols & Safeguards
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Cryptographic standards, immutable audit trails, and multi-factor defense systems &bull; Worldwide
            Deployment
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 font-brand text-lg font-bold text-white">
              <KeyRound className="size-5 text-amber-400" />
              Multi-Factor Clergy Authentication
            </h2>
            <p className="mt-3 text-slate-300">
              Access to administrative actions, ordination vetting scorecards, and financial ledger
              reconciliation requires strict multi-factor authentication (MFA) via time-based one-time
              passwords (TOTP) or authenticated mobile push confirmations.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 font-brand text-lg font-bold text-white">
              <Eye className="size-5 text-amber-400" />
              Immutable Ecclesiastical Audit Logs
            </h2>
            <p className="mt-3 text-slate-300">
              Every status change across candidate vetting (from District Nomination to Synod Ratification) is
              recorded with timestamped, actor-bound audit log entries. Audit records are tamper-resistant and
              cannot be cleared or modified retroactively.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800/80 bg-[#0c1222]/80 p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 font-brand text-lg font-bold text-white">
              <Server className="size-5 text-amber-400" />
              Encrypted Channel & Session Protection
            </h2>
            <p className="mt-3 text-slate-300">
              All data transmitted to and from the Central Administration Portal is secured with TLS 1.3
              encryption, HTTP Strict Transport Security (HSTS), and partitioned session cookies bound to
              unique client footprints.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
