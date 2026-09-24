import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-heading-lg font-semibold">Welcome back</h1>
        <p className="text-md text-muted-foreground">Sign in to the administration portal.</p>
      </div>
      <LoginForm />
    </div>
  );
}
