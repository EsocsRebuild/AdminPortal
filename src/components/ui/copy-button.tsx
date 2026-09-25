"use client";

import { Check, Copy } from "lucide-react";

import { useCopy } from "@/hooks/use-copy";

import { Button, type ButtonProps } from "./button";

/** Copies `value` and confirms with a tick. */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  value: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
}) {
  const { copied, copy } = useCopy();
  return (
    <Button
      variant="secondary"
      size={iconOnly ? "icon-sm" : "sm"}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      leftIcon={
        iconOnly ? undefined : copied ? <Check className="animate-scale-in text-success" /> : <Copy />
      }
      onClick={() => copy(value)}
      {...props}
    >
      {iconOnly ? (
        copied ? (
          <Check className="animate-scale-in text-success" />
        ) : (
          <Copy />
        )
      ) : copied ? (
        copiedLabel
      ) : (
        label
      )}
    </Button>
  );
}
