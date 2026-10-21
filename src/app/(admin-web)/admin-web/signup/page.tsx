import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Megaphone, Image as ImageIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { getSignupOptions } from "@/features/auth/queries";
import { WebAdminSignupForm } from "./web-admin-signup-form";

export const metadata: Metadata = {
  title: "Register Content Admin · ESOCS Web Content Studio",
  description: "Create a parish content administrator account for the ESOCS Web Studio.",
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

export default async function WebAdminSignupPage() {
  const options = await getSignupOptions().catch(() => null);

  if (!options) {
    return <ServiceUnavailable retryHref="/admin-web/signup" />;
  }

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
          <h1 className="font-brand text-3xl font-bold tracking-tight text-white">Create Admin Account</h1>
          <p className="text-xs font-medium text-slate-300">
            Register your credentials to publish public church bulletins, programmes, and media.
          </p>
        </div>

        <WebAdminSignupForm parishes={options.parishes} roles={options.roles} />

        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <Link
            href="/admin-web/login"
            className="inline-flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Already registered? Sign In
          </Link>

          <Link
            href="/super-admin/setup"
            className="font-medium text-slate-400 hover:text-amber-300 hover:underline"
          >
            Super Admin Setup →
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
