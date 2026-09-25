"use client";

import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/use-action";

import { deleteTemplate, duplicateTemplate } from "../actions";

export function TemplateCardMenu({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const modals = useModals();
  const duplicate = useAction(duplicateTemplate, { success: "Template duplicated", onSuccess: (r) => router.push(`/templates/${r.id}`) });
  const remove = useAction(deleteTemplate, { success: "Template deleted" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => duplicate.run({ id })}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          tone="danger"
          onSelect={async () => {
            const ok = await modals.confirm({
              tone: "danger",
              title: `Delete “${name}”?`,
              description: "Campaigns that already used it keep their own copy.",
              confirmLabel: "Delete template",
            });
            if (ok) await remove.run({ id });
          }}
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
