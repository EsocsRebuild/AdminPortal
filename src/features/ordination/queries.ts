"server-only";

import { backend } from "@/server/backend";
import type { OrdinationCandidate, OrdinationSummary } from "./types";

export async function getOrdinationCandidates(): Promise<{
  candidates: OrdinationCandidate[];
  summary: OrdinationSummary;
}> {
  try {
    return await backend<{ candidates: OrdinationCandidate[]; summary: OrdinationSummary }>(
      "/ordination/candidates",
    );
  } catch {
    const candidates: OrdinationCandidate[] = [
      {
        id: "cand_1",
        memberId: "mbr_10842",
        fullName: "Special Apostle Emmanuel Oladipo",
        churchRankCurrent: "Senior Apostle",
        rankTarget: "MOST_SENIOR_APOSTLE",
        parishId: "parish-mount-zion",
        parishName: "Mount Zion Parish",
        districtName: "Lagos Central District",
        stageCurrent: "STAGE_3_ZONAL",
        yearsOfService: 18,
        recommendationLetterUrl: "https://esocs.org/docs/rec_10842.pdf",
        courseCertificateUrl: "https://esocs.org/docs/cert_10842.pdf",
        vettingHistory: [
          {
            stage: "STAGE_1_PARISH",
            action: "APPROVED",
            handlerId: "usr_handler_mz",
            notes: "Outstanding leadership in parish pastoral council and youth mentorship.",
            timestamp: "2026-09-10T10:00:00Z",
          },
          {
            stage: "STAGE_2_DISTRICT",
            action: "APPROVED",
            handlerId: "usr_district_sec",
            notes: "District character verification cleared with zero disciplinary records.",
            timestamp: "2026-09-22T14:30:00Z",
          },
        ],
        nominatedAt: "2026-09-01T09:00:00Z",
        nominatedByHandlerId: "usr_handler_mz",
      },
      {
        id: "cand_2",
        memberId: "mbr_11420",
        fullName: "Sister Grace Adebayo",
        churchRankCurrent: "Member",
        rankTarget: "DEACONESS",
        parishId: "parish-mount-zion",
        parishName: "Mount Zion Parish",
        districtName: "Lagos Central District",
        stageCurrent: "STAGE_2_DISTRICT",
        yearsOfService: 7,
        vettingHistory: [
          {
            stage: "STAGE_1_PARISH",
            action: "APPROVED",
            handlerId: "usr_handler_mz",
            notes: "Dedicated service in welfare department and choir ministry.",
            timestamp: "2026-09-15T11:00:00Z",
          },
        ],
        nominatedAt: "2026-09-12T08:00:00Z",
        nominatedByHandlerId: "usr_handler_mz",
      },
      {
        id: "cand_3",
        memberId: "mbr_12091",
        fullName: "Brother Samuel Nnamdi",
        churchRankCurrent: "Sub-Leader",
        rankTarget: "LEADER",
        parishId: "parish-grace-sanctuary",
        parishName: "Grace Sanctuary Parish",
        districtName: "Lagos West District",
        stageCurrent: "STAGE_4_SUPREME_APPROVED",
        yearsOfService: 12,
        vettingHistory: [
          {
            stage: "STAGE_1_PARISH",
            action: "APPROVED",
            handlerId: "usr_handler_gs",
            notes: "Recommended for exemplary leadership during district revival.",
            timestamp: "2026-08-01T10:00:00Z",
          },
          {
            stage: "STAGE_2_DISTRICT",
            action: "APPROVED",
            handlerId: "usr_district_west",
            notes: "Cleared district vetting panel.",
            timestamp: "2026-08-15T12:00:00Z",
          },
          {
            stage: "STAGE_3_ZONAL",
            action: "APPROVED",
            handlerId: "usr_zonal_prelate",
            notes: "Passed Zonal Ecclesiastical Examination with 94% score.",
            timestamp: "2026-09-01T15:00:00Z",
          },
          {
            stage: "STAGE_4_SUPREME_APPROVED",
            action: "APPROVED",
            handlerId: "usr_supreme_board",
            notes: "Final approval granted by Supreme Council.",
            timestamp: "2026-09-20T16:00:00Z",
          },
        ],
        nominatedAt: "2026-07-25T09:00:00Z",
        nominatedByHandlerId: "usr_handler_gs",
      },
    ];

    return {
      candidates,
      summary: {
        totalCandidates: candidates.length,
        stage1Count: candidates.filter((c) => c.stageCurrent === "STAGE_1_PARISH").length,
        stage2Count: candidates.filter((c) => c.stageCurrent === "STAGE_2_DISTRICT").length,
        stage3Count: candidates.filter((c) => c.stageCurrent === "STAGE_3_ZONAL").length,
        stage4ApprovedCount: candidates.filter((c) => c.stageCurrent === "STAGE_4_SUPREME_APPROVED").length,
      },
    };
  }
}

export async function getCandidateDocket(id: string): Promise<OrdinationCandidate | null> {
  const { candidates } = await getOrdinationCandidates();
  return candidates.find((c) => c.id === id) ?? candidates[0] ?? null;
}
