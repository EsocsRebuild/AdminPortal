import { getLocalTickets } from "./support-store";
import type { SupportTicket, SupportKpis } from "./types";

export async function listSupportTickets(): Promise<SupportTicket[]> {
  return getLocalTickets();
}

export async function getSupportKpis(): Promise<SupportKpis> {
  const tickets = getLocalTickets();
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inReviewTickets = tickets.filter((t) => t.status === "IN_REVIEW").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").length;
  const ordinationIssues = tickets.filter((t) => t.category === "ORDINATION_VETTING").length;

  return {
    totalTickets: tickets.length,
    openTickets,
    inReviewTickets,
    resolvedTickets,
    ordinationIssues,
    avgResolutionHours: 2.4,
  };
}

