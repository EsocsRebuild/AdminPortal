"use server";

import { z } from "zod";

import { secureAction } from "@/server/action";
import { backendRaw, backend } from "@/server/backend";

import type { Notification } from "./types";

export const listNotifications = secureAction({ schema: z.object({}) }, async () => {
  const res = await backendRaw<{ data: Notification[]; meta: { unread: number } }>("/notifications", {
    query: { limit: 15 },
  });
  return { items: res.data, unread: res.meta.unread };
});

export const markAllNotificationsRead = secureAction({ schema: z.object({}) }, async () => {
  await backend("/notifications/read-all", { method: "POST" });
  return null;
});
