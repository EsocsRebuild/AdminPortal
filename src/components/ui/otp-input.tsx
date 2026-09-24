"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
}

/**
 * One-time code boxes. Typing advances, Backspace goes back, arrows move,
 * and pasting a full code fills every box. Uses the platform's one-time-code autofill.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  autoFocus,
  "aria-label": ariaLabel = "Verification code",
}: OtpInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex justify-between gap-2 sm:gap-2.5", invalid && "animate-shake")}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          maxLength={length}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            const typed = e.target.value.replace(/\D/g, "");
            if (!typed) return;
            // A paste or autofill into any box fills from that position.
            const next = (value.slice(0, i) + typed).slice(0, length);
            commit(next);
            focus(i + typed.length);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (d) commit(value.slice(0, i) + value.slice(i + 1));
              else if (i > 0) {
                commit(value.slice(0, i - 1) + value.slice(i));
                focus(i - 1);
              }
            } else if (e.key === "ArrowLeft") focus(i - 1);
            else if (e.key === "ArrowRight") focus(i + 1);
          }}
          className={cn(
            "aspect-[5/6] w-full max-w-14 min-w-0 rounded-control border border-input bg-surface text-center font-mono text-2xl font-medium text-foreground caret-primary shadow-xs",
            "transition-[border-color,box-shadow,transform] duration-200 ease-out-expo",
            "focus:scale-105 focus:border-ring focus:ring-4 focus:ring-ring/15 focus:outline-none",
            d && "border-border-strong",
            "aria-invalid:border-danger aria-invalid:focus:ring-danger/15",
            "disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}
