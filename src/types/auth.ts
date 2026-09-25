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
  /** Parish scope for parish-level admins; null means organisation-wide. */
  parishId: string | null;
}
