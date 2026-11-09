/**
 * Resolves the public Web Frontend URL (running on port 3020 by default).
 * Unifies the architecture so Admin Portal (3030) links out directly
 * to the live Web Frontend application rather than spawning conflicting internal routes.
 */
export function getWebFrontendUrl(path: string = ""): string {
  const base =
    process.env.NEXT_PUBLIC_WEB_FRONTEND_URL || process.env.WEB_FRONTEND_URL || "http://localhost:3020";

  const cleanBase = base.replace(/\/+$/, "");
  if (!path) return cleanBase;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
