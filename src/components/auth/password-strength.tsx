import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A symbol, like ! or #", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const levels = [
  { label: "Too weak", tone: "bg-danger" },
  { label: "Weak", tone: "bg-danger" },
  { label: "Fair", tone: "bg-warning" },
  { label: "Good", tone: "bg-success" },
  { label: "Strong", tone: "bg-success" },
];

export function passwordScore(password: string) {
  return rules.filter((r) => r.test(password)).length;
}

/** Four-segment meter plus a plain-language checklist. */
export function PasswordStrength({ password, id }: { password: string; id?: string }) {
  const score = passwordScore(password);
  const level = levels[score];
  return (
    <div id={id} className="grid gap-2.5" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
          {rules.map((_, i) => (
            <span key={i} className="h-1 overflow-hidden rounded-full bg-surface-muted">
              <span
                className={cn(
                  "block h-full origin-left rounded-full transition-transform duration-500 ease-out-expo",
                  level.tone,
                  i < score ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          ))}
        </div>
        <span className="w-16 text-right text-xs font-medium text-muted-foreground">
          {password ? level.label : ""}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {rules.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.label}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors duration-200",
                ok ? "text-success-soft-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-3.5 shrink-0 place-items-center rounded-full border transition-all duration-200",
                  ok ? "border-success bg-success text-success-foreground" : "border-border-strong",
                )}
              >
                {ok && <Check className="size-2.5 animate-scale-in" strokeWidth={3} />}
              </span>
              {r.label}
              <span className="sr-only">{ok ? "(done)" : "(missing)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
