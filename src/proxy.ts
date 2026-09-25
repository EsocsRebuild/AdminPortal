import { NextResponse, type NextRequest } from "next/server";

import { COOKIE, cookieOptions } from "@/server/cookies";

/**
 * Runs before every page request:
 *  1. Builds a per-request Content-Security-Policy with a fresh nonce.
 *  2. Optimistic auth: no session cookie → sign-in page (with a safe `next`).
 *     An expired access token is silently renewed with the refresh token.
 *  3. Signed-in users are kept out of the sign-in/sign-up pages.
 *
 * This is a fast first filter only. Every page and Server Action verifies the
 * session with the API again (see src/server/session.ts).
 */

const PUBLIC = /^\/(login|signup|verify|mfa|forgot-password|reset-password|invite|f)(\/|$)/;
const GUEST_ONLY = /^\/(login|signup|forgot-password)(\/|$)/;

function contentSecurityPolicy(nonce: string, embeddable: boolean, https: boolean) {
  const dev = process.env.NODE_ENV !== "production";
  // Public forms may be embedded only by sites listed in FORM_EMBED_ORIGINS.
  const embedOrigins = (process.env.FORM_EMBED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter((o) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(o));
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    // Radix, Sonner and Motion inject styles at runtime; scripts stay strict.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    `frame-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    embeddable && embedOrigins.length ? `frame-ancestors 'self' ${embedOrigins.join(" ")}` : `frame-ancestors 'none'`,
    // Only when served over HTTPS; on plain-http localhost it would break asset loading.
    https && !dev ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

interface Tokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

async function refresh(refreshToken: string, request: NextRequest): Promise<Tokens | null> {
  const base = process.env.BACKEND_API_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": request.headers.get("user-agent") ?? "",
        "X-Forwarded-For": request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
      },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return ((await res.json()) as { data: Tokens }).data;
  } catch {
    return null;
  }
}

function toLogin(request: NextRequest, clear: boolean) {
  const url = new URL("/login", request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== "/") url.searchParams.set("next", next);
  const res = NextResponse.redirect(url);
  if (clear) {
    res.cookies.delete(COOKIE.access);
    res.cookies.delete(COOKIE.refresh);
  }
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const https = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const csp = contentSecurityPolicy(nonce, pathname.startsWith("/f/"), https);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  requestHeaders.set("x-pathname", pathname + search);
  requestHeaders.set("x-request-id", request.headers.get("x-request-id") ?? crypto.randomUUID());

  const hasAccess = request.cookies.has(COOKIE.access);
  const refreshToken = request.cookies.get(COOKIE.refresh)?.value;
  const isPublic = PUBLIC.test(pathname);
  let renewed: Tokens | null = null;

  if (!isPublic && !hasAccess) {
    if (!refreshToken) return toLogin(request, false);
    renewed = await refresh(refreshToken, request);
    if (!renewed) return toLogin(request, true);
    // Let this same request's server code see the new access token.
    request.cookies.set(COOKIE.access, renewed.accessToken);
    request.cookies.set(COOKIE.refresh, renewed.refreshToken);
    requestHeaders.set("cookie", request.cookies.toString());
  }

  if (GUEST_ONLY.test(pathname) && (hasAccess || renewed)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  if (renewed) {
    response.cookies.set(COOKIE.access, renewed.accessToken, cookieOptions(renewed.expiresIn));
    response.cookies.set(COOKIE.refresh, renewed.refreshToken, cookieOptions(renewed.refreshExpiresIn));
  }
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
