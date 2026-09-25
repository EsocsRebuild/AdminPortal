export interface Profile {
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  ip: string | null;
  location: string | null;
  lastActiveAt: string;
  createdAt: string;
  current: boolean;
}

export interface SecurityOverview {
  mfaEnabled: boolean;
  recoveryCodesRemaining: number;
  passwordChangedAt: string | null;
  sessions: ActiveSession[];
}

export interface NotificationPrefs {
  accessRequests: boolean;
  formResponses: boolean;
  campaignReports: boolean;
  weeklySummary: boolean;
}
