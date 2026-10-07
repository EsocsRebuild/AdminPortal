import { z } from "zod";

export const candidateNominationSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  memberId: z.string().min(1, "Member ID is required"),
  rankTarget: z.enum([
    "DEACON",
    "DEACONESS",
    "SUB_LEADER",
    "LEADER",
    "SENIOR_LEADER",
    "APOSTLE",
    "SENIOR_APOSTLE",
    "MOST_SENIOR_APOSTLE",
  ]),
  yearsOfService: z.number().int().min(1, "Service years must be at least 1"),
  parishName: z.string().min(2, "Parish name is required"),
  recommendationNotes: z.string().min(10, "Recommendation rationale is required"),
});

export const vettingStageAdvanceSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  currentStage: z.enum(["STAGE_1_PARISH", "STAGE_2_DISTRICT", "STAGE_3_ZONAL", "STAGE_4_SUPREME_APPROVED"]),
  action: z.enum(["APPROVED", "REJECTED", "NEEDS_INFO"]),
  clearanceNotes: z.string().min(5, "Vetting clearance notes are required"),
});

export type CandidateNominationInput = z.infer<typeof candidateNominationSchema>;
export type VettingStageAdvanceInput = z.infer<typeof vettingStageAdvanceSchema>;
