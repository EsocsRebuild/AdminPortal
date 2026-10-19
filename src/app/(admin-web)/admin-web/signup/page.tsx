import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Megaphone, Image as ImageIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
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
  const options = await getSignupOptions().catch(() => ({
    parishes: [
      { id: "01a11f17-f539-746b-975d-bfd5ae201541", name: "Diobu Provincial Headquarters" },
      { id: "01a11f17-f52c-7090-9113-03b6d6cbcdd6", name: "Mount Zion General Headquarters" },
      { id: "01a11f17-f542-7d34-a359-7c42834f956e", name: "Mount Zion, Lagos" },
      { id: "01a11f17-f52e-70c0-bfe5-7c43e5e5399a", name: "National Headquarters Annex Abuja" },
      { id: "01a11f17-f547-7dc9-9050-95ce6906e625", name: "Grace Parish, Port Harcourt" },
      { id: "01a11f17-f546-7128-bd61-995920c891d5", name: "Holy Trinity, Ibadan" },
      { id: "01a11f17-f539-7d59-80c5-ce4cd2f01f42", name: "Memorial Holy Temple" },
      { id: "01a11f17-f546-72be-99b2-c23834ae724b", name: "Seraph Temple, Abuja" },
    ],
    roles: [
      { id: "01a11f17-eeac-71e4-9ed7-458f92378ddb", name: "Content editor", description: "Publishes news, events, and programmes.", icon: "editor" },
      { id: "01a11f17-eeab-7500-a882-e7641ca570a6", name: "Communications", description: "Prepares and sends emails, builds forms.", icon: "editor" },
      { id: "01a11f17-eeab-7271-aead-b17e378e9f19", name: "Parish administrator", description: "Manages members, events and giving for a parish.", icon: "church" },
    ],
  }));

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
            Create Admin Account
          </h1>
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
