import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("flex flex-col rounded-card text-foreground", {
  variants: {
    variant: {
      default: "border border-border bg-surface",
      raised: "border border-border bg-surface-raised shadow-md",
      muted: "bg-surface-muted",
      outline: "border border-dashed border-border-strong",
      ghost: "",
    },
    interactive: {
      true: "transition-[border-color,box-shadow,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, interactive, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, interactive }), className)} {...props} />;
}

export function CardHeader({
  className,
  title,
  description,
  actions,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-start gap-x-4 gap-y-2 px-card pt-card", className)} {...props}>
      {(title || description) && (
        <div className="grid min-w-0 flex-1 gap-0.5">
          {title && <h3 className="text-md font-semibold tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 p-card", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border-subtle px-card py-3 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { cardVariants };
