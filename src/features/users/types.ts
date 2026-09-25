import type { Permission } from "@/lib/permissions";

export const adminStatuses = ["active", "invited", "suspended"] as const;
export type AdminStatus = (typeof adminStatuses)[number];

export const adminStatusLabels: Record<AdminStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: { id: string; name: string };
  status: AdminStatus;
  mfaEnabled: boolean;
  lastActiveAt: string | null;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  userCount: number;
  /** Built-in roles can't be deleted; "Owner" can't be edited. */
  system: boolean;
  locked: boolean;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  parish: { id: string; name: string } | null;
  requestedRole: { id: string; name: string } | null;
  emailVerified: boolean;
  createdAt: string;
}
