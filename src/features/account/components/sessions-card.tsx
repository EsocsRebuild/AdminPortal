"use client";

import { LogOut, Monitor, Smartphone } from "lucide-react";

import { useModals } from "@/components/modals/modal-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { formatRelative } from "@/lib/format";

import { revokeOtherSessions, revokeSession } from "../actions";
import type { ActiveSession } from "../types";

export function SessionsCard({ sessions }: { sessions: ActiveSession[] }) {
  const modals = useModals();
  const revoke = useAction(revokeSession, { success: "Signed out of that device" });
  const revokeAll = useAction(revokeOtherSessions, { success: (r) => `Signed out of ${r.revoked} other ${r.revoked === 1 ? "device" : "devices"}` });
  const others = sessions.filter((s) => !s.current).length;

  return (
    <Card>
      <CardHeader
        title="Where you’re signed in"
        description="If you don’t recognise a device, sign it out and change your password."
        actions={
          others > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LogOut />}
              loading={revokeAll.pending}
              onClick={async () => {
                if (await modals.confirm({ title: "Sign out everywhere else?", description: "Every other browser and device will need to sign in again.", confirmLabel: "Sign out others" }))
                  await revokeAll.run({});
              }}
            >
              Sign out all others
            </Button>
          ) : undefined
        }
      />
      <CardContent className="grid gap-1 pt-2">
        {sessions.map((s) => {
          const mobile = /android|ios|iphone|ipad/i.test(s.os);
          const Icon = mobile ? Smartphone : Monitor;
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-control px-2 py-3 hover:bg-surface-hover">
              <span className="grid size-9 shrink-0 place-items-center rounded-control bg-surface-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div className="grid min-w-0 flex-1">
                <span className="flex items-center gap-2 font-medium">
                  {s.browser} on {s.os}
                  {s.current && <Badge tone="success">This device</Badge>}
                </span>
                <span className="truncate text-sm text-muted-foreground" suppressHydrationWarning>
                  {[s.location, s.ip].filter(Boolean).join(" · ")}
                  {!s.current && ` · active ${formatRelative(s.lastActiveAt)}`}
                </span>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" onClick={() => revoke.run({ id: s.id })}>
                  Sign out
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
