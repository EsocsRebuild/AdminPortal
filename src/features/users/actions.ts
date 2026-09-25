"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend, BackendError } from "@/server/backend";

import { approveInput, changeRoleInput, inviteInput, rejectInput, roleInput, updateRoleInput, userIdInput } from "./schemas";
import type { Role } from "./types";

const notSelf = (targetId: string, userId: string) => {
  if (targetId === userId) throw new BackendError("FORBIDDEN", "You can’t change your own access. Ask another administrator.", 403);
};

export const inviteAdmin = secureAction({ schema: inviteInput, permission: "users:manage", sudo: true }, async (input, { sudoHeaders }) => {
  await backend("/admin-users/invitations", { method: "POST", body: { ...input, name: input.name || null }, headers: sudoHeaders });
  revalidatePath("/users");
  return null;
});

export const resendInvite = secureAction({ schema: userIdInput, permission: "users:manage" }, async ({ id }) => {
  await backend(`/admin-users/${id}/invitation/resend`, { method: "POST" });
  return null;
});

export const revokeInvite = secureAction({ schema: userIdInput, permission: "users:manage" }, async ({ id }) => {
  await backend(`/admin-users/${id}/invitation`, { method: "DELETE" });
  revalidatePath("/users");
  return null;
});

export const changeAdminRole = secureAction({ schema: changeRoleInput, permission: "users:manage", sudo: true }, async ({ id, roleId }, { user, sudoHeaders }) => {
  notSelf(id, user.id);
  await backend(`/admin-users/${id}/role`, { method: "PUT", body: { roleId }, headers: sudoHeaders });
  revalidatePath("/users");
  return null;
});

export const suspendAdmin = secureAction({ schema: userIdInput, permission: "users:manage", sudo: true }, async ({ id }, { user, sudoHeaders }) => {
  notSelf(id, user.id);
  await backend(`/admin-users/${id}/suspend`, { method: "POST", headers: sudoHeaders });
  revalidatePath("/users");
  return null;
});

export const reactivateAdmin = secureAction({ schema: userIdInput, permission: "users:manage", sudo: true }, async ({ id }, { sudoHeaders }) => {
  await backend(`/admin-users/${id}/reactivate`, { method: "POST", headers: sudoHeaders });
  revalidatePath("/users");
  return null;
});

export const resetAdminMfa = secureAction({ schema: userIdInput, permission: "users:manage", sudo: true }, async ({ id }, { user, sudoHeaders }) => {
  notSelf(id, user.id);
  await backend(`/admin-users/${id}/mfa/reset`, { method: "POST", headers: sudoHeaders });
  revalidatePath("/users");
  return null;
});

export const approveAccessRequest = secureAction({ schema: approveInput, permission: "users:manage", sudo: true }, async ({ id, roleId }, { sudoHeaders }) => {
  await backend(`/access-requests/${id}/approve`, { method: "POST", body: { roleId }, headers: sudoHeaders });
  revalidatePath("/users", "layout");
  return null;
});

export const rejectAccessRequest = secureAction({ schema: rejectInput, permission: "users:manage" }, async ({ id, reason }) => {
  await backend(`/access-requests/${id}/reject`, { method: "POST", body: { reason: reason || null } });
  revalidatePath("/users", "layout");
  return null;
});

export const createRole = secureAction({ schema: roleInput, permission: "roles:manage", sudo: true }, async (values, { sudoHeaders }) => {
  const role = await backend<Role>("/roles", { method: "POST", body: values, headers: sudoHeaders });
  revalidatePath("/users/roles");
  return { id: role.id };
});

export const updateRole = secureAction({ schema: updateRoleInput, permission: "roles:manage", sudo: true }, async ({ id, values }, { sudoHeaders }) => {
  await backend(`/roles/${id}`, { method: "PUT", body: values, headers: sudoHeaders });
  revalidatePath("/users", "layout");
  return null;
});

export const deleteRole = secureAction({ schema: userIdInput, permission: "roles:manage", sudo: true }, async ({ id }, { sudoHeaders }) => {
  await backend(`/roles/${id}`, { method: "DELETE", headers: sudoHeaders });
  revalidatePath("/users/roles");
  return null;
});
