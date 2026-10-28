import { z } from "zod";

export const createFundSchema = z.object({
  name: z.string().min(3, "Ledger name must be at least 3 characters").max(100),
  code: z.string().min(2, "Fund code is required").max(20).toUpperCase(),
  description: z.string().max(500).optional(),
  initialBalance: z.number().nonnegative("Balance cannot be negative").default(0),
  status: z.enum(["active", "restricted"]).default("active"),
});

export const recordBatchSchema = z.object({
  batchNumber: z.string().min(3, "Batch number is required"),
  date: z.string().min(1, "Service date is required"),
  cashTotal: z.number().nonnegative().default(0),
  posTotal: z.number().nonnegative().default(0),
  onlineTotal: z.number().nonnegative().default(0),
  verifiedBy: z.string().min(2, "Recording officer name is required"),
});

export const reconcileBatchSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  status: z.enum(["open", "verified", "reconciled"]),
  verifiedBy: z.string().min(2, "Verifier name is required"),
});

export type CreateFundInput = z.infer<typeof createFundSchema>;
export type RecordBatchInput = z.infer<typeof recordBatchSchema>;
export type ReconcileBatchInput = z.infer<typeof reconcileBatchSchema>;
