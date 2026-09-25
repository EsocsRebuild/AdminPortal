"use client";

import { Download, KeyRound, RefreshCw, ShieldCheck, ShieldOff, Smartphone } from "lucide-react";
import * as React from "react";

import { useModals } from "@/components/modals/modal-provider";
import { SuccessCheck } from "@/components/motion/success-check";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtpInput } from "@/components/ui/otp-input";
import { useAction } from "@/hooks/use-action";

import { beginMfaSetup, disableMfa, enableMfa, regenerateRecoveryCodes } from "../actions";

function RecoveryCodes({ codes, onDone }: { codes: string[]; onDone: () => void }) {
  const [saved, setSaved] = React.useState(false);
  const text = codes.join("\n");
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(`ESOCS Admin recovery codes\nEach code works once.\n\n${text}\n`)}`;
  return (
    <>
      <DialogBody className="grid gap-4">
        <Alert tone="warning" title="Save these somewhere safe">
          If you lose your phone, each code lets you sign in once. This is the only time they’re shown.
        </Alert>
        <ol className="grid grid-cols-2 gap-2 rounded-card bg-surface-sunken p-4 font-mono text-sm">
          {codes.map((c) => (
            <li key={c} className="tabular">
              {c}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={text} label="Copy codes" />
          <Button variant="secondary" size="sm" leftIcon={<Download />} asChild>
            <a href={href} download="esocs-recovery-codes.txt">
              Download
            </a>
          </Button>
        </div>
        <Checkbox
          label="I’ve saved my recovery codes"
          checked={saved}
          onCheckedChange={(v) => setSaved(v === true)}
        />
      </DialogBody>
      <DialogFooter>
        <Button onClick={onDone} disabled={!saved}>
          Done
        </Button>
      </DialogFooter>
    </>
  );
}

export function MfaCard({ enabled, remaining }: { enabled: boolean; remaining: number }) {
  const modals = useModals();
  const [open, setOpen] = React.useState(false);
  const [stage, setStage] = React.useState<
    { step: "scan"; secret: string; qr: string } | { step: "codes"; codes: string[] } | null
  >(null);
  const [code, setCode] = React.useState("");
  const [attempt, setAttempt] = React.useState(0);
  const begin = useAction(beginMfaSetup);
  const enable = useAction(enableMfa, { quiet: true });
  const disable = useAction(disableMfa, { success: "Two-step verification turned off" });
  const regen = useAction(regenerateRecoveryCodes);

  async function start() {
    const res = await begin.run({});
    if (!res.ok) return;
    setCode("");
    setStage({ step: "scan", ...res.data });
    setOpen(true);
  }

  async function confirm(value: string) {
    const res = await enable.run({ code: value });
    if (res.ok) setStage({ step: "codes", codes: res.data.recoveryCodes });
    else {
      setAttempt((n) => n + 1);
      setCode("");
    }
  }

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            Two-step verification
            {enabled ? (
              <Badge tone="success" dot>
                On
              </Badge>
            ) : (
              <Badge tone="warning" dot>
                Off
              </Badge>
            )}
          </span>
        }
        description="A code from your phone, as well as your password, every time you sign in on a new device."
      />
      <CardContent>
        {enabled ? (
          <div className="flex items-start gap-3 rounded-card bg-success-soft/60 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
            <p className="text-sm">
              Your account is protected. You have <span className="tabular font-semibold">{remaining}</span>{" "}
              unused recovery {remaining === 1 ? "code" : "codes"}.
              {remaining <= 3 && " Consider making new ones."}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-card bg-warning-soft/60 p-4">
            <Smartphone className="mt-0.5 size-5 shrink-0 text-warning" />
            <p className="text-sm">
              Strongly recommended for everyone with access to member data. You’ll need an authenticator app
              such as Google Authenticator or Microsoft Authenticator.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        {enabled ? (
          <>
            <Button
              variant="secondary"
              leftIcon={<RefreshCw />}
              loading={regen.pending}
              onClick={async () => {
                const res = await regen.run({});
                if (res.ok) {
                  setStage({ step: "codes", codes: res.data.recoveryCodes });
                  setOpen(true);
                }
              }}
            >
              New recovery codes
            </Button>
            <Button
              variant="danger-soft"
              leftIcon={<ShieldOff />}
              onClick={async () => {
                if (
                  await modals.confirm({
                    tone: "danger",
                    title: "Turn off two-step verification?",
                    description: "Anyone who learns your password could then sign in as you.",
                    confirmLabel: "Turn off",
                  })
                )
                  await disable.run({});
              }}
            >
              Turn off
            </Button>
          </>
        ) : (
          <Button leftIcon={<KeyRound />} loading={begin.pending} onClick={start}>
            Set up two-step verification
          </Button>
        )}
      </CardFooter>

      <Dialog open={open} onOpenChange={(o) => stage?.step !== "codes" && setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stage?.step === "codes" ? "Your recovery codes" : "Set up two-step verification"}
            </DialogTitle>
            {stage?.step === "scan" && (
              <DialogDescription>Open your authenticator app and scan this code.</DialogDescription>
            )}
          </DialogHeader>
          {stage?.step === "scan" && (
            <>
              <DialogBody className="grid gap-5">
                <div className="grid justify-items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- server-generated data URL */}
                  <img
                    src={stage.qr}
                    alt="QR code for your authenticator app"
                    className="size-48 rounded-control border border-border bg-white p-2"
                  />
                  <details className="text-center text-sm text-muted-foreground">
                    <summary className="cursor-pointer">Can’t scan? Enter this key instead</summary>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <code className="rounded-xs bg-surface-sunken px-2 py-1 font-mono text-xs tracking-wider break-all">
                        {stage.secret}
                      </code>
                      <CopyButton value={stage.secret} iconOnly label="Copy key" />
                    </div>
                  </details>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Then enter the 6-digit code it shows</p>
                  <div key={attempt}>
                    <OtpInput
                      value={code}
                      onChange={setCode}
                      onComplete={confirm}
                      invalid={attempt > 0 && !code}
                      disabled={enable.pending}
                      autoFocus
                    />
                  </div>
                  {enable.result && !enable.result.ok && (
                    <p className="text-sm text-danger">
                      That code didn’t match. Codes change every 30 seconds, so try the current one.
                    </p>
                  )}
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button loading={enable.pending} disabled={code.length < 6} onClick={() => confirm(code)}>
                  Turn on
                </Button>
              </DialogFooter>
            </>
          )}
          {stage?.step === "codes" && (
            <>
              <div className="grid justify-items-center pt-4">
                <SuccessCheck className="size-12" />
              </div>
              <RecoveryCodes
                codes={stage.codes}
                onDone={() => {
                  setOpen(false);
                  setStage(null);
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
