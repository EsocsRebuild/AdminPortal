"use client";

import { FormInput } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber, formatRelative } from "@/lib/format";

import { formStatusLabels, type FormSummary } from "../types";

const col = columnHelper<FormSummary>();

export function FormsTable({
  page,
  server,
  emptyAction,
}: {
  page: FormSummary[];
  server: ServerTableState;
  emptyAction?: React.ReactNode;
}) {
  const router = useRouter();
  const columns = React.useMemo(
    () => [
      col.accessor("title", {
        header: ({ header }) => <ColumnHeader header={header} title="Form" />,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="grid min-w-0">
            <span className="truncate font-medium">{row.original.title}</span>
            <span className="truncate font-mono text-xs text-muted-foreground">/f/{row.original.slug}</span>
          </div>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: (i) => (
          <StatusBadge
            status={i.getValue() === "published" ? "active" : i.getValue()}
            label={formStatusLabels[i.getValue()]}
          />
        ),
      }),
      col.accessor("responseCount", {
        header: ({ header }) => <ColumnHeader header={header} title="Responses" />,
        meta: { label: "Responses", align: "end" },
        cell: (i) => formatNumber(i.getValue()),
      }),
      col.accessor("updatedAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Last edited" />,
        meta: { label: "Last edited" },
        cell: (i) => (
          <span className="text-muted-foreground" suppressHydrationWarning>
            {formatRelative(i.getValue())}
          </span>
        ),
      }),
    ],
    [],
  );
  return (
    <DataTable
      data={page}
      columns={columns}
      getRowId={(f) => f.id}
      server={server}
      searchPlaceholder="Search forms…"
      onRowClick={(f) =>
        router.push(f.responseCount > 0 ? `/forms/${f.id}/responses` : `/forms/${f.id}/edit`)
      }
      renderMobileRow={(row) => {
        const f = row.original;
        return (
          <button
            type="button"
            onClick={() => router.push(`/forms/${f.id}/edit`)}
            className="grid w-full gap-1 p-3.5 text-left"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate font-medium">{f.title}</span>
              <StatusBadge
                status={f.status === "published" ? "active" : f.status}
                label={formStatusLabels[f.status]}
              />
            </span>
            <span className="text-sm text-muted-foreground">{formatNumber(f.responseCount)} responses</span>
          </button>
        );
      }}
      emptyState={
        <EmptyState
          size="compact"
          icon={<FormInput />}
          title="No forms yet"
          description="Build a registration, survey or sign-up form in minutes, then share it with a link or QR code."
          action={emptyAction}
        />
      }
    />
  );
}
