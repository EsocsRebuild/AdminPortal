"use client";

import * as React from "react";
import {
  Building2,
  CheckCircle2,
  Church,
  Clock,
  Globe2,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
  Users2,
} from "lucide-react";

import { useSession } from "@/components/auth/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className="relative overflow-hidden border-l-4 border-l-primary p-5 shadow-xs bg-gradient-to-r from-surface via-surface to-surface-muted/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Handler Info */}
        <div className="flex items-center gap-3.5">
          <Avatar
            name={currentName}
            src={avatarUrl ?? sessionUser?.avatarUrl ?? undefined}
            size="lg"
            className="ring-2 ring-primary/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground">{currentName}</h2>
              <Badge tone="primary" className="font-mono text-2xs uppercase">
                ID: {currentHandlerId.slice(0, 12)}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{currentRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                {unitType === "global" ? (
                  <Globe2 className="size-3.5 text-blue-500" />
                ) : unitType === "parish" ? (
                  <Church className="size-3.5 text-emerald-500" />
                ) : (
                  <Users2 className="size-3.5 text-amber-500" />
                )}
                {unitName}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Badges & Security */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Badge tone={isSuper ? "info" : "success"} className="gap-1 py-1">
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
            <Badge tone="success" className="gap-1 py-1">
              <ShieldCheck className="size-3" />
              <span>2FA Verified</span>
            </Badge>
          )}

          <div className="hidden text-2xs text-muted-foreground md:flex items-center gap-1 ml-1">
            <Clock className="size-3 text-primary" />
            <span>Traceability Signature Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
