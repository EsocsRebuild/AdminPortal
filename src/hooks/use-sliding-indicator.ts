"use client";

import * as React from "react";

export interface IndicatorRect {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  /** False on first measurement so the indicator doesn't slide in from 0. */
  animate: boolean;
}

/**
 * Measures whichever child matches `activeSelector` (e.g. `[data-state=active]`)
 * inside the returned container ref, re-measuring on state changes and resizes.
 * The container must be `position: relative`.
 */
export function useSlidingIndicator<T extends HTMLElement>(activeSelector: string) {
  const ref = React.useRef<T>(null);
  const [rect, setRect] = React.useState<IndicatorRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    animate: false,
  });

  React.useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    let measured = false;

    const update = () => {
      const active = container.querySelector<HTMLElement>(activeSelector);
      if (!active) return setRect((r) => ({ ...r, visible: false }));
      setRect({
        x: active.offsetLeft,
        y: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
        visible: true,
        animate: measured,
      });
      measured = true;
    };

    update();
    const mo = new MutationObserver(update);
    mo.observe(container, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [activeSelector]);

  return { ref, rect };
}
