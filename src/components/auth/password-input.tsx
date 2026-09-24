"use client";

import { ArrowBigUp, Eye, EyeOff, Lock } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";

/** Password field with show/hide and a Caps Lock warning. */
export function PasswordInput({ id, ...props }: Omit<InputProps, "type" | "prefix" | "suffix">) {
  const [show, setShow] = React.useState(false);
  const [caps, setCaps] = React.useState(false);
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) =>
    setCaps(e.getModifierState?.("CapsLock") ?? false);

  return (
    <div className="grid gap-1.5">
      <Input
        id={id}
        type={show ? "text" : "password"}
        prefix={<Lock />}
        onKeyDown={onKey}
        onKeyUp={onKey}
        onBlur={() => setCaps(false)}
        suffix={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            aria-controls={id}
          >
            {show ? <EyeOff /> : <Eye />}
          </Button>
        }
        {...props}
      />
      {caps && (
        <p
          role="status"
          className="flex animate-rise-in items-center gap-1.5 text-xs text-warning-soft-foreground"
        >
          <ArrowBigUp className="size-3.5" /> Caps Lock is on
        </p>
      )}
    </div>
  );
}
