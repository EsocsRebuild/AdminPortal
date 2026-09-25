"use client";

import { Download, Trash2, UserCheck, UserMinus, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { selectColumn } from "@/components/data-table/select-column";
import { UrlFilter } from "@/components/data-table/url-filter";
import { useModals } from "@/components/modals/modal-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Parish } from "@/features/lookups/queries";
import { useAction } from "@/hooks/use-action";
import { formatDate } from "@/lib/format";
import { pluralize } from "@/lib/utils";

import { bulkDeleteMembers, bulkUpdateMembers } from "../actions";
import { memberStatuses, statusLabels, type MemberSummary } from "../types";

const col = columnHelper<MemberSummary>();

export function MembersTable({
  page,
  server,
  parishes,
}: {
  page: MemberSummary[];
  server: ServerTableState;
  parishes: Parish[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const modals = useModals();
  const canManage = usePermission("members:manage");
  const canExport = usePermission("members:export");
  const bulk = useAction(bulkUpdateMembers, { success: (r) => `${pluralize(r.updated, "member")} updated` });
  const remove = useAction(bulkDeleteMembers, {
    success: (r) => `${pluralize(r.deleted, "member")} deleted`,
  });

  const columns = React.useMemo(
    () => [
      ...(canManage ? [selectColumn<MemberSummary>()] : []),
      col.accessor("lastName", {
        id: "name",
        header: ({ header }) => <ColumnHeader header={header} title="Member" />,
        enableHiding: false,
        cell: ({ row }) => {
          const m = row.original;
          const name = `${m.firstName} ${m.lastName}`;
          return (
            <div className="flex items-center gap-3">
              <Avatar name={name} src={m.avatarUrl} />
              <div className="grid min-w-0">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {m.email ?? m.phone ?? "No contact details"}
                </span>
              </div>
            </div>
          );
        },
      }),
      col.accessor("memberNumber", {
        header: "ID",
        meta: { label: "Member ID" },
        cell: (i) => <span className="font-mono text-xs text-muted-foreground">{i.getValue()}</span>,
      }),
      col.accessor((m) => m.parish?.name ?? "—", {
        id: "parish",
        header: ({ header }) => <ColumnHeader header={header} title="Parish" />,
        meta: { label: "Parish" },
      }),
      col.accessor("rank", {
        header: "Rank",
        enableSorting: false,
        meta: { label: "Rank" },
        cell: (i) => <span className="text-muted-foreground">{i.getValue() ?? "—"}</span>,
      }),
      col.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: (i) => <StatusBadge status={i.getValue()} label={statusLabels[i.getValue()]} />,
      }),
      col.accessor("joinedAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Joined" />,
        meta: { label: "Joined" },
        cell: (i) => <span className="text-muted-foreground">{formatDate(i.getValue())}</span>,
      }),
    ],
    [canManage],
  );

  async function confirmDelete(ids: string[], clear: () => void) {
    const ok = await modals.confirm({
      tone: "danger",
      title: `Delete ${pluralize(ids.length, "member")}?`,
      description:
        "Their records, attendance and giving history will be removed permanently. This can’t be undone.",
      confirmLabel: "Delete permanently",
      confirmText: "DELETE",
    });
    if (!ok) return;
    const res = await remove.run({ ids });
    if (res.ok) clear();
  }

  const exportHref = `/api/members/export?${params.toString()}`;

  return (
    <DataTable
      data={page}
      columns={columns}
      getRowId={(m) => m.id}
      server={server}
      searchPlaceholder="Search by name, email, phone or ID…"
      initialColumnVisibility={{ memberNumber: false }}
      onRowClick={(m) => router.push(`/members/${m.id}`)}
      filters={() => (
        <>
          <UrlFilter
            param="status"
            title="Status"
            options={memberStatuses.map((s) => ({ value: s, label: statusLabels[s] }))}
          />
          {parishes.length > 1 && (
            <UrlFilter
              param="parishId"
              title="Parish"
              options={parishes.map((p) => ({ value: p.id, label: p.name }))}
            />
          )}
        </>
      )}
      toolbarEnd={
        canExport && server.total > 0 ? (
          <Button variant="secondary" size="sm" leftIcon={<Download />} asChild>
            <a href={exportHref} download>
              Export
            </a>
          </Button>
        ) : undefined
      }
      bulkActions={
        canManage
          ? (ids, clear) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<UserCheck />}
                  loading={bulk.pending}
                  onClick={async () => (await bulk.run({ ids, action: "approve" })).ok && clear()}
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<UserMinus />}
                  onClick={async () => (await bulk.run({ ids, action: "deactivate" })).ok && clear()}
                >
                  Mark inactive
                </Button>
                <Button
                  variant="danger-soft"
                  size="sm"
                  leftIcon={<Trash2 />}
                  onClick={() => confirmDelete(ids, clear)}
                >
                  Delete
                </Button>
              </>
            )
          : undefined
      }
      renderMobileRow={(row) => {
        const m = row.original;
        const name = `${m.firstName} ${m.lastName}`;
        return (
          <button
            type="button"
            onClick={() => router.push(`/members/${m.id}`)}
            className="flex w-full items-start gap-3 p-3.5 text-left"
          >
            <Avatar name={name} src={m.avatarUrl} size="lg" />
            <span className="grid min-w-0 flex-1 gap-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">{name}</span>
                <StatusBadge status={m.status} label={statusLabels[m.status]} />
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {[m.rank, m.parish?.name].filter(Boolean).join(" · ") || "No parish"}
              </span>
            </span>
          </button>
        );
      }}
      emptyState={
        <EmptyState
          size="compact"
          icon={<Users />}
          title="No members yet"
          description={
            canManage
              ? "Add your first member to get started."
              : "Members will appear here once they’re added."
          }
        />
      }
    />
  );
}
