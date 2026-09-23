"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * Bind a keyboard shortcut, e.g. `useHotkey("mod+k", open)`.
 * `mod` is ⌘ on Apple platforms and Ctrl elsewhere. Ignored while typing in
 * a field unless `allowInInputs` is set.
 */
export function useHotkey(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  { allowInInputs = false, enabled = true } = {},
) {
  const onKey = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split("+");
    const key = parts.pop()!;
    const want = { mod: parts.includes("mod"), shift: parts.includes("shift"), alt: parts.includes("alt") };

    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if (typing && !allowInInputs && !want.mod) return;
      const mod = event.metaKey || event.ctrlKey;
      if (mod !== want.mod || event.shiftKey !== want.shift || event.altKey !== want.alt) return;
      if (event.key.toLowerCase() !== key) return;
      event.preventDefault();
      onKey(event);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [combo, allowInInputs, enabled]);
}
