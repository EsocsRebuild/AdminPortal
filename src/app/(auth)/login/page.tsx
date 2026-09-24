import { LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/auth/auth-header";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="grid gap-8">
      <AuthHeader icon={<LogIn />} title="Welcome back" description="Sign in to manage your church." />
      <LoginForm />
      <p className="text-center text-base text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
