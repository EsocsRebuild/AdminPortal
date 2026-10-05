import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { PageItem, PostItem, SermonItem, SeriesItem } from "./types";

export async function listPages(params: Partial<ListParams> = {}) {
  await requirePermission("content:view");
  return backendRaw<Page<PageItem>>("/content/pages", { query: { ...params } });
}

export async function listPosts(params: Partial<ListParams> & { category?: string; tag?: string } = {}) {
  await requirePermission("content:view");
  return backendRaw<Page<PostItem>>("/content/posts", { query: { ...params } });
}

export async function listSermons(params: Partial<ListParams> & { seriesId?: string } = {}) {
  await requirePermission("content:view");
  return backendRaw<Page<SermonItem>>("/content/sermons", { query: { ...params } });
}

export async function listSeries() {
  await requirePermission("content:view");
  return backend<SeriesItem[]>("/content/series");
}
