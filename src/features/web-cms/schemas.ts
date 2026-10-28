import { z } from "zod";

export const eventInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  description: z
    .string()
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  category: z.enum(["REVIVAL", "SUNDAY_SERVICE", "FELLOWSHIP_RALLY", "CONFERENCE", "SPECIAL_PROGRAMME"]),
  startDate: z.string().min(1, "Start date & time is required"),
  endDate: z.string().optional(),
  venue: z.string().min(2, "Venue location is required"),
  bannerUrl: z.string().url("Invalid banner image URL").optional().or(z.literal("")),
  registrationOpen: z.boolean().default(false),
  ticketCapacity: z.number().int().positive("Capacity must be positive").optional(),
  publishDirectly: z.boolean().optional(),
});

export const programmeInputSchema = z.object({
  title: z.string().min(3, "Programme title must be at least 3 characters"),
  theme: z.string().min(3, "Theme is required"),
  scheduleDate: z.string().min(1, "Schedule date is required"),
  speakers: z.array(z.string()).min(1, "Provide at least one keynote speaker"),
  bulletinPdfUrl: z.string().url("Invalid PDF URL").optional().or(z.literal("")),
  livestreamUrl: z.string().url("Invalid stream URL").optional().or(z.literal("")),
});

export const vettingDecisionSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum(["EVENT", "PROGRAMME"]),
  action: z.enum(["APPROVE", "REJECT_REVISION"]),
  reviewNotes: z.string().optional(),
});

export const bulletinInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  category: z.string().min(2, "Category is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500, "Summary is too long"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  ctaText: z.string().min(2, "Call-to-action text is required"),
  ctaLink: z.string().min(1, "Target link is required"),
  isUrgent: z.boolean().default(false),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type ProgrammeInput = z.infer<typeof programmeInputSchema>;
export type VettingDecisionInput = z.infer<typeof vettingDecisionSchema>;
export type BulletinInput = z.infer<typeof bulletinInputSchema>;
