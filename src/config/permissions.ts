import type { Permission, Role } from "@/types/auth";

const read: Permission[] = [
  "dashboard:view",
  "members:view",
  "parishes:view",
  "clergy:view",
  "events:view",
  "content:view",
  "reports:view",
];

/** Single source of truth for what each role can do. `"*"` grants everything. */
export const rolePermissions: Record<Role, Permission[] | "*"> = {
  super_admin: "*",
  admin: [
    ...read,
    "members:manage",
    "parishes:manage",
    "clergy:manage",
    "events:manage",
    "content:publish",
    "finance:view",
    "communications:send",
    "users:manage",
    "audit:view",
  ],
  finance: [...read, "finance:view", "finance:manage"],
  editor: [...read, "events:manage", "content:publish"],
  parish_admin: [...read, "members:manage", "events:manage", "communications:send"],
  viewer: read,
};

export const roleLabels: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Administrator",
  finance: "Finance",
  editor: "Editor",
  parish_admin: "Parish admin",
  viewer: "Viewer",
};
