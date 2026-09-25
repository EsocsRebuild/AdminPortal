import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { AudienceList, Contact, ContactStatus } from "./types";

export async function listAudiences() {
  await requirePermission("audiences:view");
  return backend<AudienceList[]>("/audiences");
}

export async function getAudience(id: string) {
  await requirePermission("audiences:view");
  return backend<AudienceList>(`/audiences/${id}`);
}

export async function listContacts(listId: string, params: ListParams & { status?: ContactStatus }) {
  await requirePermission("audiences:view");
  return backendRaw<Page<Contact>>(`/audiences/${listId}/contacts`, { query: { ...params } });
}
