import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatCard } from "@/components/blocks/stat-card";
import { Page, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { AudienceActions } from "@/features/audiences/components/audience-actions";
import { ContactsTable } from "@/features/audiences/components/contacts-table";
import { getAudience, listContacts } from "@/features/audiences/queries";
import { contactStatuses } from "@/features/audiences/types";
import { enumParam, parseListParams } from "@/lib/list-params";
import { assertId, findOrNotFound } from "@/server/query";

export async function generateMetadata({ params }: PageProps<"/audiences/[id]">): Promise<Metadata> {
  const audience = await getAudience(assertId((await params).id)).catch(() => null);
  return { title: audience?.name ?? "Audience" };
}

export default async function AudiencePage({ params, searchParams }: PageProps<"/audiences/[id]">) {
  const id = assertId((await params).id);
  const query = parseListParams(await searchParams, { status: enumParam(contactStatuses) });
  const [audience, contacts] = await Promise.all([findOrNotFound(getAudience(id)), listContacts(id, query)]);

  return (
    <Page>
      <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
        <Link href="/audiences">All audiences</Link>
      </Button>
      <PageHeader title={audience.name} description={audience.description ?? undefined} actions={<AudienceActions audience={audience} />} />
      <section aria-label="Audience numbers" className="grid gap-page sm:grid-cols-2">
        <StatCard label="Subscribed" value={audience.subscriberCount} />
        <StatCard label="Unsubscribed" value={audience.unsubscribedCount} />
      </section>
      <ContactsTable
        listId={audience.id}
        page={contacts.data}
        server={{
          total: contacts.meta.total,
          page: contacts.meta.page,
          pageSize: contacts.meta.pageSize,
          q: query.q,
          sort: query.sort,
          dir: query.dir,
          filtered: Boolean(query.status),
        }}
      />
    </Page>
  );
}
