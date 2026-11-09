import type { Metadata } from "next";
import { LifeBuoy } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/page";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requirePermission } from "@/server/session";
import { listSupportTickets, getSupportKpis } from "@/features/support/queries";
import { SupportCrmDashboard } from "@/features/support/components/support-crm-dashboard";
import { HelpdeskDrawer } from "@/features/support/components/helpdesk-drawer";

export const metadata: Metadata = {
  title: "Member Care & Secretariat CRM · ESOCS Admin",
};

export default async function SupportCrmPage() {
  await requirePermission("users:view");
  const tickets = await listSupportTickets();
  const kpis = await getSupportKpis();

  return (
    <TooltipProvider>
      <Page>
        <PageHeader
          title="Member Care & Secretariat CRM"
          description="Manage church member enquiries, ordination vetting disputes, and parish complaints across all ecclesiastical provinces."
          eyebrow={
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-2xs font-semibold text-primary">
              <LifeBuoy className="size-3" />
              {kpis.openTickets} Open Issues
            </span>
          }
          actions={
            <HelpdeskDrawer
              initialTickets={tickets}
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  <LifeBuoy className="size-4" />
                  Lodge New Enquiry
                </button>
              }
            />
          }
        />

        <SupportCrmDashboard initialTickets={tickets} kpis={kpis} />
      </Page>
    </TooltipProvider>
  );
}
