import type { Metadata } from "next";
import { Newspaper, Plus, Sparkles } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listPosts } from "@/features/content/queries";
import type { PostItem } from "@/features/content/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Articles & News" };

export default async function PostsPage() {
  const result = await listPosts().catch(() => ({
    data: [] as PostItem[],
    meta: { page: 1, pageSize: 20, total: 0 },
  }));
  const posts = result.data ?? [];

  return (
    <Page>
      <PageHeader
        title="Articles & News"
        description="Publish church news, circulars, anniversary announcements, and ministry articles."
        actions={
          <Button variant="primary" leftIcon={<Plus className="size-4" />} disabled>
            Write article
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="size-5" />}
          title="No articles or news published"
          description="News articles and official communiques published here are synced to the website news feed and mobile apps."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col justify-between gap-3 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge
                    tone={
                      post.status === "Published"
                        ? "success"
                        : post.status === "Draft"
                          ? "neutral"
                          : "warning"
                    }
                  >
                    {post.status}
                  </Badge>
                  {post.isFeatured && (
                    <span className="flex items-center gap-1 text-2xs font-semibold text-amber-500">
                      <Sparkles className="size-3" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{post.excerpt}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-2 text-2xs text-muted-foreground">
                <span>By {post.authorName || "Editorial Team"}</span>
                {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
