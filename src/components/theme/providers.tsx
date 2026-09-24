"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { SessionProvider } from "@/components/auth/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SessionUser } from "@/types/auth";

export function Providers({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <SessionProvider user={user}>
          <TooltipProvider delayDuration={400} skipDelayDuration={150}>
            {children}
          </TooltipProvider>
        </SessionProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
