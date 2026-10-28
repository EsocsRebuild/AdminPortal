import { describe, it, expect } from "vitest";
import { lodgeTicketSchema } from "./schemas";
import {
  getLocalTickets,
  addTicketMessage,
  updateLocalTicketStatus,
} from "./support-store";
import type { TicketCategory, TicketMessage } from "./types";

describe("Support & Member Care CRM", () => {
  it("validates ticket lodging schema with clean messages", () => {
    const valid = lodgeTicketSchema.safeParse({
      title: "Discrepancy in ordination recommendation rank",
      category: "ORDINATION_VETTING",
      priority: "HIGH",
      message: "Candidate has served 12 years and was recommended for Apostle.",
      complainantName: "Elder John",
      complainantEmail: "john@esocs.org",
      candidateReferenceId: "ESOCS/ORD/2026/1234",
    });
    expect(valid.success).toBe(true);

    const invalid = lodgeTicketSchema.safeParse({
      title: "Hi",
      category: "INVALID" as unknown as TicketCategory,
      message: "Short",
      complainantName: "",
      complainantEmail: "not-an-email",
    });
    expect(invalid.success).toBe(false);
  });

  it("stores and retrieves canonical support tickets", () => {
    const tickets = getLocalTickets();
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);

    const first = tickets[0];
    expect(first.ticketNumber).toBeDefined();
    expect(first.messages.length).toBeGreaterThan(0);
  });

  it("appends messages to an existing ticket thread", () => {
    const tickets = getLocalTickets();
    const testTicket = tickets[0];

    const newMsg: TicketMessage = {
      id: `test_msg_${Date.now()}`,
      senderName: "Pastor Test",
      senderRole: "Secretariat Desk",
      isStaff: true,
      message: "Your inquiry is being evaluated by the Synod Council.",
      sentAt: new Date().toISOString(),
    };

    const added = addTicketMessage(testTicket.id, newMsg);
    expect(added).toBe(true);

    const refreshed = getLocalTickets().find((t) => t.id === testTicket.id);
    expect(refreshed?.messages.some((m) => m.id === newMsg.id)).toBe(true);
  });

  it("updates ticket status to IN_REVIEW or RESOLVED", () => {
    const tickets = getLocalTickets();
    const testTicket = tickets[0];

    const updated = updateLocalTicketStatus(
      testTicket.id,
      "IN_REVIEW",
      "Under active examination by Secretary General",
    );
    expect(updated).toBe(true);

    const refreshed = getLocalTickets().find((t) => t.id === testTicket.id);
    expect(refreshed?.status).toBe("IN_REVIEW");
    expect(refreshed?.resolutionSummary).toContain("Secretary General");
  });
});
