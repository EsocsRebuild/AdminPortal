"use client";

import { Mail, Phone } from "lucide-react";

import { StatusBadge } from "@/components/blocks/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Member } from "@/lib/fixtures";
import { formatCurrency, formatDate, formatRelative } from "@/lib/format";

export function MemberSheet({
  member,
  onOpenChange,
}: {
  member: Member | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!member} onOpenChange={onOpenChange}>
      <SheetContent size="md">
        {member && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar name={member.name} size="lg" />
                <div className="grid min-w-0">
                  <SheetTitle className="truncate">{member.name}</SheetTitle>
                  <SheetDescription className="font-mono text-xs">{member.id}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <SheetBody className="grid content-start gap-6">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={member.status} />
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-5 text-base">
                {[
                  ["Parish", member.parish],
                  ["Rank", member.rank],
                  ["Member since", formatDate(member.joinedAt)],
                  ["Last seen", formatRelative(member.lastSeenAt)],
                  ["Giving (YTD)", formatCurrency(member.givingYtd)],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-0.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="tabular font-medium" suppressHydrationWarning>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <Separator />
              <div className="grid gap-2">
                <p className="text-xs font-medium text-muted-foreground">Contact</p>
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-primary">
                  <Mail className="size-4 text-subtle-foreground" /> {member.email}
                </a>
                <a
                  href={`tel:${member.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Phone className="size-4 text-subtle-foreground" /> {member.phone}
                </a>
              </div>
            </SheetBody>
            <SheetFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button>Edit member</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
