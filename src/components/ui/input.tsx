import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared field chrome for Input, Textarea, Select triggers. */
export const fieldBase = cn(
  "w-full min-w-0 rounded-control border border-input bg-surface text-foreground shadow-xs",
  "placeholder:text-faint-foreground",
  "transition-[border-color,box-shadow] duration-150",
  "hover:border-border-strong",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
  "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
);

const sizes = {
  sm: "h-control-sm text-sm",
  md: "h-control-md",
  lg: "h-control-lg",
};

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: keyof typeof sizes;
  /** Icon or text inside the field, before the value. */
  prefix?: React.ReactNode;
  /** Icon, text or button inside the field, after the value. */
  suffix?: React.ReactNode;
}

// 16px on phones so iOS Safari does not zoom on focus; 14px from `sm`.
export function Input({ className, size = "md", prefix, suffix, type = "text", ...props }: InputProps) {
  const input = (
    <input
      type={type}
      className={cn(
        fieldBase,
        sizes[size],
        "px-3 max-sm:text-[16px]",
        prefix && "pl-9",
        suffix && "pr-10",
        "file:mr-3 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "[&::-webkit-search-cancel-button]:hidden",
        className,
      )}
      {...props}
    />
  );
  if (!prefix && !suffix) return input;
  return (
    <div className="relative w-full">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-subtle-foreground [&_svg]:size-4">
          {prefix}
        </span>
      )}
      {input}
      {suffix && (
        <span className="absolute inset-y-0 right-1.5 flex items-center text-subtle-foreground [&_svg]:size-4">
          {suffix}
        </span>
      )}
    </div>
  );
}
