/**
 * Placeholder data for the reference screens. Delete once the API is wired up.
 */
import type { SessionUser } from "@/types/auth";

export const demoUser: SessionUser = {
  id: "usr_01",
  name: "Adebayo Ogunleye",
  email: "a.ogunleye@esocs.org",
  role: "super_admin",
};

export type MemberStatus = "active" | "pending" | "inactive" | "suspended";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  parish: string;
  rank: string;
  status: MemberStatus;
  givingYtd: number;
  joinedAt: string;
  lastSeenAt: string;
}

const firstNames = [
  "Adaeze",
  "Babatunde",
  "Chiamaka",
  "Damilola",
  "Emeka",
  "Funmilayo",
  "Gbenga",
  "Halima",
  "Ifeoma",
  "Jide",
  "Kehinde",
  "Lola",
  "Mobolaji",
  "Nkechi",
  "Olumide",
  "Precious",
  "Remi",
  "Segun",
  "Temitope",
  "Uche",
  "Victoria",
  "Wale",
  "Yetunde",
  "Zainab",
];
const lastNames = [
  "Adeyemi",
  "Okafor",
  "Balogun",
  "Eze",
  "Ogunleye",
  "Nwosu",
  "Adebayo",
  "Okonkwo",
  "Afolabi",
  "Ibrahim",
  "Oyelaran",
  "Chukwu",
  "Bakare",
  "Olatunji",
];
const parishes = [
  "Mount Zion, Lagos",
  "Holy Trinity, Ibadan",
  "Seraph Temple, Abuja",
  "Cherub Cathedral, Kaduna",
  "Grace Parish, Port Harcourt",
  "Bethel, Abeokuta",
];
const ranks = ["Member", "Brother", "Sister", "Leader", "Elder", "Evangelist", "Prophet", "Apostle"];
const statuses: MemberStatus[] = ["active", "active", "active", "active", "pending", "inactive", "suspended"];

// Deterministic pseudo-random so server and client render the same rows.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function makeMembers(count = 86): Member[] {
  const rand = rng(42);
  const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const base = Date.UTC(2026, 8, 20);
  return Array.from({ length: count }, (_, i) => {
    const first = pick(firstNames);
    const last = pick(lastNames);
    return {
      id: `MBR-${String(1041 + i).padStart(5, "0")}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      phone: `+234 80${Math.floor(rand() * 10)} ${String(Math.floor(rand() * 1e7))
        .padStart(7, "0")
        .replace(/(\d{3})(\d{4})/, "$1 $2")}`,
      parish: pick(parishes),
      rank: pick(ranks),
      status: pick(statuses),
      givingYtd: Math.round((rand() * 1_800_000) / 500) * 500,
      joinedAt: new Date(base - Math.floor(rand() * 3650) * 86_400_000).toISOString(),
      lastSeenAt: new Date(base - Math.floor(rand() * 60) * 3_600_000 * 6).toISOString(),
    };
  });
}

export const members = makeMembers();

export const kpis = [
  {
    label: "Total members",
    value: 48_294,
    delta: 0.042,
    trend: [40, 42, 41, 44, 46, 45, 48, 50, 49, 53, 55, 58],
  },
  {
    label: "Giving this month",
    value: 18_450_000,
    delta: 0.118,
    currency: true,
    trend: [12, 14, 13, 15, 14, 16, 17, 15, 18, 19, 18, 21],
  },
  {
    label: "Weekly attendance",
    value: 31_870,
    delta: -0.021,
    trend: [33, 32, 34, 33, 32, 31, 33, 32, 31, 32, 31, 30],
  },
  {
    label: "Active parishes",
    value: 412,
    delta: 0.012,
    trend: [398, 399, 401, 402, 404, 405, 406, 407, 409, 410, 411, 412],
  },
] as const;

export const givingByMonth = [
  { month: "Oct", tithes: 11.2, offerings: 3.1 },
  { month: "Nov", tithes: 12.4, offerings: 3.5 },
  { month: "Dec", tithes: 16.8, offerings: 6.2 },
  { month: "Jan", tithes: 12.1, offerings: 3.0 },
  { month: "Feb", tithes: 12.9, offerings: 3.3 },
  { month: "Mar", tithes: 13.6, offerings: 3.9 },
  { month: "Apr", tithes: 15.2, offerings: 5.1 },
  { month: "May", tithes: 13.4, offerings: 3.6 },
  { month: "Jun", tithes: 13.9, offerings: 3.8 },
  { month: "Jul", tithes: 14.6, offerings: 4.0 },
  { month: "Aug", tithes: 14.1, offerings: 3.9 },
  { month: "Sep", tithes: 15.3, offerings: 4.4 },
];

export const activity = [
  {
    id: "a1",
    actor: "Chiamaka Eze",
    action: "approved 14 membership applications",
    target: "Mount Zion, Lagos",
    at: "2026-09-23T08:12:00Z",
    tone: "success" as const,
  },
  {
    id: "a2",
    actor: "Segun Balogun",
    action: "published sermon",
    target: "Walking in the Light",
    at: "2026-09-23T07:40:00Z",
    tone: "primary" as const,
  },
  {
    id: "a3",
    actor: "System",
    action: "flagged a failed payout to",
    target: "Grace Parish, Port Harcourt",
    at: "2026-09-23T06:05:00Z",
    tone: "danger" as const,
  },
  {
    id: "a4",
    actor: "Halima Ibrahim",
    action: "scheduled",
    target: "Annual Harvest Thanksgiving",
    at: "2026-09-22T18:30:00Z",
    tone: "info" as const,
  },
  {
    id: "a5",
    actor: "Olumide Afolabi",
    action: "updated role for",
    target: "Victoria Okonkwo",
    at: "2026-09-22T15:02:00Z",
    tone: "warning" as const,
  },
];

export const tasks = [
  {
    id: "t1",
    title: "Review membership applications",
    count: 12,
    href: "/members?status=pending",
    tone: "warning" as const,
  },
  { id: "t2", title: "Reconcile September remittances", count: 3, href: "/finance", tone: "danger" as const },
  { id: "t3", title: "Approve event announcements", count: 5, href: "/events", tone: "info" as const },
];
