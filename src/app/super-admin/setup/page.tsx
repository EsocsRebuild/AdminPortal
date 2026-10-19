import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Crest } from "@/components/icons/logo";
import { SuperAdminSetupForm } from "./super-admin-setup-form";

export const metadata: Metadata = {
  title: "Super Admin Provisioning · ESOCS Apex Governance",
  description: "Initialize or configure your central super administrator credentials.",
};

export default function SuperAdminSetupPage() {
  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
        {/* Ambient Regal Gold & Amber Background Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-yellow-600/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg space-y-6">
          {/* Header Branding */}
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <Crest
                size={52}
                priority
                className="shadow-xl ring-2 shadow-amber-950/50 ring-amber-500/40"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-amber-400 uppercase">
              <Crown className="size-4 text-amber-400" />
              Apex Governance & Vetting Directorate
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Super Admin Account Setup</h1>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Provision high-level ecclesiastical authority for 1-click vetting, national portal administration, and ordination clearance.
            </p>
          </div>

          <Card className="border-amber-500/30 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold text-white">Apex Security Clearance</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-300">
                Requires the Central Authority Passcode issued by the General Headquarters Secretariat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SuperAdminSetupForm />

              <div className="border-t border-slate-800 pt-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-amber-400/90 font-medium">
                  <ShieldCheck className="size-4 text-amber-400" />
                  Elevated Privilege: Universal Clearance & Vetting Rights
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
              Web Studio Login
            </Link>

            <Link href="/login" className="font-medium text-amber-400 hover:text-amber-300 hover:underline">
              Main Governance Portal Sign In →
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
