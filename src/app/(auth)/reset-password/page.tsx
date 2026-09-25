import { LinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";

import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token.length < 16) {
    return (
      <div className="grid gap-6">
        <AuthHeader
          icon={<LinkIcon />}
          title="This link isn’t valid"
          description="Reset links work once and expire after 30 minutes. Request a new one and use the latest email."
        />
        <Button size="lg" asChild>
          <Link href="/forgot-password">Send me a new link</Link>
        </Button>
      </div>
    );
  }
  return <ResetForm token={token} />;
}
