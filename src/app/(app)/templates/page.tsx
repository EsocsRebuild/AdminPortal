import { LayoutTemplate } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Page, PageHeader } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EmailThumbnail } from "@/features/email-builder/email-thumbnail";
import { NewTemplateButton } from "@/features/templates/components/new-template-dialog";
import { TemplateCardMenu } from "@/features/templates/components/template-card-menu";
import { listTemplates } from "@/features/templates/queries";
import { formatRelative } from "@/lib/format";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const templates = await listTemplates();
  return (
    <Page>
      <PageHeader
        title="Templates"
        description="Reusable email designs, so every campaign looks consistent."
        actions={<NewTemplateButton />}
      />
      {templates.length === 0 ? (
        <Card variant="outline">
          <EmptyState
            icon={<LayoutTemplate />}
            title="No templates yet"
            description="Save a design you like as a template and start every campaign from it."
            action={<NewTemplateButton />}
          />
        </Card>
      ) : (
        <Stagger className="grid gap-page sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <StaggerItem key={t.id}>
              <Card interactive className="relative h-full overflow-hidden">
                <Link
                  href={`/templates/${t.id}`}
                  className="absolute inset-0 z-0 rounded-card focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={`Edit ${t.name}`}
                />
                <EmailThumbnail document={t.content} />
                <div className="flex items-center gap-2 border-t border-border-subtle p-4">
                  <div className="grid min-w-0 flex-1">
                    <span className="truncate font-medium">{t.name}</span>
                    <span className="truncate text-xs text-muted-foreground" suppressHydrationWarning>
                      Edited {formatRelative(t.updatedAt)}
                      {t.updatedBy ? ` by ${t.updatedBy.name}` : ""}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <TemplateCardMenu id={t.id} name={t.name} />
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Page>
  );
}
