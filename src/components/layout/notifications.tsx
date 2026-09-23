"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { activity } from "@/lib/fixtures";
import { formatRelative } from "@/lib/format";

export function Notifications() {
  const unread = 3;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
          <Bell />
          <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-danger ring-2 ring-background" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold">Notifications</p>
          <Button variant="link" size="xs">
            Mark all read
          </Button>
        </div>
        <ul className="max-h-96 divide-y divide-border-subtle overflow-y-auto">
          {activity.map((a, i) => (
            <li key={a.id} className="flex gap-3 px-4 py-3 hover:bg-surface-hover">
              <Avatar name={a.actor} size="sm" />
              <p className="flex-1 text-sm">
                <span className="font-medium">{a.actor}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span> <span className="font-medium">{a.target}</span>
                <span className="mt-0.5 block text-xs text-subtle-foreground" suppressHydrationWarning>
                  {formatRelative(a.at)}
                </span>
              </p>
              {i < unread && <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-2">
          <Button variant="ghost" size="sm" fullWidth asChild>
            <Link href="/audit-log">View all activity</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
