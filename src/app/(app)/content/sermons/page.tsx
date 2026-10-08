import type { Metadata } from "next";
import { Headphones, Plus, Tv2, Video } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listSermons } from "@/features/content/queries";
import type { SermonItem } from "@/features/content/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Sermons & Media" };

export default async function SermonsPage() {
  const result = await listSermons().catch(() => ({
    data: [] as SermonItem[],
    meta: { page: 1, pageSize: 20, total: 0 },
  }));
  const sermons = result.data ?? [];

  return (
    <Page>
      <PageHeader
        title="Sermons & Media"
        description="Manage church sermons, teachings, audio recordings, and video broadcasts."
        actions={
          <Button variant="primary" leftIcon={<Plus className="size-4" />} disabled>
            Add sermon
          </Button>
        }
      />

      {sermons.length === 0 ? (
        <EmptyState
          icon={<Video className="size-5" />}
          title="No sermons uploaded yet"
          description="Uploaded sermons and media streams published here will stream live to the public website and mobile applications."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Card key={sermon.id} className="flex flex-col justify-between gap-4 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge
                    tone={
                      sermon.status === "Published"
                        ? "success"
                        : sermon.status === "Draft"
                          ? "neutral"
                          : "warning"
                    }
                  >
                    {sermon.status}
                  </Badge>
                  <span className="text-2xs text-muted-foreground">{formatDate(sermon.preachedOn)}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{sermon.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Preacher: {sermon.preacher}</p>
                {sermon.seriesTitle && (
                  <p className="mt-0.5 text-2xs font-medium text-primary">Series: {sermon.seriesTitle}</p>
                )}
                {sermon.summary && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{sermon.summary}</p>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border-subtle pt-2">
                {sermon.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-2xs text-muted-foreground">
                    <Tv2 className="size-3 text-red-500" /> Video
                  </span>
                )}
                {sermon.audioUrl && (
                  <span className="inline-flex items-center gap-1 text-2xs text-muted-foreground">
                    <Headphones className="size-3 text-emerald-500" /> Audio
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
