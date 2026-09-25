import type { NextConfig } from "next";

/**
 * Static security headers for every response. The Content-Security-Policy is
 * per-request (it carries a nonce) and is set in `src/proxy.ts`.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Enables forbidden() / unauthorized() for permission checks.
    authInterrupts: true,
    serverActions: {
      // Imports (CSV) are the largest payloads; keep the ceiling tight.
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Everything except public forms refuses to be framed (forms rely on CSP frame-ancestors).
      { source: "/((?!f/).*)", headers: [{ key: "X-Frame-Options", value: "DENY" }] },
      // Signed-in pages must never be cached by the browser or shared caches.
      {
        source: "/((?!_next/static|_next/image|favicon.ico|f/).*)",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
