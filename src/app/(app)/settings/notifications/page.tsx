import type { Metadata } from "next";

import { NotificationPrefsCard } from "@/features/account/components/notification-prefs";
import { getNotificationPrefs } from "@/features/account/queries";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  return <NotificationPrefsCard initial={await getNotificationPrefs()} />;
}
