"use client";

import { AlertOctagon, AlertTriangle, Download, Info, ScrollText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper } from "@/components/data-table/features";
import { UrlFilter } from "@/components/data-table/url-filter";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDateTime, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

import { severities, severityLabels, type AuditEvent } from "../types";

const col = columnHelper<AuditEvent>();
const severityIcon = {
  info: <Info className="size-4 text-info" />,
  warning: <AlertTriangle className="size-4 text-warning" />,
  critical: <AlertOctagon className="size-4 text-danger" />,
};

const show = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);

export function AuditTable({
  page,
  server,
  canExport,
}: {
  page: AuditEvent[];
  server: ServerTableState;
  canExport: boolean;
}) {
  const [open, setOpen] = React.useState<AuditEvent | null>(null);
  const params = useSearchParams();
  const columns = React.useMemo(
    () => [
      col.accessor("severity", {
        header: "",
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: "w-8" },
        cell: (i) => (
          <span role="img" aria-label={severityLabels[i.getValue()]}>
            {severityIcon[i.getValue()]}
          </span>
        ),
      }),
      col.accessor("summary", {
        header: "Event",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="grid max-w-xl min-w-0">
            <span className="truncate">{row.original.summary}</span>
            <span className="truncate font-mono text-xs text-muted-foreground">{row.original.action}</span>
          </div>
        ),
      }),
      col.accessor((e) => e.actor?.name ?? "System", {
        id: "actor",
        header: "By",
        enableSorting: false,
        meta: { label: "By" },
        cell: ({ row }) =>
          row.original.actor ? (
            <span className="flex items-center gap-2">
              <Avatar name={row.original.actor.name} size="sm" />
              <span className="truncate">{row.original.actor.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">System</span>
          ),
      }),
      col.accessor("ip", {
        header: "IP address",
        enableSorting: false,
        meta: { label: "IP address" },
        cell: (i) => <span className="font-mono text-xs text-muted-foreground">{i.getValue() ?? "—"}</span>,
      }),
      col.accessor("createdAt", {
        header: ({ header }) => <ColumnHeader header={header} title="When" />,
        meta: { label: "When" },
        cell: (i) => (
          <span
            className="text-muted-foreground"
            title={formatDateTime(i.getValue())}
            suppressHydrationWarning
          >
            {formatRelative(i.getValue())}
          </span>
        ),
      }),
    ],
    [],
  );

  return (
    <>
      <DataTable
        data={page}
        columns={columns}
        getRowId={(e) => e.id}
        server={server}
        searchPlaceholder="Search events, people or records…"
        onRowClick={setOpen}
        filters={() => (
          <>
            <UrlFilter
              param="severity"
              title="Severity"
              options={severities.map((s) => ({ value: s, label: severityLabels[s] }))}
            />
            <UrlFilter
              param="period"
              title="Period"
              options={[
                { value: "24h", label: "Last 24 hours" },
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
              ]}
            />
          </>
        )}
        toolbarEnd={
          canExport ? (
            <Button variant="secondary" size="sm" leftIcon={<Download />} asChild>
              <a href={`/api/audit-log/export?${params.toString()}`} download>
                Export
              </a>
            </Button>
          ) : undefined
        }
        renderMobileRow={(row) => {
          const e = row.original;
          return (
            <button
              type="button"
              onClick={() => setOpen(e)}
              className="flex w-full items-start gap-3 p-3.5 text-left"
            >
              <span className="mt-0.5">{severityIcon[e.severity]}</span>
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="text-sm">{e.summary}</span>
                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {e.actor?.name ?? "System"} · {formatRelative(e.createdAt)}
                </span>
              </span>
            </button>
          );
        }}
        emptyState={
          <EmptyState
            size="compact"
            icon={<ScrollText />}
            title="No activity recorded yet"
            description="Sign-ins, changes and exports will appear here."
          />
        }
      />
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent size="lg">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {severityIcon[open.severity]} {open.summary}
                </SheetTitle>
                <SheetDescription className="font-mono text-xs">{open.action}</SheetDescription>
              </SheetHeader>
              <SheetBody className="grid content-start gap-6">
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  {[
                    ["When", formatDateTime(open.createdAt)],
                    ["By", open.actor ? `${open.actor.name} (${open.actor.email})` : "System"],
                    ["Record", open.target ? `${open.target.label} · ${open.target.type}` : "—"],
                    ["IP address", open.ip ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-0.5">
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="break-words">{v}</dd>
                    </div>
                  ))}
                  <div className="grid gap-0.5 sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">Device</dt>
                    <dd className="font-mono text-xs break-words text-muted-foreground">
                      {open.userAgent ?? "—"}
                    </dd>
                  </div>
                </dl>
                {open.changes && Object.keys(open.changes).length > 0 && (
                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Changes</h3>
                    <div className="overflow-x-auto rounded-card border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-surface-muted/60 text-xs text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Field</th>
                            <th className="px-3 py-2 text-left font-medium">Before</th>
                            <th className="px-3 py-2 text-left font-medium">After</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(open.changes).map(([field, c]) => (
                            <tr key={field} className="border-t border-border-subtle align-top">
                              <td className="px-3 py-2 font-medium">{field}</td>
                              <td
                                className={cn(
                                  "px-3 py-2 break-all text-danger-soft-foreground line-through decoration-danger/40",
                                )}
                              >
                                {show(c.from)}
                              </td>
                              <td className="px-3 py-2 break-all text-success-soft-foreground">
                                {show(c.to)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
