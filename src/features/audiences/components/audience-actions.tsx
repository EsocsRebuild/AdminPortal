"use client";

import { MoreHorizontal, Pencil, Plus, Trash2, Upload, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/use-action";
import { formatNumber } from "@/lib/format";

import { addMembersToAudience, deleteAudience } from "../actions";
import type { AudienceList } from "../types";
import { AddContactDialog } from "./add-contact-dialog";
import { AudienceFormDialog } from "./audience-form-dialog";
import { ImportDialog } from "./import-dialog";

export function AudienceActions({ audience }: { audience: AudienceList }) {
  const router = useRouter();
  const modals = useModals();
  const [dialog, setDialog] = React.useState<"add" | "import" | "edit" | null>(null);
  const remove = useAction(deleteAudience, { success: "Audience deleted", onSuccess: () => router.replace("/audiences") });
  const sync = useAction(addMembersToAudience, {
    success: (r) => `${formatNumber(r.created)} members added${r.skipped ? `, ${formatNumber(r.skipped)} were already here` : ""}`,
  });

  async function onAddMembers() {
    const ok = await modals.confirm({
      title: "Add church members to this audience?",
      description:
        "Everyone in the member register who has agreed to receive email updates will be added. Members without consent are left out automatically.",
      confirmLabel: "Add members",
    });
    if (ok) await sync.run({ listId: audience.id });
  }

  async function onDelete() {
    const ok = await modals.confirm({
      tone: "danger",
      title: `Delete “${audience.name}”?`,
      description: `${formatNumber(audience.subscriberCount)} contacts will be removed from this list. Past campaign reports are kept.`,
      confirmLabel: "Delete audience",
      confirmText: "DELETE",
    });
    if (ok) await remove.run({ id: audience.id });
  }

  return (
    <Can permission="audiences:manage">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" leftIcon={<Upload />} onClick={() => setDialog("import")}>
          Import
        </Button>
        <Button leftIcon={<Plus />} onClick={() => setDialog("add")}>
          Add contact
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem onSelect={onAddMembers} disabled={sync.pending}>
              <Users /> Add church members
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setDialog("edit")}>
              <Pencil /> Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="danger" onSelect={onDelete}>
              <Trash2 /> Delete audience
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddContactDialog listId={audience.id} open={dialog === "add"} onOpenChange={(o) => setDialog(o ? "add" : null)} />
      <ImportDialog listId={audience.id} open={dialog === "import"} onOpenChange={(o) => setDialog(o ? "import" : null)} />
      <AudienceFormDialog audience={audience} open={dialog === "edit"} onOpenChange={(o) => setDialog(o ? "edit" : null)} />
    </Can>
  );
}

export function NewAudienceButton({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Can permission="audiences:manage">
      <Button variant={variant} leftIcon={<Plus />} onClick={() => setOpen(true)}>
        New audience
      </Button>
      <AudienceFormDialog open={open} onOpenChange={setOpen} />
    </Can>
  );
}
