"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  /** Require the user to type this text before confirming, e.g. a record name. */
  confirmText?: string;
  /** May return a promise; the dialog shows a spinner and closes when it resolves. */
  onConfirm: () => void | Promise<void>;
}

/** Confirmation for destructive or irreversible actions. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  confirmText,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const inputId = React.useId();
  const blocked = confirmText !== undefined && typed !== confirmText;

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        if (!next) setTyped("");
        onOpenChange(next);
      }}
    >
      <DialogContent size="sm" hideClose role="alertdialog">
        <DialogHeader className="pr-5 sm:pr-6">
          {tone === "danger" && (
            <span className="mb-2 grid size-10 place-items-center rounded-full bg-danger-soft text-danger">
              <AlertTriangle className="size-5" />
            </span>
          )}
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {confirmText !== undefined && (
          <div className="grid gap-1.5 px-5 pt-4 sm:px-6">
            <label htmlFor={inputId} className="text-sm text-muted-foreground">
              Type <span className="font-mono font-medium text-foreground">{confirmText}</span> to confirm
            </label>
            <Input id={inputId} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
            loading={pending}
            disabled={blocked}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
