"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { AppSplashLoader } from "@/components/ui/app-splash-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopLoader } from "@/components/ui/top-loader";

/** App-wide client providers. Session-aware providers live in the (app) layout. */
export function Providers({ nonce, children }: { nonce?: string; children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      nonce={nonce}
    >
      <MotionConfig reducedMotion="user" nonce={nonce}>
        <TooltipProvider delayDuration={400} skipDelayDuration={150}>
          <AppSplashLoader />
          <TopLoader />
          {children}
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
