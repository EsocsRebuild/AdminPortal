import * as React from "react";

import { cn } from "@/lib/utils";

import { previewMergeTags } from "./merge-tags";
import type { Block, EmailDocument } from "./types";

/** Renders **bold** and line breaks. Everything else is plain text (no HTML). */
function RichText({ text }: { text: string }) {
  return (
    <>
      {previewMergeTags(text)
        .split("\n")
        .map((line, i, lines) => (
          <React.Fragment key={i}>
            {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                <React.Fragment key={j}>{part}</React.Fragment>
              ),
            )}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
    </>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9aa1ad] italic">{children}</span>;
}

function BlockView({ block, accent }: { block: Block; accent: string }) {
  const align = "align" in block && block.align === "center" ? "text-center" : "text-left";
  switch (block.type) {
    case "heading":
      return (
        <h2 className={cn("text-[22px] leading-tight font-bold tracking-tight text-[#111827]", align)}>
          {block.text ? previewMergeTags(block.text) : <Placeholder>Heading</Placeholder>}
        </h2>
      );
    case "text":
      return (
        <p className={cn("text-[15px] leading-[1.65] text-[#374151]", align)}>
          {block.text ? <RichText text={block.text} /> : <Placeholder>Your text</Placeholder>}
        </p>
      );
    case "button":
      return (
        <div className={align}>
          <span
            className="inline-block rounded-[8px] px-5 py-3 text-[15px] font-semibold"
            style={
              block.style === "filled"
                ? { background: accent, color: "#fff" }
                : { border: `2px solid ${accent}`, color: accent }
            }
          >
            {block.label || "Button"}
          </span>
        </div>
      );
    case "image":
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote, author-supplied email image
        <img
          src={block.src}
          alt={block.alt}
          referrerPolicy="no-referrer"
          className={cn("mx-auto block h-auto rounded-[6px]", block.width === "full" ? "w-full" : "w-2/3")}
        />
      ) : (
        <div className="grid h-40 place-items-center rounded-[6px] border-2 border-dashed border-[#d1d5db] text-sm text-[#9aa1ad]">
          Image
        </div>
      );
    case "divider":
      return <hr className="border-0 border-t border-[#e5e7eb]" />;
    case "spacer":
      return <div aria-hidden className={{ sm: "h-2", md: "h-6", lg: "h-12" }[block.size]} />;
  }
}

export interface EmailPreviewProps {
  document: EmailDocument;
  subject?: string;
  previewText?: string;
  fromName?: string;
  /** Shown in the required footer. */
  organisation?: { name: string; address: string | null };
  device?: "desktop" | "mobile";
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * What recipients will see. Colours are fixed (emails don't follow the
 * portal's theme). The footer with address and unsubscribe link is always
 * added by the API, as the law requires.
 */
export function EmailPreview({
  document,
  subject,
  previewText,
  fromName,
  organisation,
  device = "desktop",
  selectedId,
  onSelect,
  className,
}: EmailPreviewProps) {
  const accent = document.settings.accentColor;
  return (
    <div className={cn("overflow-hidden rounded-card border border-border bg-surface shadow-sm", className)}>
      {(subject !== undefined || fromName) && (
        <div className="grid gap-0.5 border-b border-border px-4 py-3 text-sm">
          <p className="truncate">
            <span className="text-muted-foreground">From </span>
            <span className="font-medium">{fromName || "Your organisation"}</span>
          </p>
          <p className="truncate font-semibold">{subject ? previewMergeTags(subject) : <span className="text-subtle-foreground">No subject yet</span>}</p>
          {previewText && <p className="truncate text-muted-foreground">{previewMergeTags(previewText)}</p>}
        </div>
      )}
      <div
        className={cn(
          "flex justify-center overflow-x-hidden px-3 py-6 transition-colors",
          document.settings.background === "muted" ? "bg-[#f3f4f6]" : "bg-white",
        )}
      >
        <div
          className={cn(
            "w-full rounded-[10px] bg-white text-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[max-width] duration-500 ease-out-expo",
            device === "desktop" ? "max-w-[600px]" : "max-w-[360px]",
          )}
          style={{ colorScheme: "light" }}
        >
          <div className="grid gap-4 px-6 py-7 sm:px-8">
            {document.blocks.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#9aa1ad]">Add blocks on the left to start building your email.</p>
            ) : (
              document.blocks.map((block) =>
                onSelect ? (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => onSelect(block.id)}
                    className={cn(
                      "-mx-2 cursor-pointer rounded-[6px] px-2 py-1 text-left outline-offset-2 transition-[outline-color,background-color]",
                      "outline-2 outline-transparent hover:bg-[#f9fafb]",
                      selectedId === block.id && "outline-[color:var(--primary)]",
                    )}
                    aria-label={`Edit ${block.type} block`}
                  >
                    <BlockView block={block} accent={accent} />
                  </button>
                ) : (
                  <BlockView key={block.id} block={block} accent={accent} />
                ),
              )
            )}
          </div>
          <footer className="grid gap-1 border-t border-[#f0f1f3] px-6 py-5 text-center text-[12px] leading-relaxed text-[#6b7280] sm:px-8">
            <p>{organisation?.name ?? "Your organisation"}</p>
            <p>{organisation?.address ?? "Your postal address is added here"}</p>
            <p>
              You’re receiving this because you subscribed. <span className="underline">Unsubscribe</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
