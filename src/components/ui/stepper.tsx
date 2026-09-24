import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Progress through a short multi-step flow. */
export function Stepper({
  steps,
  current,
  className,
}: {
  steps: string[];
  current: number;
  className?: string;
}) {
  return (
    <ol aria-label="Progress" className={cn("flex items-center gap-2", className)}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className="flex flex-1 items-center gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold transition-all duration-300 ease-out-expo",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary-soft text-primary-soft-foreground ring-2 ring-primary",
                !done && !active && "bg-surface-muted text-subtle-foreground",
              )}
            >
              {done ? <Check className="size-3.5 animate-scale-in" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm whitespace-nowrap sm:block",
                active ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
              <span className="sr-only">{done ? " (completed)" : active ? " (current step)" : ""}</span>
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="relative h-px flex-1 overflow-hidden bg-border">
                <span
                  className={cn(
                    "absolute inset-0 origin-left bg-primary transition-transform duration-500 ease-out-expo",
                    done ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
