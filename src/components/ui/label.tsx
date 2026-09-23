import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({
  className,
  required,
  optional,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; optional?: boolean }) {
  return (
    <label className={cn("text-sm font-medium text-foreground", className)} {...props}>
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-danger">
          *
        </span>
      )}
      {optional && <span className="ml-1.5 font-normal text-subtle-foreground">Optional</span>}
    </label>
  );
}
