"use client";

import { CalendarX, Copy, Mail, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { useAction } from "@/hooks/use-action";
import { formatDateTime, formatNumber, formatPercent, formatRelative } from "@/lib/format";

import { deleteCampaign, duplicateCampaign, unscheduleCampaign } from "../actions";
import { campaignStatusLabels, clickRate, openRate, type CampaignSummary } from "../types";

const col = columnHelper<CampaignSummary>();

const hrefFor = (c: CampaignSummary) =>
  c.status === "draft" ? `/campaigns/${c.id}/edit` : `/campaigns/${c.id}`;

function when(c: CampaignSummary) {
  if (c.sentAt) return `Sent ${formatDateTime(c.sentAt)}`;
  if (c.scheduledAt) return `Scheduled for ${formatDateTime(c.scheduledAt)}`;
  return `Edited ${formatRelative(c.updatedAt)}`;
}

function RowMenu({ c }: { c: CampaignSummary }) {
  const router = useRouter();
  const modals = useModals();
  const canManage = usePermission("campaigns:manage");
  const canSend = usePermission("campaigns:send");
  const duplicate = useAction(duplicateCampaign, {
    success: "Copy created",
    onSuccess: (r) => router.push(`/campaigns/${r.id}/edit`),
  });
  const unschedule = useAction(unscheduleCampaign, { success: "Schedule cancelled. It’s a draft again." });
  const remove = useAction(deleteCampaign, { success: "Draft deleted" });
  if (!canManage) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${c.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onSelect={() => duplicate.run({ id: c.id })}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        {c.status === "scheduled" && canSend && (
          <DropdownMenuItem onSelect={() => unschedule.run({ id: c.id })}>
            <CalendarX /> Cancel schedule
          </DropdownMenuItem>
        )}
        {c.status === "draft" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              tone="danger"
              onSelect={async () => {
                if (
                  await modals.confirm({
                    tone: "danger",
                    title: `Delete “${c.name}”?`,
                    description: "This draft will be removed.",
                    confirmLabel: "Delete draft",
                  })
                )
                  await remove.run({ id: c.id });
              }}
            >
              <Trash2 /> Delete draft
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CampaignsTable({
  page,
  server,
  emptyAction,
}: {
  page: CampaignSummary[];
  server: ServerTableState;
  emptyAction?: React.ReactNode;
}) {
  const router = useRouter();
  const columns = React.useMemo(
    () => [
      col.accessor("name", {
        header: ({ header }) => <ColumnHeader header={header} title="Campaign" />,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="grid max-w-md min-w-0">
            <span className="truncate font-medium">{row.original.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {row.original.subject ?? "No subject yet"}
            </span>
          </div>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: (i) => <StatusBadge status={i.getValue()} label={campaignStatusLabels[i.getValue()]} />,
      }),
      col.accessor("recipientCount", {
        header: "Recipients",
        enableSorting: false,
        meta: { label: "Recipients", align: "end" },
        cell: (i) => (i.getValue() === null ? "—" : formatNumber(i.getValue()!)),
      }),
      col.display({
        id: "opens",
        header: "Opened",
        meta: { label: "Opened", align: "end" },
        cell: ({ row }) => (row.original.stats ? formatPercent(openRate(row.original.stats)) : "—"),
      }),
      col.display({
        id: "clicks",
        header: "Clicked",
        meta: { label: "Clicked", align: "end" },
        cell: ({ row }) => (row.original.stats ? formatPercent(clickRate(row.original.stats)) : "—"),
      }),
      col.accessor("updatedAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Date" />,
        meta: { label: "Date" },
        cell: ({ row }) => (
          <span className="text-muted-foreground" suppressHydrationWarning>
            {when(row.original)}
          </span>
        ),
      }),
      col.display({
        id: "actions",
        enableHiding: false,
        meta: { headerClassName: "w-12", align: "end" },
        cell: ({ row }) => <RowMenu c={row.original} />,
      }),
    ],
    [],
  );

  return (
    <DataTable
      data={page}
      columns={columns}
      getRowId={(c) => c.id}
      server={server}
      searchPlaceholder="Search campaigns…"
      onRowClick={(c) => router.push(hrefFor(c))}
      renderMobileRow={(row) => {
        const c = row.original;
        return (
          <button
            type="button"
            onClick={() => router.push(hrefFor(c))}
            className="grid w-full gap-1.5 p-3.5 text-left"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate font-medium">{c.name}</span>
              <StatusBadge status={c.status} label={campaignStatusLabels[c.status]} />
            </span>
            <span className="truncate text-sm text-muted-foreground">{c.subject ?? "No subject yet"}</span>
            <span className="text-xs text-subtle-foreground" suppressHydrationWarning>
              {when(c)}
              {c.stats ? ` · ${formatPercent(openRate(c.stats))} opened` : ""}
            </span>
          </button>
        );
      }}
      emptyState={
        <EmptyState
          size="compact"
          icon={<Mail />}
          title="No campaigns yet"
          description="Create your first email. You’ll be guided step by step, and nothing is sent until you’re ready."
          action={emptyAction}
        />
      }
    />
  );
}
