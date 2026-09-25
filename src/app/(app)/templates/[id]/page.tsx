import type { Metadata } from "next";

import { Page } from "@/components/layout/page";
import { TemplateEditor } from "@/features/templates/components/template-editor";
import { getTemplate } from "@/features/templates/queries";
import { assertId, findOrNotFound } from "@/server/query";

export const metadata: Metadata = { title: "Edit template" };

export default async function TemplatePage({ params }: PageProps<"/templates/[id]">) {
  const template = await findOrNotFound(getTemplate(assertId((await params).id)));
  return (
    <Page width="full" className="max-w-[88rem]">
      <TemplateEditor template={template} />
    </Page>
  );
}
