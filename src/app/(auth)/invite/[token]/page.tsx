import { LinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeader } from "@/components/auth/auth-header";
import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { Button } from "@/components/ui/button";
import { getInvitation } from "@/features/auth/queries";
import { BackendError } from "@/server/backend";

import { InviteForm } from "./invite-form";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({ params }: PageProps<"/invite/[token]">) {
  const { token } = await params;
  let invitation: Awaited<ReturnType<typeof getInvitation>>;
  try {
    invitation = await getInvitation(token);
  } catch (error) {
    if (error instanceof BackendError && (error.code === "NOT_FOUND" || error.code === "VALIDATION")) {
      return (
        <div className="grid gap-6">
          <AuthHeader
            icon={<LinkIcon />}
            title="This invitation isn’t valid"
            description="It may have expired or already been used. Ask the person who invited you to send a new one."
          />
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      );
    }
    return <ServiceUnavailable retryHref={`/invite/${token}`} />;
  }
  return <InviteForm token={token} invitation={invitation} />;
}
