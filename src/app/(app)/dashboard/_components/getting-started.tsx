"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { easeOutExpo } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const KEY = "esocs-admin:getting-started";

const steps = [
  { id: "profile", title: "Add your photo and phone number", href: "/settings" },
  { id: "members", title: "Look through your members", href: "/members" },
  { id: "appearance", title: "Choose how the portal looks", href: "/settings" },
  { id: "tour", title: "See every tool in one place", href: "/design-system" },
];

type State = { done: string[]; hidden: boolean };
const EMPTY = JSON.stringify({ done: [], hidden: false });
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function snapshot() {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

/** A short, dismissible checklist that helps new users find their feet. */
export function GettingStarted() {
  // null on the server so the card only renders once saved progress is known.
  const raw = React.useSyncExternalStore(subscribe, snapshot, () => null);
  const state = React.useMemo<State | null>(() => {
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as State;
    } catch {
      return JSON.parse(EMPTY) as State;
    }
  }, [raw]);
  const save = (next: State) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
  };

  if (!state) return null;
  const count = state.done.length;
  const pct = count / steps.length;
  const r = 18;
  const c = 2 * Math.PI * r;

  return (
    <AnimatePresence initial={false}>
      {!state.hidden && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
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
                    initial={false}
                    animate={{ strokeDashoffset: c * (1 - pct) }}
                    transition={{ duration: 0.8, ease: easeOutExpo }}
                  />
                </svg>
                <div className="grid gap-1">
                  <p className="font-semibold">Get started</p>
                  <p className="text-sm text-muted-foreground">
                    {count === steps.length
                      ? "All done. You’re ready to go!"
                      : `${count} of ${steps.length} done. A few quick steps to feel at home.`}
                  </p>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {steps.map((s) => {
                  const done = state.done.includes(s.id);
                  return (
                    <li key={s.id}>
                      <Link
                        href={s.href}
                        onClick={() => !done && save({ ...state, done: [...state.done, s.id] })}
                        className={cn(
                          "group flex min-h-12 items-center gap-3 rounded-control border border-border bg-surface/80 px-3 py-2 backdrop-blur transition-all duration-200",
                          "hover:border-border-strong hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                            done
                              ? "border-success bg-success text-success-foreground"
                              : "border-border-strong",
                          )}
                        >
                          {done && <Check className="size-3 animate-scale-in" strokeWidth={3} />}
                        </span>
                        <span
                          className={cn("flex-1 text-base", done && "text-muted-foreground line-through")}
                        >
                          {s.title}
                          <span className="sr-only">{done ? " (done)" : ""}</span>
                        </span>
                        <ArrowRight className="size-4 text-faint-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2"
              aria-label="Hide the getting started guide"
              onClick={() => save({ ...state, hidden: true })}
            >
              <X />
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
