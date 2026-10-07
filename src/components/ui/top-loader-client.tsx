"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopLoaderClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Trigger attention-grabbing progress animation on route change
  React.useEffect(() => {
    const t0 = setTimeout(() => {
      setLoading(true);
      setProgress(20);
    }, 0);
    const t1 = setTimeout(() => setProgress(60), 120);
    const t2 = setTimeout(() => setProgress(88), 280);
    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 450);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-99999">
      {/* Top glowing progress bar */}
      <div
        className="h-1 bg-linear-to-r from-amber-400 via-emerald-400 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.9)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Leading particle light effect */}
      <div
        className="absolute top-0 size-3 -translate-x-1/2 -translate-y-1 animate-pulse rounded-full bg-amber-300 shadow-[0_0_24px_#FCD34D] transition-all duration-300 ease-out"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}
