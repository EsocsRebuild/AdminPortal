import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, FileCheck, Layers } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SuperAdminSetupForm } from "./super-admin-setup-form";

export const metadata: Metadata = {
  title: "Super Admin Provisioning · ESOCS Apex Governance",
  description: "Initialize or configure your central super administrator credentials.",
};

const apexBenefits = [
  {
    icon: CheckCircle2,
    title: "1-Click Super Vetting",
    text: "Universal clearance queue for all branch events, bulletins, and publications.",
  },
  {
    icon: FileCheck,
    title: "Ecclesiastical Decree Approvals",
    text: "Authoritative sign-off on ordination rosters, appointments, and provincial charters.",
  },
  {
    icon: ShieldCheck,
    title: "System-Wide Audit Oversight",
    text: "Immutable forensic traceability across all parishes, districts, and provinces.",
  },
  {
    icon: Layers,
    title: "Apex Directorate Command",
    text: "Supreme administration dashboard for the General Headquarters Secretariat.",
  },
];

export default function SuperAdminSetupPage() {
  return (
    <AuthSplitLayout
      portalBadge="APEX GOVERNANCE & VETTING"
      pillTag="Apex Central Governance"
      eyebrow="Holy Order Digital System"
      headlineMain="One supreme authority to govern and"
      headlineHighlight="vet"
      benefits={apexBenefits}
    >
      <div className="grid gap-6">
        <div className="space-y-1.5">
          <h1 className="font-brand text-3xl font-bold tracking-tight text-white">Super Admin Setup</h1>
          <p className="text-xs font-medium text-slate-300">
            Initialize apex ecclesiastical authority for universal vetting and national governance.
          </p>
        </div>

        <SuperAdminSetupForm />

        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <Link
            href="/admin-web/login"
            className="font-medium text-slate-400 hover:text-amber-300 hover:underline"
          >
            ← Web Studio Sign In
          </Link>

          <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline">
            Main Governance Portal →
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
