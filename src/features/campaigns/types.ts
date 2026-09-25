import type { EmailDocument } from "@/features/email-builder/types";

export const campaignStatuses = ["draft", "scheduled", "sending", "sent", "paused", "cancelled", "failed"] as const;
export type CampaignStatus = (typeof campaignStatuses)[number];

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  paused: "Paused",
  cancelled: "Cancelled",
  failed: "Failed",
};

export interface CampaignStats {
  sent: number;
  delivered: number;
  bounces: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  unsubscribes: number;
  complaints: number;
}

export interface CampaignSummary {
  id: string;
  name: string;
  subject: string | null;
  status: CampaignStatus;
  recipientCount: number | null;
  scheduledAt: string | null;
  sentAt: string | null;
  stats: CampaignStats | null;
  updatedAt: string;
  createdBy: { id: string; name: string } | null;
}

export interface Campaign extends CampaignSummary {
  previewText: string | null;
  fromName: string | null;
  fromEmail: string | null;
  replyTo: string | null;
  audience: { listIds: string[] };
  content: EmailDocument;
}

export interface CampaignReport {
  stats: CampaignStats;
  /** Hourly buckets from the send time. */
  timeline: { at: string; opens: number; clicks: number }[];
  links: { url: string; clicks: number }[];
}

/** Verified addresses and organisation details the API allows campaigns to use. */
export interface SenderProfile {
  fromAddresses: { email: string; verified: boolean }[];
  defaultFromName: string | null;
  defaultReplyTo: string | null;
  organisationName: string;
  postalAddress: string | null;
}

export const openRate = (s: CampaignStats) => (s.delivered ? s.uniqueOpens / s.delivered : 0);
export const clickRate = (s: CampaignStats) => (s.delivered ? s.uniqueClicks / s.delivered : 0);
