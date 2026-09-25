export interface AudienceList {
  id: string;
  name: string;
  description: string | null;
  subscriberCount: number;
  unsubscribedCount: number;
  /** New sign-ups must confirm by email before they're subscribed. */
  doubleOptIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export const contactStatuses = ["subscribed", "pending", "unsubscribed", "bounced", "complained"] as const;
export type ContactStatus = (typeof contactStatuses)[number];

export const contactStatusLabels: Record<ContactStatus, string> = {
  subscribed: "Subscribed",
  pending: "Awaiting confirmation",
  unsubscribed: "Unsubscribed",
  bounced: "Bounced",
  complained: "Marked as spam",
};

export interface Contact {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: ContactStatus;
  source: "import" | "form" | "member" | "manual" | "api";
  memberId: string | null;
  subscribedAt: string | null;
  createdAt: string;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  invalid: number;
}
