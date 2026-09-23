"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn, hashToIndex, initials } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none",
  {
    variants: {
      size: {
        xs: "size-5 text-[0.5625rem]",
        sm: "size-7 text-2xs",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
        xl: "size-14 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

// Deterministic, theme-safe fallback colours.
const tints = [
  "bg-[oklch(0.93_0.04_265)] text-[oklch(0.4_0.13_265)] dark:bg-[oklch(0.35_0.08_265)] dark:text-[oklch(0.9_0.05_265)]",
  "bg-[oklch(0.94_0.05_80)] text-[oklch(0.45_0.1_65)] dark:bg-[oklch(0.38_0.07_70)] dark:text-[oklch(0.92_0.06_85)]",
  "bg-[oklch(0.94_0.04_165)] text-[oklch(0.42_0.1_165)] dark:bg-[oklch(0.35_0.06_165)] dark:text-[oklch(0.9_0.06_165)]",
  "bg-[oklch(0.94_0.035_10)] text-[oklch(0.47_0.15_10)] dark:bg-[oklch(0.36_0.08_10)] dark:text-[oklch(0.9_0.05_10)]",
  "bg-[oklch(0.94_0.035_300)] text-[oklch(0.45_0.14_300)] dark:bg-[oklch(0.36_0.08_300)] dark:text-[oklch(0.9_0.05_300)]",
  "bg-[oklch(0.94_0.035_220)] text-[oklch(0.45_0.12_220)] dark:bg-[oklch(0.36_0.07_220)] dark:text-[oklch(0.9_0.05_220)]",
];

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string;
  src?: string | null;
  className?: string;
  /** Presence dot. */
  status?: "online" | "away" | "offline";
}

export function Avatar({ name, src, size, status, className }: AvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)}>
        {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
        <AvatarPrimitive.Fallback
          delayMs={src ? 400 : 0}
          className={cn("grid size-full place-items-center", tints[hashToIndex(name, tints.length)])}
          aria-label={name}
        >
          {initials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          aria-label={status}
          className={cn(
            "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-surface",
            status === "online" && "bg-success",
            status === "away" && "bg-warning",
            status === "offline" && "bg-faint-foreground",
          )}
        />
      )}
    </span>
  );
}

/** Overlapping avatars with a "+N" overflow. */
export function AvatarGroup({
  people,
  max = 4,
  size = "sm",
  className,
}: {
  people: { name: string; src?: string | null }[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("flex items-center -space-x-1.5", className)}>
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={size} className="ring-2 ring-surface" />
      ))}
      {rest > 0 && (
        <span className={cn(avatarVariants({ size }), "bg-surface-muted text-muted-foreground ring-2 ring-surface")}>
          +{rest}
        </span>
      )}
    </div>
  );
}
