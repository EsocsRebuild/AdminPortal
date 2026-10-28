import fs from "node:fs";
import path from "node:path";
import type { SupportTicket, TicketStatus, TicketMessage } from "./types";

const DB_PATH = path.join(process.cwd(), "src/features/support/support-db.json");

function loadTicketsFromDisk(): SupportTicket[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback if file read fails
  }
  return [];
}

function saveTicketsToDisk(tickets: SupportTicket[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tickets, null, 2), "utf-8");
  } catch {
    // Fallback if disk write fails
  }
}

export function getLocalTickets(): SupportTicket[] {
  return loadTicketsFromDisk();
}

export function getTicketById(id: string): SupportTicket | null {
  const tickets = loadTicketsFromDisk();
  return tickets.find((t) => t.id === id || t.ticketNumber === id) ?? null;
}

export function addLocalTicket(ticket: SupportTicket): void {
  const list = loadTicketsFromDisk();
  const existingIdx = list.findIndex((t) => t.id === ticket.id);
  if (existingIdx !== -1) {
    list[existingIdx] = ticket;
  } else {
    list.unshift(ticket);
  }
  saveTicketsToDisk(list);
}

export function addTicketMessage(ticketId: string, message: TicketMessage): boolean {
  const list = loadTicketsFromDisk();
  const target = list.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
  if (target) {
    target.messages.push(message);
    target.updatedAt = new Date().toISOString();
    saveTicketsToDisk(list);
    return true;
  }
  return false;
}

export function updateLocalTicketStatus(
  ticketId: string,
  status: TicketStatus,
  resolutionSummary?: string,
  assignedOfficerName?: string,
): boolean {
  const list = loadTicketsFromDisk();
  const target = list.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
    if (resolutionSummary) target.resolutionSummary = resolutionSummary;
    if (assignedOfficerName) target.assignedOfficerName = assignedOfficerName;
    saveTicketsToDisk(list);
    return true;
  }
  return false;
}

