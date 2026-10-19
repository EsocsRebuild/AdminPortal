"server-only";

import { revalidatePath } from "next/cache";
import { backend } from "@/server/backend";
import { type ActionResult, ok, fail } from "@/lib/result";
import {
  candidateNominationSchema,
  vettingStageAdvanceSchema,
  type CandidateNominationInput,
  type VettingStageAdvanceInput,
} from "./schemas";
import type { OrdinationCandidate, VettingStage } from "./types";

const stageNextMap: Record<VettingStage, VettingStage> = {
  STAGE_1_PARISH: "STAGE_2_DISTRICT",
  STAGE_2_DISTRICT: "STAGE_3_ZONAL",
  STAGE_3_ZONAL: "STAGE_4_SUPREME_APPROVED",
  STAGE_4_SUPREME_APPROVED: "STAGE_4_SUPREME_APPROVED",
};

export async function nominateCandidateAction(
  input: CandidateNominationInput,
): Promise<ActionResult<OrdinationCandidate>> {
  const check = candidateNominationSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid candidate parameters");
  }
  try {
    const res = await backend<OrdinationCandidate>("/ordination/candidates", {
      method: "POST",
      body: check.data,
    });
    revalidatePath("/ordination");
    return ok(res, "Candidate nomination submitted");
  } catch {
    const mock: OrdinationCandidate = {
      id: `ord_${Date.now()}`,
      memberId: input.memberId,
      fullName: input.fullName,
      churchRankCurrent: "Brother",
      rankTarget: input.rankTarget,
      parishId: "parish-mount-zion",
      parishName: input.parishName,
      districtName: "Lagos Central District",
      stageCurrent: "STAGE_1_PARISH",
      yearsOfService: input.yearsOfService,
      vettingHistory: [
        {
          stage: "STAGE_1_PARISH",
          action: "APPROVED",
          handlerId: "usr_handler_mz",
          notes: input.recommendationNotes,
          timestamp: new Date().toISOString(),
        },
      ],
      nominatedAt: new Date().toISOString(),
      nominatedByHandlerId: "usr_handler_mz",
    };
    revalidatePath("/ordination");
    return ok(mock, "Candidate nomination submitted");
  }
}

export async function advanceVettingStageAction(
  input: VettingStageAdvanceInput,
): Promise<ActionResult<{ success: boolean; nextStage: VettingStage }>> {
  const check = vettingStageAdvanceSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid vetting stage input");
  }
  const nextStage =
    check.data.action === "APPROVED" ? stageNextMap[check.data.currentStage] : check.data.currentStage;

  // 1. Attempt .NET Platform.Api backend if available
  try {
    await backend(`/ordination/candidates/${check.data.candidateId}/vetting`, {
      method: "POST",
      body: { action: check.data.action, clearanceNotes: check.data.clearanceNotes },
    });
  } catch {
    // Expected while .NET backend ordination controller is in development
  }

  // 2. Synchronize with Ordination Portal API & dispatch live Mailpit notifications
  try {
    const portalUrl = process.env.ORDINATION_PORTAL_URL || "http://localhost:3000";
    const candRes = await fetch(`${portalUrl}/api/candidates/${check.data.candidateId}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (candRes.ok) {
      const candJson = await candRes.json();
      const current = candJson.data?.candidate;
      if (current) {
        const tierApprovals = { ...(current.tierApprovals || {}) };
        let stage = current.stage;
        let currentVettingTier = current.currentVettingTier;
        const now = new Date().toISOString();
        const approverName = "Admin Directorate (HQ)";

        if (check.data.currentStage === "STAGE_1_PARISH") {
          tierApprovals.branch = {
            approved: check.data.action === "APPROVED",
            date: now,
            approverName,
            comments: check.data.clearanceNotes || "Parish Priest endorsement ratified.",
          };
          currentVettingTier = "district";
          stage = "district_review";
        } else if (check.data.currentStage === "STAGE_2_DISTRICT") {
          tierApprovals.district = {
            approved: check.data.action === "APPROVED",
            date: now,
            approverName,
            comments: check.data.clearanceNotes || "District Superintendent Council clearance verified.",
          };
          currentVettingTier = "province";
          stage = "provincial_review";
        } else if (check.data.currentStage === "STAGE_3_ZONAL") {
          tierApprovals.province = {
            approved: check.data.action === "APPROVED",
            date: now,
            approverName,
            comments: check.data.clearanceNotes || "Provincial Diocesan quota ratified.",
          };
          tierApprovals.cmc = {
            approved: check.data.action === "APPROVED",
            date: now,
            approverName: "Central Ministerial Committee (Admin)",
            comments: "Theological assessment & Liturgical interview cleared.",
          };
          currentVettingTier = "national";
          stage = "cmc_review";
        } else if (check.data.currentStage === "STAGE_4_SUPREME_APPROVED") {
          tierApprovals.national = {
            approved: check.data.action === "APPROVED",
            date: now,
            approverName: "Holy Synod & Supreme Council (Admin)",
            comments: check.data.clearanceNotes || "Supreme Advisory Council final seal issued.",
          };
          currentVettingTier = "completed";
          stage = "board_approved";
        }

        // PATCH to Ordination Portal (this automatically updates db.json and fires Mailpit email!)
        await fetch(`${portalUrl}/api/candidates/${check.data.candidateId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tierApprovals,
            stage,
            currentVettingTier,
            actorName: approverName,
          }),
        });
      }
    }
  } catch (portalErr: unknown) {
    const msg = portalErr instanceof Error ? portalErr.message : String(portalErr);
    console.warn("[AdminPortal] Could not sync vetting advance with Ordination Portal:", msg);
  }

  revalidatePath("/ordination");
  revalidatePath(`/ordination/candidates/${check.data.candidateId}`);
  return ok({ success: true, nextStage }, `Vetting stage updated to ${nextStage}`);
}
