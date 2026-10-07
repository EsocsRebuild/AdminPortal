import type { Metadata } from "next";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/auth-header";
import { Alert } from "@/components/ui/alert";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

const notices: Record<string, { tone: "info" | "success" | "warning"; text: string }> = {
  idle: {
    tone: "warning",
    text: "You were signed out because you weren’t active for a while. Please sign in again.",
  },
  "signed-out": { tone: "success", text: "You’ve been signed out safely." },
  "password-reset": {
    tone: "success",
    text: "Your password was changed. Please sign in with your new password.",
  },
  "invite-accepted": { tone: "success", text: "Your account is ready. Sign in to get started." },
  expired: { tone: "info", text: "Your session ended. Please sign in again." },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, reason } = await searchParams;
  const notice = typeof reason === "string" ? notices[reason] : undefined;
  return (
    <div className="grid gap-8">
      <AuthHeader
        title="Welcome back"
        description="Sign in to manage your church, ordination candidates, and parish records."
      />
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      <LoginForm next={typeof next === "string" ? next : undefined} />
      <p className="text-center text-sm font-medium text-slate-300">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline">
          Request an account
        </Link>
      </p>
    </div>
  );
}
