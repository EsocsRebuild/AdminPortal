import type { SupportTicket, TicketStatus, TicketMessage } from "./types";

const inMemoryTickets: SupportTicket[] = [
  {
    id: "ticket-seed-1",
    ticketNumber: "ESOCS-CARE-2026-1001",
    title: "Member Welfare & Support",
    category: "GENERAL_ENQUIRY",
    priority: "STANDARD",
    status: "OPEN",
    complainantName: "Church Secretariat Desk",
    complainantEmail: "support@esocs.org",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "msg-seed-1",
        senderName: "Secretariat Desk",
        senderRole: "Support Officer",
        isStaff: true,
        message: "Support channel opened.",
        sentAt: new Date().toISOString(),
      },
    ],
  },
];

export function getLocalTickets(): SupportTicket[] {
  return inMemoryTickets;
}

export function getTicketById(id: string): SupportTicket | null {
  return inMemoryTickets.find((t) => t.id === id || t.ticketNumber === id) ?? null;
}

export function addLocalTicket(ticket: SupportTicket): void {
  const existingIdx = inMemoryTickets.findIndex((t) => t.id === ticket.id);
  if (existingIdx !== -1) {
    inMemoryTickets[existingIdx] = ticket;
  } else {
    inMemoryTickets.unshift(ticket);
  }
}

export function addTicketMessage(ticketId: string, message: TicketMessage): boolean {
  const ticket = inMemoryTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
  if (!ticket) return false;
  if (!ticket.messages) ticket.messages = [];
  ticket.messages.push(message);
  ticket.updatedAt = message.sentAt;
  return true;
}

export function updateLocalTicketStatus(
  ticketId: string,
  status: TicketStatus,
  resolutionSummary?: string,
  assignedOfficerName?: string,
): boolean {
  const ticket = inMemoryTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
  if (!ticket) return false;
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  if (resolutionSummary) ticket.resolutionSummary = resolutionSummary;
  if (assignedOfficerName) ticket.assignedOfficerName = assignedOfficerName;
  return true;
}
