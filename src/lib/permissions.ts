/**
 * Permissions are granted by the backend per user (via their role) and
 * returned with the session. The portal only reads them: every page and
 * action re-checks on the server, and the API enforces them again.
 */
export const permissions = [
  "dashboard:view",
  "members:view",
  "members:manage",
  "members:export",
  "campaigns:view",
  "campaigns:manage",
  "campaigns:send",
  "audiences:view",
  "audiences:manage",
  "templates:manage",
  "forms:view",
  "forms:manage",
  "users:view",
  "users:manage",
  "roles:manage",
  "audit:view",
  "settings:manage",
] as const;

export type Permission = (typeof permissions)[number];

type Subject = { permissions: readonly string[] } | null | undefined;

export function can(user: Subject, permission: Permission) {
  return !!user && user.permissions.includes(permission);
}

export function canAny(user: Subject, list: Permission[]) {
  return list.some((p) => can(user, p));
}

export function canAll(user: Subject, list: Permission[]) {
  return list.every((p) => can(user, p));
}
