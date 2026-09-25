"use client";

import * as React from "react";

import type { ActionResult } from "@/lib/result";

export type SaveState = "saved" | "unsaved" | "saving" | "error";

/**
 * Saves `value` after it stops changing for `delay` ms. Only the latest value
 * is sent; if an edit lands mid-save, another save follows. "Unsaved" is
 * derived by comparing against the last saved value, so the indicator is
 * always truthful. Warns before the tab closes while changes are unsaved.
 *
 * `value` must be referentially stable between edits (memoise drafts).
 */
export function useAutosave<T>(
  value: T,
  save: (value: T) => Promise<ActionResult<unknown>>,
  { delay = 1200, enabled = true } = {},
) {
  const [saved, setSaved] = React.useState(value);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const latest = React.useRef(value);
  const savedRef = React.useRef(value);
  const inFlight = React.useRef(false);
  const saveRef = React.useRef(save);
  const flushRef = React.useRef<() => Promise<void>>(async () => {});

  React.useEffect(() => {
    latest.current = value;
    saveRef.current = save;
  });

  React.useEffect(() => {
    flushRef.current = async () => {
      if (inFlight.current) return;
      const next = latest.current;
      if (next === savedRef.current) return;
      inFlight.current = true;
      setSaving(true);
      const res = await saveRef.current(next);
      inFlight.current = false;
      setSaving(false);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setError(null);
      savedRef.current = next;
      setSaved(next);
      // Another edit arrived while saving: save that too.
      if (latest.current !== next) void flushRef.current();
    };
  }, []);

  React.useEffect(() => {
    if (!enabled || value === savedRef.current) return;
    const id = setTimeout(() => void flushRef.current(), delay);
    return () => clearTimeout(id);
  }, [value, delay, enabled]);

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (latest.current !== savedRef.current || inFlight.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const state: SaveState = saving ? "saving" : error ? "error" : value !== saved ? "unsaved" : "saved";
  const flush = React.useCallback(() => flushRef.current(), []);
  return { state, error, flush };
}
