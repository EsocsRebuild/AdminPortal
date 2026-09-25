"use client";

import {
  FlexRender,
  useTable,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { Search, SearchX, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlQuery } from "@/hooks/use-url-query";
import { cn, pluralize } from "@/lib/utils";

import { dataTableFeatures, type DataTableColumn, type DataTableInstance, type DataTableRow } from "./features";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./view-options";

/** One page of server data plus the query that produced it. */
export interface ServerTableState {
  total: number;
  page: number;
  pageSize: number;
  q?: string;
  sort?: string;
  dir?: "asc" | "desc";
  /** True when any page-specific filter (status, date…) is applied. */
  filtered?: boolean;
}

export interface DataTableProps<T extends RowData> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable id per record; used for selection. */
  getRowId: (row: T) => string;
  /**
   * Server mode: `data` is one page from the API; search, sort and paging are
   * kept in the URL and the page re-renders on the server.
   */
  server?: ServerTableState;
  searchPlaceholder?: string;
  /** Filter controls rendered beside the search field. */
  filters?: (table: DataTableInstance<T>) => React.ReactNode;
  /** Controls at the right end of the toolbar, e.g. an export button. */
  toolbarEnd?: React.ReactNode;
  /** Actions for the floating bar shown while rows are selected. */
  bulkActions?: (selectedIds: string[], clear: () => void) => React.ReactNode;
  /** Card layout for phones. Without it, the table scrolls horizontally. */
  renderMobileRow?: (row: DataTableRow<T>) => React.ReactNode;
  onRowClick?: (row: T) => void;
  /** Shown when there is no data and nothing is filtered. */
  emptyState?: React.ReactNode;
  loading?: boolean;
  pageSize?: number;
  initialSorting?: SortingState;
  initialColumnVisibility?: ColumnVisibilityState;
  className?: string;
}

const resolve = <S,>(updater: Updater<S>, current: S) =>
  typeof updater === "function" ? (updater as (s: S) => S)(current) : updater;

export function DataTable<T extends RowData>(props: DataTableProps<T>) {
  return props.server ? <ServerDataTable {...props} server={props.server} /> : <ClientDataTable {...props} />;
}

function ClientDataTable<T extends RowData>(props: DataTableProps<T>) {
  const { data, columns, getRowId, pageSize = 10, initialSorting = [], initialColumnVisibility = {} } = props;
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    globalFilterFn: "includesString",
    enableSortingRemoval: false,
    initialState: {
      sorting: initialSorting,
      columnVisibility: initialColumnVisibility,
      pagination: { pageIndex: 0, pageSize },
    },
  });
  const { globalFilter, columnFilters } = table.state;
  const filtered = Boolean(globalFilter) || columnFilters.length > 0;

  return (
    <TableFrame
      {...props}
      table={table}
      filtered={filtered}
      search={(globalFilter as string) ?? ""}
      onSearch={(v) => table.setGlobalFilter(v)}
      onReset={() => {
        table.setGlobalFilter("");
        table.resetColumnFilters(true);
      }}
    />
  );
}

function ServerDataTable<T extends RowData>(props: DataTableProps<T> & { server: ServerTableState }) {
  const { data, columns, getRowId, server, initialColumnVisibility = {} } = props;
  const url = useUrlQuery();
  const [search, setSearch] = React.useState(server.q ?? "");

  // Debounce typing into the URL.
  React.useEffect(() => {
    if ((server.q ?? "") === search) return;
    const id = setTimeout(() => url.set({ q: search }), 350);
    return () => clearTimeout(id);
  }, [search, server.q, url]);

  const pagination: PaginationState = { pageIndex: server.page - 1, pageSize: server.pageSize };
  const sorting: SortingState = server.sort ? [{ id: server.sort, desc: server.dir === "desc" }] : [];

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: server.total,
    enableSortingRemoval: false,
    initialState: { columnVisibility: initialColumnVisibility },
    state: { pagination, sorting },
    onPaginationChange: (u) => {
      const next = resolve(u, pagination);
      url.set({ page: next.pageIndex + 1, pageSize: next.pageSize === 20 ? null : next.pageSize });
    },
    onSortingChange: (u) => {
      const next = resolve(u, sorting)[0];
      url.set({ sort: next?.id ?? null, dir: next ? (next.desc ? "desc" : "asc") : null });
    },
  });

  return (
    <TableFrame
      {...props}
      table={table}
      pending={url.isPending}
      filtered={Boolean(server.q) || Boolean(server.filtered)}
      search={search}
      onSearch={setSearch}
      onReset={() => {
        setSearch("");
        const reset: Record<string, null> = {};
        url.params.forEach((_, key) => {
          if (key !== "pageSize" && key !== "sort" && key !== "dir") reset[key] = null;
        });
        url.set(reset);
      }}
    />
  );
}

