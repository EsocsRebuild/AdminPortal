import * as React from "react";

import { cn } from "@/lib/utils";

/** Keyboard key. Pass `keys` to render a combo like ⌘ K. */
export function Kbd({
  className,
  keys,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { keys?: string[] }) {
  const content = keys ?? [children];
  return (
    <span className="inline-flex items-center gap-0.5">
      {content.map((k, i) => (
        <kbd
          key={i}
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-border bg-surface px-1 font-sans text-2xs font-medium text-muted-foreground shadow-xs",
            className,
          )}
          {...props}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}
