import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const pageVariants = cva("mx-auto grid w-full content-start gap-page px-gutter pt-6 pb-16 sm:pt-8", {
  variants: {
    width: {
      default: "max-w-page",
      narrow: "max-w-4xl",
      form: "max-w-form",
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "default" },
});

/** Page body with consistent width, gutters and vertical rhythm. */
export function Page({
  className,
  width,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof pageVariants>) {
  return <div className={cn(pageVariants({ width }), className)} {...props} />;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary actions. Stack under the title on phones. */
  actions?: React.ReactNode;
  /** Small element above the title, e.g. a status badge. */
  eyebrow?: React.ReactNode;
  /** Tabs or filters under the heading. */
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, eyebrow, children, className }: PageHeaderProps) {
  return (
    <header className={cn("grid gap-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid min-w-0 gap-1.5">
          {eyebrow}
          <h1 className="text-heading-lg font-semibold">{title}</h1>
          {description && <p className="max-w-2xl text-md text-muted-foreground">{description}</p>}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:[&>*]:flex-1">{actions}</div>
        )}
      </div>
      {children}
    </header>
  );
}

/** Heading for a region within a page. */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="grid gap-0.5">
        <h2 className="text-heading-sm font-semibold">{title}</h2>
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
