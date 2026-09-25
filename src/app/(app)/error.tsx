"use client";

import { CloudOff, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Shown when a page can't load, usually because the API is unreachable.
 * Error details stay on the server; the reference helps support find the log entry.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page width="narrow">
      <EmptyState
        icon={<CloudOff />}
        title="This page couldn’t load"
        description={
          <>
            We couldn’t get the latest information. Check your internet connection and try again. If it keeps happening, contact support.
            {error.digest && <span className="mt-3 block font-mono text-xs text-subtle-foreground">Reference: {error.digest}</span>}
          </>
        }
        action={
          <>
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button onClick={reset} leftIcon={<RotateCcw />}>
              Try again
            </Button>
          </>
        }
      />
    </Page>
  );
}
