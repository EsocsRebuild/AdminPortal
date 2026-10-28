export type TicketCategory =
  | "ORDINATION_VETTING"
  | "PARISH_MEMBERSHIP"
  | "FINANCIAL_STEWARDSHIP"
  | "MEDIA_AND_WEB"
  | "ACCOUNT_ACCESS"
  | "GENERAL_ENQUIRY";

export type TicketPriority = "STANDARD" | "HIGH" | "URGENT";

export type TicketStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "ESCALATED";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: string;
  isStaff: boolean;
  message: string;
  sentAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. "ESOCS-CARE-2026-1042"
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  complainantName: string;
  complainantEmail: string;
  complainantPhone?: string;
  parishName?: string;
  districtName?: string;
  provinceName?: string;
  candidateReferenceId?: string;
  createdAt: string;
  updatedAt: string;
  assignedOfficerName?: string;
  resolutionSummary?: string;
  messages: TicketMessage[];
}

export interface SupportKpis {
  totalTickets: number;
  openTickets: number;
  inReviewTickets: number;
  resolvedTickets: number;
  ordinationIssues: number;
  avgResolutionHours: number;
}

