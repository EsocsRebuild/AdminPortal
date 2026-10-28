import { z } from "zod";

export const lodgeTicketSchema = z.object({
  title: z.string().min(5, "Please provide a subject of at least 5 characters"),
  category: z.enum([
    "ORDINATION_VETTING",
    "PARISH_MEMBERSHIP",
    "FINANCIAL_STEWARDSHIP",
    "MEDIA_AND_WEB",
    "ACCOUNT_ACCESS",
    "GENERAL_ENQUIRY",
  ]),
  priority: z.enum(["STANDARD", "HIGH", "URGENT"]).default("STANDARD"),
  message: z.string().min(10, "Please provide detailed information (at least 10 characters)"),
  complainantName: z.string().min(2, "Please provide your full name"),
  complainantEmail: z.string().email("Please provide a valid email address"),
  complainantPhone: z.string().optional(),
  parishName: z.string().optional(),
  districtName: z.string().optional(),
  provinceName: z.string().optional(),
  candidateReferenceId: z.string().optional(),
});

export type LodgeTicketInput = z.infer<typeof lodgeTicketSchema>;

export const replyTicketSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  message: z.string().min(2, "Message cannot be empty"),
  isStaff: z.boolean().default(true),
  newStatus: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "ESCALATED"]).optional(),
});

export type ReplyTicketInput = z.infer<typeof replyTicketSchema>;

export const updateTicketStatusSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "ESCALATED"]),
  resolutionSummary: z.string().optional(),
  assignedOfficerName: z.string().optional(),
});

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;

