"use client";

import * as React from "react";
import { HelpCircle, Lightbulb } from "lucide-react";

import { Tooltip } from "@/components/ui/tooltip";
import { QuickTipsModal } from "@/components/modals/quick-tips-modal";
import { cn } from "@/lib/utils";

export function QuickTipsTrigger() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Tooltip content="Quick Tips & Guide" shortcut="?">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex size-control-sm cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors",
            "hover:bg-amber-500/10 hover:text-amber-500 focus-visible:outline-2 focus-visible:outline-ring"
          )}
          aria-label="Open Quick Tips & Guide"
        >
          <Lightbulb className="size-4" />
        </button>
      </Tooltip>

      <QuickTipsModal open={open} onOpenChange={setOpen} />
    </>
  );
}
