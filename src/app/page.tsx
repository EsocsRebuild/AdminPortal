"use client";

import * as React from "react";
import Link from "next/link";
import {
  Church,
  Globe,
  Award,
  Wallet,
  Building2,
  ArrowRight,
  Lock,
} from "lucide-react";

import { Crest } from "@/components/icons/logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-300">
      
      {/* Ambient Lighting & Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-linear-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (CONSISTENT WITH ORDINATION PORTAL)                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-6 backdrop-blur-md md:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <Crest
            size={42}
            priority
            className="ring-2 ring-amber-400/80 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-amber-300">
              THE ESOCS
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              Central Administration
            </span>
          </div>
        </Link>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin-web/dashboard"
            className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-700 hover:text-white sm:flex"
          >
            <Globe className="size-3.5 text-emerald-400" />
            <span>Web Content Studio</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-200 transition-all hover:border-slate-700 hover:text-white"
          >
            <Lock className="size-3.5" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-yellow-500 px-5 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Enter Portal</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. STATELY HERO SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-16 pb-20 text-center md:px-12 md:pt-24 md:pb-28">
        
        {/* Eyebrow Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 shadow-sm">
          <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono font-extrabold tracking-widest text-amber-300 uppercase">
            EST. 1925 &bull; ESOCS CENTRAL ADMINISTRATION WORLDWIDE
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl font-brand text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
          The Central Administration & <br className="hidden sm:inline" />
          <span className="italic text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-400 to-yellow-500 font-normal">
            Secretariat Platform
          </span>
        </h1>

        {/* Concise Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-normal">
          The centralized executive portal for ecclesiastical governance, holy order ordination vetting,
          financial stewardship, and digital church records worldwide.
        </p>

        {/* Primary Action Buttons */}
        <div className="mx-auto mt-9 flex max-w-md flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-yellow-500 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 sm:w-auto"
          >
            <Church className="size-4" />
            <span>Enter Administration Portal</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/admin-web/dashboard"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 transition-all hover:border-amber-400 hover:text-white sm:w-auto"
          >
            <Globe className="size-4 text-emerald-400" />
            <span>Web Content Studio</span>
          </Link>
        </div>

        {/* Conference / System Status Badge */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-400 shadow-sm">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-200">Central Secretariat Command</span>
          <span className="text-slate-600">&bull;</span>
          <span>Version 2.0 Active</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE GOVERNANCE MODULES (CLEAN 4-CARD GRID)                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-y border-slate-800/80 bg-slate-900/40 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              Core Secretariat Modules
            </span>
            <h2 className="mt-1 font-brand text-2xl sm:text-3xl font-extrabold text-white">
              Unified Ecclesiastical Operations
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Access the four primary administrative directorates from a single secure gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Ordination Directorate */}
            <Link
              href="/ordination"
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition-all hover:-translate-y-1 hover:border-amber-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Ordination Directorate
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Review candidate dossiers across 5 vetting stages, manage examination scores, and ratify Synod elevations.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-3 border-t border-slate-800/80">
                <span>Manage Ordinations</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 2: Parish & Member Registry */}
            <Link
              href="/members"
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10 text-blue-400 transition-transform group-hover:scale-110">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    Parish & Member Registry
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Access church directory across 1,200+ parishes, manage membership numbers, and coordinate provincial structures.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-400 pt-3 border-t border-slate-800/80">
                <span>Open Member Registry</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 3: Financial Stewardship */}
            <Link
              href="/giving"
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 transition-transform group-hover:scale-110">
                  <Wallet className="size-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Stewardship Ledgers
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Reconcile statutory ordination dues, branch remittances, and tithe batches with instant audit verification.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-3 border-t border-slate-800/80">
                <span>View Ledgers</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 4: Web Content Studio */}
            <Link
              href="/admin-web/dashboard"
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-400/10 text-purple-400 transition-transform group-hover:scale-110">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h3 className="font-brand text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    Web Content Studio
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Publish church bulletins, manage General Conference media galleries, and coordinate public livestreams.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-purple-400 pt-3 border-t border-slate-800/80">
                <span>Launch Web Studio</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>

        </div>
      </section>



      {/* ========================================================================= */}
      {/* 5. MINIMALIST EXECUTIVE FOOTER                                            */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-6 text-xs text-slate-400 md:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <Crest size={32} priority className="ring-1 ring-amber-400/80" />
              <div className="flex flex-col">
                <span className="font-brand font-extrabold text-sm text-white">THE ESOCS ADMINISTRATION</span>
                <span className="text-[10px] text-amber-400 font-mono">Central Secretariat</span>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/ordination" className="hover:text-amber-400 transition-colors">
                Ordination Vetting
              </Link>
              <Link href="/admin-web/dashboard" className="hover:text-amber-400 transition-colors">
                Web Studio
              </Link>
              <Link href="/login" className="hover:text-amber-400 transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} The Eternal Sacred Order of the Cherubim & Seraphim. All rights reserved.
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="italic text-slate-400 font-serif">“Let all things be done decently and in order.”</span>
              <span>&bull;</span>
              <span>1 Cor 14:40</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
