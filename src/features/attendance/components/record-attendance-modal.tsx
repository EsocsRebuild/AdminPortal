"use client";

import * as React from "react";
import { Plus, Users, Calculator, CheckCircle2 } from "lucide-react";
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
import { recordHeadcountAction } from "../actions";

export function RecordAttendanceModal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [men, setMen] = React.useState(0);
  const [women, setWomen] = React.useState(0);
  const [children, setChildren] = React.useState(0);

  const total = men + women + children;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const serviceType = (formData.get("serviceType") as string)?.trim();
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
    const notes = (formData.get("notes") as string)?.trim();
    const recorder = (formData.get("recorder") as string)?.trim();

    const res = await recordHeadcountAction({
      serviceType,
      date,
      men,
      women,
      children,
      notes,
      recorder,
    });

    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setMen(0);
      setWomen(0);
      setChildren(0);
      router.refresh();
    } else {
      setError(res.message || "Failed to record attendance session");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" leftIcon={<Plus className="size-4" />}>
          Record Service Headcount
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Record Service Headcount
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Log demographic counts for Sunday divine worship, vigils, or rallies.
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
            <label htmlFor="att-type" className="font-semibold text-foreground">
              Service Type *
            </label>
            <Input
              id="att-type"
              name="serviceType"
              required
              placeholder="e.g. Sunday Divine Liturgy & Eucharist"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="att-date" className="font-semibold text-foreground">
              Service Date *
            </label>
            <Input
              id="att-date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="text-xs"
            />
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-surface-muted/30 p-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Demographic Breakdown
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label htmlFor="att-men" className="text-3xs font-medium text-muted-foreground">
                  Men Count
                </label>
                <Input
                  id="att-men"
                  type="number"
                  min="0"
                  value={men || ""}
                  onChange={(e) => setMen(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="att-women" className="text-3xs font-medium text-muted-foreground">
                  Women Count
                </label>
                <Input
                  id="att-women"
                  type="number"
                  min="0"
                  value={women || ""}
                  onChange={(e) => setWomen(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="att-children" className="text-3xs font-medium text-muted-foreground">
                  Children Count
                </label>
                <Input
                  id="att-children"
                  type="number"
                  min="0"
                  value={children || ""}
                  onChange={(e) => setChildren(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Calculator className="size-3.5 text-primary" /> Total Headcount:
              </span>
              <span className="text-sm font-bold text-primary font-mono">{total} Worshippers</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="att-recorder" className="font-semibold text-foreground">
              Recorder / Chief Usher Signature *
            </label>
            <Input
              id="att-recorder"
              name="recorder"
              required
              placeholder="e.g. Bro. D. O. Williams (Ushering Secretary)"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="att-notes" className="font-semibold text-foreground">
              Service Remarks / Weather Notes
            </label>
            <Input
              id="att-notes"
              name="notes"
              placeholder="e.g. Heavy rainfall in the morning, high communion attendance"
              className="text-xs"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              <CheckCircle2 className="mr-1.5 size-3.5" />
              {loading ? "Recording..." : "Save Headcount Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
