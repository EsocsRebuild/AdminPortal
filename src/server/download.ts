import "server-only";

import { can, type Permission } from "@/lib/permissions";

import { backendStream, BackendError } from "./backend";
import { getSession } from "./session";

/**
 * Route Handler body for a permission-checked CSV download. The file name is
 * fixed server-side; nothing from the request reaches the header.
 */
export async function streamDownload(opts: {
  permission: Permission;
  path: string;
  query?: Record<string, string | undefined>;
  filename: string;
}) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!can(user, opts.permission)) return new Response("Forbidden", { status: 403 });
  try {
    const upstream = await backendStream(opts.path, opts.query);
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${opts.filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return new Response("Export failed", { status });
  }
}

/** Only allow simple filter values through to the API. */
export function pickParams(url: URL, keys: string[]) {
  const out: Record<string, string | undefined> = {};
  for (const key of keys) {
    const v = url.searchParams.get(key);
    if (v && /^[\w\s@.,:-]{1,120}$/.test(v)) out[key] = v;
  }
  return out;
}
