import type { Metadata } from "next";

import { ProfileForm } from "@/features/account/components/profile-form";
import { getProfile, getSecurityOverview } from "@/features/account/queries";
import { getSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [profile, session, security] = await Promise.all([
    getProfile(),
    getSession(),
    getSecurityOverview().catch(() => null),
  ]);

  const userUnit = await resolveUserUnit(session?.scopeUnitId);

  return <ProfileForm profile={profile} session={session} security={security} userUnit={userUnit} />;
}
