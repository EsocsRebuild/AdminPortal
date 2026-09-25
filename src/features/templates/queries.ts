import "server-only";

import { backend } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { Template } from "./types";

export async function listTemplates() {
  await requirePermission("templates:manage");
  return backend<Template[]>("/templates", { query: { include: "content" } });
}

/** Used by the campaign composer too, so it only needs campaign rights. */
export async function listTemplatesForPicker() {
  await requirePermission("campaigns:manage");
  return backend<Template[]>("/templates", { query: { include: "content" } });
}

export async function getTemplate(id: string) {
  await requirePermission("templates:manage");
  return backend<Template>(`/templates/${id}`);
}
