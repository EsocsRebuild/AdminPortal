"use server";

import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { z } from "zod";

import { secureAction } from "@/server/action";
import { backend } from "@/server/backend";

import { changePasswordInput, mfaCodeInput, notificationPrefsInput, profileInput, sessionIdInput } from "./schemas";

export const updateProfile = secureAction({ schema: profileInput }, async (values) => {
  await backend("/me/profile", { method: "PATCH", body: values });
  revalidatePath("/", "layout");
  return null;
});

/** The API signs out every other session when the password changes. */
export const changePassword = secureAction({ schema: changePasswordInput }, async ({ current, next }) => {
  await backend("/me/password", { method: "POST", body: { currentPassword: current, newPassword: next } });
  revalidatePath("/settings/security");
  return null;
});

/** Starts two-step setup. The QR is rendered here so the secret never leaves the server in another form. */
export const beginMfaSetup = secureAction({ schema: z.object({}), sudo: true }, async (_input, { sudoHeaders }) => {
  const { secret, otpauthUrl } = await backend<{ secret: string; otpauthUrl: string }>("/me/mfa/setup", { method: "POST", headers: sudoHeaders });
  const qr = await QRCode.toDataURL(otpauthUrl, { margin: 1, width: 220, errorCorrectionLevel: "M" });
  return { secret, qr };
});

export const enableMfa = secureAction({ schema: mfaCodeInput }, async ({ code }) => {
  const { recoveryCodes } = await backend<{ recoveryCodes: string[] }>("/me/mfa/enable", { method: "POST", body: { code } });
  revalidatePath("/settings/security");
  return { recoveryCodes };
});

export const disableMfa = secureAction({ schema: z.object({}), sudo: true }, async (_input, { sudoHeaders }) => {
  await backend("/me/mfa", { method: "DELETE", headers: sudoHeaders });
  revalidatePath("/settings/security");
  return null;
});

export const regenerateRecoveryCodes = secureAction({ schema: z.object({}), sudo: true }, async (_input, { sudoHeaders }) => {
  const r = await backend<{ recoveryCodes: string[] }>("/me/mfa/recovery-codes", { method: "POST", headers: sudoHeaders });
  revalidatePath("/settings/security");
  return r;
});

export const revokeSession = secureAction({ schema: sessionIdInput }, async ({ id }) => {
  await backend(`/me/sessions/${id}`, { method: "DELETE" });
  revalidatePath("/settings/security");
  return null;
});

export const revokeOtherSessions = secureAction({ schema: z.object({}), sudo: true }, async (_i, { sudoHeaders }) => {
  const r = await backend<{ revoked: number }>("/me/sessions/revoke-others", { method: "POST", headers: sudoHeaders });
  revalidatePath("/settings/security");
  return r;
});

export const updateNotificationPrefs = secureAction({ schema: notificationPrefsInput }, async (values) => {
  await backend("/me/notification-preferences", { method: "PUT", body: values });
  return null;
});
