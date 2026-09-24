import { CalendarPlus, HandCoins, Megaphone, UserRoundPlus, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const actions: { href: string; title: string; text: string; icon: LucideIcon; tint: string }[] = [
  {
    href: "/members?new=1",
    title: "Add a member",
    text: "Register someone new",
    icon: UserRoundPlus,
    tint: "bg-[oklch(0.94_0.04_265)] text-[oklch(0.45_0.15_265)] dark:bg-[oklch(0.3_0.07_265)] dark:text-[oklch(0.85_0.08_265)]",
  },
  {
    href: "/finance",
    title: "Record giving",
    text: "Tithes and offerings",
    icon: HandCoins,
    tint: "bg-[oklch(0.95_0.05_85)] text-[oklch(0.5_0.11_65)] dark:bg-[oklch(0.33_0.06_70)] dark:text-[oklch(0.88_0.09_85)]",
  },
  {
    href: "/events",
    title: "Plan an event",
    text: "Services and programmes",
    icon: CalendarPlus,
    tint: "bg-[oklch(0.95_0.04_165)] text-[oklch(0.45_0.1_165)] dark:bg-[oklch(0.3_0.05_165)] dark:text-[oklch(0.85_0.09_165)]",
  },
  {
    href: "/communications",
    title: "Send a message",
    text: "Email or SMS your people",
    icon: Megaphone,
    tint: "bg-[oklch(0.95_0.03_10)] text-[oklch(0.5_0.16_10)] dark:bg-[oklch(0.32_0.07_10)] dark:text-[oklch(0.86_0.08_10)]",
  },
];

/** Large, plainly labelled shortcuts to the most common jobs. */
export function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className={cn(
            "group relative flex flex-col gap-3 overflow-hidden rounded-card border border-border bg-surface p-4",
            "transition-[border-color,box-shadow,transform] duration-300 ease-out-expo",
            "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "sm:flex-row sm:items-center",
          )}
        >
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-card transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:-rotate-3",
              a.tint,
            )}
          >
            <a.icon className="size-5" />
          </span>
          <span className="grid min-w-0 gap-0.5">
            <span className="font-medium">{a.title}</span>
            <span className="line-clamp-2 text-sm text-muted-foreground sm:truncate">{a.text}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
