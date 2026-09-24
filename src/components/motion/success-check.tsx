"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/** Celebratory check mark: the ring pops in, then the tick draws itself. */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <div className={cn("relative grid size-16 place-items-center", className)} aria-hidden>
      <motion.span
        className="absolute inset-0 rounded-full bg-success-soft"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      />
      <motion.span
        className="absolute inset-0 rounded-full ring-2 ring-success/30"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.25 }}
      />
      <svg viewBox="0 0 24 24" className="relative size-8 text-success">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
    </div>
  );
}
