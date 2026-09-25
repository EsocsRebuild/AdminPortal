"use client";

import { Check, ChevronDown, ListFilter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlQuery } from "@/hooks/use-url-query";

export interface UrlFilterOption {
  value: string;
  label: string;
}

/** Single-choice filter stored in the URL, e.g. `?status=pending`. For server tables. */
export function UrlFilter({
  param,
  title,
  options,
}: {
  param: string;
  title: string;
  options: UrlFilterOption[];
}) {
  const url = useUrlQuery();
  const current = url.get(param);
  const selected = options.find((o) => o.value === current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className={selected ? "border-primary/40" : "border-dashed"}
          leftIcon={<ListFilter />}
          rightIcon={<ChevronDown className="opacity-60" />}
        >
          {title}
          {selected && (
            <Badge tone="primary" shape="square">
              {selected.label}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => url.set({ [param]: o.value })}>
            <span className="flex-1">{o.label}</span>
            {current === o.value && <Check className="text-primary!" />}
          </DropdownMenuItem>
        ))}
        {selected && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => url.set({ [param]: null })}>Show all</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
