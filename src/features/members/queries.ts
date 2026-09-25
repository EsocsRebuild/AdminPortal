import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { Member, MemberStatus, MemberSummary } from "./types";

export async function listMembers(params: ListParams & { status?: MemberStatus; parishId?: string }) {
  await requirePermission("members:view");
  return backendRaw<Page<MemberSummary>>("/members", { query: { ...params } });
}

export async function getMember(id: string) {
  await requirePermission("members:view");
  return backend<Member>(`/members/${encodeURIComponent(id)}`);
}
