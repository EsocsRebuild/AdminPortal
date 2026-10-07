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
  FileText,
  ChevronRight,
  Zap,
  Activity,
  Search,
  Check,
  Building2,
  Flame,
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
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500/30 selection:text-amber-300 overflow-x-hidden">
      {/* App Splash Loader on initial load */}
      <AppSplashLoader />

      {/* Ambient Aurora Background Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 size-[1000px] rounded-full bg-gradient-to-b from-amber-500/10 via-royal-600/10 to-transparent blur-[140px] opacity-70 animate-pulse" />
        <div className="absolute top-[30%] -left-[10%] size-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-[65%] -right-[10%] size-[700px] rounded-full bg-amber-500/5 blur-[140px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-2xl md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <Crest size={44} priority className="ring-2 ring-amber-400/80 shadow-xl shadow-amber-950/60 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-brand text-xl font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">THE ESOCS</span>
            <span className="text-2xs font-bold tracking-widest text-amber-400 uppercase">Administration Platform</span>
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
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-5 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40 active:scale-95"
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
          className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-xl shadow-inner mb-8"
        >
          <Sparkles className="size-4 text-amber-400 animate-pulse" />
          <span className="text-2xs font-extrabold text-amber-300 uppercase tracking-widest">
            Official Ecclesiastical Platform · Version 2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-brand text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
        >
          The Unified Digital Ecosystem for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
            Ecclesiastical Governance
          </span>{" "}
          & World-Class{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400">
            Web Content
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Powering the Eternal Sacred Order of the Cherubim & Seraphim worldwide across every parish, Holy Order ordination candidate pipeline, financial ledger, and public web presence.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/45"
          >
            <Church className="size-4 text-slate-950" />
            <span>Main Church Admin</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/admin-web/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3.5 text-sm font-extrabold text-emerald-400 backdrop-blur-xl transition-all hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:scale-105"
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
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Building2 className="size-4" />
              <span className="text-2xs font-extrabold uppercase tracking-widest">Global Reach</span>
            </div>
            <span className="font-brand text-3xl md:text-4xl font-extrabold text-white">1,200+</span>
            <span className="text-2xs font-semibold text-slate-400 mt-1">Parishes & Dioceses</span>
          </div>

          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <UsersRound className="size-4" />
              <span className="text-2xs font-extrabold uppercase tracking-widest">Congregation</span>
            </div>
            <span className="font-brand text-3xl md:text-4xl font-extrabold text-white">450,000+</span>
            <span className="text-2xs font-semibold text-slate-400 mt-1">Enrolled Members</span>
          </div>

          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <ShieldCheck className="size-4" />
              <span className="text-2xs font-extrabold uppercase tracking-widest">Audit Trail</span>
            </div>
            <span className="font-brand text-3xl md:text-4xl font-extrabold text-white">100%</span>
            <span className="text-2xs font-semibold text-slate-400 mt-1">Traceable Headers</span>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <Activity className="size-4" />
              <span className="text-2xs font-extrabold uppercase tracking-widest">Performance</span>
            </div>
            <span className="font-brand text-3xl md:text-4xl font-extrabold text-white">&lt; 45ms</span>
            <span className="text-2xs font-semibold text-slate-400 mt-1">Query Latency</span>
          </div>
        </motion.div>
      </section>

      {/* Interactive Dual-Portal Interactive Switcher Section */}
      <section id="dual-portals" className="relative z-10 bg-slate-900/40 border-y border-slate-800/80 py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block mb-2">
              Dual Ecosystem Architecture
            </span>
            <h2 className="font-brand text-3xl md:text-5xl font-extrabold text-white">
              Two Tailored Environments. One Core System.
            </h2>
            <p className="mt-4 text-base text-slate-300 font-medium">
              Toggle below to experience how ESOCS separates high-security ecclesiastical governance from public web content publishing.
            </p>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full bg-slate-950 p-1.5 border border-slate-800 shadow-2xl">
              <button
                onClick={() => setActivePortalTab("main")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-extrabold transition-all ${
                  activePortalTab === "main"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Church className="size-4" />
                <span>Main Church Governance Admin</span>
              </button>

              <button
                onClick={() => setActivePortalTab("web")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-extrabold transition-all ${
                  activePortalTab === "web"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30"
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
                className="rounded-3xl border border-amber-500/30 bg-slate-950 p-6 md:p-8 shadow-[0_0_80px_rgba(251,191,36,0.12)]"
              >
                {/* Header Mock */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                      <Church className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-brand text-xl font-extrabold text-white">Main Church Governance Admin</h3>
                      <p className="text-xs font-medium text-amber-400">Scoped Unit: Mount Zion Parish (HQ) · X-Portal-Type: admin-main</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30 transition-all"
                  >
                    <span>Launch Main Admin Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* Grid Live Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  {/* Card 1: Ordination Candidate Vetting */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-wider">Ordination Pipeline</span>
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
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[80%]" />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-2xs">
                      <span className="text-slate-400">Recommendation</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold">Approved by Synod</span>
                    </div>
                  </div>

                  {/* Card 2: Live Parish Headcount */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-blue-400 uppercase tracking-wider">Live Headcount</span>
                      <Activity className="size-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-extrabold text-white font-mono">1,482</h4>
                      <p className="text-2xs text-slate-400">Sunday Service · Mount Zion Cathedral</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-2xs pt-2">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="block text-slate-400">Male</span>
                        <span className="font-extrabold text-white">620</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="block text-slate-400">Female</span>
                        <span className="font-extrabold text-white">710</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="block text-slate-400">Children</span>
                        <span className="font-extrabold text-amber-400">152</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Financial Tithes Ledger */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">Stewardship Ledger</span>
                      <Wallet className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-white font-mono">₦ 4,850,000</h4>
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
                className="rounded-3xl border border-emerald-500/30 bg-slate-950 p-6 md:p-8 shadow-[0_0_80px_rgba(16,185,129,0.12)]"
              >
                {/* Header Mock */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">
                      <Globe className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-brand text-xl font-extrabold text-white">Web Content & Media Studio</h3>
                      <p className="text-xs font-medium text-emerald-400">Content Studio · X-Portal-Type: admin-web</p>
                    </div>
                  </div>

                  <Link
                    href="/admin-web/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold hover:bg-emerald-400/30 transition-all"
                  >
                    <span>Launch Web Content Studio</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* Grid Live Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  {/* Card 1: Interactive Super Vetting Queue */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">Super Vetting Queue</span>
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Surulere Parish Bulletin</h4>
                      <p className="text-2xs text-slate-400">Submitted by Media Team · 10 mins ago</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-2xs text-slate-300 font-semibold">Total Approved Items</span>
                      <span className="font-mono text-base font-extrabold text-emerald-400">{vettedCount}</span>
                    </div>
                    <button
                      onClick={handleQuickApprove}
                      className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Check className="size-3.5" />
                      <span>Test 1-Click Approve Submission</span>
                    </button>
                  </div>

                  {/* Card 2: High-Res Media Gallery */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-wider">Media Vault</span>
                      <Video className="size-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Annual General Conference Video</h4>
                      <p className="text-2xs text-slate-400">4K Ultra HD Broadcast Asset</p>
                    </div>
                    <div className="relative h-24 rounded-xl overflow-hidden border border-slate-800">
                      <Image
                        src="/brand/hero-mount-zion.webp"
                        alt="Media Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-2xs font-extrabold">
                          Ready for Web Publish
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Events Schedule */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-purple-400 uppercase tracking-wider">Programme Sync</span>
                      <CalendarDays className="size-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">78th Mount Zion Revival</h4>
                      <p className="text-2xs text-slate-400">Oct 14 - Oct 21, 2026</p>
                    </div>
                    <div className="space-y-2 text-2xs pt-1">
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
      <section id="governance" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block mb-2">
            High-Grade Capabilities
          </span>
          <h2 className="font-brand text-3xl md:text-5xl font-extrabold text-white">
            Built for Scale, Dignity, and Security.
          </h2>
          <p className="mt-4 text-base text-slate-300 font-medium">
            Every module is designed to eliminate manual paperwork, enforce financial clarity, and streamline ecclesiastical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-amber-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Holy Order Ordination Pipeline</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Track candidate elevations from Postulant to Senior Apostle across 5 rigorous vetting stages with full committee voting and verification logs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-emerald-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Bank-Grade Stewardship Ledgers</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Reconcile tithes, offerings, and special revival seeds with zero-discrepancy batch processing and automated receipt issuance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-blue-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-blue-400/10 border border-blue-400/30 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersRound className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Global Member Registry</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Search over 450,000 members in milliseconds across any parish or diocese with instant digital identity generation.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-purple-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-purple-400/10 border border-purple-400/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Autonomous Fellowships & Wings</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Dedicated, scoped management for Youth Fellowship, Women Fellowship, and the Music Directorate with tailored executive roles.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-pink-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-pink-400/10 border border-pink-400/30 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">1-Click Content Vetting Inbox</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Super-Admins review, approve, or request edits for branch news, photo galleries, and bulletins before public website release.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl hover:border-amber-400/40 transition-all group">
            <div className="size-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-brand text-xl font-extrabold text-white">Cryptographic Audit Trail</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Every sensitive action is stamped with <code className="text-amber-400">X-Handler-Id</code> and <code className="text-amber-400">X-Scope-Unit</code> for complete security compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Audit Showcase */}
      <section id="security" className="relative z-10 py-24 px-6 md:px-12 bg-slate-900/60 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block mb-2">
                Enterprise & Ecclesiastical Governance
              </span>
              <h2 className="font-brand text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Designed for Uncompromising Security & Transparency.
              </h2>
              <p className="mt-4 text-base text-slate-300 leading-relaxed font-medium">
                The ESOCS platform enforces strict contextual isolation. Parish clerks see only their local parish data, while Prelates and Super-Admins retain global oversight.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-amber-400/20 text-amber-400 mt-1">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">X-Portal-Type Enclosure</h4>
                    <p className="text-xs text-slate-400">Ensures Web Studio requests never touch Church Governance APIs unless authenticated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-400/20 text-emerald-400 mt-1">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Unit Scoping (X-Scope-Unit)</h4>
                    <p className="text-xs text-slate-400">Locks requests automatically to the user&apos;s assigned parish or fellowship jurisdiction.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-blue-400/20 text-blue-400 mt-1">
                    <Scale className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Immutable Secretariat Audit Logs</h4>
                    <p className="text-xs text-slate-400">All member edits, ordination updates, and financial entries are cryptographically logged.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Security Code Graphic Card */}
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6 md:p-8 font-mono text-xs shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-2xs text-amber-400 font-extrabold uppercase tracking-widest">
                  ESOCS Security Engine v2.0
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p className="text-slate-500">// Request Transmission Verification</p>
                <p><span className="text-amber-400">POST</span> /api/ordination/candidates/ORD-2026-889/vet</p>
                <p><span className="text-purple-400">Host:</span> admin.esocs.org</p>
                <p><span className="text-purple-400">X-Portal-Type:</span> admin-main</p>
                <p><span className="text-purple-400">X-Scope-Unit:</span> parish-mount-zion</p>
                <p><span className="text-purple-400">X-Handler-Id:</span> hnd_prelate_synod_9042</p>
                <p><span className="text-purple-400">Authorization:</span> Bearer esocs_sec_78942...</p>
                <p className="text-emerald-400 pt-2">✓ 200 OK — Candidate Elevation Approved & Cryptographically Signed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scriptural Authority Banner */}
      <section className="relative z-10 py-20 px-6 text-center border-y border-amber-400/20 bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          <Crest size={64} priority className="mx-auto ring-4 ring-amber-400/80 shadow-2xl shadow-amber-950/80" />
          <h3 className="font-brand text-2xl md:text-4xl font-extrabold text-white italic">
            “Let all things be done decently and in order.”
          </h3>
          <p className="text-xs md:text-sm font-extrabold text-amber-400 uppercase tracking-widest">
            1 Corinthians 14:40 · Eternal Sacred Order of the Cherubim & Seraphim
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-800/80 py-16 px-6 md:px-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Crest size={36} priority className="ring-2 ring-amber-400/80" />
              <span className="font-brand text-lg font-extrabold text-white">THE ESOCS PLATFORM</span>
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Official Administration System of the Eternal Sacred Order of the Cherubim & Seraphim.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase text-amber-400">Main Admin</h4>
            <ul className="space-y-2 text-2xs font-semibold">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Executive Dashboard</Link></li>
              <li><Link href="/members" className="hover:text-white transition-colors">Member Registry</Link></li>
              <li><Link href="/ordination" className="hover:text-white transition-colors">Ordination Vetting</Link></li>
              <li><Link href="/giving" className="hover:text-white transition-colors">Financial Ledgers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase text-emerald-400">Web Studio</h4>
            <ul className="space-y-2 text-2xs font-semibold">
              <li><Link href="/admin-web/dashboard" className="hover:text-white transition-colors">Studio Dashboard</Link></li>
              <li><Link href="/admin-web/vetting" className="hover:text-white transition-colors">Super Vetting Queue</Link></li>
              <li><Link href="/admin-web/media" className="hover:text-white transition-colors">Media Vault</Link></li>
              <li><Link href="/admin-web/events" className="hover:text-white transition-colors">Event Calendar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs tracking-wider uppercase text-slate-200">System Security</h4>
            <p className="text-2xs text-slate-400 leading-relaxed mb-3">
              Encrypted end-to-end with full parish unit scoping and audit traceability.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-2xs font-bold text-emerald-400">
              System Online · v2.0
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-2xs text-slate-500">
          <p>© 2026 Eternal Sacred Order of the Cherubim & Seraphim (ESOCS). All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-semibold">
            <Link href="/login" className="hover:text-slate-300">Sign In</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
