import { Award, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { UrlTabs } from "@/components/data-table/url-tabs";
import { Page, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormsTable } from "@/features/forms/components/forms-table";
import { NewFormButton } from "@/features/forms/components/new-form-button";
import { listForms } from "@/features/forms/queries";
import { formStatuses } from "@/features/forms/types";
import { NominateCandidateModal } from "@/features/ordination/components/nominate-candidate-modal";
import { enumParam, parseListParams } from "@/lib/list-params";

export const metadata: Metadata = { title: "Forms" };

export default async function FormsPage({ searchParams }: PageProps<"/forms">) {
  const params = parseListParams(await searchParams, { status: enumParam(formStatuses) });
  const result = await listForms({ ...params, sort: params.sort ?? "updatedAt", dir: params.dir ?? "desc" });

  return (
    <Page>
      <PageHeader
        title="Forms & Registrations"
        description="Official ecclesiastical registrations, custom survey forms, and public link portals."
        actions={<NewFormButton />}
      >
        <UrlTabs
          param="status"
          label="Form status"
          tabs={[
            { value: null, label: "All" },
            { value: "published", label: "Live" },
            { value: "draft", label: "Drafts" },
            { value: "closed", label: "Closed" },
          ]}
        />
      </PageHeader>

      {/* Featured Canonical Form: 2026 Holy Order Ordination Candidate Registration */}
      <Card className="mb-6 border-amber-500/20 bg-linear-to-r from-amber-500/10 via-card to-card shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-500">
              <Award className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-amber-500">
                  Apex Statutory Form
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-3xs font-semibold text-emerald-500">
                  <ShieldCheck className="size-3" /> Active Official Registration
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                2026 Holy Order Ordination Candidate Registration Form
              </h3>
              <p className="text-xs text-muted-foreground">
                Official candidate dossier intake, statutory rank levies, and 4-tier vetting protocol (Branch → District → Provincial → National).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NominateCandidateModal defaultParishName="Central Secretariat (HQ)" />
            <Link href="/ordination">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>View Submitted Dossiers</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
            <Button variant="secondary" size="sm" asChild className="gap-1 text-xs">
              <a href="http://localhost:3010" target="_blank" rel="noopener noreferrer">
                <span>Candidate Portal</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <FormsTable
        page={result.data}
        emptyAction={<NewFormButton />}
        server={{
          total: result.meta.total,
          page: result.meta.page,
          pageSize: result.meta.pageSize,
          q: params.q,
          sort: params.sort,
          dir: params.dir,
          filtered: Boolean(params.status),
        }}
      />
    </Page>
  );
}
