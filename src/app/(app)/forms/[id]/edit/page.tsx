import type { Metadata } from "next";

import { Alert } from "@/components/ui/alert";
import { FormBuilder } from "@/features/forms/components/form-builder";
import { getForm } from "@/features/forms/queries";
import { can } from "@/lib/permissions";
import { assertId, findOrNotFound } from "@/server/query";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Build form" };

export default async function EditFormPage({ params }: PageProps<"/forms/[id]/edit">) {
  const user = await requireSession();
  const form = await findOrNotFound(getForm(assertId((await params).id)));
  return (
    <>
      {form.status === "published" && (
        <Alert tone="warning" title="This form is live">
          Changes appear to visitors straight away. Removing a question hides its past answers from new
          exports.
        </Alert>
      )}
      <FormBuilder form={form} readOnly={!can(user, "forms:manage")} />
    </>
  );
}
