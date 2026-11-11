"use client";

import * as React from "react";
import Link from "next/link";
import { Church, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <Church className="size-7" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        We encountered a temporary interruption
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The church administration service could not complete your request at this moment. Please check your
        connection and try again.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
        <Button onClick={reset} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <RotateCcw className="size-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
