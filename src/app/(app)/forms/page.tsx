import type { Metadata } from "next";

import { UrlTabs } from "@/components/data-table/url-tabs";
import { Page, PageHeader } from "@/components/layout/page";
import { FormsTable } from "@/features/forms/components/forms-table";
import { NewFormButton } from "@/features/forms/components/new-form-button";
import { listForms } from "@/features/forms/queries";
import { formStatuses } from "@/features/forms/types";
import { enumParam, parseListParams } from "@/lib/list-params";

export const metadata: Metadata = { title: "Forms" };

export default async function FormsPage({ searchParams }: PageProps<"/forms">) {
  const params = parseListParams(await searchParams, { status: enumParam(formStatuses) });
  const result = await listForms({ ...params, sort: params.sort ?? "updatedAt", dir: params.dir ?? "desc" });
  return (
    <Page>
      <PageHeader
        title="Forms"
        description="Registrations, surveys and sign-ups you can share with a link."
        actions={<NewFormButton />}
      >
        <UrlTabs
          param="status"
          label="Form status"
          tabs={[
            { value: null, label: "All" },
            { value: "published", label: "Live" },
            { value: "draft", label: "Drafts" },
            { value: "closed", label: "Closed" },
          ]}
        />
      </PageHeader>
      <FormsTable
        page={result.data}
        emptyAction={<NewFormButton />}
        server={{
          total: result.meta.total,
          page: result.meta.page,
          pageSize: result.meta.pageSize,
          q: params.q,
          sort: params.sort,
          dir: params.dir,
          filtered: Boolean(params.status),
        }}
      />
    </Page>
  );
}
