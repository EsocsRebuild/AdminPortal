"use client";

import { UserMinus, UsersRound } from "lucide-react";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { selectColumn } from "@/components/data-table/select-column";
import { UrlFilter } from "@/components/data-table/url-filter";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAction } from "@/hooks/use-action";
import { formatDate } from "@/lib/format";
import { pluralize } from "@/lib/utils";

import { removeContacts } from "../actions";
import { contactStatuses, contactStatusLabels, type Contact } from "../types";

const col = columnHelper<Contact>();
const sources: Record<Contact["source"], string> = {
  import: "Import",
  form: "Form",
  member: "Member register",
  manual: "Added by hand",
  api: "Integration",
};

export function ContactsTable({
  listId,
  page,
  server,
}: {
  listId: string;
  page: Contact[];
  server: ServerTableState;
}) {
  const modals = useModals();
  const canManage = usePermission("audiences:manage");
  const remove = useAction(removeContacts, { success: (r) => `${pluralize(r.removed, "contact")} removed` });

  const columns = React.useMemo(
    () => [
      ...(canManage ? [selectColumn<Contact>()] : []),
      col.accessor("email", {
        header: ({ header }) => <ColumnHeader header={header} title="Contact" />,
        enableHiding: false,
        cell: ({ row }) => {
          const c = row.original;
          const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
          return (
            <div className="grid min-w-0">
              <span className="truncate font-medium">{name || c.email}</span>
              {name && <span className="truncate text-xs text-muted-foreground">{c.email}</span>}
            </div>
          );
        },
      }),
      col.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: (i) => <StatusBadge status={i.getValue()} label={contactStatusLabels[i.getValue()]} />,
      }),
      col.accessor("source", {
        header: "Added from",
        enableSorting: false,
        meta: { label: "Added from" },
        cell: (i) => <span className="text-muted-foreground">{sources[i.getValue()]}</span>,
      }),
      col.accessor("createdAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Added" />,
        meta: { label: "Added" },
        cell: (i) => <span className="text-muted-foreground">{formatDate(i.getValue())}</span>,
      }),
    ],
    [canManage],
  );

  return (
    <DataTable
      data={page}
      columns={columns}
      getRowId={(c) => c.id}
      server={server}
      searchPlaceholder="Search by email or name…"
      filters={() => (
        <UrlFilter
          param="status"
          title="Status"
          options={contactStatuses.map((s) => ({ value: s, label: contactStatusLabels[s] }))}
        />
      )}
      bulkActions={
        canManage
          ? (ids, clear) => (
              <Button
                variant="danger-soft"
                size="sm"
                leftIcon={<UserMinus />}
                onClick={async () => {
                  const ok = await modals.confirm({
                    title: `Remove ${pluralize(ids.length, "contact")} from this audience?`,
                    description:
                      "They won’t receive emails sent to this audience. Their other lists aren’t affected.",
                    confirmLabel: "Remove",
                    tone: "danger",
                  });
                  if (ok && (await remove.run({ listId, ids })).ok) clear();
                }}
              >
                Remove
              </Button>
            )
          : undefined
      }
      renderMobileRow={(row) => {
        const c = row.original;
        const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
        return (
          <div className="flex items-center justify-between gap-3 p-3.5">
            <div className="grid min-w-0">
              <span className="truncate font-medium">{name || c.email}</span>
              {name && <span className="truncate text-sm text-muted-foreground">{c.email}</span>}
            </div>
            <StatusBadge status={c.status} label={contactStatusLabels[c.status]} />
          </div>
        );
      }}
      emptyState={
        <EmptyState
          size="compact"
          icon={<UsersRound />}
          title="No contacts yet"
          description="Import a spreadsheet, add church members who agreed to emails, or add people one at a time."
        />
      }
    />
  );
}
