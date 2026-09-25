import type { Metadata } from "next";

import { ResponsesTable } from "@/features/forms/components/responses-table";
import { getForm, listResponses } from "@/features/forms/queries";
import { parseListParams } from "@/lib/list-params";
import { assertId, findOrNotFound } from "@/server/query";

export const metadata: Metadata = { title: "Form responses" };

export default async function ResponsesPage({ params, searchParams }: PageProps<"/forms/[id]/responses">) {
  const id = assertId((await params).id);
  const query = parseListParams(await searchParams);
  const [form, responses] = await Promise.all([
    findOrNotFound(getForm(id)),
    listResponses(id, { ...query, sort: query.sort ?? "submittedAt", dir: query.dir ?? "desc" }),
  ]);
  return (
    <ResponsesTable
      form={form}
      page={responses.data}
      server={{
        total: responses.meta.total,
        page: responses.meta.page,
        pageSize: responses.meta.pageSize,
        q: query.q,
        sort: query.sort,
        dir: query.dir,
      }}
    />
  );
}
