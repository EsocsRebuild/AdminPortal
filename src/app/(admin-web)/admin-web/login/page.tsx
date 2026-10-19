import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Megaphone, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
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

export default function WebAdminLoginPage() {
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
          <h1 className="font-brand text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-xs font-medium text-slate-300">
            Sign in to manage church website content, events, and public programmes.
          </p>
        </div>

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
