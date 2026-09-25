import type { Metadata } from "next";

import { ProfileForm } from "@/features/account/components/profile-form";
import { getProfile } from "@/features/account/queries";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  return <ProfileForm profile={await getProfile()} />;
}
