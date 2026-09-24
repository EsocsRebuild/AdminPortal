"use client";

import { KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { cn, sleep } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("email") || !data.get("password")) {
      setError("Please enter your email and password.");
      setAttempt((n) => n + 1);
      return;
    }
    setError(null);
    setPending(true);
    await sleep(700); // TODO: POST credentials to the auth endpoint.
    toast.success("Signed in", { description: "Welcome back." });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {error && (
        <div key={attempt} className="animate-shake">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}
      <Field label="Email address" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          size="lg"
          autoComplete="username"
          autoFocus
          prefix={<Mail />}
          placeholder="you@example.com"
        />
      </Field>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot it?
          </Link>
        </div>
        <PasswordInput id="password" name="password" size="lg" autoComplete="current-password" />
      </div>
      <Checkbox name="remember" label="Keep me signed in on this device" defaultChecked />
      <Button type="submit" size="lg" fullWidth loading={pending} className={cn(pending && "cursor-wait")}>
        {pending ? "Signing you in…" : "Sign in"}
      </Button>
      <div className="flex items-center gap-3 text-xs text-subtle-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <Button variant="secondary" size="lg" fullWidth leftIcon={<KeyRound />}>
        Sign in with your organisation
      </Button>
    </form>
  );
}
