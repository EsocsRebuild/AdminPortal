import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva("relative flex gap-3 rounded-card border p-3.5 text-base [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    tone: {
      info: "border-info/25 bg-info-soft text-info-soft-foreground",
      success: "border-success/25 bg-success-soft text-success-soft-foreground",
      warning: "border-warning/35 bg-warning-soft text-warning-soft-foreground",
      danger: "border-danger/25 bg-danger-soft text-danger-soft-foreground",
      neutral: "border-border bg-surface-muted text-foreground",
    },
  },
  defaultVariants: { tone: "info" },
});

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle, neutral: Info };

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  action?: React.ReactNode;
}

export function Alert({ className, tone, title, action, children, ...props }: AlertProps) {
  const Icon = icons[tone ?? "info"];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn(alertVariants({ tone }), className)} {...props}>
      <Icon aria-hidden />
      <div className="grid flex-1 gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-foreground/80">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
