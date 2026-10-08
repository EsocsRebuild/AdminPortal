import type { Metadata } from "next";
import { BookOpen, Calendar, Plus } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listSeries } from "@/features/content/queries";
import type { SeriesItem } from "@/features/content/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Sermon Series" };

export default async function SeriesPage() {
  const series: SeriesItem[] = await listSeries().catch(() => []);

  return (
    <Page>
      <PageHeader
        title="Sermon Series"
        description="Organise sermons and teachings into multi-week topical or scriptural series."
        actions={
          <Button variant="primary" leftIcon={<Plus className="size-4" />} disabled>
            New series
          </Button>
        }
      />

      {series.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="No sermon series defined"
          description="Group sermons into themes like 'Spiritual Revival' or 'Kingdom Living' for congregation study."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between gap-3 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge tone="info">{item.sermonCount} sermons</Badge>
                  {item.startsOn && (
                    <span className="flex items-center gap-1 text-2xs text-muted-foreground">
                      <Calendar className="size-3" /> {formatDate(item.startsOn)}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                {item.description && (
                  <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
              <div className="border-t border-border-subtle pt-2 font-mono text-2xs text-muted-foreground">
                /{item.slug}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
