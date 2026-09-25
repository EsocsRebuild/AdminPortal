import * as React from "react";

import { ShellProvider } from "./shell-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * Sidebar + top bar frame for every signed-in screen.
 * ≥ lg: persistent sidebar (collapsible to a rail). < lg: drawer from the top bar.
 */
export function AppShell({
  children,
  showDesignSystem,
}: {
  children: React.ReactNode;
  showDesignSystem: boolean;
}) {
  return (
    <ShellProvider showDesignSystem={showDesignSystem}>
      <div className="min-h-dvh lg:grid lg:grid-cols-[var(--spacing-sidebar)_minmax(0,1fr)] lg:transition-[grid-template-columns] lg:duration-200 lg:ease-emphasized lg:rail:grid-cols-[var(--spacing-rail)_minmax(0,1fr)]">
        <Sidebar className="sticky top-0 hidden h-dvh lg:flex" />
        <div className="flex min-w-0 flex-col">
          <a
            href="#main"
            className="sr-only z-50 rounded-control bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Topbar />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </ShellProvider>
  );
}
