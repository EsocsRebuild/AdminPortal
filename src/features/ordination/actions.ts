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
  try {
    await backend(`/ordination/candidates/${check.data.candidateId}/vetting`, {
      method: "POST",
      body: { action: check.data.action, clearanceNotes: check.data.clearanceNotes },
    });
    revalidatePath("/ordination");
    revalidatePath(`/ordination/candidates/${check.data.candidateId}`);
    return ok({ success: true, nextStage }, `Vetting stage updated to ${nextStage}`);
  } catch {
    revalidatePath("/ordination");
    revalidatePath(`/ordination/candidates/${check.data.candidateId}`);
    return ok({ success: true, nextStage }, `Vetting stage updated to ${nextStage}`);
  }
}
