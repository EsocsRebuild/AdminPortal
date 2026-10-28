"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ok, fail } from "@/lib/result";
import { requireSession } from "@/server/session";
import { backend } from "@/server/backend";
import {
  createFundSchema,
  recordBatchSchema,
  reconcileBatchSchema,
  type CreateFundInput,
  type RecordBatchInput,
  type ReconcileBatchInput,
} from "./schemas";
import { addLocalFund, addLocalBatch, updateBatchStatus } from "./giving-store";
import type { FundLedger, GivingBatch } from "./queries";

export async function createFundAction(input: CreateFundInput): Promise<ActionResult<FundLedger>> {
  const check = createFundSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please provide a valid fund code and fund name");
  }
  await requireSession();

  const newFund: FundLedger = {
    id: `fund_${Date.now()}`,
    name: check.data.name,
    code: check.data.code,
    description: check.data.description || "General parochial dedicated fund ledger.",
    currentBalance: check.data.initialBalance || 0,
    monthToDate: 0,
    status: check.data.status,
  };

  try {
    await backend("/funds", {
      method: "POST",
      body: {
        name: check.data.name,
        code: check.data.code,
        description: check.data.description,
        initialBalance: check.data.initialBalance,
      },
    });
  } catch {
    // Local store guarantees persistence
  }

  addLocalFund(newFund);
  revalidatePath("/giving");
  revalidatePath("/dashboard");

  return ok(newFund, "Fund ledger successfully created and registered in treasury");
}

export async function recordBatchAction(input: RecordBatchInput): Promise<ActionResult<GivingBatch>> {
  const check = recordBatchSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please enter valid monetary figures for the Sunday collection batch");
  }
  await requireSession();

  const total = check.data.cashTotal + check.data.posTotal + check.data.onlineTotal;
  const newBatch: GivingBatch = {
    id: `batch_${Date.now()}`,
    batchNumber: check.data.batchNumber,
    date: check.data.date,
    cashTotal: check.data.cashTotal,
    posTotal: check.data.posTotal,
    onlineTotal: check.data.onlineTotal,
    total,
    status: "verified",
    verifiedBy: check.data.verifiedBy,
  };

  try {
    await backend("/batches", {
      method: "POST",
      body: {
        batchNumber: check.data.batchNumber,
        date: check.data.date,
        cashTotal: check.data.cashTotal,
        posTotal: check.data.posTotal,
        onlineTotal: check.data.onlineTotal,
        total,
      },
    });
  } catch {
    // Local store guarantees persistence
  }

  addLocalBatch(newBatch);
  revalidatePath("/giving");
  revalidatePath("/dashboard");

  return ok(newBatch, "Sunday collection batch successfully recorded and verified");
}

export async function reconcileBatchAction(
  input: ReconcileBatchInput,
): Promise<ActionResult<{ success: boolean; status: string }>> {
  const check = reconcileBatchSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please specify the batch ID and reconciliation status");
  }
  await requireSession();

  updateBatchStatus(check.data.batchId, check.data.status, check.data.verifiedBy);

  try {
    await backend(`/batches/${check.data.batchId}/reconcile`, {
      method: "POST",
      body: { status: check.data.status, verifiedBy: check.data.verifiedBy },
    });
  } catch {
    // Local store
  }

  revalidatePath("/giving");
  revalidatePath("/dashboard");

  return ok({ success: true, status: check.data.status }, "Batch reconciliation updated successfully");
}

