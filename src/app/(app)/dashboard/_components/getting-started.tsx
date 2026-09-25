"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SetupStep {
  id: string;
  title: string;
  href: string;
  done: boolean;
}

const KEY = "esocs-admin:getting-started-hidden";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** Setup checklist driven by the real state of the account. Hidden once complete or dismissed. */
export function GettingStarted({ steps }: { steps: SetupStep[] }) {
  const hidden = React.useSyncExternalStore(subscribe, read, () => true);
  const count = steps.filter((s) => s.done).length;
  const complete = count === steps.length;
  const pct = steps.length ? count / steps.length : 1;
  const r = 18;
  const c = 2 * Math.PI * r;

  const hide = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    listeners.forEach((l) => l());
  };

  return (
    <AnimatePresence initial={false}>
      {!hidden && !complete && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
          className="overflow-hidden"
        >
          <Card className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
            <div className="relative grid gap-5 p-card pr-12 sm:p-6 sm:pr-14 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
              <div className="flex items-start gap-4">
                <svg viewBox="0 0 44 44" className="size-12 shrink-0 -rotate-90" aria-hidden>
                  <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: c * (1 - pct) }}
                    transition={{ duration: 1, ease: easeOutExpo, delay: 0.2 }}
                  />
                </svg>
                <div className="grid gap-1">
                  <p className="font-semibold">Finish setting up</p>
                  <p className="text-sm text-muted-foreground">
                    {count} of {steps.length} done. These keep your account safe and your emails out of spam.
                  </p>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {steps.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      className="group flex min-h-12 items-center gap-3 rounded-control border border-border bg-surface/80 px-3 py-2 backdrop-blur transition-all duration-200 hover:border-border-strong hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          s.done ? "border-success bg-success text-success-foreground" : "border-border-strong",
                        )}
                      >
                        {s.done && <Check className="size-3 animate-scale-in" strokeWidth={3} />}
                      </span>
                      <span className={cn("flex-1 text-base", s.done && "text-muted-foreground line-through")}>
                        {s.title}
                        <span className="sr-only">{s.done ? " (done)" : ""}</span>
                      </span>
                      <ArrowRight className="size-4 text-faint-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" aria-label="Hide the setup checklist" onClick={hide}>
              <X />
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
