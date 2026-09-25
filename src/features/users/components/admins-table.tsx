"use client";

import { KeyRound, MailPlus, MoreHorizontal, ShieldCheck, ShieldOff, UserCheck, UserCog, UserX, XCircle } from "lucide-react";
import * as React from "react";

import { usePermission, useSession } from "@/components/auth/session-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { UrlFilter } from "@/components/data-table/url-filter";
import { useModals } from "@/components/modals/modal-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAction } from "@/hooks/use-action";
import { formatRelative } from "@/lib/format";

import { changeAdminRole, reactivateAdmin, resendInvite, resetAdminMfa, revokeInvite, suspendAdmin } from "../actions";
import { adminStatuses, adminStatusLabels, type AdminUser, type Role } from "../types";

const col = columnHelper<AdminUser>();

function RoleDialog({ user, roles, open, onOpenChange }: { user: AdminUser; roles: Role[]; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [roleId, setRoleId] = React.useState(user.role.id);
  const change = useAction(changeAdminRole, { success: `${user.name}’s role was updated`, onSuccess: () => onOpenChange(false) });
  const role = roles.find((r) => r.id === roleId);
  return (
    <Dialog open={open} onOpenChange={(o) => !change.pending && onOpenChange(o)}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>For {user.name}. It takes effect the next time they load a page.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-2">
          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger aria-label="Role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.filter((r) => !r.locked).map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {role?.description && <p className="text-sm text-muted-foreground">{role.description}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={change.pending}>
            Cancel
          </Button>
          <Button loading={change.pending} disabled={roleId === user.role.id} onClick={() => change.run({ id: user.id, roleId })}>
            Save role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RowMenu({ user, roles }: { user: AdminUser; roles: Role[] }) {
  const me = useSession();
  const modals = useModals();
  const canManage = usePermission("users:manage");
  const [roleOpen, setRoleOpen] = React.useState(false);
  const suspend = useAction(suspendAdmin, { success: `${user.name} was suspended and signed out` });
  const reactivate = useAction(reactivateAdmin, { success: `${user.name} can sign in again` });
  const resend = useAction(resendInvite, { success: "Invitation sent again" });
  const revoke = useAction(revokeInvite, { success: "Invitation cancelled" });
  const resetMfa = useAction(resetAdminMfa, { success: "Two-step verification reset" });
  if (!canManage || user.id === me?.id) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${user.name}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {user.status === "invited" ? (
            <>
              <DropdownMenuItem onSelect={() => resend.run({ id: user.id })}>
                <MailPlus /> Resend invitation
              </DropdownMenuItem>
              <DropdownMenuItem tone="danger" onSelect={() => revoke.run({ id: user.id })}>
                <XCircle /> Cancel invitation
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onSelect={() => setRoleOpen(true)}>
                <UserCog /> Change role
              </DropdownMenuItem>
              {user.mfaEnabled && (
                <DropdownMenuItem
                  onSelect={async () => {
                    if (
                      await modals.confirm({
                        title: `Reset two-step verification for ${user.name}?`,
                        description: "Use this if they lost their phone. They’ll set it up again next time they sign in.",
                        confirmLabel: "Reset",
                      })
                    )
                      await resetMfa.run({ id: user.id });
                  }}
                >
                  <KeyRound /> Reset two-step verification
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {user.status === "suspended" ? (
                <DropdownMenuItem onSelect={() => reactivate.run({ id: user.id })}>
                  <UserCheck /> Reactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  tone="danger"
                  onSelect={async () => {
                    if (
                      await modals.confirm({
                        tone: "danger",
                        title: `Suspend ${user.name}?`,
                        description: "They’ll be signed out everywhere immediately and won’t be able to sign in until reactivated.",
                        confirmLabel: "Suspend",
                      })
                    )
                      await suspend.run({ id: user.id });
                  }}
                >
                  <UserX /> Suspend access
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <RoleDialog user={user} roles={roles} open={roleOpen} onOpenChange={setRoleOpen} />
    </>
  );
}

export function AdminsTable({ page, server, roles }: { page: AdminUser[]; server: ServerTableState; roles: Role[] }) {
  const me = useSession();
  const columns = React.useMemo(
    () => [
      col.accessor("name", {
        header: ({ header }) => <ColumnHeader header={header} title="Administrator" />,
        enableHiding: false,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar name={u.name} src={u.avatarUrl} />
              <div className="grid min-w-0">
                <span className="flex items-center gap-2 truncate font-medium">
                  {u.name}
                  {u.id === me?.id && <Badge tone="outline">You</Badge>}
                </span>
                <span className="truncate text-xs text-muted-foreground">{u.email}</span>
              </div>
            </div>
          );
        },
      }),
      col.accessor((u) => u.role.name, { id: "role", header: "Role", enableSorting: false, meta: { label: "Role" } }),
      col.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: (i) => <StatusBadge status={i.getValue()} label={adminStatusLabels[i.getValue()]} />,
      }),
      col.accessor("mfaEnabled", {
        header: "Two-step",
        enableSorting: false,
        meta: { label: "Two-step verification" },
        cell: (i) =>
          i.getValue() ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-success-soft-foreground">
              <ShieldCheck className="size-4" /> On
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-warning-soft-foreground">
              <ShieldOff className="size-4" /> Off
            </span>
          ),
      }),
      col.accessor("lastActiveAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Last active" />,
        meta: { label: "Last active" },
        cell: (i) => <span className="text-muted-foreground" suppressHydrationWarning>{i.getValue() ? formatRelative(i.getValue()!) : "Never"}</span>,
      }),
      col.display({
        id: "actions",
        enableHiding: false,
        meta: { headerClassName: "w-12", align: "end" },
        cell: ({ row }) => <RowMenu user={row.original} roles={roles} />,
      }),
    ],
    [me?.id, roles],
  );

  return (
    <DataTable
      data={page}
      columns={columns}
      getRowId={(u) => u.id}
      server={server}
      searchPlaceholder="Search by name or email…"
      filters={() => (
        <>
          <UrlFilter param="status" title="Status" options={adminStatuses.map((s) => ({ value: s, label: adminStatusLabels[s] }))} />
          <UrlFilter param="roleId" title="Role" options={roles.map((r) => ({ value: r.id, label: r.name }))} />
        </>
      )}
      renderMobileRow={(row) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3 p-3.5">
            <Avatar name={u.name} src={u.avatarUrl} size="lg" />
            <div className="grid min-w-0 flex-1">
              <span className="truncate font-medium">{u.name}</span>
              <span className="truncate text-sm text-muted-foreground">{u.role.name}</span>
            </div>
            <StatusBadge status={u.status} label={adminStatusLabels[u.status]} />
            <RowMenu user={u} roles={roles} />
          </div>
        );
      }}
    />
  );
}
