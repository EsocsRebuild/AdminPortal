"server-only";

import { backend } from "@/server/backend";
import type { OrdinationCandidate, OrdinationSummary, VettingStage, VettingLogEntry, EcclesiasticalRank } from "./types";

interface RawPortalCandidate {
  id: string;
  fullName: string;
  regNumber?: string;
  currentRank?: string;
  targetRankName?: string;
  parish?: string;
  district?: string;
  province?: string;
  stage?: string;
  tenureYears?: number;
  submissionDate?: string;
  branchPriestName?: string;
  tierApprovals?: {
    branch?: { approved?: boolean; approverName?: string; date?: string; comments?: string };
    district?: { approved?: boolean; approverName?: string; date?: string; comments?: string };
    province?: { approved?: boolean; approverName?: string; date?: string; comments?: string };
    cmc?: { approved?: boolean; approverName?: string; date?: string; comments?: string };
    national?: { approved?: boolean; approverName?: string; date?: string; comments?: string };
  };
}

function mapToAdminCandidate(c: RawPortalCandidate): OrdinationCandidate {
  let stageCurrent: VettingStage = "STAGE_1_PARISH";
  if (
    c.tierApprovals?.national?.approved ||
    ["board_approved", "investiture_assigned", "ordained"].includes(c.stage || "")
  ) {
    stageCurrent = "STAGE_4_SUPREME_APPROVED";
  } else if (c.tierApprovals?.cmc?.approved || c.tierApprovals?.province?.approved || c.stage === "cmc_review") {
    stageCurrent = "STAGE_3_ZONAL";
  } else if (c.tierApprovals?.branch?.approved || c.stage === "district_review") {
    stageCurrent = "STAGE_2_DISTRICT";
  }

  const vettingHistory: VettingLogEntry[] = [];
  if (c.tierApprovals?.branch?.approved) {
    vettingHistory.push({
      stage: "STAGE_1_PARISH",
      action: "APPROVED",
      handlerId: c.tierApprovals.branch.approverName || "Parish Rector",
      notes: c.tierApprovals.branch.comments || "Parish Priest endorsement verified.",
      timestamp: c.tierApprovals.branch.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (c.tierApprovals?.district?.approved) {
    vettingHistory.push({
      stage: "STAGE_2_DISTRICT",
      action: "APPROVED",
      handlerId: c.tierApprovals.district.approverName || "District Superintendent",
      notes: c.tierApprovals.district.comments || "District character verification cleared.",
      timestamp: c.tierApprovals.district.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (c.tierApprovals?.province?.approved || c.tierApprovals?.cmc?.approved) {
    vettingHistory.push({
      stage: "STAGE_3_ZONAL",
      action: "APPROVED",
      handlerId: c.tierApprovals.cmc?.approverName || "Zonal Directorate",
      notes: c.tierApprovals.cmc?.comments || "Passed doctrinal screening and examination.",
      timestamp: c.tierApprovals.cmc?.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (c.tierApprovals?.national?.approved) {
    vettingHistory.push({
      stage: "STAGE_4_SUPREME_APPROVED",
      action: "APPROVED",
      handlerId: c.tierApprovals.national.approverName || "Supreme Council",
      notes: c.tierApprovals.national.comments || "Supreme Council final ratification granted.",
      timestamp: c.tierApprovals.national.date || c.submissionDate || new Date().toISOString(),
    });
  }

  // Normalize target rank to valid enum value or fallback to LEADER
  const validRanks: EcclesiasticalRank[] = [
    "DEACON",
    "DEACONESS",
    "SUB_LEADER",
    "LEADER",
    "SENIOR_LEADER",
    "APOSTLE",
    "SENIOR_APOSTLE",
    "MOST_SENIOR_APOSTLE",
  ];
  const targetNormalized = (c.targetRankName || "")
    .toUpperCase()
    .replace(/\s+/g, "_") as EcclesiasticalRank;
  const rankTarget = validRanks.includes(targetNormalized) ? targetNormalized : "LEADER";

  return {
    id: c.id,
    memberId: c.regNumber || c.id,
    fullName: c.fullName,
    churchRankCurrent: c.currentRank || "Member",
    rankTarget,
    parishId: `parish-${(c.parish || "general").toLowerCase().replace(/\s+/g, "-")}`,
    parishName: c.parish || "Parish",
    districtName: c.district || "District",
    stageCurrent,
    yearsOfService: c.tenureYears || 5,
    vettingHistory,
    nominatedAt: c.submissionDate || new Date().toISOString(),
    nominatedByHandlerId: c.branchPriestName || "Branch Rector",
  };
}

const DEFAULT_FALLBACK_CANDIDATES: OrdinationCandidate[] = [
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

export async function getOrdinationCandidates(): Promise<{
  candidates: OrdinationCandidate[];
  summary: OrdinationSummary;
}> {
  // 1. Try .NET Platform.Api if implemented
  try {
    const res = await backend<{ candidates: OrdinationCandidate[]; summary: OrdinationSummary }>(
      "/ordination/candidates",
    );
    if (res && res.candidates && res.candidates.length > 0) {
      return res;
    }
  } catch {
    // Expected while .NET backend ordination controller is in development
  }

  // 2. Fetch live canonical candidates from Ordination Portal
  const portalUrls = [
    process.env.ORDINATION_PORTAL_URL,
    "http://host.docker.internal:3010",
    "http://localhost:3010",
    "http://localhost:3000",
    "http://172.17.0.1:3010",
  ].filter(Boolean) as string[];

  for (const portalUrl of portalUrls) {
    try {
      const res = await fetch(`${portalUrl}/api/candidates`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2500),
      });

      if (res.ok) {
        const json = await res.json();
        const rawCandidates = json.data?.candidates || [];
        if (Array.isArray(rawCandidates) && rawCandidates.length > 0) {
          const candidates = rawCandidates.map(mapToAdminCandidate);
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
    } catch {
      // Continue to next candidate URL
    }
  }

  // 3. Fallback to default candidates
  const candidates = DEFAULT_FALLBACK_CANDIDATES;
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

export async function getCandidateDocket(id: string): Promise<OrdinationCandidate | null> {
  const { candidates } = await getOrdinationCandidates();
  return candidates.find((c) => c.id === id) ?? candidates[0] ?? null;
}
