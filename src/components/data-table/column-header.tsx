"use client";

import type { Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { DataTableFeatures } from "./features";

/** Clickable, accessible sort header. Use as a column's `header`. */
export function ColumnHeader<T>({
  header,
  title,
}: {
  header: Header<DataTableFeatures, T, unknown>;
  title: React.ReactNode;
}) {
  const column = header.column;
  if (!column.getCanSort()) return <span>{title}</span>;
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "-mx-1.5 inline-flex h-7 cursor-pointer items-center gap-1 rounded-xs px-1.5 transition-colors hover:bg-surface-hover hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-ring",
        sorted && "text-foreground",
        column.columnDef.meta?.align === "end" && "flex-row-reverse",
      )}
    >
      {title}
      <Icon className={cn("size-3.5", !sorted && "opacity-50")} />
    </button>
  );
}
