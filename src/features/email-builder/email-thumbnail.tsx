import { cn } from "@/lib/utils";

import { EmailPreview } from "./email-preview";
import type { EmailDocument } from "./types";

/** Scaled-down, non-interactive preview for cards and pickers. */
export function EmailThumbnail({ document, className }: { document: EmailDocument; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none relative h-44 overflow-hidden bg-surface-muted select-none", className)}>
      <div className="absolute top-0 left-1/2 w-[640px] origin-top -translate-x-1/2 scale-[0.42]">
        <EmailPreview document={document} className="rounded-none border-0 shadow-none" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
    </div>
  );
}
