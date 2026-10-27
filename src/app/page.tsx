"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Church, Globe, ArrowRight, Lock } from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { LandingFooter } from "@/components/layout/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#070b14] font-sans text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient Lighting & Sacred Aura (Matching Ordination Portal) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Golden Central Aura */}
        <div className="absolute top-[-15%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-linear-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-[140px]" />
        {/* Soft Secondary Ambient Glow */}
        <div className="absolute right-[-10%] bottom-[-10%] h-125 w-125 rounded-full bg-blue-500/5 blur-[120px]" />
        {/* Architectural Subtle Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-25" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (CLEAN, STATELY & ALIGNED WITH ORDINATION PORTAL)          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#070b14]/95 px-4 backdrop-blur-md sm:h-20 sm:px-8 md:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <Crest
            size={40}
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

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/admin-web/dashboard"
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 text-xs font-semibold whitespace-nowrap text-slate-200 shadow-sm transition-all hover:border-amber-500 hover:text-white active:scale-95 sm:inline-flex"
          >
            <Globe className="size-3.5 text-amber-400" />
            <span>Web Content Studio</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 text-xs font-semibold whitespace-nowrap text-slate-300 shadow-sm transition-all hover:border-slate-700 hover:text-white active:scale-95"
          >
            <Lock className="size-3.5" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-500 px-4 text-xs font-bold whitespace-nowrap text-slate-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95"
          >
            <span>Enter Portal</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. STATELY HERO SECTION (DIRECT, HIGH-END & CONCISE)                      */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 shadow-sm"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
          <span className="font-mono text-[10px] font-extrabold tracking-widest text-amber-300 uppercase sm:text-[11px]">
            EST. 1925 &bull; ESOCS HOLY ORDER WORLDWIDE
          </span>
        </motion.div>

        {/* Stately Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl font-brand text-3xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px]"
        >
          The Central Administration & <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text font-normal text-transparent italic">
            Governance Platform
          </span>
        </motion.h1>

        {/* Clear, Human, Direct Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm md:text-base"
        >
          The official executive portal for church leadership, ordination candidate screening, parish
          registries, and financial stewardship worldwide.
        </motion.p>

        {/* Primary Action Buttons (Tactile, Proportional, Matching Ordination Portal) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-3.5"
        >
          <Link
            href="/dashboard"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-600/20 bg-amber-500 px-6 text-xs font-bold tracking-wide whitespace-nowrap text-slate-950 shadow-sm transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] sm:h-12 sm:w-auto sm:px-7 sm:text-sm"
          >
            <Church className="size-4" />
            <span>Enter Administration Portal</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/admin-web/dashboard"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 text-xs font-semibold tracking-wide whitespace-nowrap text-slate-200 shadow-sm transition-all hover:border-amber-500/60 hover:text-white active:scale-[0.98] sm:h-12 sm:w-auto sm:px-7 sm:text-sm"
          >
            <Globe className="size-4 text-amber-400" />
            <span>Web Content Studio</span>
          </Link>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SCRIPTURAL SEAL & EXECUTIVE AUTHORITY                                  */}
      {/* ========================================================================= */}
      <section className="relative z-10 px-4 pb-16 text-center sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-[#0c1222]/80 p-6 shadow-sm sm:p-8">
          <Crest size={48} priority className="mx-auto mb-4 text-amber-400" />
          <blockquote className="font-serif text-base text-slate-200 italic sm:text-lg">
            “Let all things be done decently and in order.”
          </blockquote>
          <p className="mt-2 font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">
            1 Corinthians 14:40 &bull; Central Secretariat Worldwide
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STATELY EXECUTIVE FOOTER (LEGAL, GOVERNANCE & PRIVACY)                 */}
      {/* ========================================================================= */}
      <LandingFooter />
    </div>
  );
}
