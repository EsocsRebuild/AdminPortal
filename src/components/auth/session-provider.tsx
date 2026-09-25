"use client";

import * as React from "react";

import { can, type Permission } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

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
 * Hides UI the user can't use. This is for clarity only: every page and
 * Server Action re-checks the permission on the server, and the API enforces it.
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
