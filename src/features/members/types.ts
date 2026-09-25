export const memberStatuses = ["active", "pending", "inactive", "suspended"] as const;
export type MemberStatus = (typeof memberStatuses)[number];

export const genders = ["female", "male"] as const;

export interface MemberSummary {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  parish: { id: string; name: string } | null;
  rank: string | null;
  status: MemberStatus;
  /** Has agreed to receive email updates. Required before adding to any audience. */
  emailConsent: boolean;
  joinedAt: string;
}

export interface Member extends MemberSummary {
  gender: (typeof genders)[number] | null;
  dateOfBirth: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string } | null;
}

export const statusLabels: Record<MemberStatus, string> = {
  active: "Active",
  pending: "Awaiting approval",
  inactive: "Inactive",
  suspended: "Suspended",
};
