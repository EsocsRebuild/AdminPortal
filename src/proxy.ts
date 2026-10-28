import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs before every page request:
 *  - Generates per-request Content-Security-Policy with a fresh cryptographic nonce.
 *  - Forwards `x-nonce`, `x-pathname`, and `x-request-id` headers to Server Components.
 *
 * All authentication & authorization checks are cleanly enforced in Server
 * Components (Layouts & Pages via `requireSession()`) and Server Actions.
 */

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
    embeddable && embedOrigins.length
      ? `frame-ancestors 'self' ${embedOrigins.join(" ")}`
      : `frame-ancestors 'none'`,
    // Only when served over HTTPS; on plain-http localhost it would break asset loading.
    https && !dev ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");
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

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Skip assets and metadata files (icons, robots, manifest): they must never pass through proxy.
      source:
        "/((?!api/health|_next/static|_next/image|favicon.ico|apple-icon|manifest.webmanifest|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest|woff2?)$).*)",
    },
  ],
};
