export type VettingStage =
  "STAGE_1_PARISH" | "STAGE_2_DISTRICT" | "STAGE_3_ZONAL" | "STAGE_4_SUPREME_APPROVED";

export type EcclesiasticalRank =
  | "DEACON"
  | "DEACONESS"
  | "SUB_LEADER"
  | "LEADER"
  | "SENIOR_LEADER"
  | "APOSTLE"
  | "SENIOR_APOSTLE"
  | "MOST_SENIOR_APOSTLE";

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
  churchRankCurrent: string;
  rankTarget: EcclesiasticalRank;
  parishId: string;
  parishName: string;
  districtName: string;
  stageCurrent: VettingStage;
  baptismDate?: string;
  yearsOfService: number;
  recommendationLetterUrl?: string;
  courseCertificateUrl?: string;
  vettingHistory: VettingLogEntry[];
  nominatedAt: string;
  nominatedByHandlerId: string;
}

export interface OrdinationSummary {
  totalCandidates: number;
  stage1Count: number;
  stage2Count: number;
  stage3Count: number;
  stage4ApprovedCount: number;
}
