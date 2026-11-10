"use client";

import { ArrowBigUp, Eye, EyeOff, Lock } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "suffix"> {
  hidePrefix?: boolean;
}

/** Password field with show/hide toggle, accessible controls, and a Caps Lock warning. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, hidePrefix = false, prefix, onKeyDown, onKeyUp, onBlur, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const [caps, setCaps] = React.useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      setCaps(e.getModifierState?.("CapsLock") ?? false);
      onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      setCaps(e.getModifierState?.("CapsLock") ?? false);
      onKeyUp?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setCaps(false);
      onBlur?.(e);
    };

    return (
      <div className="grid gap-1.5">
        <Input
          ref={ref}
          id={id}
          type={show ? "text" : "password"}
          prefix={hidePrefix ? undefined : (prefix ?? <Lock />)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          suffix={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              aria-controls={id}
              className="text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus-visible:ring-1"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
  },
);

PasswordInput.displayName = "PasswordInput";
