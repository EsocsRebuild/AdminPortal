"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import * as React from "react";

import { formatCurrency, formatNumber } from "@/lib/format";

const presets = {
  number: (n: number) => formatNumber(Math.round(n)),
  currency: (n: number) => formatCurrency(n, { compact: true }),
};

/**
 * Counts up to `value` the first time it's on screen. Renders the final value on
 * the server, so there's no layout shift and no animation without JavaScript.
 */
export function CountUp({
  value,
  preset = "number",
  duration = 1.2,
  className,
}: {
  value: number;
  preset?: keyof typeof presets;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const format = presets[preset];

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
