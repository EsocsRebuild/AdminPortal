/**
 * Liveness probe for Docker and the reverse proxy. Deliberately doesn't call
 * the API, so a backend outage doesn't get this container restarted.
 */
export function GET() {
  return Response.json(
    { status: "ok", version: process.env.DEPLOYMENT_VERSION ?? "dev" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
