/**
 * Cookie names and the policy applied to them. All auth cookies are httpOnly,
 * so client JavaScript (and any injected script) can never read a token.
 * The `__Host-` prefix pins cookies to this exact origin over HTTPS.
 */
const secure = process.env.NODE_ENV === "production";
const prefix = secure ? "__Host-" : "";

export const COOKIE = {
  /** Short-lived access token. Its presence is the proxy's optimistic "signed in" check. */
  access: `${prefix}esocs_at`,
  /** Long-lived refresh token, rotated by the backend on every refresh. */
  refresh: `${prefix}esocs_rt`,
  /** Pending MFA challenge between password and code steps. */
  mfa: `${prefix}esocs_mfa`,
  /** Recent re-authentication ("sudo mode") for dangerous actions. */
  sudo: `${prefix}esocs_sudo`,
  /** Email awaiting verification after sign-up (not secret, but kept server-side). */
  pendingEmail: `${prefix}esocs_pending`,
} as const;

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
    priority: "high",
  } as const;
}
