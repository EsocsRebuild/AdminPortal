import type { Metadata } from "next";
import { FileText, Globe, Plus } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listPages } from "@/features/content/queries";
import type { PageItem } from "@/features/content/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Pages & Hero" };

export default async function PagesPage() {
  const result = await listPages().catch(() => ({
    data: [] as PageItem[],
    meta: { page: 1, pageSize: 20, total: 0 },
  }));
  const pages = result.data ?? [];

  return (
    <Page>
      <PageHeader
        title="Pages & Hero"
        description="Manage static and dynamic public website pages, hero sections, and navigation hierarchies."
        actions={
          <Button variant="primary" leftIcon={<Plus className="size-4" />} disabled>
            Create page
          </Button>
        }
      />

      {pages.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-5" />}
          title="No pages registered"
          description="Build dynamic CMS pages like About, Faith & Order, or Holy Order landing sections."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between gap-3 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge
                    tone={p.status === "Published" ? "success" : p.status === "Draft" ? "neutral" : "warning"}
                  >
                    {p.status}
                  </Badge>
                  {p.showInNavigation && (
                    <span className="flex items-center gap-1 text-2xs font-medium text-primary">
                      <Globe className="size-3" /> In Nav
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="mt-0.5 font-mono text-2xs text-muted-foreground">{p.path}</p>
                {p.summary && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{p.summary}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-2 text-2xs text-muted-foreground">
                <span>Template: {p.template || "Standard"}</span>
                {p.updatedAt && <span>Updated {formatDate(p.updatedAt)}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
