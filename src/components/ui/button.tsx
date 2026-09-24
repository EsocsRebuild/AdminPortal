import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-expo",
    "active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary bg-[linear-gradient(180deg,oklch(1_0_0/0.14),transparent_60%)] text-primary-foreground shadow-button hover:bg-primary-hover",
        secondary:
          "border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-surface-hover",
        soft: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70",
        outline: "border border-border-strong bg-transparent text-foreground hover:bg-surface-hover",
        ghost: "bg-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground",
        inverse: "bg-inverse text-inverse-foreground shadow-button hover:bg-inverse/90",
        danger:
          "bg-danger bg-[linear-gradient(180deg,oklch(1_0_0/0.14),transparent_60%)] text-danger-foreground shadow-button hover:bg-danger-hover",
        "danger-soft":
          "bg-danger-soft text-danger-soft-foreground hover:bg-danger hover:text-danger-foreground",
        link: "h-auto! rounded-xs px-0! text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        xs: "h-control-xs gap-1.5 px-2 text-xs [&_svg]:size-3.5",
        sm: "h-control-sm gap-1.5 px-3 text-sm [&_svg]:size-4",
        md: "h-control-md px-3.5 text-sm [&_svg]:size-4",
        lg: "h-control-lg px-5 text-base [&_svg]:size-4.5",
        "icon-xs": "size-control-xs [&_svg]:size-3.5",
        "icon-sm": "size-control-sm [&_svg]:size-4",
        icon: "size-control-md [&_svg]:size-4",
        "icon-lg": "size-control-lg [&_svg]:size-5",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Merge styles onto the child element, e.g. a Next.js `<Link>`. */
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      <Slottable>{children}</Slottable>
      {rightIcon}
    </Comp>
  );
}

export { buttonVariants };
