"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { publicAction, secureAction } from "@/server/action";
import { backend, BackendError } from "@/server/backend";
import { COOKIE, cookieOptions } from "@/server/cookies";
import { clearAuthCookies, safeNext, setAuthCookies, type AuthTokens } from "@/server/session";

import {
  forgotPasswordSchema,
  mfaSchema,
  acceptInviteSchema,
  reauthSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "./schemas";
import type { LoginResponse } from "./types";

/** Step 1 of sign-in. Returns where to go next; never reveals which part was wrong. */
export const signIn = publicAction({ schema: signInSchema }, async ({ email, password, remember, next }) => {
  const result = await backend<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password, remember },
  });

  if (result.status === "mfa_required") {
    (await cookies()).set(COOKIE.mfa, result.challengeToken, cookieOptions(result.expiresIn));
    return { redirectTo: `/mfa${next ? `?next=${encodeURIComponent(safeNext(next))}` : ""}` };
  }
  if (result.status === "email_unverified") {
    (await cookies()).set(COOKIE.pendingEmail, result.email, cookieOptions(60 * 60));
    return { redirectTo: "/verify" };
  }
  await setAuthCookies(result.tokens);
  return { redirectTo: safeNext(next) };
});

/** Step 2 of sign-in when two-factor authentication is on. */
export const verifyMfa = publicAction({ schema: mfaSchema }, async (input) => {
  const jar = await cookies();
  const challengeToken = jar.get(COOKIE.mfa)?.value;
  if (!challengeToken) {
    throw new BackendError("UNAUTHENTICATED", "That sign-in attempt expired. Please start again.", 401);
  }
  const tokens = await backend<AuthTokens>("/auth/mfa/verify", {
    method: "POST",
    auth: false,
    body: { challengeToken, method: input.method, code: input.code, rememberDevice: input.rememberDevice },
  });
  jar.delete(COOKIE.mfa);
  await setAuthCookies(tokens);
  return { redirectTo: safeNext(input.next) };
});

export const signUp = publicAction({ schema: signUpSchema }, async (input) => {
  await backend("/auth/signup", {
    method: "POST",
    auth: false,
    body: {
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      parishId: input.parishId,
      requestedRoleId: input.requestedRoleId,
      password: input.password,
    },
  });
  (await cookies()).set(COOKIE.pendingEmail, input.email, cookieOptions(60 * 60));
  return { redirectTo: "/verify" };
});

export const verifyEmail = publicAction({ schema: verifyEmailSchema }, async ({ code }) => {
  const jar = await cookies();
  const email = jar.get(COOKIE.pendingEmail)?.value;
  if (!email)
    throw new BackendError(
      "NOT_FOUND",
      "Your verification link has expired. Please sign in to get a new code.",
      404,
    );
  await backend("/auth/verify-email", { method: "POST", auth: false, body: { email, code } });
  jar.delete(COOKIE.pendingEmail);
  return { email };
});

export const resendVerification = publicAction({ schema: z.object({}) }, async () => {
  const email = (await cookies()).get(COOKIE.pendingEmail)?.value;
  if (!email) throw new BackendError("NOT_FOUND", "Please sign in again to get a new code.", 404);
  await backend("/auth/verify-email/resend", { method: "POST", auth: false, body: { email } });
  return null;
});

/** Always succeeds from the user's point of view, so it can't reveal which emails have accounts. */
export const requestPasswordReset = publicAction({ schema: forgotPasswordSchema }, async ({ email }) => {
  try {
    await backend("/auth/password/forgot", { method: "POST", auth: false, body: { email } });
  } catch (error) {
    if (error instanceof BackendError && (error.code === "RATE_LIMITED" || error.code === "UNAVAILABLE"))
      throw error;
  }
  return null;
});

export const resetPassword = publicAction({ schema: resetPasswordSchema }, async ({ token, password }) => {
  await backend("/auth/password/reset", { method: "POST", auth: false, body: { token, password } });
  // Resetting a password signs out every device; start clean here too.
  await clearAuthCookies();
  return null;
});

/** Confirms the password and opens a short "sudo" window for dangerous actions. */
export const reauthenticate = secureAction({ schema: reauthSchema }, async ({ password }) => {
  const { sudoToken, expiresIn } = await backend<{ sudoToken: string; expiresIn: number }>(
    "/auth/reauthenticate",
    { method: "POST", body: { password } },
  );
  (await cookies()).set(COOKIE.sudo, sudoToken, cookieOptions(expiresIn));
  return null;
});

/** Called by the idle-timeout dialog's "Stay signed in". */
export const keepAlive = secureAction({ schema: z.object({}) }, async () => {
  await backend("/auth/session/touch", { method: "POST" });
  return null;
});

export async function signOut(reason?: "idle" | "manual") {
  try {
    const refreshToken = (await cookies()).get(COOKIE.refresh)?.value;
    await backend("/auth/logout", { method: "POST", body: { refreshToken } });
  } catch {
    // Signing out locally must always succeed, even if the API is down.
  }
  await clearAuthCookies();
  redirect(reason === "idle" ? "/login?reason=idle" : "/login?reason=signed-out");
}

/** New administrator sets their name and password from an emailed invitation. */
export const acceptInvitation = publicAction(
  { schema: acceptInviteSchema },
  async ({ token, name, password }) => {
    await backend(`/public/invitations/${encodeURIComponent(token)}/accept`, {
      method: "POST",
      auth: false,
      body: { name, password },
    });
    return null;
  },
);
