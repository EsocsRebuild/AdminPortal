"use client";

import * as React from "react";
import { Lightbulb, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickTipsModal } from "@/components/modals/quick-tips-modal";
import { cn } from "@/lib/utils";

export interface ContextualTipCardProps {
  id: string;
  title: string;
  description: string;
  shortcut?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function ContextualTipCard({
  id,
  title,
  description,
  shortcut,
  actionText = "Learn More",
  onAction,
  className,
}: ContextualTipCardProps) {
  const [dismissed, setDismissed] = React.useState(true);
  const [tipsModalOpen, setTipsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const isDismissed = localStorage.getItem(`tip_dismissed_${id}`);
    setDismissed(isDismissed === "true");
  }, [id]);

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem(`tip_dismissed_${id}`, "true");
  }

  if (dismissed) return null;

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-panel border border-amber-500/20 bg-amber-500/5 p-4 text-foreground shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-amber-400/20 dark:bg-amber-400/5",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lightbulb className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">{title}</h4>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-2xs font-medium text-amber-700 dark:text-amber-300">
                <Sparkles className="size-2.5" /> Quick Tip
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            size="xs"
            variant="outline"
            onClick={onAction ?? (() => setTipsModalOpen(true))}
            className="border-amber-500/30 text-xs hover:bg-amber-500/10"
          >
            {actionText}
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            className="grid size-6 place-items-center rounded-xs text-subtle-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Dismiss tip"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <QuickTipsModal open={tipsModalOpen} onOpenChange={setTipsModalOpen} />
    </>
  );
}
