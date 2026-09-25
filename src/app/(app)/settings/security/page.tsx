import type { Metadata } from "next";

import { MfaCard } from "@/features/account/components/mfa-card";
import { PasswordForm } from "@/features/account/components/password-form";
import { SessionsCard } from "@/features/account/components/sessions-card";
import { getSecurityOverview } from "@/features/account/queries";

export const metadata: Metadata = { title: "Security" };

export default async function SecurityPage() {
  const security = await getSecurityOverview();
  return (
    <>
      <MfaCard enabled={security.mfaEnabled} remaining={security.recoveryCodesRemaining} />
      <PasswordForm changedAt={security.passwordChangedAt} />
      <SessionsCard sessions={security.sessions} />
    </>
  );
}
