"use client";

import * as React from "react";
import { CheckCircle2, ShieldCheck, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { advanceVettingStageAction, updateCandidateDetailsAction } from "@/features/ordination/actions";
import type { VettingStage } from "@/features/ordination/types";

interface CandidateClearanceFormProps {
  candidateId: string;
  candidateName: string;
  currentStage: VettingStage;
}

const stageLabelMap: Record<VettingStage, string> = {
  STAGE_1_BRANCH: "Branch Level Nomination",
  STAGE_2_DISTRICT: "District Review",
  STAGE_3_PROVINCIAL: "Provincial Review",
  STAGE_4_NATIONAL: "National Level Holy Synod Approval",
  STAGE_1_PARISH: "Branch Level Nomination",
  STAGE_3_ZONAL: "Provincial Review",
  STAGE_4_SUPREME_APPROVED: "National Level Holy Synod Approval",
};

export function CandidateClearanceForm({
  candidateId,
  candidateName,
  currentStage,
}: CandidateClearanceFormProps) {
  const router = useRouter();
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Please provide clearance justification or audit notes.");
      return;
    }
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirmClearance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await advanceVettingStageAction({
        candidateId,
        currentStage,
        action: "APPROVED",
        clearanceNotes: notes.trim(),
      });

      setLoading(false);
      setConfirmOpen(false);

      if (res.ok) {
        setSuccess(res.message || "Clearance granted successfully and recorded in canonical audit ledger.");
        setNotes("");
        router.refresh();
      } else {
        setError(res.message || "Failed to advance vetting stage");
      }
    } catch {
      setLoading(false);
      setConfirmOpen(false);
      setError("An unexpected network error occurred while communicating with the server.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="clearance-notes" className="text-xs font-medium text-foreground">
            Clearance Justification & Audit Notes *
          </label>
          <textarea
            id="clearance-notes"
            name="notes"
            rows={3}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide theological screening rationale, pastoral council endorsement, or verification details..."
            className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-2xs text-muted-foreground">
            Action will be permanently recorded in the ordination audit ledger and synchronized with central registries.
          </span>
          <Button
            type="submit"
            disabled={loading}
            className="gap-1.5 bg-emerald-600 text-xs font-medium text-white shadow-md hover:bg-emerald-500"
          >
            <CheckCircle2 className="size-4" />
            Grant Clearance & Advance to Next Tier
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md border-border bg-card p-6 text-foreground shadow-2xl">
          <DialogHeader>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <ShieldCheck className="size-6" />
            </div>
            <DialogTitle className="text-center text-base font-bold text-foreground">
              Confirm Ecclesiastical Stage Clearance
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Are you sure you want to approve and ratify clearance for <strong>{candidateName}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-2 rounded-xl border border-border bg-surface-muted/40 p-3 text-xs">
            <div className="flex justify-between border-b border-border pb-1.5">
              <span className="text-muted-foreground">Current Stage:</span>
              <span className="font-semibold text-foreground">{stageLabelMap[currentStage] || currentStage}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Audit Notes:</span>
              <p className="rounded bg-background/80 p-2 font-mono text-2xs text-foreground">{notes}</p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => setConfirmOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={handleConfirmClearance}
              className="gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              {loading && <Loader2 className="size-3.5 animate-spin" />}
              {loading ? "Recording Clearance..." : "Confirm & Ratify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface CandidateRecordUpdateFormProps {
  candidateId: string;
  initialDuesStatus?: "pending" | "cleared" | "exempt";
  initialConductRating?: string;
}

export function CandidateRecordUpdateForm({
  candidateId,
  initialDuesStatus = "pending",
  initialConductRating = "exemplary",
}: CandidateRecordUpdateFormProps) {
  const router = useRouter();
  const [duesStatus, setDuesStatus] = React.useState(initialDuesStatus);
  const [conductRating, setConductRating] = React.useState(initialConductRating);
  const [loading, setLoading] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await updateCandidateDetailsAction(candidateId, {
        duesStatus,
        conductRating,
      });

      setLoading(false);
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.message || "Failed to update candidate record");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred while communicating with the server.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-3">
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3 sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="upd-dues" className="font-medium text-foreground">
            Financial Dues Status
          </label>
          <select
            id="upd-dues"
            name="duesStatus"
            value={duesStatus}
            onChange={(e) => setDuesStatus(e.target.value as "pending" | "cleared" | "exempt")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="pending">Pending Payment</option>
            <option value="cleared">Cleared (Full Dues Paid)</option>
            <option value="exempt">Exempt (Clergy Quota)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="upd-conduct" className="font-medium text-foreground">
            Conduct & Character Rating
          </label>
          <select
            id="upd-conduct"
            name="conductRating"
            value={conductRating}
            onChange={(e) => setConductRating(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="exemplary">Exemplary</option>
            <option value="commendable">Commendable</option>
            <option value="under_review">Under Pastoral Review</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={loading}
            className="gap-1.5 text-xs text-foreground"
          >
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {loading ? "Saving..." : "Save Candidate Updates"}
          </Button>

          {saved && (
            <span className="flex items-center gap-1 text-2xs font-semibold text-emerald-500 animate-in fade-in">
              <CheckCircle2 className="size-3.5" />
              Saved!
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
