"use client";

import * as React from "react";

import { can } from "@/lib/permissions";
import type { Permission, SessionUser } from "@/types/auth";

const SessionContext = React.createContext<SessionUser | null>(null);

export function SessionProvider({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  return <SessionContext value={user}>{children}</SessionContext>;
}

export function useSession() {
  return React.use(SessionContext);
}

export function usePermission(permission: Permission) {
  return can(useSession(), permission);
}

/**
 * Render children only when the current user holds `permission`.
 * This hides UI; the API must still enforce the same rule.
 */
export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  return usePermission(permission) ? children : fallback;
}
