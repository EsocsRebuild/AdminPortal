import type { Metadata } from "next";
import Link from "next/link";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { getSignupOptions } from "@/features/auth/queries";

import { SignupFlow } from "./signup-flow";

export const metadata: Metadata = { title: "Request an account" };

export default async function SignupPage() {
  const options = await getSignupOptions().catch(() => null);
  if (!options) return <ServiceUnavailable retryHref="/signup" />;
  return (
    <div className="grid gap-8">
      <SignupFlow parishes={options.parishes} roles={options.roles} />
      <p className="text-center text-base text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
