export const roles = ["super_admin", "admin", "finance", "editor", "parish_admin", "viewer"] as const;
export type Role = (typeof roles)[number];

/** `<resource>:<action>` */
export type Permission =
  | "dashboard:view"
  | "members:view"
  | "members:manage"
  | "parishes:view"
  | "parishes:manage"
  | "clergy:view"
  | "clergy:manage"
  | "events:view"
  | "events:manage"
  | "content:view"
  | "content:publish"
  | "finance:view"
  | "finance:manage"
  | "communications:send"
  | "reports:view"
  | "users:manage"
  | "audit:view"
  | "settings:manage";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  /** Scope for parish-level admins. */
  parishId?: string;
}
