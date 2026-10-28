"use client";

import * as React from "react";
import { Plus, Wallet, Sparkles } from "lucide-react";
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
import { createFundAction } from "../actions";

export function NewFundModal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();
    const code = (formData.get("code") as string)?.trim().toUpperCase();
    const description = (formData.get("description") as string)?.trim();
    const initialBalanceRaw = formData.get("initialBalance") as string;
    const initialBalance = initialBalanceRaw ? Number(initialBalanceRaw) : 0;
    const status = (formData.get("status") as "active" | "restricted") || "active";

    const res = await createFundAction({
      name,
      code,
      description,
      initialBalance,
      status,
    });

    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setError(res.message || "Failed to create fund ledger");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" leftIcon={<Plus className="size-4" />}>
          New Fund Ledger
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Create Dedicated Fund Ledger
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Set up a new church treasury ledger for tithes, projects, or welfare.
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

          <div className="space-y-1.5">
            <label htmlFor="f-name" className="font-semibold text-foreground">
              Fund Ledger Name *
            </label>
            <Input
              id="f-name"
              name="name"
              required
              placeholder="e.g. Cathedral Organ & Instruments Fund"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="f-code" className="font-semibold text-foreground">
                Fund Code *
              </label>
              <Input
                id="f-code"
                name="code"
                required
                placeholder="e.g. MUS-004"
                className="text-xs uppercase font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="f-status" className="font-semibold text-foreground">
                Ledger Status
              </label>
              <select
                id="f-status"
                name="status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="active">Active (Unrestricted)</option>
                <option value="restricted">Restricted (Capital Project)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="f-bal" className="font-semibold text-foreground">
              Initial Balance (₦)
            </label>
            <Input
              id="f-bal"
              name="initialBalance"
              type="number"
              min="0"
              placeholder="0"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="f-desc" className="font-semibold text-foreground">
              Description / Statutory Purpose
            </label>
            <textarea
              id="f-desc"
              name="description"
              rows={2}
              placeholder="Purpose of ledger and approved allocation guidelines..."
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="gap-1.5">
              <Sparkles className="size-3.5" />
              {loading ? "Registering..." : "Create Ledger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

