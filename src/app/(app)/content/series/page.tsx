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
            <Card key={item.id} className="p-4 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge tone="info">{item.sermonCount} sermons</Badge>
                  {item.startsOn && (
                    <span className="text-2xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" /> {formatDate(item.startsOn)}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5">{item.description}</p>
                )}
              </div>
              <div className="pt-2 border-t border-border-subtle text-2xs text-muted-foreground font-mono">
                /{item.slug}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
