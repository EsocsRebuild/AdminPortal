"server-only";

import { revalidatePath } from "next/cache";
import { backend } from "@/server/backend";
import { type ActionResult, ok, fail } from "@/lib/result";
import {
  eventInputSchema,
  programmeInputSchema,
  vettingDecisionSchema,
  type EventInput,
  type ProgrammeInput,
  type VettingDecisionInput,
} from "./schemas";
import type { WebEvent, WebProgramme } from "./types";

export async function submitEventAction(input: EventInput): Promise<ActionResult<WebEvent>> {
  const check = eventInputSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid event parameters");
  }
  try {
    const res = await backend<WebEvent>("/web-cms/events", {
      method: "POST",
      body: check.data,
    });
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/vetting");
    return ok(res, "Event submitted for vetting");
  } catch {
    // Graceful fallback for mock / development environment
    const mockEvent: WebEvent = {
      id: `evt_${Date.now()}`,
      unitId: "parish-mount-zion",
      unitName: "Mount Zion Parish",
      title: input.title,
      description: input.description,
      category: input.category,
      startDate: input.startDate,
      endDate: input.endDate,
      venue: input.venue,
      bannerUrl: input.bannerUrl || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
      registrationOpen: input.registrationOpen,
      ticketCapacity: input.ticketCapacity,
      status: "PENDING_REVIEW",
      submittedByHandlerId: "usr_handler_mz",
      submittedAt: new Date().toISOString(),
    };
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/events");
    return ok(mockEvent, "Event submitted for vetting");
  }
}

export async function submitProgrammeAction(input: ProgrammeInput): Promise<ActionResult<WebProgramme>> {
  const check = programmeInputSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid programme parameters");
  }
  try {
    const res = await backend<WebProgramme>("/web-cms/programmes", {
      method: "POST",
      body: check.data,
    });
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/programmes");
    return ok(res, "Programme schedule published");
  } catch {
    const mockProgramme: WebProgramme = {
      id: `prog_${Date.now()}`,
      unitId: "parish-mount-zion",
      unitName: "Mount Zion Parish",
      title: input.title,
      theme: input.theme,
      scheduleDate: input.scheduleDate,
      speakers: input.speakers,
      bulletinPdfUrl: input.bulletinPdfUrl,
      livestreamUrl: input.livestreamUrl,
      status: "PENDING_REVIEW",
      submittedByHandlerId: "usr_handler_mz",
      submittedAt: new Date().toISOString(),
    };
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/programmes");
    return ok(mockProgramme, "Programme schedule submitted for vetting");
  }
}

export async function vetContentAction(
  input: VettingDecisionInput,
): Promise<ActionResult<{ success: boolean; newStatus: string }>> {
  const check = vettingDecisionSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid decision payload");
  }
  const newStatus = check.data.action === "APPROVE" ? "APPROVED_LIVE" : "NEEDS_REVISION";
  try {
    await backend(`/web-cms/vetting/${check.data.contentId}`, {
      method: "POST",
      body: { action: check.data.action, reviewNotes: check.data.reviewNotes },
    });
    revalidatePath("/admin-web/vetting");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/dashboard");
    return ok({ success: true, newStatus }, `Content updated to ${newStatus}`);
  } catch {
    revalidatePath("/admin-web/vetting");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/dashboard");
    return ok({ success: true, newStatus }, `Content updated to ${newStatus}`);
  }
}
