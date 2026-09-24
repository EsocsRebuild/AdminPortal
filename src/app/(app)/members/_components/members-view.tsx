"use client";

import { Download, Mail, MoreHorizontal, Plus, Trash2, UserCheck, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { StatusBadge } from "@/components/blocks/status-badge";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { columnHelper } from "@/components/data-table/features";
import { selectColumn } from "@/components/data-table/select-column";
import { PageHeader } from "@/components/layout/page";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import type { Member } from "@/lib/fixtures";
import { formatCurrency, formatDate } from "@/lib/format";
import { pluralize, sleep } from "@/lib/utils";

import { MemberFormDialog } from "./member-form";
import { MemberSheet } from "./member-sheet";

const col = columnHelper<Member>();

function count<K extends keyof Member>(rows: Member[], key: K) {
  const map = new Map<string, number>();
  rows.forEach((r) => map.set(String(r[key]), (map.get(String(r[key])) ?? 0) + 1));
  return map;
}

function RowMenu({ member, onView }: { member: Member; onView: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${member.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onSelect={onView}>
          <Users /> View profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`mailto:${member.email}`}>
            <Mail /> Send email
          </a>
        </DropdownMenuItem>
        <Can permission="members:manage">
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger" onSelect={() => toast.error(`${member.name} removed`)}>
            <Trash2 /> Remove
          </DropdownMenuItem>
        </Can>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MembersView({ members }: { members: Member[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [tab, setTab] = React.useState(params.get("status") ?? "all");
  const [viewing, setViewing] = React.useState<Member | null>(null);
  const [confirmIds, setConfirmIds] = React.useState<string[] | null>(null);
  const formOpen = params.get("new") === "1";

  const setFormOpen = (open: boolean) => {
    const next = new URLSearchParams(params);
    if (open) next.set("new", "1");
    else next.delete("new");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const data = React.useMemo(
    () => (tab === "all" ? members : members.filter((m) => m.status === tab)),
    [members, tab],
  );
  const statusCounts = React.useMemo(() => count(members, "status"), [members]);
  const parishCounts = React.useMemo(() => count(data, "parish"), [data]);
  const rankCounts = React.useMemo(() => count(data, "rank"), [data]);

  const columns = React.useMemo(
    () => [
      selectColumn<Member>(),
      col.accessor("name", {
        header: ({ header }) => <ColumnHeader header={header} title="Member" />,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.original.name} size="md" />
            <div className="grid min-w-0">
              <span className="truncate font-medium">{row.original.name}</span>
              <span className="truncate text-xs text-muted-foreground">{row.original.email}</span>
            </div>
          </div>
        ),
      }),
      col.accessor("id", {
        header: "ID",
        meta: { label: "ID" },
        cell: (info) => <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>,
      }),
      col.accessor("parish", {
        header: ({ header }) => <ColumnHeader header={header} title="Parish" />,
        filterFn: "arrIncludesSome",
        meta: { label: "Parish" },
      }),
      col.accessor("rank", {
        header: "Rank",
        filterFn: "arrIncludesSome",
        meta: { label: "Rank" },
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
      }),
      col.accessor("status", {
        header: "Status",
        meta: { label: "Status" },
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      col.accessor("givingYtd", {
        header: ({ header }) => <ColumnHeader header={header} title="Giving YTD" />,
        enableGlobalFilter: false,
        meta: { label: "Giving YTD", align: "end" },
        cell: (info) => formatCurrency(info.getValue()),
      }),
      col.accessor("joinedAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Joined" />,
        sortFn: "datetime",
        enableGlobalFilter: false,
        meta: { label: "Joined" },
        cell: (info) => <span className="text-muted-foreground">{formatDate(info.getValue())}</span>,
      }),
      col.display({
        id: "actions",
        enableHiding: false,
        meta: { headerClassName: "w-12", align: "end" },
        cell: ({ row }) => <RowMenu member={row.original} onView={() => setViewing(row.original)} />,
      }),
    ],
    [],
  );

  const tabs = [
    { value: "all", label: "All", count: members.length },
    { value: "active", label: "Active", count: statusCounts.get("active") ?? 0 },
    { value: "pending", label: "Pending", count: statusCounts.get("pending") ?? 0 },
    { value: "inactive", label: "Inactive", count: statusCounts.get("inactive") ?? 0 },
    { value: "suspended", label: "Suspended", count: statusCounts.get("suspended") ?? 0 },
  ];

  return (
    <Tabs value={tab} onValueChange={setTab} className="grid grid-cols-[minmax(0,1fr)] gap-page">
      <PageHeader
        title="Members"
        description="Everyone registered across all parishes."
        actions={
          <>
            <Button variant="secondary" leftIcon={<Download />}>
              Export
            </Button>
            <Can permission="members:manage">
              <Button leftIcon={<Plus />} onClick={() => setFormOpen(true)}>
                Add member
              </Button>
            </Can>
          </>
        }
      >
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label} <TabsCount>{t.count}</TabsCount>
            </TabsTrigger>
          ))}
        </TabsList>
      </PageHeader>

      <TabsContent value={tab} className="pt-0">
        <DataTable
          key={tab}
          data={data}
          columns={columns}
          getRowId={(m) => m.id}
          searchPlaceholder="Search name, email or ID…"
          initialSorting={[{ id: "joinedAt", desc: true }]}
          initialColumnVisibility={{ id: false }}
          onRowClick={setViewing}
          filters={(table) => (
            <>
              <FacetedFilter
                column={table.getColumn("parish")}
                title="Parish"
                options={[...parishCounts].map(([value, n]) => ({ value, label: value, count: n }))}
              />
              <FacetedFilter
                column={table.getColumn("rank")}
                title="Rank"
                options={[...rankCounts].map(([value, n]) => ({ value, label: value, count: n }))}
              />
            </>
          )}
          bulkActions={(ids, clear) => (
            <>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Mail />}
                onClick={() => toast(`Emailing ${pluralize(ids.length, "member")}…`)}
              >
                Email
              </Button>
              <Can permission="members:manage">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<UserCheck />}
                  onClick={() => {
                    toast.success(`${pluralize(ids.length, "member")} approved`);
                    clear();
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger-soft"
                  size="sm"
                  leftIcon={<Trash2 />}
                  onClick={() => setConfirmIds(ids)}
                >
                  Remove
                </Button>
              </Can>
            </>
          )}
          renderMobileRow={(row) => (
            <div className="flex items-start gap-3 p-3.5">
              <Avatar name={row.original.name} size="lg" />
              <button
                type="button"
                className="grid min-w-0 flex-1 gap-1 text-left"
                onClick={() => setViewing(row.original)}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{row.original.name}</span>
                  <StatusBadge status={row.original.status} />
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {row.original.rank} · {row.original.parish}
                </span>
                <span className="tabular text-sm">{formatCurrency(row.original.givingYtd)} YTD</span>
              </button>
            </div>
          )}
          emptyState={
            <EmptyState
              size="compact"
              icon={<Users />}
              title="No members in this view"
              description="Members you add or approve will show up here."
            />
          }
        />
      </TabsContent>

      <MemberSheet member={viewing} onOpenChange={(open) => !open && setViewing(null)} />
      <MemberFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <ConfirmDialog
        open={!!confirmIds}
        onOpenChange={(open) => !open && setConfirmIds(null)}
        tone="danger"
        title={`Remove ${pluralize(confirmIds?.length ?? 0, "member")}?`}
        description="They'll lose access to the member portal. Giving history is kept for records."
        confirmLabel="Remove"
        confirmText="REMOVE"
        onConfirm={async () => {
          await sleep(600);
          toast.success(`${pluralize(confirmIds?.length ?? 0, "member")} removed`);
        }}
      />
    </Tabs>
  );
}
