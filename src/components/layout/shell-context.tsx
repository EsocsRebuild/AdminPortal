"use client";

import * as React from "react";

import { useSession } from "@/components/auth/session-provider";
import { navigation } from "@/config/navigation";
import { can } from "@/lib/permissions";

const ShellContext = React.createContext({ showDesignSystem: false });

export function ShellProvider({ showDesignSystem, children }: { showDesignSystem: boolean; children: React.ReactNode }) {
  const value = React.useMemo(() => ({ showDesignSystem }), [showDesignSystem]);
  return <ShellContext value={value}>{children}</ShellContext>;
}

/** Navigation filtered to what this user may open. */
export function useVisibleNavigation() {
  const user = useSession();
  const { showDesignSystem } = React.use(ShellContext);
  return React.useMemo(
    () =>
      navigation
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => (!item.permission || can(user, item.permission)) && (!item.devOnly || showDesignSystem),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [user, showDesignSystem],
  );
}
