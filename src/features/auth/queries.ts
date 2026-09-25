import "server-only";

import { backend } from "@/server/backend";

import type { PublicParish, PublicRole } from "./types";

/** Choices shown on the sign-up form. Public endpoints; no session needed. */
export async function getSignupOptions() {
  const [parishes, roles] = await Promise.all([
    backend<PublicParish[]>("/public/parishes", { auth: false }),
    backend<PublicRole[]>("/public/requestable-roles", { auth: false }),
  ]);
  return { parishes, roles };
}

export async function getInvitation(token: string) {
  return backend<{ email: string; name: string | null; roleName: string; invitedBy: string; expiresAt: string }>(
    `/public/invitations/${encodeURIComponent(token)}`,
    { auth: false },
  );
}
