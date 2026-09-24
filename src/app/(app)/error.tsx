"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page width="narrow">
      <EmptyState
        icon={<TriangleAlert />}
        title="Something went wrong"
        description={
          <>
            This section failed to load. Try again, or contact support if it keeps happening.
            {error.digest && <span className="mt-2 block font-mono text-xs">Ref: {error.digest}</span>}
          </>
        }
        action={
          <Button onClick={reset} leftIcon={<RotateCcw />}>
            Try again
          </Button>
        }
      />
    </Page>
  );
}
