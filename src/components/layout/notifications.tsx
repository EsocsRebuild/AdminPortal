"use client";

import { Bell, BellOff, RotateCcw } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { listNotifications, markAllNotificationsRead } from "@/features/notifications/actions";
import type { Notification } from "@/features/notifications/types";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

const toneDot = { info: "bg-info", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: Notification[]; unread: number };

/** Notifications load when opened and refresh every few minutes in the background. */
export function Notifications() {
  const [state, setState] = React.useState<State>({ status: "loading" });
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await listNotifications({});
    setState(res.ok ? { status: "ready", ...res.data } : { status: "error" });
  }, []);

  React.useEffect(() => {
    let alive = true;
    const refresh = () =>
      listNotifications({}).then((res) => {
        if (alive) setState(res.ok ? { status: "ready", ...res.data } : { status: "error" });
      });
    void refresh();
    const id = setInterval(() => document.visibilityState === "visible" && void refresh(), 3 * 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const unread = state.status === "ready" ? state.unread : 0;

  async function markAll() {
    if (state.status !== "ready") return;
    setState({ ...state, unread: 0, items: state.items.map((n) => ({ ...n, read: true })) });
    await markAllNotificationsRead({});
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) void load();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        >
          <Bell />
          {unread > 0 && (
            <span aria-hidden className="absolute top-2 right-2 size-2 animate-scale-in rounded-full bg-danger ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-1.5rem))] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold">Notifications</p>
          {unread > 0 && (
            <Button variant="link" size="xs" onClick={markAll}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {state.status === "loading" || state.status === "idle" ? (
            <div className="grid gap-4 p-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-2 rounded-full" />
                  <div className="grid flex-1 gap-2">
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : state.status === "error" ? (
            <div className="grid justify-items-center gap-3 px-4 py-8 text-center text-sm text-muted-foreground">
              Couldn’t load notifications.
              <Button variant="secondary" size="sm" leftIcon={<RotateCcw />} onClick={load}>
                Try again
              </Button>
            </div>
          ) : state.items.length === 0 ? (
            <div className="grid justify-items-center gap-2 px-4 py-10 text-center">
              <BellOff className="size-5 text-subtle-foreground" />
              <p className="text-sm text-muted-foreground">You’re all caught up.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {state.items.map((n) => {
                const body = (
                  <>
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : toneDot[n.tone])} />
                    <span className="grid flex-1 gap-0.5">
                      <span className={cn("text-sm", !n.read && "font-medium")}>{n.title}</span>
                      {n.body && <span className="text-sm text-muted-foreground">{n.body}</span>}
                      <span className="text-xs text-subtle-foreground">{formatRelative(n.createdAt)}</span>
                    </span>
                  </>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-surface-hover">
                        {body}
                      </Link>
                    ) : (
                      <div className="flex gap-3 px-4 py-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-2">
          <Button variant="ghost" size="sm" fullWidth asChild>
            <Link href="/audit-log" onClick={() => setOpen(false)}>
              View activity history
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
