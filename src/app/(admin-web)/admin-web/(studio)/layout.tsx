import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SessionProvider } from "@/components/auth/session-provider";
import { ModalProvider } from "@/components/modals/modal-provider";
import { WebStudioShell } from "@/components/layout/web-studio-shell";
import { getSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export default async function WebAdminStudioLayout({ children }: { children: ReactNode }) {
  const sessionUser = await getSession();
  if (!sessionUser) {
    redirect("/admin-web/login?next=/admin-web/dashboard");
  }

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
