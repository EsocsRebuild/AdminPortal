import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Megaphone, Image as ImageIcon, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { getSession } from "@/server/session";
import { WebAdminLoginForm } from "./web-admin-login-form";

export const metadata: Metadata = {
  title: "Web Admin Login · ESOCS Content Studio",
  description: "Sign in to manage church website content, events, and public programmes.",
};

const studioBenefits = [
  {
    icon: Globe,
    title: "Parish Website Publishing",
    text: "Publish public church announcements, bulletins, and branch updates.",
  },
  {
    icon: Megaphone,
    title: "Live Programmes & Events",
    text: "Manage revival nights, annual summits, and community programmes.",
  },
  {
    icon: ImageIcon,
    title: "Media & Banner Assets",
    text: "Central library for banners, logos, and high-resolution church flyers.",
  },
  {
    icon: ShieldCheck,
    title: "Super Vetting Clearance",
    text: "Direct routing to the Super Admin clearance queue for 1-click approvals.",
  },
];

export default async function WebAdminLoginPage() {
  const sessionUser = await getSession();

  return (
    <AuthSplitLayout
      portalBadge="WEB CONTENT STUDIO"
      pillTag="Content & Web Publishing"
      eyebrow="Holy Order Digital System"
      headlineMain="One unified studio to amplify your"
      headlineHighlight="parish"
      benefits={studioBenefits}
    >
      <div className="grid gap-6">
        <div className="space-y-1.5">
          <h1 className="font-brand text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="text-xs font-medium text-slate-300">
            Sign in to manage church website content, events, and public programmes.
          </p>
        </div>

        {sessionUser && (
          <div className="rounded-xl border border-amber-400/40 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <span className="flex items-center gap-1.5 text-2xs font-bold tracking-wider text-amber-400 uppercase">
                  <UserCheck className="size-3.5" />
                  Currently Signed In
                </span>
                <p className="truncate text-sm font-bold text-white">{sessionUser.name}</p>
                <p className="truncate text-xs text-slate-400">{sessionUser.email}</p>
              </div>
              <Link href="/admin-web/dashboard" className="shrink-0">
                <Button size="sm" className="bg-amber-500 font-bold text-slate-950 hover:bg-amber-400">
                  Go to Dashboard
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            </div>
            <p className="mt-2.5 border-t border-slate-800 pt-2 text-2xs text-slate-400">
              Need another account? Sign in with different credentials below:
            </p>
          </div>
        )}

        <WebAdminLoginForm />

        <div className="flex flex-col items-center gap-2 pt-2 text-center text-xs text-slate-400">
          <p>
            New Web Administrator?{" "}
            <Link
              href="/admin-web/signup"
              className="font-semibold text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
            >
              Register Content Admin
            </Link>
          </p>

          <div className="flex items-center gap-3 pt-1 text-2xs">
            <Link href="/login" className="text-slate-400 hover:text-amber-300 hover:underline">
              Switch to Main Governance Portal
            </Link>
            <span className="text-slate-600">·</span>
            <Link href="/super-admin/setup" className="text-slate-400 hover:text-amber-300 hover:underline">
              Super Admin Setup
            </Link>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
