import { streamDownload } from "@/server/download";

export async function GET(_request: Request, { params }: RouteContext<"/api/forms/[id]/responses/export">) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return new Response("Not found", { status: 404 });
  return streamDownload({
    permission: "forms:view",
    path: `/forms/${id}/responses/export`,
    filename: `form-responses-${new Date().toISOString().slice(0, 10)}.csv`,
  });
}
