"use client";

import type { Column } from "@tanstack/react-table";
import { PlusCircle, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import type { DataTableFeatures } from "./features";

export interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * Multi-select filter for one column. The column needs `filterFn: "arrIncludesSome"`.
 */
export function FacetedFilter<T>({
  column,
  title,
  options,
}: {
  column: Column<DataTableFeatures, T, unknown> | undefined;
  title: string;
  options: FacetOption[];
}) {
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? []);

  const toggle = (value: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(value);
    else next.delete(value);
    column?.setFilterValue(next.size ? [...next] : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="border-dashed" leftIcon={<PlusCircle />}>
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              {selected.size > 2 ? (
                <Badge tone="primary" shape="square">
                  {selected.size} selected
                </Badge>
              ) : (
                options
                  .filter((o) => selected.has(o.value))
                  .map((o) => (
                    <Badge key={o.value} tone="primary" shape="square">
                      {o.label}
                    </Badge>
                  ))
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1.5">
        <div role="group" aria-label={title} className="grid">
          {options.map((o) => (
            <label
              key={o.value}
              className="flex min-h-8 cursor-pointer items-center gap-2.5 rounded-xs px-2 hover:bg-surface-hover pointer-coarse:min-h-10"
            >
              <Checkbox checked={selected.has(o.value)} onCheckedChange={(v) => toggle(o.value, v === true)} />
              <span className="flex-1 text-base">{o.label}</span>
              {o.count !== undefined && <span className="text-xs text-subtle-foreground tabular">{o.count}</span>}
            </label>
          ))}
        </div>
        {selected.size > 0 && (
          <>
            <Separator className="my-1.5" />
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<X />}
              onClick={() => column?.setFilterValue(undefined)}
            >
              Clear filter
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
