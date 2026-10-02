import type { Permission } from "@/lib/permissions";

/** The signed-in admin, as returned by `GET /auth/me`. Safe to send to the client. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: { id: string; name: string };
  permissions: Permission[];
  mfaEnabled: boolean;
  /** Unit scope for unit/parish/section admins; null means organisation-wide (Global Super Admin). */
  scopeUnitId?: string | null;
  /** Legacy alias for parish-level scope. */
  parishId?: string | null;
  /** True if user has platform-wide super admin privileges across all units. */
  isPlatformAdmin?: boolean;
}

export interface UnitScopeMetadata {
  id: string | null;
  name: string;
  type: "global" | "province" | "parish" | "fellowship";
  code?: string;
  slug?: string;
}
