export type VettingStage =
  | "STAGE_1_BRANCH"
  | "STAGE_2_DISTRICT"
  | "STAGE_3_PROVINCIAL"
  | "STAGE_4_NATIONAL"
  // Legacy aliases for backward compatibility with database records
  | "STAGE_1_PARISH"
  | "STAGE_3_ZONAL"
  | "STAGE_4_SUPREME_APPROVED";

export type EcclesiasticalRank =
  | "ALADURA"
  | "RABBI"
  | "EVANGELIST"
  | "DEACON"
  | "DEACONESS"
  | "SUB_LEADER"
  | "LEADER"
  | "SENIOR_LEADER"
  | "APOSTLE"
  | "SENIOR_APOSTLE"
  | "MOST_SENIOR_APOSTLE"
  | "SPECIAL_APOSTLE";

export interface VettingLogEntry {
  stage: VettingStage;
  action: "APPROVED" | "REJECTED" | "NEEDS_INFO";
  handlerId: string;
  notes: string;
  timestamp: string;
}

export interface OrdinationCandidate {
  id: string;
  memberId: string;
  fullName: string;
  email?: string;
  phone?: string;
  churchRankCurrent: string;
  rankTarget: EcclesiasticalRank;
  parishId: string;
  parishName: string;
  districtName: string;
  provinceName?: string;
  isProvincialWorshipper?: boolean;
  stageCurrent: VettingStage;
  baptismDate?: string;
  yearsOfService: number;
  duesStatus?: "pending" | "cleared" | "exempt";
  duesAmountPaid?: number;
  conductRating?: string;
  passportPhotoUrl?: string;
  recommendationLetterUrl?: string;
  courseCertificateUrl?: string;
  vettingHistory: VettingLogEntry[];
  nominatedAt: string;
  nominatedByHandlerId: string;
}

export interface OrdinationSummary {
  totalCandidates: number;
  stage1BranchCount: number;
  stage2DistrictCount: number;
  stage3ProvincialCount: number;
  stage4NationalCount: number;
  // Legacy aliases
  stage1Count?: number;
  stage2Count?: number;
  stage3Count?: number;
  stage4ApprovedCount?: number;
}
