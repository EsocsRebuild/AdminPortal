"use client";

import { AlertTriangle, Lock, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { useModals } from "@/components/modals/modal-provider";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { permissionCatalog } from "@/lib/permission-catalog";
import type { Permission } from "@/lib/permissions";
import { pluralize } from "@/lib/utils";
import { resultErrors, type Errors } from "@/lib/validate";

import { createRole, deleteRole, updateRole } from "../actions";
import type { Role } from "../types";

export function RoleEditor({ role }: { role?: Role }) {
  const router = useRouter();
  const modals = useModals();
  const canEdit = usePermission("roles:manage") && !role?.locked;
  const [name, setName] = React.useState(role?.name ?? "");
  const [description, setDescription] = React.useState(role?.description ?? "");
  const [granted, setGranted] = React.useState<Set<Permission>>(new Set(role?.permissions ?? ["dashboard:view"]));
  const [errors, setErrors] = React.useState<Errors>({});

  const create = useAction(createRole, { success: "Role created", onSuccess: (r) => router.replace(`/users/roles/${r.id}`) });
  const update = useAction(updateRole, { success: "Role saved" });
  const remove = useAction(deleteRole, { success: "Role deleted", onSuccess: () => router.replace("/users/roles") });

  const toggle = (p: Permission, on: boolean) => {
    const next = new Set(granted);
    if (on) next.add(p);
    else next.delete(p);
    // Managing implies viewing, so nobody ends up with an unusable combination.
    if (on && p.endsWith(":manage")) next.add(p.replace(":manage", ":view") as Permission);
    if (on && p === "campaigns:send") next.add("campaigns:view");
    setGranted(next);
  };

  async function save() {
    const values = { name, description, permissions: [...granted] };
    const res = role ? await update.run({ id: role.id, values }) : await create.run(values);
    setErrors(res.ok ? {} : resultErrors(res, role ? "values." : ""));
  }

  const sensitive = permissionCatalog.flatMap((g) => g.items).filter((i) => i.sensitive && granted.has(i.permission));

  return (
    <div className="grid max-w-4xl gap-page">
      {role?.locked && (
        <Alert tone="info" title="This role can’t be changed">
          The Owner role always has every permission so the organisation can never be locked out.
        </Alert>
      )}
      {role && role.userCount > 0 && canEdit && (
        <Alert tone="warning">
          {pluralize(role.userCount, "administrator")} {role.userCount === 1 ? "has" : "have"} this role. Changes apply to them straight away.
        </Alert>
      )}
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Role name" htmlFor="role-name" error={errors.name}>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} maxLength={60} aria-describedby="role-name-msg" />
          </Field>
          <Field label="Description" htmlFor="role-desc" optional>
            <Textarea id="role-desc" rows={1} value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} maxLength={280} />
          </Field>
        </CardContent>
      </Card>

      {permissionCatalog.map((group) => (
        <Card key={group.area}>
          <CardHeader title={group.area} />
          <CardContent className="grid gap-1 pt-2">
            {group.items.map((item) => (
              <div key={item.permission} className="flex items-start justify-between gap-4 rounded-control px-2 py-3 hover:bg-surface-hover">
                <label htmlFor={`perm-${item.permission}`} className="grid cursor-pointer gap-0.5">
                  <span className="flex items-center gap-2 font-medium">
                    {item.label}
                    {item.sensitive && (
                      <Badge tone="warning" shape="square">
                        Sensitive
                      </Badge>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </label>
                <Switch
                  id={`perm-${item.permission}`}
                  checked={granted.has(item.permission)}
                  onCheckedChange={(on) => toggle(item.permission, on)}
                  disabled={!canEdit}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {canEdit && (
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface-raised/95 p-3 shadow-lg backdrop-blur">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {sensitive.length > 0 ? (
              <>
                <AlertTriangle className="size-4 text-warning" /> Includes {pluralize(sensitive.length, "sensitive permission")}
              </>
            ) : (
              <>
                <Lock className="size-4" /> {pluralize(granted.size, "permission")} selected
              </>
            )}
          </p>
          <div className="flex gap-2">
            {role && !role.system && (
              <Button
                variant="danger-soft"
                leftIcon={<Trash2 />}
                onClick={async () => {
                  if (role.userCount > 0) {
                    await modals.confirm({
                      title: "Move people off this role first",
                      description: `${pluralize(role.userCount, "administrator")} still ${role.userCount === 1 ? "has" : "have"} it. Give them another role, then delete it.`,
                      confirmLabel: "OK",
                    });
                    return;
                  }
                  if (await modals.confirm({ tone: "danger", title: `Delete the “${role.name}” role?`, confirmLabel: "Delete role" })) await remove.run({ id: role.id });
                }}
              >
                Delete
              </Button>
            )}
            <Button leftIcon={<Save />} loading={create.pending || update.pending} onClick={save}>
              {role ? "Save changes" : "Create role"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
