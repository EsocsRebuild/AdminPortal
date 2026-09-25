import { MailCheck, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Page, PageHeader } from "@/components/layout/page";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NewAudienceButton } from "@/features/audiences/components/audience-actions";
import { listAudiences } from "@/features/audiences/queries";
import { formatCompact, formatDate, formatPercent } from "@/lib/format";

export const metadata: Metadata = { title: "Audiences" };

export default async function AudiencesPage() {
  const audiences = await listAudiences();

  return (
    <Page>
      <PageHeader
        title="Audiences"
        description="The lists of people your email campaigns go to."
        actions={audiences.length > 0 ? <NewAudienceButton /> : undefined}
      />
      {audiences.length === 0 ? (
        <Card variant="outline">
          <EmptyState
            icon={<UsersRound />}
            title="Create your first audience"
            description="Start with a list like “Church newsletter”. You can import contacts or add members who’ve agreed to hear from you."
            action={<NewAudienceButton />}
          />
        </Card>
      ) : (
        <Stagger className="grid gap-page sm:grid-cols-2 xl:grid-cols-3">
          {audiences.map((a) => {
            const total = a.subscriberCount + a.unsubscribedCount;
            return (
              <StaggerItem key={a.id}>
                <Link
                  href={`/audiences/${a.id}`}
                  className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Card interactive className="h-full gap-5 p-card">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-card bg-primary-soft text-primary-soft-foreground">
                        <UsersRound className="size-5" />
                      </span>
                      <div className="grid min-w-0 gap-0.5">
                        <h2 className="truncate font-semibold">{a.name}</h2>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {a.description ?? "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-4">
                      <div>
                        <p className="tabular text-metric font-semibold">
                          {formatCompact(a.subscriberCount)}
                        </p>
                        <p className="text-xs text-muted-foreground">subscribed</p>
                      </div>
                      <div className="grid justify-items-end gap-1 text-xs text-muted-foreground">
                        {a.doubleOptIn && (
                          <span className="inline-flex items-center gap-1">
                            <MailCheck className="size-3.5 text-success" /> Confirmed sign-ups
                          </span>
                        )}
                        <span>
                          {total > 0
                            ? `${formatPercent(a.unsubscribedCount / total)} unsubscribed`
                            : `Created ${formatDate(a.createdAt)}`}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </Page>
  );
}
