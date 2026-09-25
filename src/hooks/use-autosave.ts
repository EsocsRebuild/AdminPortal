"use client";

import * as React from "react";

import type { ActionResult } from "@/lib/result";

export type SaveState = "saved" | "unsaved" | "saving" | "error";

/**
 * Saves `value` after it stops changing for `delay` ms. Only the latest value
 * is sent; if an edit lands mid-save, another save follows. Warns before the
 * tab closes while changes are unsaved.
 */
export function useAutosave<T>(value: T, save: (value: T) => Promise<ActionResult<unknown>>, { delay = 1200, enabled = true } = {}) {
  const [state, setState] = React.useState<SaveState>("saved");
  const [error, setError] = React.useState<string | null>(null);
  const first = React.useRef(true);
  const latest = React.useRef(value);
  const inFlight = React.useRef(false);
  const dirty = React.useRef(false);
  const saveRef = React.useRef(save);
  React.useEffect(() => {
    saveRef.current = save;
  });

  const flush = React.useCallback(async () => {
    if (inFlight.current || !dirty.current) return;
    inFlight.current = true;
    dirty.current = false;
    setState("saving");
    const res = await saveRef.current(latest.current);
    inFlight.current = false;
    if (!res.ok) {
      dirty.current = true;
      setError(res.message);
      setState("error");
      return;
    }
    setError(null);
    if (dirty.current) void flush();
    else setState("saved");
  }, []);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!enabled) return;
    latest.current = value;
    dirty.current = true;
    setState("unsaved");
    const id = setTimeout(() => void flush(), delay);
    return () => clearTimeout(id);
  }, [value, delay, enabled, flush]);

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current || inFlight.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return { state, error, flush };
}
