import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RoleEditor } from "@/features/users/components/role-editor";
import { getRole } from "@/features/users/queries";
import { assertId, findOrNotFound } from "@/server/query";

export const metadata: Metadata = { title: "Edit role" };

export default async function RolePage({ params }: PageProps<"/users/roles/[id]">) {
  const role = await findOrNotFound(getRole(assertId((await params).id)));
  return (
    <div className="grid gap-page">
      <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
        <Link href="/users/roles">All roles</Link>
      </Button>
      <RoleEditor role={role} />
    </div>
  );
}
