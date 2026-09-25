import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { requirePermission } from "@/server/session";

import type { AccessRequest, AdminStatus, AdminUser, Role } from "./types";

export async function listAdmins(params: ListParams & { status?: AdminStatus; roleId?: string }) {
  await requirePermission("users:view");
  return backendRaw<Page<AdminUser>>("/admin-users", { query: { ...params } });
}

export async function listRoles() {
  await requirePermission("users:view");
  return backend<Role[]>("/roles");
}

export async function getRole(id: string) {
  await requirePermission("users:view");
  return backend<Role>(`/roles/${id}`);
}

export async function listAccessRequests() {
  await requirePermission("users:view");
  return backend<AccessRequest[]>("/access-requests", { query: { status: "pending" } });
}
