"use client";

import * as React from "react";
import { Church, Globe2, ShieldCheck, Lock, Building2, Users2, ArrowRight, Shield, Award, Wallet, CalendarDays } from "lucide-react";
import Link from "next/link";

import type { SessionUser } from "@/types/auth";

export function JurisdictionScopeBanner({ user }: { user: SessionUser }) {
  const roleLower = (user.role?.name ?? "").toLowerCase();
  const isSuperAdmin = Boolean(
    user.isPlatformAdmin ||
      roleLower.includes("super") ||
      roleLower.includes("prelate") ||
      roleLower.includes("synod") ||
      roleLower.includes("secretary"),
  );

  const isProvinceAdmin = roleLower.includes("province") || roleLower.includes("provincial");
  const isDistrictAdmin = roleLower.includes("district");
  const isFellowshipAdmin = roleLower.includes("fellowship") || roleLower.includes("youth") || roleLower.includes("women") || roleLower.includes("choir");

  // Determine active jurisdiction context
  const scopeType = isSuperAdmin
    ? "global"
    : isProvinceAdmin
      ? "province"
      : isDistrictAdmin
        ? "district"
        : isFellowshipAdmin
          ? "fellowship"
          : "parish";

  const scopeDetails = {
    global: {
      title: "Grand Secretariat Jurisdiction",
      subtitle: "Global Ecclesiastical Governance Scope · All Dioceses & Parishes",
      badgeText: "Global Super Admin",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: Globe2,
      accentColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      summary: "Global panoramic access across 1,200+ parishes worldwide, Holy Order ordination vetting, bank-grade financial ledgers, and platform security controls.",
      quickActions: [
        { label: "Ordination Vetting", href: "/ordination", icon: Award },
        { label: "Financial Ledgers", href: "/giving", icon: Wallet },
        { label: "Security & Users", href: "/users", icon: ShieldCheck },
      ],
    },
    province: {
      title: "Provincial Secretariat Jurisdiction",
      subtitle: "Provincial HQ Oversight · Multi-District Regional Scope",
      badgeText: "Provincial Administrator",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: Building2,
      accentColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      summary: "Regional administrative jurisdiction oversight covering assigned district secretariats, regional ordination candidates, and parish compliance.",
      quickActions: [
        { label: "Regional Wings", href: "/sections", icon: Building2 },
        { label: "Parish Directory", href: "/members", icon: Church },
      ],
    },
    district: {
      title: "District Secretariat Jurisdiction",
      subtitle: "District Scope · Local Branch Parishes Group",
      badgeText: "District Administrator",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      icon: Shield,
      accentColor: "from-blue-500/20 via-indigo-500/10 to-transparent",
      summary: "District-level administration overseeing local parish Sunday attendance headcounts, member roster registrations, and parish tithe submissions.",
      quickActions: [
        { label: "District Members", href: "/members", icon: Users2 },
        { label: "Sunday Headcount", href: "/attendance", icon: CalendarDays },
      ],
    },
    fellowship: {
      title: "Autonomous Wing Directorate Scope",
      subtitle: "Fellowship Directorate · Youth / Women / Music Wings",
      badgeText: "Wing Executive",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      icon: Users2,
      accentColor: "from-purple-500/20 via-pink-500/10 to-transparent",
      summary: "Autonomous wing governance managing national fellowship conferences, revival programmes, wing rosters, and directorate stewardship.",
      quickActions: [
        { label: "Wing Directorates", href: "/sections", icon: Users2 },
        { label: "Events Calendar", href: "/events", icon: CalendarDays },
      ],
    },
    parish: {
      title: "Mount Zion Parish Secretariat Jurisdiction",
      subtitle: "Local Branch Scope · Parish Clerk & Secretariat",
      badgeText: "Parish Clerk Scoped",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: Church,
      accentColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      summary: "Local parish administration scoped strictly to Mount Zion Parish congregation members, Sunday service attendance, and weekly tithe batch entries.",
      quickActions: [
        { label: "Sunday Attendance", href: "/attendance", icon: CalendarDays },
        { label: "Member Roster", href: "/members", icon: Users2 },
      ],
    },
  }[scopeType];

  const ScopeIcon = scopeDetails.icon;

  return (
    <div className={`relative overflow-hidden rounded-card border border-slate-800 bg-gradient-to-r ${scopeDetails.accentColor} bg-slate-900/90 p-5 md:p-6 shadow-2xl backdrop-blur-3xl`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 shadow-xl">
            <ScopeIcon className="size-6" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-brand text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {scopeDetails.title}
              </h2>
              <span className={`px-3 py-1 rounded-full border text-2xs font-extrabold uppercase tracking-widest backdrop-blur-xl ${scopeDetails.badgeClass}`}>
                {scopeDetails.badgeText}
              </span>
            </div>

            <p className="text-xs font-bold text-amber-400">
              {scopeDetails.subtitle}
            </p>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-medium">
              {scopeDetails.summary}
            </p>
          </div>
        </div>

        {/* Scoped Quick Action Hub */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          {scopeDetails.quickActions.map((act) => {
            const ActIcon = act.icon;
            return (
              <Link
                key={act.href}
                href={act.href}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/90 px-3.5 py-2 text-xs font-bold text-slate-200 transition-all hover:border-amber-400/50 hover:bg-slate-800 hover:text-white shadow-md active:scale-95"
              >
                <ActIcon className="size-3.5 text-amber-400" />
                <span>{act.label}</span>
                <ArrowRight className="size-3 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
