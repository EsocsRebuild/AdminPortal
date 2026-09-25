"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { keepAlive, signOut } from "@/features/auth/actions";

const IDLE_MS = Math.max(2, Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES) || 15) * 60_000;
const WARN_MS = 60_000;
const TOUCH_EVERY_MS = 5 * 60_000;
const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "mousemove"] as const;

/**
 * Signs the user out after a period of inactivity, with a one-minute warning.
 * Activity in any tab counts for all tabs, and signing out in one signs out all.
 */
export function SessionGuard() {
  const router = useRouter();
  const lastActive = React.useRef(0);
  const lastTouch = React.useRef(0);
  const channel = React.useRef<BroadcastChannel | null>(null);
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const remainingRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const markActive = React.useCallback((broadcast = true) => {
    const now = Date.now();
    lastActive.current = now;
    if (broadcast) channel.current?.postMessage({ type: "active", at: now });
    // Keep the server-side session alive while the user is working.
    if (now - lastTouch.current > TOUCH_EVERY_MS) {
      lastTouch.current = now;
      void keepAlive({});
    }
  }, []);

  React.useEffect(() => {
    lastActive.current = Date.now();
    lastTouch.current = Date.now();
    const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("esocs-session") : null;
    channel.current = bc;
    bc?.addEventListener("message", (e: MessageEvent<{ type: string; at?: number }>) => {
      if (e.data.type === "active" && e.data.at) lastActive.current = Math.max(lastActive.current, e.data.at);
      if (e.data.type === "signed-out") router.replace("/login?reason=signed-out");
    });

    let throttle = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - throttle < 5_000) return;
      throttle = now;
      // Activity while the warning is open doesn't count; the user must choose.
      if (remainingRef.current === null) markActive();
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    const tick = setInterval(() => {
      const idle = Date.now() - lastActive.current;
      if (idle >= IDLE_MS) {
        bc?.postMessage({ type: "signed-out" });
        void signOut("idle");
      } else if (idle >= IDLE_MS - WARN_MS) {
        setRemaining(Math.ceil((IDLE_MS - idle) / 1000));
      } else {
        setRemaining(null);
      }
    }, 1000);

    return () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      clearInterval(tick);
      bc?.close();
    };
  }, [markActive, router]);

  const stay = () => {
    lastTouch.current = 0;
    markActive();
    setRemaining(null);
  };

  return (
    <Dialog open={remaining !== null} onOpenChange={(o) => !o && stay()}>
      <DialogContent size="sm" hideClose role="alertdialog">
        <DialogHeader className="pr-5 sm:pr-6">
          <span className="mb-2 grid size-10 place-items-center rounded-full bg-warning-soft text-warning-soft-foreground">
            <Clock className="size-5" />
          </span>
          <DialogTitle>Are you still there?</DialogTitle>
          <DialogDescription>
            For your security, you’ll be signed out in{" "}
            <span className="tabular font-semibold text-foreground">{remaining ?? 0} seconds</span> because
            you haven’t been active.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              channel.current?.postMessage({ type: "signed-out" });
              void signOut("manual");
            }}
          >
            Sign out now
          </Button>
          <Button autoFocus onClick={stay}>
            Stay signed in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
