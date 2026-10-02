"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home, Users } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Household, HouseholdRole } from "@/features/members/types-household";

const roleTone: Record<HouseholdRole, "primary" | "info" | "neutral" | "success"> = {
  head: "primary",
  spouse: "info",
  child: "neutral",
  dependent: "neutral",
  other: "neutral",
};

const roleLabel: Record<HouseholdRole, string> = {
  head: "Head of Household",
  spouse: "Spouse",
  child: "Child",
  dependent: "Dependent",
  other: "Family Member",
};

export interface HouseholdCardProps {
  household: Household;
}

export function HouseholdCard({ household }: HouseholdCardProps) {
  return (
    <Card className="overflow-hidden border-border">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Home className="size-4 text-primary" />
            <span>{household.familyName}</span>
          </div>
        }
        description={household.address ?? "Parish Registered Family Household"}
        actions={
          <Badge tone="primary" className="gap-1 font-mono">
            <Users className="size-3" />
            <span>{household.members.length} Members</span>
          </Badge>
        }
      />
      <CardContent className="pt-2">
        <div className="grid gap-2">
          {household.members.map((m) => (
            <Link
              key={m.id}
              href={`/members/${m.id}`}
              className="group flex items-center justify-between rounded-control border border-border-subtle bg-surface px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-surface-hover"
            >
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.avatarUrl ?? undefined} size="sm" />
                <div>
                  <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {m.name}
                  </div>
                  <div className="text-2xs text-muted-foreground">{m.memberCode}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge tone={roleTone[m.role]}>{roleLabel[m.role]}</Badge>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
