import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/blocks/status-badge";
import { Page } from "@/components/layout/page";
import { RouteTabs } from "@/components/layout/route-tabs";
import { Button } from "@/components/ui/button";
import { FormHeaderActions } from "@/features/forms/components/form-header-actions";
import { getForm, publicFormUrl } from "@/features/forms/queries";
import { formStatusLabels } from "@/features/forms/types";
import { assertId, findOrNotFound } from "@/server/query";

export default async function FormLayout({ children, params }: LayoutProps<"/forms/[id]">) {
  const id = assertId((await params).id);
  const form = await findOrNotFound(getForm(id));
  const base = `/forms/${id}`;

  return (
    <Page width="full" className="max-w-[88rem]">
      <div className="grid gap-5">
        <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
          <Link href="/forms">All forms</Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid min-w-0 gap-1.5">
            <StatusBadge status={form.status === "published" ? "active" : form.status} label={formStatusLabels[form.status]} className="w-fit" />
            <h1 className="truncate text-heading-lg font-semibold">{form.title}</h1>
          </div>
          <FormHeaderActions form={form} publicUrl={publicFormUrl(form.slug)} />
        </div>
        <RouteTabs
          label="Form sections"
          tabs={[
            { href: `${base}/edit`, label: "Build" },
            { href: `${base}/settings`, label: "Settings" },
            { href: `${base}/share`, label: "Share" },
            { href: `${base}/responses`, label: "Responses", count: form.responseCount },
          ]}
        />
      </div>
      {children}
    </Page>
  );
}
