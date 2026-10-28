"use client";

import * as React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reconcileBatchAction } from "../actions";

interface BatchStatusToggleProps {
  batchId: string;
  initialStatus: "open" | "verified" | "reconciled";
}

export function BatchStatusToggle({ batchId, initialStatus }: BatchStatusToggleProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState(initialStatus);
  const [loading, setLoading] = React.useState(false);

  const handleReconcile = async () => {
    setLoading(true);
    const nextStatus = status === "reconciled" ? "verified" : "reconciled";
    const res = await reconcileBatchAction({
      batchId,
      status: nextStatus,
      verifiedBy: "Parish Financial Secretary",
    });
    setLoading(false);
    if (res.ok) {
      setStatus(nextStatus);
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-1.5 justify-center">
      <Badge
        tone={status === "reconciled" ? "success" : status === "verified" ? "info" : "warning"}
        className="capitalize cursor-pointer"
        onClick={handleReconcile}
        title="Click to toggle audit reconciliation status"
      >
        {status}
      </Badge>
      <Button
        variant="ghost"
        size="xs"
        disabled={loading}
        onClick={handleReconcile}
        className="h-6 px-1 text-3xs text-muted-foreground hover:text-foreground"
      >
        {status === "reconciled" ? (
          <CheckCircle2 className="size-3 text-success" />
        ) : (
          <Clock className="size-3 text-warning" />
        )}
      </Button>
    </div>
  );
}

