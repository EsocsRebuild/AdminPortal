import * as React from "react";

import { cn } from "@/lib/utils";

import { fieldBase } from "./input";

export function Textarea({
  className,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldBase, "field-sizing-content min-h-20 px-3 py-2 max-sm:text-[16px]", className)}
      {...props}
    />
  );
}
