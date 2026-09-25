import type { Metadata } from "next";

import { listAudiences } from "@/features/audiences/queries";
import { FormSettingsForm } from "@/features/forms/components/form-settings-form";
import { getForm } from "@/features/forms/queries";
import { can } from "@/lib/permissions";
import { env } from "@/server/env";
import { assertId, findOrNotFound } from "@/server/query";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Form settings" };

export default async function FormSettingsPage({ params }: PageProps<"/forms/[id]/settings">) {
  const user = await requireSession();
  const form = await findOrNotFound(getForm(assertId((await params).id)));
  const audiences = can(user, "audiences:view") ? await listAudiences() : [];
  return (
    <FormSettingsForm
      form={form}
      audiences={audiences}
      canManage={can(user, "forms:manage")}
      appUrl={env().NEXT_PUBLIC_APP_URL}
    />
  );
}
