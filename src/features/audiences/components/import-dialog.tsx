"use client";

import { AlertTriangle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import * as React from "react";

import { SuccessCheck } from "@/components/motion/success-check";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDrop } from "@/components/ui/file-drop";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAction } from "@/hooks/use-action";
import { EMAIL_RE, parseCsv } from "@/lib/csv";
import { formatNumber } from "@/lib/format";
import { pluralize } from "@/lib/utils";

import { importContacts } from "../actions";
import type { ImportResult } from "../types";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 50_000;
const CHUNK = 500;
const NONE = "__none";

type Field = "email" | "firstName" | "lastName";
const fields: { key: Field; label: string; guess: RegExp }[] = [
  { key: "email", label: "Email address", guess: /e-?mail/i },
  { key: "firstName", label: "First name", guess: /^(first|given|fore)[\s_-]?name$|^first$/i },
  { key: "lastName", label: "Last name", guess: /^(last|sur|family)[\s_-]?name$|^last$|^surname$/i },
];

type Stage =
  | { name: "upload" }
  | { name: "map"; fileName: string; header: string[]; rows: string[][] }
  | { name: "importing"; done: number; total: number }
  | { name: "done"; result: ImportResult };

function ImportDialogBody({ listId, onOpenChange }: { listId: string; onOpenChange: (o: boolean) => void }) {
  const [stage, setStage] = React.useState<Stage>({ name: "upload" });
  const [error, setError] = React.useState<string | null>(null);
  const [mapping, setMapping] = React.useState<Record<Field, number | null>>({ email: null, firstName: null, lastName: null });
  const [consent, setConsent] = React.useState(false);
  const [updateExisting, setUpdateExisting] = React.useState(false);
  const run = useAction(importContacts, { quiet: true });

  async function onFile(file: File) {
    setError(null);
    const rows = parseCsv(await file.text());
    if (rows.length < 2) return setError("That file looks empty. It needs a header row and at least one contact.");
    if (rows.length - 1 > MAX_ROWS) return setError(`That’s more than ${formatNumber(MAX_ROWS)} contacts. Split it into smaller files.`);
    const [header, ...body] = rows;
    const guessed = Object.fromEntries(
      fields.map((f) => {
        const i = header.findIndex((h) => f.guess.test(h.trim()));
        return [f.key, i >= 0 ? i : null];
      }),
    ) as Record<Field, number | null>;
    if (guessed.email === null) {
      const i = header.findIndex((_, col) => body.slice(0, 20).some((r) => EMAIL_RE.test(r[col]?.trim() ?? "")));
      guessed.email = i >= 0 ? i : null;
    }
    setMapping(guessed);
    setStage({ name: "map", fileName: file.name, header, rows: body });
  }

  const analysis = React.useMemo(() => {
    if (stage.name !== "map" || mapping.email === null) return null;
    const seen = new Set<string>();
    const valid: { email: string; firstName: string; lastName: string }[] = [];
    let invalid = 0;
    let duplicates = 0;
    for (const r of stage.rows) {
      const email = (r[mapping.email] ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        invalid++;
        continue;
      }
      if (seen.has(email)) {
        duplicates++;
        continue;
      }
      seen.add(email);
      valid.push({
        email,
        firstName: mapping.firstName !== null ? (r[mapping.firstName] ?? "").trim().slice(0, 80) : "",
        lastName: mapping.lastName !== null ? (r[mapping.lastName] ?? "").trim().slice(0, 80) : "",
      });
    }
    return { valid, invalid, duplicates };
  }, [stage, mapping]);

  async function startImport() {
    if (!analysis) return;
    const total = analysis.valid.length;
    const sum: ImportResult = { created: 0, updated: 0, skipped: 0, invalid: analysis.invalid };
    setStage({ name: "importing", done: 0, total });
    for (let i = 0; i < total; i += CHUNK) {
      const res = await run.run({ listId, contacts: analysis.valid.slice(i, i + CHUNK), consent: true, updateExisting });
      if (!res.ok) {
        setError(`${res.message} ${formatNumber(i)} of ${formatNumber(total)} contacts were imported before this happened.`);
        setStage({ name: "done", result: sum });
        return;
      }
      sum.created += res.data.created;
      sum.updated += res.data.updated;
      sum.skipped += res.data.skipped;
      sum.invalid += res.data.invalid;
      setStage({ name: "importing", done: Math.min(total, i + CHUNK), total });
    }
    setStage({ name: "done", result: sum });
  }

  const busy = stage.name === "importing";

  return (
    <>
        <DialogHeader>
          <DialogTitle>Import contacts</DialogTitle>
          <DialogDescription>Upload a CSV file exported from a spreadsheet, like Excel or Google Sheets.</DialogDescription>
        </DialogHeader>

        <DialogBody className="grid gap-5">
          {error && <Alert tone="danger">{error}</Alert>}

          {stage.name === "upload" && (
            <>
              <FileDrop accept=".csv,text/csv" maxSize={MAX_BYTES} onFile={onFile} onError={setError} hint="CSV up to 5 MB. The first row should be column names." />
              <p className="text-sm text-muted-foreground">
                Tip: in Excel choose <span className="font-medium text-foreground">File → Save as → CSV</span>. Only an
                email column is required.
              </p>
            </>
          )}

          {stage.name === "map" && (
            <>
              <div className="flex items-center gap-3 rounded-card border border-border p-3">
                <FileSpreadsheet className="size-5 text-success" />
                <div className="grid flex-1">
                  <span className="truncate font-medium">{stage.fileName}</span>
                  <span className="text-sm text-muted-foreground">{pluralize(stage.rows.length, "row")}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStage({ name: "upload" })}>
                  Change file
                </Button>
              </div>

              <div className="grid gap-3">
                <p className="text-sm font-medium">Match your columns</p>
                {fields.map((f) => (
                  <div key={f.key} className="grid items-center gap-2 sm:grid-cols-[9rem_minmax(0,1fr)]">
                    <label htmlFor={`map-${f.key}`} className="text-sm text-muted-foreground">
                      {f.label}
                      {f.key === "email" && <span className="text-danger"> *</span>}
                    </label>
                    <Select
                      value={mapping[f.key] === null ? NONE : String(mapping[f.key])}
                      onValueChange={(v) => setMapping({ ...mapping, [f.key]: v === NONE ? null : Number(v) })}
                    >
                      <SelectTrigger id={`map-${f.key}`} size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>{f.key === "email" ? "Choose a column" : "Don’t import"}</SelectItem>
                        {stage.header.map((h, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {h.trim() || `Column ${i + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {analysis && (
                <>
                  <div className="overflow-x-auto rounded-card border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-muted/60 text-xs text-muted-foreground">
                        <tr>
                          {fields.map((f) => (
                            <th key={f.key} className="px-3 py-2 text-left font-medium">
                              {f.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.valid.slice(0, 4).map((c) => (
                          <tr key={c.email} className="border-t border-border-subtle">
                            <td className="px-3 py-2">{c.email}</td>
                            <td className="px-3 py-2">{c.firstName || "—"}</td>
                            <td className="px-3 py-2">{c.lastName || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="grid gap-1.5 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-success" />
                      <span>
                        <span className="font-semibold tabular">{formatNumber(analysis.valid.length)}</span> ready to import
                      </span>
                    </li>
                    {analysis.invalid > 0 && (
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="size-4 text-warning" />
                        {pluralize(analysis.invalid, "row")} skipped because the email is missing or invalid
                      </li>
                    )}
                    {analysis.duplicates > 0 && (
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="size-4 text-warning" />
                        {pluralize(analysis.duplicates, "duplicate")} in the file will be imported once
                      </li>
                    )}
                  </ul>
                  <div className="grid gap-3 rounded-card border border-border bg-surface-muted/50 p-3.5">
                    <Checkbox
                      label="Everyone in this file agreed to receive emails from us"
                      description="Required by data-protection law. Importing people who didn’t agree can get your emails blocked."
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                    />
                    <Switch
                      size="sm"
                      label="Update names for people already on this list"
                      checked={updateExisting}
                      onCheckedChange={setUpdateExisting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    People who previously unsubscribed or marked your emails as spam are never re-subscribed.
                  </p>
                </>
              )}
            </>
          )}

          {stage.name === "importing" && (
            <div className="grid gap-3 py-6 text-center" aria-live="polite">
              <p className="font-medium">Importing contacts…</p>
              <Progress value={stage.done} max={stage.total} aria-label="Import progress" />
              <p className="text-sm text-muted-foreground tabular">
                {formatNumber(stage.done)} of {formatNumber(stage.total)}. Please keep this window open.
              </p>
            </div>
          )}

          {stage.name === "done" && (
            <div className="grid justify-items-center gap-4 py-4 text-center">
              {!error && <SuccessCheck />}
              <p className="text-heading-sm font-semibold">{error ? "Import stopped" : "Import complete"}</p>
              <dl className="grid w-full max-w-sm grid-cols-2 gap-3 text-left">
                {[
                  ["Added", stage.result.created],
                  ["Updated", stage.result.updated],
                  ["Already on the list", stage.result.skipped],
                  ["Invalid", stage.result.invalid],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-control bg-surface-muted p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="text-lg font-semibold tabular">{formatNumber(Number(v))}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {stage.name === "done" ? (
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              {stage.name === "map" && (
                <Button onClick={startImport} disabled={!analysis || analysis.valid.length === 0 || !consent}>
                  Import {analysis ? formatNumber(analysis.valid.length) : ""} contacts
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </>
  );
}

export function ImportDialog({ listId, open, onOpenChange }: { listId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <ImportDialogBody listId={listId} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
