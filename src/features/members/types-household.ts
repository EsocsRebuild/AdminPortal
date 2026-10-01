export type HouseholdRole = "head" | "spouse" | "child" | "dependent" | "other";

export interface HouseholdMember {
  id: string;
  name: string;
  memberCode: string;
  role: HouseholdRole;
  avatarUrl?: string | null;
}

export interface Household {
  id: string;
  familyName: string;
  headMemberId: string;
  unitId: string;
  address: string | null;
  members: HouseholdMember[];
}
