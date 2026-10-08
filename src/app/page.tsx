"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Church,
  Globe,
  ShieldCheck,
  Award,
  UsersRound,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Wallet,
  CalendarDays,
  Video,
  Activity,
  Check,
  Building2,
  Scale,
} from "lucide-react";

import { Crest } from "@/components/icons/logo";
import { AppSplashLoader } from "@/components/ui/app-splash-loader";

export default function LandingPage() {
  const [activePortalTab, setActivePortalTab] = React.useState<"main" | "web">("main");
  const [vettedCount, setVettedCount] = React.useState(148);

  const handleQuickApprove = () => {
    setVettedCount((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100 selection:bg-amber-500/30 selection:text-amber-300">
      {/* App Splash Loader on initial load */}
      <AppSplashLoader />

      {/* Ambient Aurora Background Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 size-250 -translate-x-1/2 animate-pulse rounded-full bg-linear-to-b from-amber-500/10 via-royal-600/10 to-transparent opacity-70 blur-[140px]" />
        <div className="absolute top-[30%] left-[-10%] size-150 rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-[65%] right-[-10%] size-175 rounded-full bg-amber-500/5 blur-[140px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-2xl md:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <Crest
            size={44}
            priority
            className="shadow-xl ring-2 shadow-amber-950/60 ring-amber-400/80 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-amber-300">
              THE ESOCS
            </span>
            <span className="text-2xs font-bold tracking-widest text-amber-400 uppercase">
              Administration Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 text-xs font-semibold tracking-wide text-slate-300 md:flex">
          <a href="#dual-portals" className="transition-colors hover:text-amber-400">
            Dual Ecosystem
          </a>
          <a href="#governance" className="transition-colors hover:text-amber-400">
            Governance & Ordination
          </a>
          <a href="#web-studio" className="transition-colors hover:text-amber-400">
            Web Content Studio
          </a>
          <a href="#security" className="transition-colors hover:text-amber-400">
            Security & Audit
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-slate-700/80 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:flex"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full bg-linear-to-r from-amber-400 via-amber-500 to-yellow-500 px-5 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40 active:scale-95"
          >
            <span>Enter Portal</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center md:px-12 md:pt-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 shadow-inner backdrop-blur-xl"
        >
          <Sparkles className="size-4 animate-pulse text-amber-400" />
          <span className="text-2xs font-extrabold tracking-widest text-amber-300 uppercase">
            Official Ecclesiastical Platform · Version 2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-5xl font-brand text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          The Unified Digital Ecosystem for{" "}
          <span className="bg-linear-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Ecclesiastical Governance
          </span>{" "}
          & World-Class{" "}
          <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Web Content
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl text-base leading-relaxed font-medium text-slate-300 sm:text-lg md:text-xl"
        >
          Powering the Eternal Sacred Order of the Cherubim & Seraphim worldwide across every parish, Holy
          Order ordination candidate pipeline, financial ledger, and public web presence.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-yellow-500 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/45 sm:w-auto"
          >
            <Church className="size-4 text-slate-950" />
            <span>Main Church Admin</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/admin-web/dashboard"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3.5 text-sm font-extrabold text-emerald-400 backdrop-blur-xl transition-all hover:scale-105 hover:border-emerald-500/60 hover:bg-emerald-500/20 sm:w-auto"
          >
            <Globe className="size-4 text-emerald-400" />
            <span>Web Content Studio</span>
          </Link>
        </motion.div>

        {/* Real-time Global Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-2xl md:grid-cols-4"
        >
          <div className="flex flex-col items-center border-r border-slate-800/80 p-3 last:border-0">
            <div className="mb-1 flex items-center gap-1.5 text-amber-400">
              <Building2 className="size-4" />
              <span className="text-2xs font-extrabold tracking-widest uppercase">Global Reach</span>
            </div>
            <span className="font-brand text-3xl font-extrabold text-white md:text-4xl">1,200+</span>
            <span className="mt-1 text-2xs font-semibold text-slate-400">Parishes & Dioceses</span>
          </div>

          <div className="flex flex-col items-center border-r border-slate-800/80 p-3 last:border-0">
            <div className="mb-1 flex items-center gap-1.5 text-amber-400">
              <UsersRound className="size-4" />
              <span className="text-2xs font-extrabold tracking-widest uppercase">Congregation</span>
            </div>
            <span className="font-brand text-3xl font-extrabold text-white md:text-4xl">450,000+</span>
            <span className="mt-1 text-2xs font-semibold text-slate-400">Enrolled Members</span>
          </div>

          <div className="flex flex-col items-center border-r border-slate-800/80 p-3 last:border-0">
            <div className="mb-1 flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="size-4" />
              <span className="text-2xs font-extrabold tracking-widest uppercase">Audit Trail</span>
            </div>
            <span className="font-brand text-3xl font-extrabold text-white md:text-4xl">100%</span>
            <span className="mt-1 text-2xs font-semibold text-slate-400">Traceable Headers</span>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="mb-1 flex items-center gap-1.5 text-emerald-400">
              <Activity className="size-4" />
              <span className="text-2xs font-extrabold tracking-widest uppercase">Performance</span>
            </div>
            <span className="font-brand text-3xl font-extrabold text-white md:text-4xl">&lt; 45ms</span>
            <span className="mt-1 text-2xs font-semibold text-slate-400">Query Latency</span>
          </div>
        </motion.div>
      </section>

      {/* Interactive Dual-Portal Interactive Switcher Section */}
      <section
        id="dual-portals"
        className="relative z-10 border-y border-slate-800/80 bg-slate-900/40 px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-2 block text-2xs font-extrabold tracking-widest text-amber-400 uppercase">
              Dual Ecosystem Architecture
            </span>
            <h2 className="font-brand text-3xl font-extrabold text-white md:text-5xl">
              Two Tailored Environments. One Core System.
            </h2>
            <p className="mt-4 text-base font-medium text-slate-300">
              Toggle below to experience how ESOCS separates high-security ecclesiastical governance from
              public web content publishing.
            </p>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-full border border-slate-800 bg-slate-950 p-1.5 shadow-2xl">
              <button
                onClick={() => setActivePortalTab("main")}
                className={`flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-extrabold transition-all ${
                  activePortalTab === "main"
                    ? "bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Church className="size-4" />
                <span>Main Church Governance Admin</span>
              </button>

              <button
                onClick={() => setActivePortalTab("web")}
                className={`flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-extrabold transition-all ${
                  activePortalTab === "web"
                    ? "bg-linear-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="size-4" />
                <span>Web Content & Media Studio</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <AnimatePresence mode="wait">
            {activePortalTab === "main" ? (
              <motion.div
                key="main-portal-preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-amber-500/30 bg-slate-950 p-6 shadow-[0_0_80px_rgba(251,191,36,0.12)] md:p-8"
              >
                {/* Header Mock */}
                <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5 text-amber-400">
                      <Church className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-brand text-xl font-extrabold text-white">
                        Main Church Governance Admin
                      </h3>
                      <p className="text-xs font-medium text-amber-400">
                        Scoped Unit: Mount Zion Parish (HQ) · X-Portal-Type: admin-main
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/20 px-4 py-2 text-xs font-bold text-amber-300 transition-all hover:bg-amber-400/30"
                  >
                    <span>Launch Main Admin Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* Grid Live Cards */}
                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
                  {/* Card 1: Ordination Candidate Vetting */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-amber-400 uppercase">
                        Ordination Pipeline
                      </span>
                      <Award className="size-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Senior Apostle Candidate</h4>
                      <p className="text-2xs text-slate-400">Candidate ID: ORD-2026-889</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-2xs font-bold text-slate-300">
                        <span>Vetting Progress</span>
                        <span className="text-amber-400">Stage 4 of 5 (80%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950 p-0.5">
                        <div className="h-full w-[80%] rounded-full bg-linear-to-r from-amber-500 to-yellow-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-2xs">
                      <span className="text-slate-400">Recommendation</span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-extrabold text-emerald-400">
                        Approved by Synod
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Live Parish Headcount */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-blue-400 uppercase">
                        Live Headcount
                      </span>
                      <Activity className="size-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-mono text-3xl font-extrabold text-white">1,482</h4>
                      <p className="text-2xs text-slate-400">Sunday Service · Mount Zion Cathedral</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-2xs">
                      <div className="rounded border border-slate-800 bg-slate-950 p-2">
                        <span className="block text-slate-400">Male</span>
                        <span className="font-extrabold text-white">620</span>
                      </div>
                      <div className="rounded border border-slate-800 bg-slate-950 p-2">
                        <span className="block text-slate-400">Female</span>
                        <span className="font-extrabold text-white">710</span>
                      </div>
                      <div className="rounded border border-slate-800 bg-slate-950 p-2">
                        <span className="block text-slate-400">Children</span>
                        <span className="font-extrabold text-amber-400">152</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Financial Tithes Ledger */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-emerald-400 uppercase">
                        Stewardship Ledger
                      </span>
                      <Wallet className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-mono text-2xl font-extrabold text-white">₦ 4,850,000</h4>
                      <p className="text-2xs text-slate-400">Monthly Reconciled Tithes & Offerings</p>
                    </div>
                    <div className="space-y-2 pt-1 text-2xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Parish Batch #804</span>
                        <span className="font-bold text-emerald-400">Verified</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Audit Status</span>
                        <span className="font-bold text-amber-400">100% Traceable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="web-portal-preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-emerald-500/30 bg-slate-950 p-6 shadow-[0_0_80px_rgba(16,185,129,0.12)] md:p-8"
              >
                {/* Header Mock */}
                <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2.5 text-emerald-400">
                      <Globe className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-brand text-xl font-extrabold text-white">
                        Web Content & Media Studio
                      </h3>
                      <p className="text-xs font-medium text-emerald-400">
                        Content Studio · X-Portal-Type: admin-web
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin-web/dashboard"
                    className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/20 px-4 py-2 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-400/30"
                  >
                    <span>Launch Web Content Studio</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* Grid Live Cards */}
                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
                  {/* Card 1: Interactive Super Vetting Queue */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-emerald-400 uppercase">
                        Super Vetting Queue
                      </span>
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Surulere Parish Bulletin</h4>
                      <p className="text-2xs text-slate-400">Submitted by Media Team · 10 mins ago</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-2xs font-semibold text-slate-300">Total Approved Items</span>
                      <span className="font-mono text-base font-extrabold text-emerald-400">
                        {vettedCount}
                      </span>
                    </div>
                    <button
                      onClick={handleQuickApprove}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-xs font-extrabold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
                    >
                      <Check className="size-3.5" />
                      <span>Test 1-Click Approve Submission</span>
                    </button>
                  </div>

                  {/* Card 2: High-Res Media Gallery */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-amber-400 uppercase">
                        Media Vault
                      </span>
                      <Video className="size-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Annual General Conference Video</h4>
                      <p className="text-2xs text-slate-400">4K Ultra HD Broadcast Asset</p>
                    </div>
                    <div className="relative h-24 overflow-hidden rounded-xl border border-slate-800">
                      <Image
                        src="/brand/hero-mount-zion.webp"
                        alt="Media Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                        <span className="rounded-full bg-amber-400 px-2.5 py-1 text-2xs font-extrabold text-slate-950">
                          Ready for Web Publish
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Events Schedule */}
                  <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold tracking-wider text-purple-400 uppercase">
                        Programme Sync
                      </span>
                      <CalendarDays className="size-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">78th Mount Zion Revival</h4>
                      <p className="text-2xs text-slate-400">Oct 14 - Oct 21, 2026</p>
                    </div>
                    <div className="space-y-2 pt-1 text-2xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Synced to Public Site</span>
                        <span className="font-bold text-emerald-400">Live</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Livestream Stream URL</span>
                        <span className="font-bold text-purple-400">Configured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section id="governance" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-2 block text-2xs font-extrabold tracking-widest text-amber-400 uppercase">
            High-Grade Capabilities
          </span>
          <h2 className="font-brand text-3xl font-extrabold text-white md:text-5xl">
            Built for Scale, Dignity, and Security.
          </h2>
          <p className="mt-4 text-base font-medium text-slate-300">
            Every module is designed to eliminate manual paperwork, enforce financial clarity, and streamline
            ecclesiastical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-amber-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
              <Award className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Holy Order Ordination Pipeline</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Track candidate elevations from Postulant to Senior Apostle across 5 rigorous vetting stages
              with full committee voting and verification logs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-emerald-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 transition-transform group-hover:scale-110">
              <Wallet className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Bank-Grade Stewardship Ledgers</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Reconcile tithes, offerings, and special revival seeds with zero-discrepancy batch processing
              and automated receipt issuance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-blue-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-400/10 text-blue-400 transition-transform group-hover:scale-110">
              <UsersRound className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Global Member Registry</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Search over 450,000 members in milliseconds across any parish or diocese with instant digital
              identity generation.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-purple-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-400/10 text-purple-400 transition-transform group-hover:scale-110">
              <Layers className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Autonomous Fellowships & Wings</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Dedicated, scoped management for Youth Fellowship, Women Fellowship, and the Music Directorate
              with tailored executive roles.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-pink-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-pink-400/30 bg-pink-400/10 text-pink-400 transition-transform group-hover:scale-110">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">1-Click Content Vetting Inbox</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Super-Admins review, approve, or request edits for branch news, photo galleries, and bulletins
              before public website release.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition-all hover:border-amber-400/40">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Cryptographic Audit Trail</h3>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Every sensitive action is stamped with <code className="text-amber-400">X-Handler-Id</code> and{" "}
              <code className="text-amber-400">X-Scope-Unit</code> for complete security compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Audit Showcase */}
      <section
        id="security"
        className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-2 block text-2xs font-extrabold tracking-widest text-amber-400 uppercase">
                Enterprise & Ecclesiastical Governance
              </span>
              <h2 className="font-brand text-3xl leading-tight font-extrabold text-white md:text-5xl">
                Designed for Uncompromising Security & Transparency.
              </h2>
              <p className="mt-4 text-base leading-relaxed font-medium text-slate-300">
                The ESOCS platform enforces strict contextual isolation. Parish clerks see only their local
                parish data, while Prelates and Super-Admins retain global oversight.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded bg-amber-400/20 p-1 text-amber-400">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">X-Portal-Type Enclosure</h4>
                    <p className="text-xs text-slate-400">
                      Ensures Web Studio requests never touch Church Governance APIs unless authenticated.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded bg-emerald-400/20 p-1 text-emerald-400">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Unit Scoping (X-Scope-Unit)</h4>
                    <p className="text-xs text-slate-400">
                      Locks requests automatically to the user&apos;s assigned parish or fellowship
                      jurisdiction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded bg-blue-400/20 p-1 text-blue-400">
                    <Scale className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Immutable Secretariat Audit Logs</h4>
                    <p className="text-xs text-slate-400">
                      All member edits, ordination updates, and financial entries are cryptographically
                      logged.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Security Code Graphic Card */}
            <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-950 p-6 font-mono text-xs shadow-2xl md:p-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-2xs font-extrabold tracking-widest text-amber-400 uppercase">
                  ESOCS Security Engine v2.0
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p className="text-slate-500">{"// Request Transmission Verification"}</p>
                <p>
                  <span className="text-amber-400">POST</span> /api/ordination/candidates/ORD-2026-889/vet
                </p>
                <p>
                  <span className="text-purple-400">Host:</span> admin.esocs.org
                </p>
                <p>
                  <span className="text-purple-400">X-Portal-Type:</span> admin-main
                </p>
                <p>
                  <span className="text-purple-400">X-Scope-Unit:</span> parish-mount-zion
                </p>
                <p>
                  <span className="text-purple-400">X-Handler-Id:</span> hnd_prelate_synod_9042
                </p>
                <p>
                  <span className="text-purple-400">Authorization:</span> Bearer esocs_sec_78942...
                </p>
                <p className="pt-2 text-emerald-400">
                  ✓ 200 OK — Candidate Elevation Approved & Cryptographically Signed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scriptural Authority Banner */}
      <section className="relative z-10 border-y border-amber-400/20 bg-linear-to-r from-amber-950/40 via-slate-950 to-amber-950/40 px-6 py-20 text-center backdrop-blur-2xl">
        <div className="mx-auto max-w-4xl space-y-4">
          <Crest
            size={64}
            priority
            className="mx-auto shadow-2xl ring-4 shadow-amber-950/80 ring-amber-400/80"
          />
          <h3 className="font-brand text-2xl font-extrabold text-white italic md:text-4xl">
            “Let all things be done decently and in order.”
          </h3>
          <p className="text-xs font-extrabold tracking-widest text-amber-400 uppercase md:text-sm">
            1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-6 py-16 text-xs text-slate-400 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Crest size={36} priority className="ring-2 ring-amber-400/80" />
              <span className="font-brand text-lg font-extrabold text-white">THE ESOCS PLATFORM</span>
            </div>
            <p className="text-2xs leading-relaxed text-slate-400">
              Official Administration System of the Eternal Sacred Order of the Cherubim & Seraphim.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-amber-400 uppercase">Main Admin</h4>
            <ul className="space-y-2 text-2xs font-semibold">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-white">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/members" className="transition-colors hover:text-white">
                  Member Registry
                </Link>
              </li>
              <li>
                <Link href="/ordination" className="transition-colors hover:text-white">
                  Ordination Vetting
                </Link>
              </li>
              <li>
                <Link href="/giving" className="transition-colors hover:text-white">
                  Financial Ledgers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">Web Studio</h4>
            <ul className="space-y-2 text-2xs font-semibold">
              <li>
                <Link href="/admin-web/dashboard" className="transition-colors hover:text-white">
                  Studio Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin-web/vetting" className="transition-colors hover:text-white">
                  Super Vetting Queue
                </Link>
              </li>
              <li>
                <Link href="/admin-web/media" className="transition-colors hover:text-white">
                  Media Vault
                </Link>
              </li>
              <li>
                <Link href="/admin-web/events" className="transition-colors hover:text-white">
                  Event Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-200 uppercase">
              System Security
            </h4>
            <p className="mb-3 text-2xs leading-relaxed text-slate-400">
              Encrypted end-to-end with full parish unit scoping and audit traceability.
            </p>
            <span className="inline-block rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-2xs font-bold text-emerald-400">
              System Online · v2.0
            </span>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between border-t border-slate-900 pt-6 text-2xs text-slate-500 sm:flex-row">
          <p>© 2026 Eternal Sacred Order of the Cherubim & Seraphim (ESOCS). All rights reserved.</p>
          <div className="mt-2 flex items-center gap-4 font-semibold sm:mt-0">
            <Link href="/login" className="hover:text-slate-300">
              Sign In
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
