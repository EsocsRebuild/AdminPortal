import { pickParams, streamDownload } from "@/server/download";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = new Date().toISOString().slice(0, 10);
  return streamDownload({
    permission: "members:export",
    path: "/members/export",
    query: pickParams(url, ["q", "status", "parishId", "sort", "dir"]),
    filename: `members-${date}.csv`,
  });
}
