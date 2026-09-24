"use client";

import { useCallback, useEffect, useState } from "react";

/** Seconds remaining; call `restart()` to begin again. */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const restart = useCallback(() => setLeft(seconds), [seconds]);
  return { left, done: left <= 0, restart };
}
