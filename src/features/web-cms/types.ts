export type ContentStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED_LIVE" | "NEEDS_REVISION";

export type EventCategory =
  "REVIVAL" | "SUNDAY_SERVICE" | "FELLOWSHIP_RALLY" | "CONFERENCE" | "SPECIAL_PROGRAMME";

export interface WebEvent {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  venue: string;
  bannerUrl?: string;
  registrationOpen: boolean;
  ticketCapacity?: number;
  status: ContentStatus;
  reviewNotes?: string;
  submittedByHandlerId: string;
  submittedAt: string;
  vettedAt?: string;
  vettedByHandlerId?: string;
}

export interface WebProgramme {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  theme: string;
  scheduleDate: string;
  speakers: string[];
  bulletinPdfUrl?: string;
  livestreamUrl?: string;
  status: ContentStatus;
  reviewNotes?: string;
  submittedByHandlerId: string;
  submittedAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  cdnUrl: string;
  uploadedAt: string;
  uploadedByHandlerId: string;
}

export interface VettingSummary {
  pendingEventsCount: number;
  pendingProgrammesCount: number;
  approvedCount: number;
  revisionRequestedCount: number;
}
