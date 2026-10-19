import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSignupOptions } from "@/features/auth/queries";
import { WebAdminSignupForm } from "./web-admin-signup-form";

export const metadata: Metadata = {
  title: "Register Content Admin · ESOCS Content Studio",
  description: "Create a parish content administrator account for the ESOCS Web Studio.",
};

export default async function WebAdminSignupPage() {
  const options = await getSignupOptions().catch(() => ({
    parishes: [
      { id: "parish-mount-zion", name: "Mount Zion Parish, Lagos" },
      { id: "parish-headquarters", name: "Mount Zion General Headquarters" },
      { id: "parish-surulere", name: "Surulere Provincial Headquarters" },
      { id: "parish-abuja", name: "National Headquarters Annex Abuja" },
      { id: "parish-portharcourt", name: "Grace Parish, Port Harcourt" },
    ],
    roles: [
      { id: "role-content-editor", name: "Content Editor", description: "Publishes news, events, and programmes.", icon: "editor" },
      { id: "role-media-lead", name: "Media Lead", description: "Manages banners, photos, and live media.", icon: "editor" },
    ],
  }));

  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
        {/* Ambient Emerald Background Gradients */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg space-y-6">
          {/* Header Branding */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
              <Sparkles className="size-3.5 animate-pulse" />
              ESOCS Web Content Studio
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Create Admin Account</h1>
            <p className="text-sm font-medium text-slate-300">
              Register to manage church announcements, bulletins, and branch media.
            </p>
          </div>

          <Card className="border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold text-white">Administrator Profile</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-300">
                All accounts are scoped to your assigned parish and cleared by the Super Vetting Board.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WebAdminSignupForm parishes={options.parishes} roles={options.roles} />

              <div className="border-t border-slate-800 pt-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Protected by Central Identity Governance
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/admin-web/login"
              className="inline-flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Already have an account? Sign In
            </Link>

            <Link href="/super-admin/setup" className="font-medium text-slate-300 underline hover:text-white">
              Apex Super Admin Setup →
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
