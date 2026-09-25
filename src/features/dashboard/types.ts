/** `GET /dashboard/summary`. Sections the user can't see come back as null. */
export interface DashboardSummary {
  members: { total: number; newThisMonth: number; delta: number | null; trend: number[] } | null;
  audience: { subscribers: number; delta: number | null; trend: number[] } | null;
  campaigns: { sentLast30Days: number; averageOpenRate: number | null } | null;
  forms: { responsesLast30Days: number; liveForms: number } | null;
  pending: { accessRequests: number; memberApprovals: number; scheduledCampaigns: number };
  setup: { domainVerified: boolean; hasAudience: boolean; hasForm: boolean; postalAddressSet: boolean };
}
