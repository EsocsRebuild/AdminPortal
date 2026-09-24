import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

export interface FieldProps {
  label: React.ReactNode;
  /** Must match the id of the control passed as children. */
  htmlFor: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Label beside the control from `sm` up, for settings-style forms. */
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Label, control and hint or error. The message id is `${htmlFor}-msg`;
 * point the control's `aria-describedby` at it.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  optional,
  inline,
  className,
  children,
}: FieldProps) {
  const message = error ?? hint;
  const msg = message && (
    <p
      id={`${htmlFor}-msg`}
      role={error ? "alert" : undefined}
      className={cn("text-xs", error ? "text-danger" : "text-muted-foreground")}
    >
      {message}
    </p>
  );

  if (inline) {
    return (
      <div className={cn("grid gap-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6", className)}>
        <div className="grid content-start gap-1 sm:pt-2">
          <Label htmlFor={htmlFor} required={required} optional={optional}>
            {label}
          </Label>
          {!error && msg}
        </div>
        <div className="grid gap-1.5">
          {children}
          {error && msg}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required} optional={optional}>
        {label}
      </Label>
      {children}
      {msg}
    </div>
  );
}

/** Groups fields under a heading, e.g. a section of a settings page. */
export function Fieldset({
  legend,
  description,
  className,
  children,
}: {
  legend: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("grid gap-5", className)}>
      <div className="grid gap-1">
        <legend className="text-md font-semibold">{legend}</legend>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}
