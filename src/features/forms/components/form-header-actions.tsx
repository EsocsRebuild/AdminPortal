"use client";

import { Copy, ExternalLink, Lock, MoreHorizontal, Rocket, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

import { closeForm, deleteForm, duplicateForm, publishForm } from "../actions";
import type { FormSummary } from "../types";

export function FormHeaderActions({ form, publicUrl }: { form: FormSummary; publicUrl: string }) {
  const router = useRouter();
  const modals = useModals();
  const publish = useAction(publishForm, {
    success: "Your form is live",
    onSuccess: () => router.push(`/forms/${form.id}/share`),
  });
  const close = useAction(closeForm, { success: "Form closed. It no longer accepts responses." });
  const duplicate = useAction(duplicateForm, {
    success: "Copy created",
    onSuccess: (r) => router.push(`/forms/${r.id}/edit`),
  });
  const remove = useAction(deleteForm, {
    success: "Form deleted",
    onSuccess: () => router.replace("/forms"),
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {form.status === "published" && (
        <Button variant="secondary" leftIcon={<ExternalLink />} asChild>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            Open form
          </a>
        </Button>
      )}
      <Can permission="forms:manage">
        {form.status !== "published" ? (
          <Button
            leftIcon={<Rocket />}
            loading={publish.pending}
            onClick={async () => {
              const ok = await modals.confirm({
                title: form.status === "closed" ? "Reopen this form?" : "Publish this form?",
                description: "Anyone with the link will be able to fill it in. You can close it at any time.",
                confirmLabel: form.status === "closed" ? "Reopen" : "Publish",
              });
              if (ok) await publish.run({ id: form.id });
            }}
          >
            {form.status === "closed" ? "Reopen" : "Publish"}
          </Button>
        ) : (
          <Button
            variant="secondary"
            leftIcon={<Lock />}
            loading={close.pending}
            onClick={async () => {
              const ok = await modals.confirm({
                title: "Stop accepting responses?",
                description:
                  "People who open the link will see that the form is closed. Existing responses are kept.",
                confirmLabel: "Close form",
              });
              if (ok) await close.run({ id: form.id });
            }}
          >
            Close form
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => duplicate.run({ id: form.id })}>
              <Copy /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              tone="danger"
              onSelect={async () => {
                const ok = await modals.confirm({
                  tone: "danger",
                  title: `Delete “${form.title}”?`,
                  description: `The form and all ${formatNumber(form.responseCount)} responses will be deleted permanently.`,
                  confirmLabel: "Delete form",
                  confirmText: "DELETE",
                });
                if (ok) await remove.run({ id: form.id });
              }}
            >
              <Trash2 /> Delete form
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Can>
    </div>
  );
}
