import { SessionGuard } from "@/components/auth/session-guard";
import { SessionProvider } from "@/components/auth/session-provider";
import { AppShell } from "@/components/layout/app-shell";
import { ModalProvider } from "@/components/modals/modal-provider";
import { env } from "@/server/env";
import { requireSession } from "@/server/session";

/**
 * Everything signed-in lives under this layout. The session is verified with
 * the API on every request; pages additionally check their own permission.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireSession();
  const showDesignSystem = env().NODE_ENV !== "production" || env().ENABLE_DESIGN_SYSTEM;
  return (
    <SessionProvider user={user}>
      <ModalProvider>
        <AppShell showDesignSystem={showDesignSystem}>{children}</AppShell>
        <SessionGuard />
      </ModalProvider>
    </SessionProvider>
  );
}
