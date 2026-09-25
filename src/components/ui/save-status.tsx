"use client";

import { AlertCircle, Check, CloudUpload } from "lucide-react";

import type { SaveState } from "@/hooks/use-autosave";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Spinner } from "./spinner";

/** Small "Saved / Saving… / Couldn't save" indicator for autosaving editors. */
export function SaveStatus({ state, onRetry, className }: { state: SaveState; onRetry?: () => void; className?: string }) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      {state === "saved" && (
        <>
          <Check className="size-4 text-success" /> Saved
        </>
      )}
      {state === "unsaved" && (
        <>
          <CloudUpload className="size-4" /> Unsaved changes
        </>
      )}
      {state === "saving" && (
        <>
          <Spinner className="size-3.5" /> Saving…
        </>
      )}
      {state === "error" && (
        <>
          <AlertCircle className="size-4 text-danger" />
          <span className="text-danger">Couldn’t save</span>
          {onRetry && (
            <Button variant="link" size="xs" onClick={onRetry}>
              Try again
            </Button>
          )}
        </>
      )}
    </span>
  );
}
