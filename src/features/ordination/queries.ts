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
  const isProvincialWorshipper = Boolean(
    (c.parish || "").toLowerCase().includes("provincial") ||
    (c.parish || "").toLowerCase().includes("cathedral") ||
    (c.parish || "").toLowerCase().includes("seat") ||
    (c.district || "").toLowerCase().includes("provincial"),
  );

  let stageCurrent: VettingStage = "STAGE_1_BRANCH";
  if (
    c.tierApprovals?.national?.approved ||
    ["board_approved", "investiture_assigned", "ordained"].includes(c.stage || "")
  ) {
    stageCurrent = "STAGE_4_NATIONAL";
  } else if (
    c.tierApprovals?.province?.approved ||
    c.tierApprovals?.cmc?.approved ||
    ["provincial_review", "province_approved", "cmc_review"].includes(c.stage || "")
  ) {
    stageCurrent = "STAGE_3_PROVINCIAL";
  } else if (c.tierApprovals?.district?.approved || c.stage === "district_review") {
    stageCurrent = "STAGE_2_DISTRICT";
  } else if (c.tierApprovals?.branch?.approved) {
    // If candidate worships at the provincial level, branch nomination progresses directly to Provincial Review
    stageCurrent = isProvincialWorshipper ? "STAGE_3_PROVINCIAL" : "STAGE_2_DISTRICT";
  }

  const vettingHistory: VettingLogEntry[] = [];
  if (c.tierApprovals?.branch?.approved) {
    vettingHistory.push({
      stage: "STAGE_1_BRANCH",
      action: "APPROVED",
      handlerId: c.tierApprovals.branch.approverName || "Branch Presiding Officer",
      notes:
        c.tierApprovals.branch.comments ||
        (isProvincialWorshipper
          ? "Provincial Cathedral Branch nomination endorsed."
          : "Branch Level nomination endorsed."),
      timestamp: c.tierApprovals.branch.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (
    c.tierApprovals?.district?.approved ||
    (isProvincialWorshipper &&
      (c.tierApprovals?.province?.approved ||
        stageCurrent === "STAGE_3_PROVINCIAL" ||
        stageCurrent === "STAGE_4_NATIONAL"))
  ) {
    vettingHistory.push({
      stage: "STAGE_2_DISTRICT",
      action: "APPROVED",
      handlerId: c.tierApprovals?.district?.approverName || "District Review Committee",
      notes:
        c.tierApprovals?.district?.comments ||
        (isProvincialWorshipper
          ? "Direct Provincial Seat Jurisdiction: District review cleared."
          : "District Review verification cleared."),
      timestamp: c.tierApprovals?.district?.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (c.tierApprovals?.province?.approved || c.tierApprovals?.cmc?.approved) {
    vettingHistory.push({
      stage: "STAGE_3_PROVINCIAL",
      action: "APPROVED",
      handlerId: c.tierApprovals?.province?.approverName || "Provincial Advisory Council",
      notes: c.tierApprovals?.province?.comments || "Provincial Review clearance ratified.",
      timestamp: c.tierApprovals?.province?.date || c.submissionDate || new Date().toISOString(),
    });
  }
  if (c.tierApprovals?.national?.approved) {
    vettingHistory.push({
      stage: "STAGE_4_NATIONAL",
      action: "APPROVED",
      handlerId: c.tierApprovals.national.approverName || "National Holy Synod",
      notes: c.tierApprovals.national.comments || "National Level final ratification granted.",
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
    parishName: c.parish || "Branch",
    districtName: c.district || "District",
    provinceName: c.province || "Province",
    isProvincialWorshipper,
    stageCurrent,
    yearsOfService: c.tenureYears || 5,
    duesStatus: c.duesStatus,
    duesAmountPaid: c.duesAmountPaid,
    conductRating: c.conductRating,
    passportPhotoUrl: c.passportPhotoUrl,
    vettingHistory,
    nominatedAt: c.submissionDate || new Date().toISOString(),
    nominatedByHandlerId: c.branchPriestName || "Branch Presiding Officer",
  };
}

export type CandidateSortOption =
  "date-desc" | "date-asc" | "name-asc" | "name-desc" | "rank" | "tenure-desc" | "stage";

export interface CandidateFilterOptions {
  province?: string;
  stage?: string;
  duesStatus?: string;
  search?: string;
  sort?: CandidateSortOption;
}

const rankHierarchyOrder: Record<string, number> = {
  SPECIAL_APOSTLE: 12,
  MOST_SENIOR_APOSTLE: 11,
  SENIOR_APOSTLE: 10,
  APOSTLE: 9,
  SENIOR_LEADER: 8,
  LEADER: 7,
  SUB_LEADER: 6,
  EVANGELIST: 5,
  RABBI: 4,
  DEACON: 3,
  DEACONESS: 3,
  ALADURA: 2,
};

const stageProgressOrder: Record<VettingStage, number> = {
  STAGE_1_BRANCH: 1,
  STAGE_1_PARISH: 1,
  STAGE_2_DISTRICT: 2,
  STAGE_3_PROVINCIAL: 3,
  STAGE_3_ZONAL: 3,
  STAGE_4_NATIONAL: 4,
  STAGE_4_SUPREME_APPROVED: 4,
};

export async function getOrdinationCandidates(options?: CandidateFilterOptions): Promise<{
  candidates: OrdinationCandidate[];
  summary: OrdinationSummary;
  allProvinces: string[];
}> {
  let allRawCandidates: OrdinationCandidate[] = [];

  // 1. Try .NET Platform.Api if implemented
  try {
    const res = await backend<{ candidates: OrdinationCandidate[]; summary: OrdinationSummary }>(
      "/ordination/candidates",
    );
    if (res && res.candidates && res.candidates.length > 0) {
      allRawCandidates = res.candidates;
    }
  } catch {
    // Expected while .NET backend ordination controller is in development
  }

  // 2. Fetch live canonical candidates from Ordination Portal
  if (allRawCandidates.length === 0) {
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
          const rawList = json.data?.candidates || [];
          if (Array.isArray(rawList) && rawList.length > 0) {
            allRawCandidates = rawList.map(mapToAdminCandidate);
            break;
          }
        }
      } catch {
        // Continue to next candidate URL
      }
    }
  }

  // Fallback canonical dataset if portal is starting up or in offline mode
  if (allRawCandidates.length === 0) {
    allRawCandidates = [
      {
        id: "cand-007",
        memberId: "ESOCS/ORD/2026/7821",
        fullName: "Senior Apostle Daniel W. Briggs",
        email: "daniel.briggs@esocs.test",
        phone: "+234 803 777 9922",
        churchRankCurrent: "Senior Leader",
        rankTarget: "APOSTLE",
        parishId: "parish-diobu-central",
        parishName: "Diobu Central Cathedral (Provincial Seat)",
        districtName: "Diobu District",
        provinceName: "Diobu Province",
        isProvincialWorshipper: true,
        stageCurrent: "STAGE_3_PROVINCIAL",
        yearsOfService: 7,
        duesStatus: "cleared",
        duesAmountPaid: 65000,
        conductRating: "exemplary",
        vettingHistory: [],
        nominatedAt: "2026-10-21T10:00:00Z",
        nominatedByHandlerId: "Special Senior Apostle T. J. George",
      },
      {
        id: "cand-006",
        memberId: "ESOCS/ORD/2026/6416",
        fullName: "peter chima tester",
        email: "peter4tech@gmail.com",
        phone: "+234 808 639 2101",
        churchRankCurrent: "Brother",
        rankTarget: "ALADURA",
        parishId: "parish-mount-zion",
        parishName: "Mount Zion Cathedral Branch (National Headquarters)",
        districtName: "Ebute Metta District (Mother District)",
        provinceName: "Lagos Central Province",
        isProvincialWorshipper: true,
        stageCurrent: "STAGE_1_BRANCH",
        yearsOfService: 4,
        duesStatus: "pending",
        duesAmountPaid: 0,
        conductRating: "exemplary",
        vettingHistory: [],
        nominatedAt: "2026-10-19T14:00:00Z",
        nominatedByHandlerId: "Branch Presiding Officer",
      },
      {
        id: "cand-002",
        memberId: "ESOCS/ORD/2026/8929",
        fullName: "Pastor Michael Chukwuma",
        email: "michael.chukwuma@esocs.test",
        phone: "+234 803 123 4567",
        churchRankCurrent: "Leader",
        rankTarget: "RABBI",
        parishId: "parish-mount-zion",
        parishName: "Mount Zion Cathedral",
        districtName: "Lagos Central District",
        provinceName: "Lagos Province",
        isProvincialWorshipper: false,
        stageCurrent: "STAGE_2_DISTRICT",
        yearsOfService: 6,
        duesStatus: "cleared",
        duesAmountPaid: 45000,
        conductRating: "exemplary",
        vettingHistory: [],
        nominatedAt: "2026-10-19T21:20:00Z",
        nominatedByHandlerId: "Senior Apostle J. K. Babalola",
      },
    ];
  }

  // Extract all distinct provinces present across the full candidate population
  const provinceSet = new Set<string>();
  for (const c of allRawCandidates) {
    const p = (c.provinceName || "").trim();
    if (p && p.toLowerCase() !== "province") {
      provinceSet.add(p);
    }
  }
  // Ensure major ecclesiastical jurisdictions are represented
  provinceSet.add("Diobu Province");
  provinceSet.add("Lagos Central Province");
  provinceSet.add("Lagos Province");
  const allProvinces = Array.from(provinceSet).sort();

  // ─── Professional Data Filtering ───
  let filtered = [...allRawCandidates];

  // A. Province / Jurisdiction Filter
  if (options?.province && options.province !== "ALL") {
    const targetProv = options.province.toLowerCase().trim();
    const normTarget = targetProv.replace(/\bprovince\b/gi, "").trim();

    filtered = filtered.filter((c) => {
      const candidateProv = (c.provinceName || "").toLowerCase().trim();
      if (!candidateProv || candidateProv === "province") return false;
      if (candidateProv === targetProv) return true;

      const normCandidate = candidateProv.replace(/\bprovince\b/gi, "").trim();
      return normTarget === normCandidate;
    });
  }

  // B. Vetting Pipeline Stage Filter
  if (options?.stage && options.stage !== "ALL") {
    filtered = filtered.filter((c) => {
      if (options.stage === "STAGE_1_BRANCH" || options.stage === "STAGE_1_PARISH") {
        return c.stageCurrent === "STAGE_1_BRANCH" || c.stageCurrent === "STAGE_1_PARISH";
      }
      if (options.stage === "STAGE_3_PROVINCIAL" || options.stage === "STAGE_3_ZONAL") {
        return c.stageCurrent === "STAGE_3_PROVINCIAL" || c.stageCurrent === "STAGE_3_ZONAL";
      }
      if (options.stage === "STAGE_4_NATIONAL" || options.stage === "STAGE_4_SUPREME_APPROVED") {
        return c.stageCurrent === "STAGE_4_NATIONAL" || c.stageCurrent === "STAGE_4_SUPREME_APPROVED";
      }
      return c.stageCurrent === options.stage;
    });
  }

  // C. Dues Reconciliation Status Filter
  if (options?.duesStatus && options.duesStatus !== "ALL") {
    filtered = filtered.filter((c) => c.duesStatus === options.duesStatus);
  }

  // D. Free-Text Search Filter
  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.memberId.toLowerCase().includes(q) ||
        c.rankTarget.toLowerCase().includes(q) ||
        c.churchRankCurrent.toLowerCase().includes(q) ||
        c.parishName.toLowerCase().includes(q) ||
        c.districtName.toLowerCase().includes(q) ||
        (c.provinceName || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q)
      );
    });
  }

  // ─── Professional Data Sorting ───
  const sort = options?.sort || "date-desc";
  filtered.sort((a, b) => {
    switch (sort) {
      case "date-asc":
        return new Date(a.nominatedAt).getTime() - new Date(b.nominatedAt).getTime();
      case "name-asc":
        return a.fullName.localeCompare(b.fullName);
      case "name-desc":
        return b.fullName.localeCompare(a.fullName);
      case "rank": {
        const rankA = rankHierarchyOrder[a.rankTarget] || 0;
        const rankB = rankHierarchyOrder[b.rankTarget] || 0;
        return rankB - rankA;
      }
      case "tenure-desc":
        return b.yearsOfService - a.yearsOfService;
      case "stage": {
        const stageA = stageProgressOrder[a.stageCurrent] || 0;
        const stageB = stageProgressOrder[b.stageCurrent] || 0;
        return stageB - stageA;
      }
      case "date-desc":
      default:
        return new Date(b.nominatedAt).getTime() - new Date(a.nominatedAt).getTime();
    }
  });

  const isStage1 = (c: OrdinationCandidate) =>
    c.stageCurrent === "STAGE_1_BRANCH" || c.stageCurrent === "STAGE_1_PARISH";
  const isStage2 = (c: OrdinationCandidate) => c.stageCurrent === "STAGE_2_DISTRICT";
  const isStage3 = (c: OrdinationCandidate) =>
    c.stageCurrent === "STAGE_3_PROVINCIAL" || c.stageCurrent === "STAGE_3_ZONAL";
  const isStage4 = (c: OrdinationCandidate) =>
    c.stageCurrent === "STAGE_4_NATIONAL" || c.stageCurrent === "STAGE_4_SUPREME_APPROVED";

  return {
    candidates: filtered,
    summary: {
      totalCandidates: filtered.length,
      stage1BranchCount: filtered.filter(isStage1).length,
      stage2DistrictCount: filtered.filter(isStage2).length,
      stage3ProvincialCount: filtered.filter(isStage3).length,
      stage4NationalCount: filtered.filter(isStage4).length,
      // Legacy compatibility aliases
      stage1Count: filtered.filter(isStage1).length,
      stage2Count: filtered.filter(isStage2).length,
      stage3Count: filtered.filter(isStage3).length,
      stage4ApprovedCount: filtered.filter(isStage4).length,
    },
    allProvinces,
  };
}

export async function getCandidateDocket(id: string): Promise<OrdinationCandidate | null> {
  const { candidates } = await getOrdinationCandidates();
  return candidates.find((c) => c.id === id) ?? null;
}
