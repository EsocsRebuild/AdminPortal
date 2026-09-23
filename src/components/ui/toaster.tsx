"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import { useMediaQuery } from "@/hooks/use-media-query";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const desktop = useMediaQuery("(min-width: 40rem)");
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position={desktop ? "bottom-right" : "top-center"}
      gap={8}
      toastOptions={{
        classNames: {
          toast:
            "rounded-card! border-border! bg-surface-raised! text-foreground! font-sans! text-base! shadow-lg! gap-3!",
          title: "font-medium!",
          description: "text-muted-foreground! text-sm!",
          actionButton: "bg-primary! text-primary-foreground! rounded-xs! font-medium!",
          cancelButton: "bg-surface-muted! text-foreground! rounded-xs!",
          success: "[&_[data-icon]]:text-success!",
          error: "[&_[data-icon]]:text-danger!",
          warning: "[&_[data-icon]]:text-warning!",
          info: "[&_[data-icon]]:text-info!",
        },
      }}
    />
  );
}

export { toast } from "sonner";
