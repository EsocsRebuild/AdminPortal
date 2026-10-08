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
    <label className={cn("text-sm font-semibold text-slate-900 dark:text-slate-100", className)} {...props}>
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 font-bold text-danger">
          *
        </span>
      )}
      {optional && <span className="ml-1.5 font-normal text-slate-400">Optional</span>}
    </label>
  );
}
