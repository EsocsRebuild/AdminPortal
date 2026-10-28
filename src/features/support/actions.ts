"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, ok, fail } from "@/lib/result";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";
import {
  lodgeTicketSchema,
  replyTicketSchema,
  updateTicketStatusSchema,
  type LodgeTicketInput,
  type ReplyTicketInput,
  type UpdateTicketStatusInput,
} from "./schemas";
import {
  addLocalTicket,
  addTicketMessage,
  updateLocalTicketStatus,
} from "./support-store";
import type { SupportTicket, TicketMessage } from "./types";

export async function lodgeSupportTicketAction(
  input: LodgeTicketInput,
): Promise<ActionResult<SupportTicket>> {
  const check = lodgeTicketSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please provide a subject, message, and your contact details");
  }

  const user = await requireSession().catch(() => null);
  const unitInfo = await resolveUserUnit(user?.scopeUnitId).catch(() => null);

  const ticketNumber = `ESOCS-CARE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const firstMessage: TicketMessage = {
    id: `msg_${Date.now()}`,
    senderName: check.data.complainantName,
    senderRole: user?.role?.name || "Church Administrator",
    isStaff: false,
    message: check.data.message,
    sentAt: now,
  };

  const newTicket: SupportTicket = {
    id: `tkt_${Date.now()}`,
    ticketNumber,
    title: check.data.title,
    category: check.data.category,
    priority: check.data.priority,
    status: "OPEN",
    complainantName: check.data.complainantName,
    complainantEmail: check.data.complainantEmail,
    complainantPhone: check.data.complainantPhone,
    parishName: check.data.parishName || unitInfo?.unitName || "Central Parish",
    districtName: check.data.districtName || "General Administrative District",
    provinceName: check.data.provinceName || "National Jurisdiction",
    candidateReferenceId: check.data.candidateReferenceId,
    createdAt: now,
    updatedAt: now,
    assignedOfficerName: "Central Secretariat Member Care Desk",
    messages: [firstMessage],
  };

  addLocalTicket(newTicket);

  revalidatePath("/crm");
  revalidatePath("/dashboard");
  revalidatePath("/ordination");

  return ok(newTicket, `Support ticket ${ticketNumber} opened successfully. Our Secretariat Care Desk is attending to your request.`);
}

export async function replySupportTicketAction(
  input: ReplyTicketInput,
): Promise<ActionResult<TicketMessage>> {
  const check = replyTicketSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please type a message before sending your reply");
  }

  const user = await requireSession().catch(() => null);
  const now = new Date().toISOString();

  const newMessage: TicketMessage = {
    id: `msg_${Date.now()}`,
    senderName: user?.name || "Secretariat Support Officer",
    senderRole: user?.role?.name || (check.data.isStaff ? "Secretariat Care Desk" : "Church Member"),
    isStaff: check.data.isStaff,
    message: check.data.message,
    sentAt: now,
  };

  const okAdd = addTicketMessage(check.data.ticketId, newMessage);
  if (!okAdd) {
    return fail("NOT_FOUND", "Unable to locate the specified support ticket");
  }

  if (check.data.newStatus) {
    updateLocalTicketStatus(check.data.ticketId, check.data.newStatus);
  }

  revalidatePath("/crm");
  return ok(newMessage, "Message delivered to ticket thread");
}

export async function updateTicketStatusAction(
  input: UpdateTicketStatusInput,
): Promise<ActionResult<{ success: boolean }>> {
  const check = updateTicketStatusSchema.safeParse(input);
  if (!check.success) {
    return fail("VALIDATION", "Please provide a valid ticket status");
  }

  const user = await requireSession().catch(() => null);
  const officerName = check.data.assignedOfficerName || user?.name || "Secretariat Officer";

  const success = updateLocalTicketStatus(
    check.data.ticketId,
    check.data.status,
    check.data.resolutionSummary,
    officerName,
  );

  if (!success) {
    return fail("NOT_FOUND", "Unable to locate the specified support ticket");
  }

  revalidatePath("/crm");
  return ok({ success: true }, `Ticket status updated to ${check.data.status}`);
}
