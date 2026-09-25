"use client";

import { FileUp } from "lucide-react";
import * as React from "react";

import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface FileDropProps {
  accept: string;
  /** Bytes. */
  maxSize: number;
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  hint?: React.ReactNode;
  className?: string;
}

/** Drag-and-drop or click to choose a single file. Checks type and size before handing it over. */
export function FileDrop({ accept, maxSize, onFile, onError, hint, className }: FileDropProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const id = React.useId();

  const handle = (file: File | undefined) => {
    if (!file) return;
    const okType = accept.split(",").some((a) => {
      const t = a.trim().toLowerCase();
      return t.startsWith(".") ? file.name.toLowerCase().endsWith(t) : file.type === t;
    });
    if (!okType) return onError?.("That file type isn’t supported.");
    if (file.size > maxSize)
      return onError?.(`That file is too large. The limit is ${formatBytes(maxSize)}.`);
    onFile(file);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files[0]);
      }}
      className={cn(
        "group grid cursor-pointer justify-items-center gap-3 rounded-card border-2 border-dashed border-border-strong bg-surface-muted/40 px-6 py-10 text-center transition-all duration-200",
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:border-primary/50 hover:bg-primary-soft/40",
        over && "scale-[1.01] border-primary bg-primary-soft/60",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-surface text-primary shadow-sm transition-transform duration-300 ease-spring group-hover:-translate-y-0.5">
        <FileUp className="size-5" />
      </span>
      <span className="grid gap-1">
        <span className="font-medium">
          Drop your file here, or{" "}
          <span className="text-primary underline underline-offset-4">choose one</span>
        </span>
        {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      </span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}
