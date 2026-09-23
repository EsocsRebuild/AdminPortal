"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { DialogCloseButton, DialogOverlay } from "./dialog";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva("fixed z-50 flex flex-col bg-surface-raised text-foreground shadow-lg focus:outline-none", {
  variants: {
    side: {
      right: [
        "inset-y-0 right-0 h-dvh w-full border-l border-border",
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        "data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right",
      ],
      left: [
        "inset-y-0 left-0 h-dvh w-[min(20rem,88vw)] border-r border-border",
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        "data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left",
      ],
      bottom: [
        "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-panel border-t border-border pb-[env(safe-area-inset-bottom)]",
        "data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom",
      ],
    },
    size: {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-xl",
      xl: "sm:max-w-3xl",
    },
  },
  compoundVariants: [{ side: "bottom", className: "sm:max-w-none" }],
  defaultVariants: { side: "right", size: "md" },
});

/** Panel sliding in from an edge. Use for record details and multi-field edits. */
export function SheetContent({
  className,
  children,
  side,
  size,
  hideClose,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & { hideClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content className={cn(sheetVariants({ side, size }), className)} {...props}>
        {children}
        {!hideClose && <DialogCloseButton className="top-[calc(env(safe-area-inset-top)+0.75rem)]" />}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1 border-b border-border-subtle px-5 py-4 pr-12", className)} {...props} />;
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-5", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 border-t border-border-subtle px-5 py-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-heading-sm font-semibold", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-base text-muted-foreground", className)} {...props} />;
}
