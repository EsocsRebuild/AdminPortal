"use client";

import * as React from "react";
import { Activity, Church, Globe2, Lock, ShieldCheck, Users2 } from "lucide-react";

import { useSession } from "@/components/auth/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface HandlerCardProps {
  handlerId?: string;
  name?: string;
  roleName?: string;
  unitName?: string;
  unitType?: "global" | "parish" | "fellowship";
  avatarUrl?: string | null;
  mfaEnabled?: boolean;
}

export function HandlerCard({
  handlerId,
  name,
  roleName,
  unitName = "Mount Zion Parish",
  unitType = "parish",
  avatarUrl,
  mfaEnabled,
}: HandlerCardProps) {
  const sessionUser = useSession();

  const currentHandlerId = handlerId ?? sessionUser?.id ?? "usr_handler_default";
  const currentName = name ?? sessionUser?.name ?? "Admin Handler";
  const currentRole = roleName ?? sessionUser?.role?.name ?? "Parish Administrator";
  const isMfa = mfaEnabled ?? sessionUser?.mfaEnabled ?? false;
  const isSuper =
    sessionUser?.isPlatformAdmin ||
    sessionUser?.role?.name?.toLowerCase().includes("super") ||
    sessionUser?.role?.name?.toLowerCase().includes("prelate");

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary bg-gradient-to-r from-surface via-surface/95 to-surface-muted/60 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:shadow-md sm:p-5">
      {/* Decorative subtle ambient gradient ring */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Handler Avatar & Meta */}
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="relative shrink-0">
            <Avatar
              name={currentName}
              src={avatarUrl ?? sessionUser?.avatarUrl ?? undefined}
              size="lg"
              className="shadow-xs ring-2 ring-primary/20"
            />
            {/* Live active session pulse indicator */}
            <span
              className="absolute right-0 bottom-0 size-3 rounded-full bg-emerald-500 ring-2 ring-surface"
              title="Handler Session Active"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                {currentName}
              </h2>
              <Badge
                tone="primary"
                shape="pill"
                className="font-mono text-2xs font-semibold tracking-wider uppercase"
              >
                ID: {currentHandlerId.slice(0, 12)}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{currentRole}</span>
              <span className="text-border-strong">•</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                {unitType === "global" ? (
                  <Globe2 className="size-3.5 shrink-0 text-blue-500" />
                ) : unitType === "parish" ? (
                  <Church className="size-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <Users2 className="size-3.5 shrink-0 text-amber-500" />
                )}
                <span className="max-w-[160px] truncate sm:max-w-[220px]">{unitName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Badges & Security */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Badge tone={isSuper ? "info" : "success"} className="gap-1.5 px-2.5 py-1 font-medium">
            {isSuper ? (
              <>
                <Globe2 className="size-3 text-blue-500" />
                <span>Panoramic Super Admin</span>
              </>
            ) : (
              <>
                <Lock className="size-3 text-emerald-500" />
                <span>Scoped Workspace</span>
              </>
            )}
          </Badge>

          {isMfa && (
            <Badge tone="success" className="gap-1.5 px-2.5 py-1 font-medium">
              <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>2FA Verified</span>
            </Badge>
          )}

          <div className="hidden items-center gap-1.5 rounded-full border border-border-subtle bg-surface-muted/60 px-2.5 py-1 text-2xs font-medium text-muted-foreground lg:flex">
            <Activity className="size-3 animate-pulse text-primary" />
            <span>Traceability Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
