import "server-only";

import { cookies, headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

import { can, type Permission } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

import { backend, BackendError } from "./backend";
import { COOKIE, cookieOptions } from "./cookies";

/**
 * Data Access Layer for authentication.
 *
 * `getSession()` asks the API who the token belongs to (so a revoked or
 * expired session is caught immediately) and is memoised per request.
 * Pages call `requireSession()` / `requirePermission()`; Server Actions go
 * through `secureAction()`, which calls the same functions.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  if (!jar.get(COOKIE.access)?.value) return null;
  try {
    return await backend<SessionUser>("/auth/me");
  } catch (error) {
    if (error instanceof BackendError && error.code === "UNAUTHENTICATED") return null;
    throw error;
  }
});

/** The current path, set by the proxy, so sign-in can return the user here. */
async function currentPath() {
  return (await headers()).get("x-pathname") ?? "/dashboard";
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect(`/login?next=${encodeURIComponent(await currentPath())}`);
  return user;
}

/** Renders the 403 page when the user lacks `permission`. */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireSession();
  if (!can(user, permission)) forbidden();
  return user;
}

// ─── Cookie lifecycle (Server Actions and the proxy only) ────────────────────

export interface AuthTokens {
  accessToken: string;
  /** Seconds. */
  expiresIn: number;
  refreshToken: string;
  /** Seconds. */
  refreshExpiresIn: number;
}

export async function setAuthCookies(tokens: AuthTokens) {
  const jar = await cookies();
  jar.set(COOKIE.access, tokens.accessToken, cookieOptions(tokens.expiresIn));
  jar.set(COOKIE.refresh, tokens.refreshToken, cookieOptions(tokens.refreshExpiresIn));
}

export async function clearAuthCookies() {
  const jar = await cookies();
  for (const name of Object.values(COOKIE)) jar.delete(name);
}

/** Only allow same-site relative paths as post-login destinations (no open redirects). */
export function safeNext(next: unknown, fallback = "/dashboard") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/^\/(login|signup|verify|mfa|forgot-password|reset-password)\b/.test(next)) return fallback;
  return next;
}
