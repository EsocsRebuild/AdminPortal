import type { ReactNode } from "react";
import { SessionProvider } from "@/components/auth/session-provider";
import { ModalProvider } from "@/components/modals/modal-provider";
import { WebStudioShell } from "@/components/layout/web-studio-shell";
import { requirePermission } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export default async function WebAdminStudioLayout({ children }: { children: ReactNode }) {
  const sessionUser = await requirePermission("content:view");

  const userUnit = await resolveUserUnit(sessionUser.scopeUnitId);
  const isPlatformAdmin = Boolean(
    sessionUser.isPlatformAdmin ||
    sessionUser.role?.name?.toLowerCase().includes("super") ||
    sessionUser.role?.name?.toLowerCase().includes("prelate"),
  );

  return (
    <SessionProvider user={sessionUser}>
      <ModalProvider>
        <WebStudioShell userUnit={userUnit} isPlatformAdmin={isPlatformAdmin}>
          {children}
        </WebStudioShell>
      </ModalProvider>
    </SessionProvider>
  );
}
