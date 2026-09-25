"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Parish } from "@/features/lookups/queries";
import { useAction } from "@/hooks/use-action";

import { deleteMember } from "../actions";
import type { Member } from "../types";
import { MemberFormDialog } from "./member-form-dialog";

export function MemberActions({ member, parishes }: { member: Member; parishes: Parish[] }) {
  const router = useRouter();
  const modals = useModals();
  const [editing, setEditing] = React.useState(false);
  const name = `${member.firstName} ${member.lastName}`;
  const remove = useAction(deleteMember, {
    success: `${name} was deleted`,
    onSuccess: () => router.replace("/members"),
  });

  async function onDelete() {
    const ok = await modals.confirm({
      tone: "danger",
      title: `Delete ${name}?`,
      description:
        "Their record and history will be removed permanently. If they’ve simply left, mark them inactive instead.",
      confirmLabel: "Delete permanently",
      confirmText: member.lastName.toUpperCase(),
    });
    if (ok) await remove.run({ id: member.id });
  }

  return (
    <Can permission="members:manage">
      <div className="flex items-center gap-2">
        <Button variant="secondary" leftIcon={<Pencil />} onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem tone="danger" onSelect={onDelete}>
              <Trash2 /> Delete member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <MemberFormDialog open={editing} onOpenChange={setEditing} parishes={parishes} member={member} />
    </Can>
  );
}
