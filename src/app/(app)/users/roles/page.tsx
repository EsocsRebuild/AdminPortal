import { Lock, Plus, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Can } from "@/components/auth/session-provider";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listRoles } from "@/features/users/queries";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = { title: "Roles" };

export default async function RolesPage() {
  const roles = await listRoles();
  return (
    <div className="grid gap-page">
      <Can permission="roles:manage">
        <Button variant="secondary" leftIcon={<Plus />} asChild className="w-fit">
          <Link href="/users/roles/new">New role</Link>
        </Button>
      </Can>
      <Stagger className="grid gap-page sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <StaggerItem key={r.id}>
            <Link href={`/users/roles/${r.id}`} className="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <Card interactive className="h-full gap-4 p-card">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-card bg-primary-soft text-primary-soft-foreground">
                    {r.locked ? <Lock className="size-5" /> : <ShieldCheck className="size-5" />}
                  </span>
                  <div className="grid min-w-0 gap-0.5">
                    <span className="flex items-center gap-2 font-semibold">
                      {r.name}
                      {r.system && <Badge tone="outline">Built-in</Badge>}
                    </span>
                    <span className="line-clamp-2 text-sm text-muted-foreground">{r.description ?? "No description"}</span>
                  </div>
                </div>
                <p className="mt-auto text-sm text-muted-foreground">
                  {pluralize(r.userCount, "person", "people")} · {pluralize(r.permissions.length, "permission")}
                </p>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
