import "server-only";

import { backend } from "@/server/backend";
import { requireSession } from "@/server/session";

import type { NotificationPrefs, Profile, SecurityOverview } from "./types";

export async function getProfile() {
  await requireSession();
  return backend<Profile>("/me/profile");
}

export async function getSecurityOverview() {
  await requireSession();
  return backend<SecurityOverview>("/me/security");
}

export async function getNotificationPrefs() {
  await requireSession();
  return backend<NotificationPrefs>("/me/notification-preferences");
}
