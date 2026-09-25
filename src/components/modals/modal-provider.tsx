"use client";

import * as React from "react";

import { ConfirmDialog, type ConfirmDialogProps } from "@/components/ui/confirm-dialog";

import { ReauthDialog } from "./reauth-dialog";

type Render = (api: { open: boolean; close: (value?: unknown) => void }) => React.ReactNode;

interface Entry {
  id: number;
  open: boolean;
  render: Render;
}

export type ConfirmOptions = Omit<ConfirmDialogProps, "open" | "onOpenChange" | "onConfirm"> & {
  /** Runs while the dialog shows a spinner; the dialog closes when it resolves. */
  onConfirm?: () => void | Promise<void>;
};

export interface Modals {
  /** Resolves true when confirmed, false when dismissed. */
  confirm(options: ConfirmOptions): Promise<boolean>;
  /** Asks for the password again. Resolves true once sudo mode is open. */
  reauth(): Promise<boolean>;
  /** Opens any dialog. Call `close(value)` from inside to resolve. */
  open<T = unknown>(
    render: (api: { open: boolean; close: (value?: T) => void }) => React.ReactNode,
  ): Promise<T | undefined>;
}

const ModalContext = React.createContext<Modals | null>(null);

/**
 * Imperative, promise-based dialogs that stack correctly and animate out
 * before unmounting:
 *
 *   const modals = useModals();
 *   if (await modals.confirm({ title: "Delete this form?", tone: "danger" })) …
 */
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const nextId = React.useRef(0);

  const open = React.useCallback<Modals["open"]>((render) => {
    return new Promise((resolve) => {
      const id = ++nextId.current;
      let settled = false;
      const close = (value?: unknown) => {
        if (settled) return;
        settled = true;
        resolve(value as never);
        setEntries((list) => list.map((e) => (e.id === id ? { ...e, open: false } : e)));
        // Unmount after the exit animation.
        setTimeout(() => setEntries((list) => list.filter((e) => e.id !== id)), 300);
      };
      setEntries((list) => [...list, { id, open: true, render: (api) => render({ ...api, close }) }]);
    });
  }, []);

  const confirm = React.useCallback<Modals["confirm"]>(
    ({ onConfirm, ...options }) =>
      open<boolean>(({ open: isOpen, close }) => (
        <ConfirmDialog
          {...options}
          open={isOpen}
          onOpenChange={(o) => !o && close(false)}
          onConfirm={async () => {
            await onConfirm?.();
            close(true);
          }}
        />
      )).then(Boolean),
    [open],
  );

  const reauth = React.useCallback<Modals["reauth"]>(
    () =>
      open<boolean>(({ open: isOpen, close }) => (
        <ReauthDialog open={isOpen} onDone={(ok) => close(ok)} />
      )).then(Boolean),
    [open],
  );

  const api = React.useMemo(() => ({ open, confirm, reauth }), [open, confirm, reauth]);

  return (
    <ModalContext value={api}>
      {children}
      {entries.map((e) => (
        <React.Fragment key={e.id}>{e.render({ open: e.open, close: () => {} })}</React.Fragment>
      ))}
    </ModalContext>
  );
}

/** Null outside the signed-in app (e.g. on auth pages). */
export function useOptionalModals() {
  return React.use(ModalContext);
}

export function useModals() {
  const ctx = React.use(ModalContext);
  if (!ctx) throw new Error("useModals must be used inside <ModalProvider>");
  return ctx;
}
