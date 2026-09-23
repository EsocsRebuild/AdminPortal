"use client";

import { useTable, type SortingState, type ColumnVisibilityState } from "@tanstack/react-table";
import { Search, SearchX, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { pluralize } from "@/lib/utils";
import { cn } from "@/lib/utils";

import {
  dataTableFeatures,
  type DataTableColumn,
  type DataTableInstance,
  type DataTableRow,
} from "./features";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./view-options";

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable id per record; used for selection. */
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  /** Filter controls rendered beside the search field. */
  filters?: (table: DataTableInstance<T>) => React.ReactNode;
  /** Actions for the floating bar shown while rows are selected. */
  bulkActions?: (selectedIds: string[], clear: () => void) => React.ReactNode;
  /** Card layout for phones. Without it, the table scrolls horizontally. */
  renderMobileRow?: (row: DataTableRow<T>) => React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  pageSize?: number;
  initialSorting?: SortingState;
  initialColumnVisibility?: ColumnVisibilityState;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Search…",
  filters,
  bulkActions,
  renderMobileRow,
  onRowClick,
  emptyState,
  loading = false,
  pageSize = 10,
  initialSorting = [],
  initialColumnVisibility = {},
  className,
}: DataTableProps<T>) {
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

  const { globalFilter, columnFilters, rowSelection } = table.state;
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns().length;
  const isFiltered = Boolean(globalFilter) || columnFilters.length > 0;
  const clearSelection = () => table.resetRowSelection(true);
  const resetFilters = () => {
    table.setGlobalFilter("");
    table.resetColumnFilters(true);
  };

  const noResults = (
    <EmptyState
      size="compact"
      icon={<SearchX />}
      title="No matching results"
      description="Try a different search term or clear the filters."
      action={
        <Button variant="secondary" size="sm" onClick={resetFilters}>
          Clear filters
        </Button>
      }
    />
  );
  const empty = isFiltered ? noResults : (emptyState ?? <EmptyState size="compact" title="Nothing here yet" />);

  return (
    <div className={cn("grid gap-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64 lg:w-72">
          <Input
            type="search"
            size="sm"
            value={(globalFilter as string) ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search table"
            prefix={<Search />}
          />
        </div>
        {filters?.(table)}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={resetFilters} rightIcon={<X />}>
            Reset
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Phone layout: cards */}
      {renderMobileRow && (
        <div className="grid gap-2 md:hidden">
          {loading ? (
            Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-card" />)
          ) : rows.length === 0 ? (
            <div className="rounded-card border border-border bg-surface">{empty}</div>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                data-selected={row.getIsSelected() || undefined}
                className="rounded-card border border-border bg-surface shadow-xs transition-colors data-selected:border-primary/50 data-selected:bg-primary-soft/40"
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
          "overflow-hidden rounded-card border border-border bg-surface shadow-xs",
          renderMobileRow && "max-md:hidden",
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
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
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
                          <table.FlexRender cell={cell} />
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

      <DataTablePagination table={table} />

      {/* Floating bulk-action bar */}
      {bulkActions && selectedIds.length > 0 && (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-fit animate-pop-in flex-wrap items-center gap-2 rounded-panel border border-border bg-surface-raised p-1.5 pl-4 shadow-lg sm:flex-nowrap"
        >
          <span className="text-sm font-medium whitespace-nowrap tabular">
            {pluralize(selectedIds.length, "row")} selected
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
