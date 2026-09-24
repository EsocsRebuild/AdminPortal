import type { Metadata } from "next";
import Link from "next/link";

import { SignupFlow } from "./signup-flow";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div className="grid gap-8">
      <SignupFlow />
      <p className="text-center text-base text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
