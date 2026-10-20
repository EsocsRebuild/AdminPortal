"use client";

import * as React from "react";
import {
  Church,
  Globe2,
  ShieldCheck,
  Building2,
  Users2,
  ArrowRight,
  Shield,
  Award,
  Wallet,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

import type { SessionUser } from "@/types/auth";

export function JurisdictionScopeBanner({
  user,
  unitName = "Assigned Church Unit",
}: {
  user: SessionUser;
  unitName?: string;
}) {
  const roleLower = (user.role?.name ?? "").toLowerCase();
  const isSuperAdmin = Boolean(
    user.isPlatformAdmin ||
    roleLower.includes("super") ||
    roleLower.includes("prelate") ||
    roleLower.includes("synod") ||
    roleLower.includes("secretary"),
  );

  const isContentEditor =
    roleLower.includes("content") ||
    roleLower.includes("editor") ||
    roleLower.includes("media");
  const isProvinceAdmin = roleLower.includes("province") || roleLower.includes("provincial");
  const isDistrictAdmin = roleLower.includes("district");
  const isFellowshipAdmin =
    roleLower.includes("fellowship") ||
    roleLower.includes("youth") ||
    roleLower.includes("women") ||
    roleLower.includes("choir");

  // Determine active jurisdiction context
  const scopeType = isSuperAdmin
    ? "global"
    : isContentEditor
      ? "content"
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
      summary:
        "Global panoramic access across parishes worldwide, Holy Order ordination vetting, financial ledgers, and platform administration.",
      quickActions: [
        { label: "Ordination Vetting", href: "/ordination", icon: Award },
        { label: "Financial Ledgers", href: "/giving", icon: Wallet },
        { label: "Security & Users", href: "/users", icon: ShieldCheck },
      ],
    },
    content: {
      title: `${unitName} Content Studio`,
      subtitle: `Web Content & Publishing Scope · ${user.role?.name ?? "Content Editor"}`,
      badgeText: user.role?.name ?? "Content Editor",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: Globe2,
      accentColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      summary: `Administrative workspace scoped to public web announcements, bulletins, events, and media publishing for ${unitName}.`,
      quickActions: [
        { label: "Web Studio", href: "/admin-web/dashboard", icon: Globe2 },
        { label: "Submit Event", href: "/admin-web/events", icon: CalendarDays },
        { label: "Media Library", href: "/admin-web/media", icon: Building2 },
      ],
    },
    province: {
      title: `${unitName} Secretariat Jurisdiction`,
      subtitle: `Provincial HQ Oversight · Multi-District Regional Scope`,
      badgeText: user.role?.name ?? "Provincial Administrator",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: Building2,
      accentColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      summary: `Regional administrative jurisdiction oversight covering assigned district secretariats, ordination candidates, and compliance for ${unitName}.`,
      quickActions: [
        { label: "Regional Wings", href: "/sections", icon: Building2 },
        { label: "Parish Directory", href: "/members", icon: Church },
      ],
    },
    district: {
      title: `${unitName} Secretariat Jurisdiction`,
      subtitle: `District Scope · Local Branch Parishes Group`,
      badgeText: user.role?.name ?? "District Administrator",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      icon: Shield,
      accentColor: "from-blue-500/20 via-indigo-500/10 to-transparent",
      summary: `District-level administration overseeing local parish Sunday attendance headcounts, member roster registrations, and parish tithe submissions for ${unitName}.`,
      quickActions: [
        { label: "District Members", href: "/members", icon: Users2 },
        { label: "Sunday Headcount", href: "/attendance", icon: CalendarDays },
      ],
    },
    fellowship: {
      title: `${unitName} Directorate Scope`,
      subtitle: "Fellowship Directorate · Autonomous Wing",
      badgeText: user.role?.name ?? "Wing Executive",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      icon: Users2,
      accentColor: "from-purple-500/20 via-pink-500/10 to-transparent",
      summary: `Autonomous wing governance managing national fellowship conferences, revival programmes, wing rosters, and directorate stewardship for ${unitName}.`,
      quickActions: [
        { label: "Wing Directorates", href: "/sections", icon: Users2 },
        { label: "Events Calendar", href: "/events", icon: CalendarDays },
      ],
    },
    parish: {
      title: `${unitName} Secretariat Jurisdiction`,
      subtitle: `Local Branch Scope · ${user.role?.name ?? "Parish Secretariat"}`,
      badgeText: user.role?.name ?? "Parish Scoped",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: Church,
      accentColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      summary: `Local parish administration scoped strictly to ${unitName} congregation members, Sunday service attendance, and unit operations.`,
      quickActions: [
        { label: "Sunday Attendance", href: "/attendance", icon: CalendarDays },
        { label: "Member Roster", href: "/members", icon: Users2 },
      ],
    },
  }[scopeType];

  const ScopeIcon = scopeDetails.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-card border border-slate-800 bg-linear-to-r ${scopeDetails.accentColor} bg-slate-900/90 p-5 shadow-2xl backdrop-blur-3xl md:p-6`}
    >
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-amber-400 shadow-xl">
            <ScopeIcon className="size-6" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-brand text-xl font-extrabold tracking-tight text-white md:text-2xl">
                {scopeDetails.title}
              </h2>
              <span
                className={`rounded-full border px-3 py-1 text-2xs font-extrabold tracking-widest uppercase backdrop-blur-xl ${scopeDetails.badgeClass}`}
              >
                {scopeDetails.badgeText}
              </span>
            </div>

            <p className="text-xs font-bold text-amber-400">{scopeDetails.subtitle}</p>

            <p className="max-w-3xl text-xs leading-relaxed font-medium text-slate-300">
              {scopeDetails.summary}
            </p>
          </div>
        </div>

        {/* Scoped Quick Action Hub */}
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2.5 pt-2 lg:w-auto lg:pt-0">
          {scopeDetails.quickActions.map((act) => {
            const ActIcon = act.icon;
            return (
              <Link
                key={act.href}
                href={act.href}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/90 px-3.5 py-2 text-xs font-bold text-slate-200 shadow-md transition-all hover:border-amber-400/50 hover:bg-slate-800 hover:text-white active:scale-95"
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
