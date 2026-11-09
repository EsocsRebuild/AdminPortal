"use client";

import * as React from "react";
import Link from "next/link";
import { Globe, ImageIcon, Users, Award, Church, ShieldCheck, Plus, UserCheck, Wallet } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

interface DashboardHeaderProps {
  user: SessionUser;
  unitName: string;
  isSuperAdmin: boolean;
}

export function DashboardHeader({ user, unitName, isSuperAdmin }: DashboardHeaderProps) {
  const roleName = user.role?.name || "Church Administrator";
  const roleLower = roleName.toLowerCase();

  const isContentEditor =
    roleLower.includes("content") ||
    roleLower.includes("editor") ||
    roleLower.includes("media") ||
    roleLower.includes("web");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-amber-500/10 via-card to-card p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Profile Info & Ecclesiastical Scope */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar
              name={user.name}
              src={user.avatarUrl}
              size="lg"
              className="size-14 ring-2 ring-amber-400/30 sm:size-16"
            />
            <span
              className="absolute right-0 bottom-0 size-3.5 rounded-full bg-emerald-500 ring-2 ring-card"
              title="Session Active"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Welcome, {user.name}
              </h1>
              <Badge tone="primary" shape="pill" className="text-2xs font-semibold">
                {roleName}
              </Badge>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-bold text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="size-3" />
                  Global Headquarters
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2.5 py-0.5 text-2xs font-medium text-foreground">
                  <Church className="size-3 text-amber-600 dark:text-amber-400" />
                  {unitName}
                </span>
              )}
            </div>

            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {isContentEditor
                ? `Create and publish church service programmes, flyers, bulletins, and announcements for ${unitName}.`
                : isSuperAdmin
                  ? "Apex executive oversight across all ecclesiastical provinces, holy order ordination vetting, and diocesan operations."
                  : `Ecclesiastical administration and membership records for ${unitName}.`}
            </p>
          </div>
        </div>

        {/* Primary Clear Action Shortcuts */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          {isContentEditor ? (
            <>
              <Link href="/admin-web/events">
                <Button className="gap-1.5 bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-500">
                  <Plus className="size-4" />
                  Submit Church Event
                </Button>
              </Link>
              <Link href="/admin-web/dashboard">
                <Button variant="outline" className="gap-1.5 text-xs">
                  <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Web Studio
                </Button>
              </Link>
              <Link href="/admin-web/media">
                <Button variant="outline" className="gap-1.5 text-xs">
                  <ImageIcon className="size-4 text-amber-600 dark:text-amber-400" />
                  Media Library
                </Button>
              </Link>
            </>
          ) : isSuperAdmin ? (
            <>
              <Link href="/ordination">
                <Button className="gap-1.5 bg-amber-500 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400">
                  <Award className="size-4" />
                  Ordination Pipeline
                </Button>
              </Link>
              <Link href="/members">
                <Button variant="outline" className="gap-1.5 text-xs">
                  <Users className="size-4" />
                  Member Directory
                </Button>
              </Link>
              <Link href="/admin-web/dashboard">
                <Button variant="outline" className="gap-1.5 text-xs">
                  <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Web Studio
                </Button>
              </Link>
            </>
          ) : (
            <>
              {can(user, "attendance:view") && (
                <Link href="/attendance">
                  <Button className="gap-1.5 bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                    <UserCheck className="size-4" />
                    Sunday Attendance
                  </Button>
                </Link>
              )}
              {can(user, "members:view") && (
                <Link href="/members">
                  <Button variant="outline" className="gap-1.5 text-xs">
                    <Users className="size-4" />
                    Member Directory
                  </Button>
                </Link>
              )}
              {can(user, "giving:view") && (
                <Link href="/giving">
                  <Button variant="outline" className="gap-1.5 text-xs">
                    <Wallet className="size-4 text-amber-600 dark:text-amber-400" />
                    Giving & Stewardship
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
