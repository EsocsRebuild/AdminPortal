"use client";

import * as React from "react";
import { Plus, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { nominateCandidateAction } from "@/features/ordination/actions";
import type { EcclesiasticalRank } from "@/features/ordination/types";

interface NominateCandidateModalProps {
  defaultParishName?: string;
}

export function NominateCandidateModal({
  defaultParishName = "Parish Assembly",
}: NominateCandidateModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const memberId = formData.get("memberId") as string;
    const rankTarget = formData.get("rankTarget") as EcclesiasticalRank;
    const parishName = formData.get("parishName") as string;
    const yearsOfService = Number(formData.get("yearsOfService")) || 5;
    const recommendationNotes = formData.get("notes") as string;

    const res = await nominateCandidateAction({
      fullName,
      memberId,
      rankTarget,
      parishName,
      yearsOfService,
      recommendationNotes,
    });

    setLoading(false);

    if (res.ok) {
      setOpen(false);
    } else {
      setError(res.message || "Failed to submit nomination");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-md hover:bg-primary/90">
          <Plus className="size-4" />
          Nominate Candidate for Rank Promotion
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Award className="size-5" />
            <SheetTitle className="text-base font-bold text-foreground">
              Branch Level Nomination Docket
            </SheetTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Nominate a church worker or clergy member for ecclesiastical rank promotion vetting starting at
            Branch Level.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {error && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="nom-name" className="font-medium text-foreground">
              Candidate Full Name *
            </label>
            <Input
              id="nom-name"
              name="fullName"
              required
              placeholder="e.g. Brother Samuel Olawale"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nom-member-id" className="font-medium text-foreground">
              Member ID / Reg Number *
            </label>
            <Input
              id="nom-member-id"
              name="memberId"
              required
              placeholder="e.g. ESOCS/MBR/2026/894"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nom-rank" className="font-medium text-foreground">
              Target Ecclesiastical Rank *
            </label>
            <select
              id="nom-rank"
              name="rankTarget"
              required
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="ALADURA">Aladura</option>
              <option value="RABBI">Rabbi</option>
              <option value="EVANGELIST">Evangelist</option>
              <option value="DEACON">Deacon</option>
              <option value="DEACONESS">Deaconess</option>
              <option value="SUB_LEADER">Sub-Leader</option>
              <option value="LEADER">Leader</option>
              <option value="SENIOR_LEADER">Senior Leader</option>
              <option value="APOSTLE">Apostle</option>
              <option value="SENIOR_APOSTLE">Senior Apostle</option>
              <option value="MOST_SENIOR_APOSTLE">Most Senior Apostle</option>
              <option value="SPECIAL_APOSTLE">Special Apostle</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nom-parish" className="font-medium text-foreground">
              Branch Jurisdiction / Cathedral Seat *
            </label>
            <Input
              id="nom-parish"
              name="parishName"
              defaultValue={defaultParishName}
              required
              placeholder="e.g. Diobu Central Cathedral or Local Branch"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nom-tenure" className="font-medium text-foreground">
              Tenure / Years in Active Service *
            </label>
            <Input
              id="nom-tenure"
              name="yearsOfService"
              type="number"
              min={1}
              max={60}
              defaultValue={5}
              required
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nom-notes" className="font-medium text-foreground">
              Pastoral Council Recommendation Notes *
            </label>
            <textarea
              id="nom-notes"
              name="notes"
              required
              rows={3}
              placeholder="State ministerial dedication, spiritual maturity, and tithing fidelity..."
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
            >
              <Sparkles className="size-4" />
              {loading ? "Registering Candidate..." : "Submit Nomination to Ordination Pipeline"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