function TableFrame<T extends RowData>({
  table,
  filtered,
  pending = false,
  search,
  onSearch,
  onReset,
  searchPlaceholder = "Search…",
  filters,
  toolbarEnd,
  bulkActions,
  renderMobileRow,
  onRowClick,
  emptyState,
  loading = false,
  pageSize = 10,
  className,
}: DataTableProps<T> & {
  table: DataTableInstance<T>;
  filtered: boolean;
  pending?: boolean;
  search: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}) {
  const rowSelection = table.atoms.rowSelection.get();
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns().length;
  const clearSelection = () => table.resetRowSelection(true);

  const empty = filtered ? (
    <EmptyState
      size="compact"
      icon={<SearchX />}
      title="No matching results"
      description="Try a different search, or clear the filters."
      action={
        <Button variant="secondary" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      }
    />
  ) : (
    (emptyState ?? <EmptyState size="compact" title="Nothing here yet" />)
  );

  return (
    <div className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64 lg:w-72">
          <Input
            type="search"
            size="sm"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search"
            prefix={<Search />}
            maxLength={120}
          />
        </div>
        {filters?.(table)}
        {filtered && (
          <Button variant="ghost" size="sm" onClick={onReset} rightIcon={<X />}>
            Clear
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {toolbarEnd}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-3" aria-busy={pending || undefined}>
        {/* Loading bar for server round-trips */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-1.5 z-10 h-0.5 overflow-hidden rounded-full transition-opacity duration-300",
            pending ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="h-full w-1/3 animate-[shimmer_1.1s_linear_infinite] bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] bg-size-[300%_100%]" />
        </div>

        {/* Phone layout: cards */}
        {renderMobileRow && (
          <div className={cn("grid gap-2 transition-opacity duration-200 md:hidden", pending && "opacity-60")}>
            {loading ? (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-card" />)
            ) : rows.length === 0 ? (
              <div className="rounded-card border border-border bg-surface">{empty}</div>
            ) : (
              rows.map((row) => (
                <div
                  key={row.id}
                  data-selected={row.getIsSelected() || undefined}
                  className="rounded-card border border-border bg-surface transition-colors data-selected:border-primary/50 data-selected:bg-primary-soft/40"
                >
                  {renderMobileRow(row)}
                </div>
              ))
            )}
          </div>
        )}

        {/* Table layout */}
        <div
          className={cn(
            "overflow-hidden rounded-card border border-border bg-surface transition-opacity duration-200",
            renderMobileRow && "max-md:hidden",
            pending && "opacity-60",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom border-collapse text-base">
              <thead className="bg-surface-muted/60">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id} className="border-b border-border">
                    {group.headers.map((header) => {
                      const meta = header.column.columnDef.meta;
                      const sorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          scope="col"
                          aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                          className={cn(
                            "h-10 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-4 last:pr-4",
                            meta?.align === "end" && "text-right",
                            meta?.headerClassName,
                          )}
                        >
                          {header.isPlaceholder ? null : <FlexRender header={header} />}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: Math.min(pageSize, 8) }, (_, i) => (
                    <tr key={i} className="h-row border-b border-border-subtle last:border-0">
                      {Array.from({ length: visibleColumns }, (_, j) => (
                        <td key={j} className="px-3 first:pl-4 last:pr-4">
                          <Skeleton className="h-3.5 w-full max-w-40" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns}>{empty}</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      data-selected={row.getIsSelected() || undefined}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(row.original);
                            }
                          : undefined
                      }
                      tabIndex={onRowClick ? 0 : undefined}
                      className={cn(
                        "h-row border-b border-border-subtle transition-colors last:border-0",
                        "hover:bg-surface-hover data-selected:bg-primary-soft/50",
                        onRowClick &&
                          "cursor-pointer focus-visible:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta;
                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-3 align-middle whitespace-nowrap first:pl-4 last:pr-4",
                              meta?.align === "end" && "text-right tabular",
                              meta?.cellClassName,
                            )}
                          >
                            <FlexRender cell={cell} />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {table.getRowCount() > 0 && <DataTablePagination table={table} />}

      {/* Floating bulk-action bar */}
      {bulkActions && selectedIds.length > 0 && (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-fit animate-pop-in flex-wrap items-center gap-2 rounded-panel border border-border bg-surface-raised p-1.5 pl-4 shadow-lg sm:flex-nowrap"
        >
          <span className="tabular text-sm font-medium whitespace-nowrap">
            {pluralize(selectedIds.length, "item")} selected
          </span>
          <span aria-hidden className="mx-1 h-5 w-px bg-border" />
          <div className="flex flex-wrap items-center gap-1">{bulkActions(selectedIds, clearSelection)}</div>
          <Button variant="ghost" size="icon-sm" onClick={clearSelection} aria-label="Clear selection">
            <X />
          </Button>
        </div>
      )}
    </div>
  );
}
