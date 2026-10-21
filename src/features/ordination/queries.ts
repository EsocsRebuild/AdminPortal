"server-only";

import { backend } from "@/server/backend";
import type {
  OrdinationCandidate,
  OrdinationSummary,
  VettingStage,
  VettingLogEntry,
  EcclesiasticalRank,
} from "./types";

interface RawPortalCandidate {
  id: string;
  fullName: string;
  regNumber?: string;
  email?: string;
  phone?: string;
  currentRank?: string;
  targetRankName?: string;
  parish?: string;
  district?: string;
  province?: string;
  stage?: string;
  tenureYears?: number;
  submissionDate?: string;
  branchPriestName?: string;
  duesStatus?: "pending" | "cleared" | "exempt";
  duesAmountPaid?: number;
  conductRating?: string;
  passportPhotoUrl?: string;
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
  } else if (
    c.tierApprovals?.cmc?.approved ||
    c.tierApprovals?.province?.approved ||
    c.stage === "cmc_review"
  ) {
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

  const validRanks: EcclesiasticalRank[] = [
    "ALADURA",
    "RABBI",
    "EVANGELIST",
    "DEACON",
    "DEACONESS",
    "SUB_LEADER",
    "LEADER",
    "SENIOR_LEADER",
    "APOSTLE",
    "SENIOR_APOSTLE",
    "MOST_SENIOR_APOSTLE",
    "SPECIAL_APOSTLE",
  ];
  const targetNormalized = (c.targetRankName || "").toUpperCase().replace(/\s+/g, "_") as EcclesiasticalRank;
  const rankTarget = validRanks.includes(targetNormalized) ? targetNormalized : "LEADER";

  return {
    id: c.id,
    memberId: c.regNumber || c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    churchRankCurrent: c.currentRank || "Member",
    rankTarget,
    parishId: `parish-${(c.parish || "general").toLowerCase().replace(/\s+/g, "-")}`,
    parishName: c.parish || "Parish",
    districtName: c.district || "District",
    provinceName: c.province || "Province",
    stageCurrent,
    yearsOfService: c.tenureYears || 5,
    duesStatus: c.duesStatus,
    duesAmountPaid: c.duesAmountPaid,
    conductRating: c.conductRating,
    passportPhotoUrl: c.passportPhotoUrl,
    vettingHistory,
    nominatedAt: c.submissionDate || new Date().toISOString(),
    nominatedByHandlerId: c.branchPriestName || "Branch Rector",
  };
}

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
    "http://esocs-ordination-portal-dev:3000",
    "http://portal-dev:3000",
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
        signal: AbortSignal.timeout(3000),
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
              stage4ApprovedCount: candidates.filter((c) => c.stageCurrent === "STAGE_4_SUPREME_APPROVED")
                .length,
            },
          };
        }
      }
    } catch {
      // Continue to next candidate URL
    }
  }

  // 3. Return clean empty pipeline when unpopulated
  return {
    candidates: [],
    summary: {
      totalCandidates: 0,
      stage1Count: 0,
      stage2Count: 0,
      stage3Count: 0,
      stage4ApprovedCount: 0,
    },
  };
}

export async function getCandidateDocket(id: string): Promise<OrdinationCandidate | null> {
  const { candidates } = await getOrdinationCandidates();
  return candidates.find((c) => c.id === id) ?? null;
}
