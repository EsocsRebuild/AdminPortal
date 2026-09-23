"use client";

import { Checkbox } from "@/components/ui/checkbox";

import type { DataTableColumn } from "./features";

/** Checkbox column with select-all for the current page and Shift-click ranges. */
export function selectColumn<T>(): DataTableColumn<T> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: { headerClassName: "w-10", cellClassName: "w-10" },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={
          table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        // Route through the table handler so Shift-click selects a range.
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          row.getToggleSelectedHandler()({ shiftKey: e.shiftKey, target: { checked: !row.getIsSelected() } });
        }}
      />
    ),
  };
}
