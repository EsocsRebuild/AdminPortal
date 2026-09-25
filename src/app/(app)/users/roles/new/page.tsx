import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RoleEditor } from "@/features/users/components/role-editor";
import { requirePermission } from "@/server/session";

export const metadata: Metadata = { title: "New role" };

export default async function NewRolePage() {
  await requirePermission("roles:manage");
  return (
    <div className="grid gap-page">
      <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
        <Link href="/users/roles">All roles</Link>
      </Button>
      <RoleEditor />
    </div>
  );
}
