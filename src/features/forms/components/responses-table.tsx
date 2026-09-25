"use client";

import { Download, Inbox, Trash2 } from "lucide-react";
import * as React from "react";

import { usePermission } from "@/components/auth/session-provider";
import { ColumnHeader } from "@/components/data-table/column-header";
import { DataTable, type ServerTableState } from "@/components/data-table/data-table";
import { columnHelper, type DataTableColumn } from "@/components/data-table/features";
import { selectColumn } from "@/components/data-table/select-column";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAction } from "@/hooks/use-action";
import { formatDateTime } from "@/lib/format";
import { pluralize, truncate } from "@/lib/utils";

import { deleteResponses } from "../actions";
import { formatAnswer } from "../format-answer";
import type { Form, FormResponse } from "../types";

const col = columnHelper<FormResponse>();

export function ResponsesTable({
  form,
  page,
  server,
}: {
  form: Form;
  page: FormResponse[];
  server: ServerTableState;
}) {
  const modals = useModals();
  const canManage = usePermission("forms:manage");
  const [open, setOpen] = React.useState<FormResponse | null>(null);
  const remove = useAction(deleteResponses, {
    success: (r) => `${pluralize(r.deleted, "response")} deleted`,
  });
  const questions = form.fields.filter((f) => f.type !== "section");

  const columns = React.useMemo(() => {
    const cols: DataTableColumn<FormResponse>[] = [
      ...(canManage ? [selectColumn<FormResponse>()] : []),
      col.accessor("submittedAt", {
        header: ({ header }) => <ColumnHeader header={header} title="Submitted" />,
        enableHiding: false,
        cell: (i) => <span className="text-muted-foreground">{formatDateTime(i.getValue())}</span>,
      }),
      ...questions.slice(0, 6).map((q) =>
        col.display({
          id: q.id,
          header: truncate(q.label || "Untitled", 32),
          meta: { label: q.label || "Untitled" },
          cell: ({ row }) => (
            <span className="block max-w-64 truncate">
              {formatAnswer(q, row.original.answers[q.id]) || "—"}
            </span>
          ),
        }),
      ),
    ];
    return cols;
  }, [canManage, questions]);

  return (
    <>
      <DataTable
        data={page}
        columns={columns}
        getRowId={(r) => r.id}
        server={server}
        searchPlaceholder="Search answers…"
        onRowClick={setOpen}
        toolbarEnd={
          server.total > 0 ? (
            <Button variant="secondary" size="sm" leftIcon={<Download />} asChild>
              <a href={`/api/forms/${form.id}/responses/export`} download>
                Export CSV
              </a>
            </Button>
          ) : undefined
        }
        bulkActions={
          canManage
            ? (ids, clear) => (
                <Button
                  variant="danger-soft"
                  size="sm"
                  leftIcon={<Trash2 />}
                  onClick={async () => {
                    const ok = await modals.confirm({
                      tone: "danger",
                      title: `Delete ${pluralize(ids.length, "response")}?`,
                      description: "They’ll be removed permanently, including from exports.",
                      confirmLabel: "Delete",
                    });
                    if (ok && (await remove.run({ id: form.id, responseIds: ids })).ok) clear();
                  }}
                >
                  Delete
                </Button>
              )
            : undefined
        }
        renderMobileRow={(row) => {
          const r = row.original;
          const first = questions[0];
          return (
            <button type="button" onClick={() => setOpen(r)} className="grid w-full gap-1 p-3.5 text-left">
              <span className="truncate font-medium">
                {(first && formatAnswer(first, r.answers[first.id])) || "Response"}
              </span>
              <span className="text-xs text-muted-foreground">{formatDateTime(r.submittedAt)}</span>
            </button>
          );
        }}
        emptyState={
          <EmptyState
            size="compact"
            icon={<Inbox />}
            title="No responses yet"
            description={
              form.status === "published"
                ? "Share the link from the Share tab to start collecting answers."
                : "Publish the form and share its link to start collecting answers."
            }
          />
        }
      />
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent size="lg">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>Response</SheetTitle>
                <SheetDescription>Submitted {formatDateTime(open.submittedAt)}</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <dl className="grid gap-5">
                  {form.fields.map((f) =>
                    f.type === "section" ? (
                      <h3
                        key={f.id}
                        className="border-t border-border pt-4 text-sm font-semibold first:border-0 first:pt-0"
                      >
                        {f.label}
                      </h3>
                    ) : (
                      <div key={f.id} className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">{f.label || "Untitled question"}</dt>
                        <dd className="text-base whitespace-pre-wrap">
                          {formatAnswer(f, open.answers[f.id]) || (
                            <span className="text-subtle-foreground">No answer</span>
                          )}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
