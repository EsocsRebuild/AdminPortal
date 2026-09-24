import { Construction } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Page, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { allNavItems } from "@/config/navigation";

/** Placeholder for navigation entries whose module isn't built yet. Unknown paths 404. */
function findItem(slug: string[]) {
  return allNavItems.find((i) => i.href === `/${slug[0]}`);
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const item = findItem((await params).slug);
  return { title: item?.title ?? "Not found" };
}

export default async function ModulePlaceholder({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item || slug.length > 1) notFound();
  const Icon = item.icon;
  return (
    <Page>
      <PageHeader title={item.title} />
      <Card variant="outline">
        <EmptyState
          icon={<Icon />}
          title={`${item.title} is on the way`}
          description="This module hasn't been built yet. The shell, navigation and permissions are already wired up."
          action={
            <>
              <Button variant="secondary" asChild>
                <Link href="/design-system">Browse components</Link>
              </Button>
              <Button asChild leftIcon={<Construction />}>
                <Link href="/members">See a finished module</Link>
              </Button>
            </>
          }
        />
      </Card>
    </Page>
  );
}
