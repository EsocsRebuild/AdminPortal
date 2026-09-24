"use client";

import { Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sleep } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("email") || !data.get("password")) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setPending(true);
    await sleep(600); // TODO: POST credentials to the auth endpoint.
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          size="lg"
          autoComplete="username"
          prefix={<Mail />}
          placeholder="you@esocs.org"
        />
      </Field>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link href="#" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          size="lg"
          autoComplete="current-password"
          prefix={<Lock />}
          suffix={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
            >
              {show ? <EyeOff /> : <Eye />}
            </Button>
          }
        />
      </div>
      <Checkbox name="remember" label="Keep me signed in for 30 days" />
      <Button type="submit" size="lg" fullWidth loading={pending}>
        Sign in
      </Button>
      <div className="flex items-center gap-3 text-xs text-subtle-foreground">
        <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
      </div>
      <Button variant="secondary" size="lg" fullWidth leftIcon={<KeyRound />}>
        Continue with single sign-on
      </Button>
    </form>
  );
}
