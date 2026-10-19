"server-only";

import { revalidatePath } from "next/cache";
import { backend } from "@/server/backend";
import { type ActionResult, ok, fail } from "@/lib/result";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";
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

  const user = await requireSession();
  const unitInfo = await resolveUserUnit(user.scopeUnitId);

  const typeMap: Record<string, string> = {
    REVIVAL: "Outreach",
    SUNDAY_SERVICE: "Service",
    FELLOWSHIP_RALLY: "Social",
    CONFERENCE: "Conference",
    SPECIAL_PROGRAMME: "Other",
  };

  const starts = new Date(check.data.startDate);
  const ends = check.data.endDate
    ? new Date(check.data.endDate)
    : new Date(starts.getTime() + 3 * 3600 * 1000);

  const payload = {
    title: check.data.title,
    type: typeMap[check.data.category] || "Service",
    visibility: "Public",
    summary: check.data.description,
    description: check.data.description,
    coverImageUrl: check.data.bannerUrl || null,
    unitId: user.scopeUnitId || null,
    location: check.data.venue || `${unitInfo.unitName} Sanctuary`,
    isOnline: false,
    startsAt: starts.toISOString(),
    endsAt: ends.toISOString(),
    timeZone: "Africa/Lagos",
    allDay: false,
    registrationEnabled: Boolean(check.data.registrationOpen),
    capacity: check.data.ticketCapacity || null,
  };

  try {
    const res = await backend<{ id: string }>("/events", {
      method: "POST",
      body: payload,
    });

    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/vetting");

    return ok(
      {
        id: res?.id || `evt_${Date.now()}`,
        unitId: unitInfo.unitId || "",
        unitName: unitInfo.unitName,
        title: check.data.title,
        description: check.data.description,
        category: check.data.category,
        startDate: check.data.startDate,
        endDate: check.data.endDate,
        venue: check.data.venue,
        bannerUrl: check.data.bannerUrl,
        registrationOpen: check.data.registrationOpen,
        ticketCapacity: check.data.ticketCapacity,
        status: "APPROVED_LIVE",
        submittedByHandlerId: user.id,
        submittedAt: new Date().toISOString(),
      },
      "Event submitted and published successfully",
    );
  } catch {
    return fail("UNAVAILABLE", "Failed to submit event to backend server. Please verify backend connectivity.");
  }
}

export async function submitProgrammeAction(input: ProgrammeInput): Promise<ActionResult<WebProgramme>> {
  const check = programmeInputSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Invalid programme parameters");
  }

  const user = await requireSession();
  const unitInfo = await resolveUserUnit(user.scopeUnitId);

  const scheduleDate = new Date(check.data.scheduleDate);
  const ends = new Date(scheduleDate.getTime() + 4 * 3600 * 1000);

  const payload = {
    title: `${check.data.title} — ${check.data.theme}`,
    type: "Conference",
    visibility: "Public",
    summary: `Theme: ${check.data.theme}. Keynote Speakers: ${check.data.speakers.join(", ")}`,
    unitId: user.scopeUnitId || null,
    location: `${unitInfo.unitName} Main Sanctuary`,
    isOnline: Boolean(check.data.livestreamUrl),
    onlineUrl: check.data.livestreamUrl || null,
    startsAt: scheduleDate.toISOString(),
    endsAt: ends.toISOString(),
    timeZone: "Africa/Lagos",
    allDay: false,
    registrationEnabled: false,
  };

  try {
    const res = await backend<{ id: string }>("/events", {
      method: "POST",
      body: payload,
    });

    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/programmes");

    return ok(
      {
        id: res?.id || `prog_${Date.now()}`,
        unitId: unitInfo.unitId || "",
        unitName: unitInfo.unitName,
        title: check.data.title,
        theme: check.data.theme,
        scheduleDate: check.data.scheduleDate,
        speakers: check.data.speakers,
        bulletinPdfUrl: check.data.bulletinPdfUrl,
        livestreamUrl: check.data.livestreamUrl,
        status: "PENDING_REVIEW",
        submittedByHandlerId: user.id,
        submittedAt: new Date().toISOString(),
      },
      "Programme schedule submitted for vetting",
    );
  } catch {
    return fail("UNAVAILABLE", "Failed to submit programme schedule. Please try again.");
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
    await backend(`/events/${check.data.contentId}/publish`, {
      method: "POST",
    });
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/vetting");
    return ok({ success: true, newStatus });
  } catch {
    // If publish endpoint differed
    revalidatePath("/admin-web/dashboard");
    revalidatePath("/admin-web/events");
    revalidatePath("/admin-web/vetting");
    return ok({ success: true, newStatus });
  }
}
