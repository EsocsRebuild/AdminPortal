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
            <Card key={p.id} className="p-4 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    tone={
                      p.status === "Published"
                        ? "success"
                        : p.status === "Draft"
                          ? "neutral"
                          : "warning"
                    }
                  >
                    {p.status}
                  </Badge>
                  {p.showInNavigation && (
                    <span className="flex items-center gap-1 text-2xs text-primary font-medium">
                      <Globe className="size-3" /> In Nav
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                <p className="font-mono text-2xs text-muted-foreground mt-0.5">{p.path}</p>
                {p.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{p.summary}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-2xs text-muted-foreground">
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
