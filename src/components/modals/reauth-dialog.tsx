"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { useSession } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { reauthenticate } from "@/features/auth/actions";
import { fieldError, type ActionResult } from "@/lib/result";

/** "Confirm it's you" before a dangerous action. Opens a short sudo window on success. */
export function ReauthDialog({ open, onDone }: { open: boolean; onDone: (ok: boolean) => void }) {
  const user = useSession();
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<null> | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await reauthenticate({ password });
    setPending(false);
    setResult(res);
    if (res.ok) onDone(true);
  }

  const error =
    fieldError(result, "password") ??
    (result && !result.ok && result.code !== "VALIDATION" ? result.message : undefined);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !pending && onDone(false)}>
      <DialogContent size="sm">
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
          <DialogHeader>
            <span className="mb-2 grid size-10 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <DialogTitle>Confirm it’s you</DialogTitle>
            <DialogDescription>
              This is a sensitive action. Enter the password for{" "}
              <span className="font-medium text-foreground">{user?.email}</span> to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Field label="Password" htmlFor="reauth-password" error={error}>
              <PasswordInput
                id="reauth-password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="reauth-password-msg"
              />
            </Field>
            <p className="mt-3 text-xs text-muted-foreground">
              You won’t be asked again for a few minutes.{" "}
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onDone(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" loading={pending} disabled={!password}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
