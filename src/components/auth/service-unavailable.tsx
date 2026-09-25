import { CloudOff, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Shown when a public page can't reach the API. */
export function ServiceUnavailable({ retryHref, message }: { retryHref: string; message?: string }) {
  return (
    <div className="grid justify-items-center gap-4 text-center">
      <span className="grid size-12 place-items-center rounded-card border border-border bg-surface text-muted-foreground shadow-sm">
        <CloudOff className="size-5" />
      </span>
      <div className="grid gap-1.5">
        <h1 className="text-heading-md font-semibold">We can’t connect right now</h1>
        <p className="text-md text-muted-foreground">
          {message ?? "The service is temporarily unavailable. Please try again in a moment."}
        </p>
      </div>
      <Button asChild leftIcon={<RotateCcw />}>
        <Link href={retryHref}>Try again</Link>
      </Button>
    </div>
  );
}
