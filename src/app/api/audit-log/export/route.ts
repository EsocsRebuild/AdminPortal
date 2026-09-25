import { pickParams, streamDownload } from "@/server/download";

export async function GET(request: Request) {
  return streamDownload({
    permission: "audit:view",
    path: "/audit-events/export",
    query: pickParams(new URL(request.url), ["q", "severity", "actorId"]),
    filename: `audit-log-${new Date().toISOString().slice(0, 10)}.csv`,
  });
}
