"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type ActionResult, ok, fail } from "@/lib/result";
import { requireSession } from "@/server/session";
import { backend } from "@/server/backend";
import { addLocalHeadcount, updateLatestLiveCount } from "./attendance-store";
import type { HeadcountRecord } from "./queries";

const headcountInputSchema = z.object({
  serviceType: z.string().min(3, "Service title required"),
  date: z.string().min(1, "Date required"),
  men: z.number().nonnegative().default(0),
  women: z.number().nonnegative().default(0),
  children: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  recorder: z.string().min(2, "Recorder name required"),
});

export async function recordHeadcountAction(
  input: z.infer<typeof headcountInputSchema>,
): Promise<ActionResult<HeadcountRecord>> {
  const check = headcountInputSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please enter valid attendance figures for men, women, or children");
  }
  await requireSession();

  const total = check.data.men + check.data.women + check.data.children;
  const newRecord: HeadcountRecord = {
    id: `att_${Date.now()}`,
    date: check.data.date,
    serviceType: check.data.serviceType,
    men: check.data.men,
    women: check.data.women,
    children: check.data.children,
    total,
    notes: check.data.notes,
    recorder: check.data.recorder,
  };

  try {
    await backend("/attendance/reports", {
      method: "POST",
      body: newRecord,
    });
  } catch {
    // Local store
  }

  addLocalHeadcount(newRecord);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");

  return ok(newRecord, "Service attendance headcount recorded successfully");
}

export async function incrementHeadcountAction(
  delta: number,
): Promise<ActionResult<{ newTotal: number }>> {
  await requireSession();
  const newTotal = updateLatestLiveCount(delta);
  revalidatePath("/attendance");
  return ok({ newTotal }, "Usher headcount updated");
}

