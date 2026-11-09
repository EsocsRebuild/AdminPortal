"use client";

import * as React from "react";
import { Plus, Award, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery, breakpoints } from "@/hooks/use-media-query";
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

  const isDesktop = useMediaQuery(breakpoints.md);

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
        <Button className="gap-2 bg-primary text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
          <Plus className="size-4" />
          Nominate Candidate for Rank Promotion
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        size={isDesktop ? "lg" : undefined}
        className="flex flex-col bg-card text-foreground sm:max-w-xl"
      >
        {/* Mobile Pull Handle */}
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-border md:hidden" />

        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <Award className="size-5" />
            <SheetTitle className="text-base font-bold text-foreground">
              Branch Level Nomination Docket
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Nominate a church worker or clergy member for ecclesiastical rank promotion vetting.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="nom-name" className="text-xs font-semibold text-foreground">
                Candidate Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="nom-name"
                name="fullName"
                required
                placeholder="e.g. Brother Samuel Olawale"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="nom-member-id" className="text-xs font-semibold text-foreground">
                Member ID / Registration Number <span className="text-rose-500">*</span>
              </label>
              <Input
                id="nom-member-id"
                name="memberId"
                required
                placeholder="e.g. ESOCS/MBR/2026/894"
                className="h-10 font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="nom-rank" className="text-xs font-semibold text-foreground">
                Target Ecclesiastical Rank <span className="text-rose-500">*</span>
              </label>
              <select
                id="nom-rank"
                name="rankTarget"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
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
              <label htmlFor="nom-parish" className="text-xs font-semibold text-foreground">
                Branch Jurisdiction / Cathedral Seat <span className="text-rose-500">*</span>
              </label>
              <Input
                id="nom-parish"
                name="parishName"
                defaultValue={defaultParishName}
                required
                placeholder="e.g. Diobu Central Cathedral or Local Branch"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="nom-tenure" className="text-xs font-semibold text-foreground">
                Tenure / Years in Active Service <span className="text-rose-500">*</span>
              </label>
              <Input
                id="nom-tenure"
                name="yearsOfService"
                type="number"
                min={1}
                max={60}
                defaultValue={5}
                required
                className="h-10 font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="nom-notes" className="text-xs font-semibold text-foreground">
                Pastoral Council Recommendation Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="nom-notes"
                name="notes"
                required
                rows={3}
                placeholder="State ministerial dedication, spiritual maturity, and attendance fidelity..."
                className="w-full rounded-md border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full gap-2 bg-primary text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Registering Candidate...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Submit Nomination to Ordination Pipeline
                  </>
                )}
              </Button>
            </div>
          </form>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
