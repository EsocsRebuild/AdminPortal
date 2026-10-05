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
            <Card key={sermon.id} className="p-4 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
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
                <h3 className="font-semibold text-foreground text-sm">{sermon.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Preacher: {sermon.preacher}</p>
                {sermon.seriesTitle && (
                  <p className="text-2xs text-primary font-medium mt-0.5">Series: {sermon.seriesTitle}</p>
                )}
                {sermon.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{sermon.summary}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
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
