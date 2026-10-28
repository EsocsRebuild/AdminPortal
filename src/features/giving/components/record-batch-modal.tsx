"use client";

import * as React from "react";
import { Plus, FileSpreadsheet, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { recordBatchAction } from "../actions";

export function RecordBatchModal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [cash, setCash] = React.useState<number>(0);
  const [pos, setPos] = React.useState<number>(0);
  const [online, setOnline] = React.useState<number>(0);

  const grandTotal = cash + pos + online;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const batchNumber = (formData.get("batchNumber") as string)?.trim();
    const date = (formData.get("date") as string) || new Date().toISOString();
    const verifiedBy = (formData.get("verifiedBy") as string)?.trim();

    const res = await recordBatchAction({
      batchNumber,
      date,
      cashTotal: cash,
      posTotal: pos,
      onlineTotal: online,
      verifiedBy,
    });

    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setCash(0);
      setPos(0);
      setOnline(0);
      router.refresh();
    } else {
      setError(res.message || "Failed to record collection batch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" leftIcon={<Plus className="size-3.5" />}>
          Record Sunday Collection Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Record Sunday Collection Batch
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Enter physical cash counts, POS settlement slips, and online church bank transfers.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="b-num" className="font-semibold text-foreground">
                Batch Reference Number *
              </label>
              <Input
                id="b-num"
                name="batchNumber"
                required
                defaultValue={`BAT-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`}
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="b-date" className="font-semibold text-foreground">
                Service Date *
              </label>
              <Input
                id="b-date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-2.5 rounded-lg border border-border bg-surface-muted/30 p-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Intake Breakdown (₦)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label htmlFor="b-cash" className="text-3xs font-medium text-muted-foreground">
                  Cash Collections
                </label>
                <Input
                  id="b-cash"
                  type="number"
                  min="0"
                  value={cash || ""}
                  onChange={(e) => setCash(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="b-pos" className="text-3xs font-medium text-muted-foreground">
                  POS Slips
                </label>
                <Input
                  id="b-pos"
                  type="number"
                  min="0"
                  value={pos || ""}
                  onChange={(e) => setPos(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="b-online" className="text-3xs font-medium text-muted-foreground">
                  Bank Transfers
                </label>
                <Input
                  id="b-online"
                  type="number"
                  min="0"
                  value={online || ""}
                  onChange={(e) => setOnline(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Calculator className="size-3.5 text-primary" /> Total Verified Collection:
              </span>
              <span className="text-sm font-bold text-primary font-mono">
                ₦{grandTotal.toLocaleString("en-NG")}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="b-verifier" className="font-semibold text-foreground">
              Counting Officers / Verifier Signature *
            </label>
            <Input
              id="b-verifier"
              name="verifiedBy"
              required
              placeholder="e.g. Deacon S. A. Okon (Head of Counting Committee)"
              className="text-xs"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading ? "Recording Batch..." : "Record & Verify Batch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

