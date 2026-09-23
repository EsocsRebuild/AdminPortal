import { rolePermissions } from "@/config/permissions";
import type { Permission, SessionUser } from "@/types/auth";

type Subject = Pick<SessionUser, "role"> | null | undefined;

export function can(user: Subject, permission: Permission) {
  if (!user) return false;
  const granted = rolePermissions[user.role];
  return granted === "*" || granted.includes(permission);
}

export function canAny(user: Subject, permissions: Permission[]) {
  return permissions.some((p) => can(user, p));
}

export function canAll(user: Subject, permissions: Permission[]) {
  return permissions.every((p) => can(user, p));
}
