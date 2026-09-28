#!/usr/bin/env node
/**
 * ESOCS Admin: MOCK API for local preview.
 *
 * A stand-in for the real backend that follows docs/api-contract.md, so the
 * portal can be explored before the backend exists. In-memory only: every
 * restart resets the data. Never deploy this; it is excluded from the Docker
 * image and has no real security.
 *
 *   npm run mock-api            # http://localhost:4010/v1
 *
 * Sign in with:  admin@esocs.test  /  Preview-Password-2026
 * Two-step demo: mfa@esocs.test    /  Preview-Password-2026   (code 123456)
 */
import { randomUUID } from "node:crypto";
import http from "node:http";

const PORT = Number(process.env.MOCK_API_PORT ?? 4010);
const PASSWORD = "Preview-Password-2026";
const MFA_CODE = "123456";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const now = () => new Date().toISOString();
const ago = (hours) => new Date(Date.now() - hours * 3600e3).toISOString();
const id = (p) => `${p}_${randomUUID().slice(0, 8)}`;
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (a) => a[Math.floor(rand() * a.length)];

const ALL = [
  "dashboard:view",
  "members:view",
  "members:manage",
  "members:export",
  "campaigns:view",
  "campaigns:manage",
  "campaigns:send",
  "audiences:view",
  "audiences:manage",
  "templates:manage",
  "forms:view",
  "forms:manage",
  "users:view",
  "users:manage",
  "roles:manage",
  "audit:view",
  "settings:manage",
];

// ─── Data ────────────────────────────────────────────────────────────────────
const db = {
  me: {
    id: "usr_owner",
    name: "Preview Administrator",
    email: "admin@esocs.test",
    avatarUrl: null,
    role: { id: "owner", name: "Owner" },
    permissions: ALL,
    mfaEnabled: false,
    parishId: null,
    phone: null,
  },
  parishes: [
    { id: "par_1", name: "Mount Zion, Lagos" },
    { id: "par_2", name: "Holy Trinity, Ibadan" },
    { id: "par_3", name: "Seraph Temple, Abuja" },
    { id: "par_4", name: "Grace Parish, Port Harcourt" },
  ],
  roles: [
    {
      id: "owner",
      name: "Owner",
      description: "Full access. Can’t be changed.",
      permissions: ALL,
      system: true,
      locked: true,
    },
    {
      id: "admin",
      name: "Administrator",
      description: "Runs day-to-day administration.",
      permissions: ALL.filter((p) => p !== "roles:manage"),
      system: true,
      locked: false,
    },
    {
      id: "comms",
      name: "Communications",
      description: "Prepares and sends emails, builds forms.",
      permissions: [
        "dashboard:view",
        "campaigns:view",
        "campaigns:manage",
        "campaigns:send",
        "audiences:view",
        "audiences:manage",
        "templates:manage",
        "forms:view",
        "forms:manage",
      ],
      system: false,
      locked: false,
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Can look but not change anything.",
      permissions: ["dashboard:view", "members:view", "campaigns:view", "audiences:view", "forms:view"],
      system: true,
      locked: false,
    },
  ],
  members: [],
  audiences: [],
  contacts: {},
  templates: [],
  campaigns: [],
  forms: [],
  responses: {},
  admins: [],
  requests: [],
  audit: [],
  notifications: [],
  domains: [],
  sending: {
    organisationName: "Eternal Sacred Order of Cherubim & Seraphim",
    postalAddress: null,
    defaultFromName: "ESOCS",
    defaultFromEmail: null,
    defaultReplyTo: null,
  },
  prefs: { accessRequests: true, formResponses: true, campaignReports: true, weeklySummary: false },
  sessions: [],
  pendingMfa: new Map(),
};

const first = [
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
  "Segun",
  "Temitope",
  "Uche",
  "Yetunde",
  "Zainab",
];
const last = [
  "Okafor",
  "Balogun",
  "Eze",
  "Nwosu",
  "Adebayo",
  "Afolabi",
  "Ibrahim",
  "Bakare",
  "Okonkwo",
  "Olatunji",
];
for (let i = 0; i < 64; i++) {
  const f = pick(first),
    l = pick(last);
  db.members.push({
    id: `mem_${1000 + i}`,
    memberNumber: `MBR-${10400 + i}`,
    firstName: f,
    lastName: l,
    email: `${f}.${l}${i}@example.org`.toLowerCase(),
    phone: `+234 80${Math.floor(rand() * 9)} 555 ${String(1000 + i).slice(-4)}`,
    avatarUrl: null,
    parish: pick(db.parishes),
    rank: pick(["Member", "Brother", "Sister", "Leader", "Elder", "Evangelist"]),
    status: pick(["active", "active", "active", "active", "pending", "inactive"]),
    emailConsent: rand() > 0.3,
    joinedAt: ago(24 * Math.floor(rand() * 2000)),
    gender: pick(["female", "male"]),
    dateOfBirth: null,
    address: null,
    notes: null,
    createdAt: ago(24 * 400),
    updatedAt: ago(Math.floor(rand() * 500)),
    createdBy: { id: db.me.id, name: db.me.name },
  });
}

const doc = (heading, body) => ({
  version: 1,
  settings: { accentColor: "#2f4fb4", background: "muted" },
  blocks: [
    { id: "blk-h1a2", type: "heading", text: heading, align: "left" },
    { id: "blk-t3b4", type: "text", text: `Dear {{first_name}},\n\n${body}`, align: "left" },
    {
      id: "blk-b5c6",
      type: "button",
      label: "Find out more",
      url: "https://example.org",
      align: "left",
      style: "filled",
    },
  ],
});

db.audiences.push(
  {
    id: "aud_news",
    name: "Church newsletter",
    description: "Weekly updates for the whole congregation",
    doubleOptIn: true,
    createdAt: ago(3000),
    updatedAt: ago(20),
  },
  {
    id: "aud_youth",
    name: "Youth fellowship",
    description: "Events and news for under-30s",
    doubleOptIn: true,
    createdAt: ago(900),
    updatedAt: ago(48),
  },
);
for (const a of db.audiences) {
  db.contacts[a.id] = db.members
    .filter((m) => m.emailConsent)
    .slice(0, a.id === "aud_news" ? 40 : 14)
    .map((m, i) => ({
      id: id("con"),
      email: m.email,
      firstName: m.firstName,
      lastName: m.lastName,
      status: i % 9 === 8 ? "unsubscribed" : i % 13 === 12 ? "bounced" : "subscribed",
      source: pick(["member", "import", "form"]),
      memberId: m.id,
      subscribedAt: ago(i * 30),
      createdAt: ago(i * 30),
    }));
}

db.templates.push({
  id: "tpl_news",
  name: "Monthly newsletter",
  description: null,
  updatedAt: ago(72),
  updatedBy: { id: db.me.id, name: db.me.name },
  content: doc("This month at church", "Here’s what’s coming up."),
});

const stats = (n) => ({
  sent: n,
  delivered: n - 4,
  bounces: 4,
  opens: Math.round(n * 0.7),
  uniqueOpens: Math.round(n * 0.48),
  clicks: Math.round(n * 0.14),
  uniqueClicks: Math.round(n * 0.1),
  unsubscribes: 2,
  complaints: 0,
});
const baseCampaign = {
  previewText: null,
  fromName: "ESOCS",
  fromEmail: null,
  replyTo: null,
  audience: { listIds: ["aud_news"] },
  createdBy: { id: db.me.id, name: db.me.name },
};
db.campaigns.push(
  {
    ...baseCampaign,
    id: "cmp_harvest",
    name: "Harvest Thanksgiving invitation",
    subject: "You’re invited: Harvest Thanksgiving this Sunday",
    status: "sent",
    recipientCount: 36,
    scheduledAt: null,
    sentAt: ago(30),
    stats: stats(36),
    updatedAt: ago(30),
    content: doc("Harvest Thanksgiving is here", "Join us this **Sunday at 9am** for a joyful service."),
  },
  {
    ...baseCampaign,
    id: "cmp_draft",
    name: "Youth camp reminder",
    subject: null,
    status: "draft",
    recipientCount: null,
    scheduledAt: null,
    sentAt: null,
    stats: null,
    updatedAt: ago(2),
    audience: { listIds: ["aud_youth"] },
    content: doc("Youth camp is coming", "Registration closes soon."),
  },
);

const campFields = [
  {
    id: "fullname",
    type: "short_text",
    label: "Full name",
    description: null,
    placeholder: null,
    required: true,
    options: null,
    validation: null,
  },
  {
    id: "emailaddr",
    type: "email",
    label: "Email address",
    description: "We’ll send your confirmation here.",
    placeholder: null,
    required: true,
    options: null,
    validation: null,
  },
  {
    id: "session",
    type: "radio",
    label: "Which session will you attend?",
    description: null,
    placeholder: null,
    required: true,
    options: [
      { id: "morning", label: "Morning (9am)" },
      { id: "evening", label: "Evening (5pm)" },
    ],
    validation: null,
  },
  {
    id: "consent",
    type: "consent",
    label: "I’m happy to receive emails from the church",
    description: null,
    placeholder: null,
    required: false,
    options: null,
    validation: null,
  },
];
db.forms.push({
  id: "frm_camp",
  title: "Youth camp registration",
  slug: "youth-camp",
  status: "published",
  updatedAt: ago(5),
  publishedAt: ago(100),
  description: "Register for our annual youth camp. Places are limited.",
  fields: campFields,
  settings: {
    submitLabel: "Register",
    confirmationTitle: "You’re registered!",
    confirmationMessage: "We’ll email you the details soon.",
    redirectUrl: null,
    closesAt: null,
    responseLimit: 120,
    notifyEmails: [],
    audienceId: "aud_youth",
  },
});
db.responses.frm_camp = Array.from({ length: 18 }, (_, i) => ({
  id: id("rsp"),
  submittedAt: ago(i * 9),
  answers: {
    fullname: `${pick(first)} ${pick(last)}`,
    emailaddr: `guest${i}@example.org`,
    session: pick(["morning", "evening"]),
    consent: rand() > 0.4,
  },
}));

db.admins.push(
  {
    id: db.me.id,
    name: db.me.name,
    email: db.me.email,
    avatarUrl: null,
    role: { id: "owner", name: "Owner" },
    status: "active",
    mfaEnabled: false,
    lastActiveAt: now(),
    createdAt: ago(5000),
  },
  {
    id: "usr_2",
    name: "Chiamaka Eze",
    email: "chiamaka.eze@example.org",
    avatarUrl: null,
    role: { id: "admin", name: "Administrator" },
    status: "active",
    mfaEnabled: true,
    lastActiveAt: ago(3),
    createdAt: ago(3000),
  },
  {
    id: "usr_3",
    name: "Segun Balogun",
    email: "segun.balogun@example.org",
    avatarUrl: null,
    role: { id: "comms", name: "Communications" },
    status: "active",
    mfaEnabled: false,
    lastActiveAt: ago(26),
    createdAt: ago(1000),
  },
  {
    id: "usr_4",
    name: "Halima Ibrahim",
    email: "halima.ibrahim@example.org",
    avatarUrl: null,
    role: { id: "comms", name: "Communications" },
    status: "invited",
    mfaEnabled: false,
    lastActiveAt: null,
    createdAt: ago(20),
  },
);
db.requests.push(
  {
    id: "req_1",
    name: "Ifeoma Nwosu",
    email: "ifeoma.nwosu@example.org",
    phone: "+234 809 555 0142",
    parish: db.parishes[1],
    requestedRole: { id: "comms", name: "Communications" },
    emailVerified: true,
    createdAt: ago(6),
  },
  {
    id: "req_2",
    name: "Jide Bakare",
    email: "jide.bakare@example.org",
    phone: null,
    parish: db.parishes[0],
    requestedRole: { id: "viewer", name: "Viewer" },
    emailVerified: false,
    createdAt: ago(30),
  },
);
db.domains.push({
  id: "dom_1",
  domain: "esocs.test",
  status: "pending",
  lastCheckedAt: ago(1),
  records: [
    {
      purpose: "SPF: authorises our mail servers",
      type: "TXT",
      host: "esocs.test",
      value: "v=spf1 include:mail.example-mailer.net ~all",
      status: "verified",
    },
    {
      purpose: "DKIM: signs your emails",
      type: "CNAME",
      host: "esocs._domainkey.esocs.test",
      value: "esocs.dkim.example-mailer.net",
      status: "pending",
    },
    {
      purpose: "DMARC: tells inboxes what to do",
      type: "TXT",
      host: "_dmarc.esocs.test",
      value: "v=DMARC1; p=quarantine",
      status: "pending",
    },
  ],
});
db.notifications.push(
  {
    id: id("ntf"),
    title: "2 people requested an account",
    body: null,
    href: "/users/requests",
    tone: "warning",
    read: false,
    createdAt: ago(1),
  },
  {
    id: id("ntf"),
    title: "“Harvest Thanksgiving invitation” was sent",
    body: "36 recipients",
    href: "/campaigns/cmp_harvest",
    tone: "success",
    read: true,
    createdAt: ago(30),
  },
);

function audit(action, summary, severity = "info", changes = null) {
  db.audit.unshift({
    id: id("evt"),
    action,
    summary,
    severity,
    actor: { id: db.me.id, name: db.me.name, email: db.me.email },
    target: null,
    ip: "127.0.0.1",
    userAgent: "Mock browser",
    changes,
    createdAt: now(),
  });
}
audit("auth.login", "Signed in");
audit("member.updated", "Updated member details", "info", {
  phone: { from: "+234 803 555 0100", to: "+234 803 555 0199" },
});
audit("auth.login_failed", "Failed sign-in attempt", "warning");

// ─── HTTP plumbing ───────────────────────────────────────────────────────────
class Fail extends Error {
  constructor(status, code, message, fields) {
    super(message);
    Object.assign(this, { status, code, fields });
  }
}
const notFound = () => {
  throw new Fail(404, "NOT_FOUND", "We couldn’t find that.");
};
const find = (arr, key) => arr.find((x) => x.id === key) ?? notFound();

function page(items, q) {
  let list = [...items];
  const term = q.get("q")?.toLowerCase();
  if (term) list = list.filter((x) => JSON.stringify(x).toLowerCase().includes(term));
  for (const f of ["status", "severity", "parishId", "roleId"]) {
    const v = q.get(f);
    if (v)
      list = list.filter((x) => (f === "parishId" ? x.parish?.id : f === "roleId" ? x.role?.id : x[f]) === v);
  }
  const sort = q.get("sort"),
    dir = q.get("dir") === "asc" ? 1 : -1;
  if (sort) list.sort((a, b) => (String(a[sort] ?? "") > String(b[sort] ?? "") ? dir : -dir));
  const p = Math.max(1, Number(q.get("page")) || 1),
    size = Number(q.get("pageSize")) || 20;
  return {
    data: list.slice((p - 1) * size, p * size),
    meta: { page: p, pageSize: size, total: list.length },
  };
}

const tokens = () => ({
  accessToken: `mock-${randomUUID()}`,
  expiresIn: 3600,
  refreshToken: `mock-r-${randomUUID()}`,
  refreshExpiresIn: 7 * 86400,
});
const audienceView = (a) => {
  const c = db.contacts[a.id] ?? [];
  return {
    ...a,
    subscriberCount: c.filter((x) => x.status === "subscribed").length,
    unsubscribedCount: c.filter((x) => x.status !== "subscribed").length,
  };
};
const formView = (f) => ({ ...f, responseCount: (db.responses[f.id] ?? []).length });
const roleView = (r) => ({ ...r, userCount: db.admins.filter((a) => a.role.id === r.id).length });
const csv = (rows) =>
  rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

// ─── Routes: [method, pattern, handler(body, query, params) → data | {data, meta} | Response-like] ─
const R = [];
const route = (m, p, h) => R.push([m, new RegExp(`^${p.replace(/:(\w+)/g, "(?<$1>[^/]+)")}$`), h]);
const ok = (data) => ({ data });

// Auth
route("POST", "/auth/login", (b) => {
  if (b.password !== PASSWORD || !/@/.test(b.email ?? ""))
    throw new Fail(401, "UNAUTHENTICATED", "That email and password don’t match.");
  if (b.email.toLowerCase().startsWith("mfa@")) {
    const challengeToken = randomUUID();
    db.pendingMfa.set(challengeToken, true);
    return ok({ status: "mfa_required", challengeToken, expiresIn: 300 });
  }
  audit("auth.login", "Signed in");
  return ok({ status: "authenticated", tokens: tokens() });
});
route("POST", "/auth/mfa/verify", (b) => {
  if (!db.pendingMfa.has(b.challengeToken))
    throw new Fail(401, "UNAUTHENTICATED", "That sign-in attempt expired. Please start again.");
  if (b.code !== MFA_CODE && !(b.method === "recovery" && b.code.length >= 8))
    throw new Fail(422, "VALIDATION", `Wrong code. In preview mode the code is ${MFA_CODE}.`);
  db.pendingMfa.delete(b.challengeToken);
  return ok(tokens());
});
route("POST", "/auth/refresh", () => ok(tokens()));
route("POST", "/auth/logout", () => null);
route("GET", "/auth/me", () => ok(db.me));
route("POST", "/auth/session/touch", () => null);
route("POST", "/auth/reauthenticate", (b) => {
  if (b.password !== PASSWORD)
    throw new Fail(422, "VALIDATION", "That password isn’t right.", {
      password: ["That password isn’t right."],
    });
  return ok({ sudoToken: randomUUID(), expiresIn: 600 });
});
route("POST", "/auth/signup", (b) => {
  db.requests.unshift({
    id: id("req"),
    name: b.name,
    email: b.email,
    phone: b.phone,
    parish: db.parishes.find((p) => p.id === b.parishId) ?? null,
    requestedRole: roleView(find(db.roles, b.requestedRoleId)),
    emailVerified: false,
    createdAt: now(),
  });
  return null;
});
route("POST", "/auth/verify-email", (b) => {
  if (b.code === "000000") throw new Fail(422, "VALIDATION", "That code didn’t work.");
  const r = db.requests.find((x) => x.email === b.email);
  if (r) r.emailVerified = true;
  return null;
});
route("POST", "/auth/verify-email/resend", () => null);
route("POST", "/auth/password/forgot", () => null);
route("POST", "/auth/password/reset", () => null);
route("GET", "/public/parishes", () => ok(db.parishes));
route("GET", "/public/requestable-roles", () =>
  ok([
    {
      id: "admin",
      name: "Parish administrator",
      description: "Manage members and events for a parish.",
      icon: "church",
    },
    { id: "comms", name: "Communications", description: "Send emails and build forms.", icon: "editor" },
    {
      id: "viewer",
      name: "Just looking",
      description: "View information without making changes.",
      icon: "viewer",
    },
  ]),
);
route("GET", "/public/invitations/:token", () =>
  ok({
    email: "new.admin@example.org",
    name: null,
    roleName: "Communications",
    invitedBy: db.me.name,
    expiresAt: ago(-72),
  }),
);
route("POST", "/public/invitations/:token/accept", () => null);

// Account
route("GET", "/me/profile", () =>
  ok({ name: db.me.name, email: db.me.email, phone: db.me.phone, avatarUrl: null }),
);
route("PATCH", "/me/profile", (b) => {
  Object.assign(db.me, b);
  db.admins[0].name = db.me.name;
  audit("account.updated", "Updated their profile");
  return null;
});
route("POST", "/me/password", (b) => {
  if (b.currentPassword !== PASSWORD)
    throw new Fail(422, "VALIDATION", "Your current password isn’t right.", {
      current: ["Your current password isn’t right."],
    });
  audit("account.password_changed", "Changed their password", "warning");
  return null;
});
route("GET", "/me/security", () =>
  ok({
    mfaEnabled: db.me.mfaEnabled,
    recoveryCodesRemaining: db.me.mfaEnabled ? 10 : 0,
    passwordChangedAt: ago(900),
    sessions: [
      {
        id: "ses_current",
        browser: "Chrome",
        os: "macOS",
        ip: "127.0.0.1",
        location: "This computer",
        lastActiveAt: now(),
        createdAt: ago(1),
        current: true,
      },
      ...db.sessions,
    ],
  }),
);
route("POST", "/me/mfa/setup", () =>
  ok({
    secret: "JBSWY3DPEHPK3PXP",
    otpauthUrl: `otpauth://totp/ESOCS%20Admin:${encodeURIComponent(db.me.email)}?secret=JBSWY3DPEHPK3PXP&issuer=ESOCS%20Admin`,
  }),
);
route("POST", "/me/mfa/enable", (b) => {
  if (b.code !== MFA_CODE)
    throw new Fail(422, "VALIDATION", `Wrong code. In preview mode the code is ${MFA_CODE}.`, {
      code: ["Wrong code."],
    });
  db.me.mfaEnabled = true;
  db.admins[0].mfaEnabled = true;
  audit("account.mfa_enabled", "Turned on two-step verification");
  return ok({
    recoveryCodes: Array.from({ length: 10 }, () =>
      randomUUID()
        .slice(0, 9)
        .replace(/^(.{4})./, "$1-"),
    ),
  });
});
route("DELETE", "/me/mfa", () => {
  db.me.mfaEnabled = false;
  db.admins[0].mfaEnabled = false;
  return null;
});
route("POST", "/me/mfa/recovery-codes", () =>
  ok({ recoveryCodes: Array.from({ length: 10 }, () => randomUUID().slice(0, 9)) }),
);
route("DELETE", "/me/sessions/:id", () => null);
route("POST", "/me/sessions/revoke-others", () => ok({ revoked: 0 }));
route("GET", "/me/notification-preferences", () => ok(db.prefs));
route("PUT", "/me/notification-preferences", (b) => {
  db.prefs = b;
  return null;
});
route("GET", "/notifications", () => ({
  data: db.notifications,
  meta: { unread: db.notifications.filter((n) => !n.read).length },
}));
route("POST", "/notifications/read-all", () => {
  db.notifications.forEach((n) => (n.read = true));
  return null;
});

// Dashboard & lookups
route("GET", "/lookups/parishes", () => ok(db.parishes));
route("GET", "/dashboard/summary", () => {
  const subs = db.audiences.reduce((s, a) => s + audienceView(a).subscriberCount, 0);
  const sent = db.campaigns.filter((c) => c.stats);
  return ok({
    members: {
      total: db.members.length,
      newThisMonth: 6,
      delta: 0.042,
      trend: [40, 42, 41, 44, 46, 45, 48, 50, 53, 58],
    },
    audience: { subscribers: subs, delta: 0.018, trend: [30, 31, 33, 32, 35, 36, 38, 39] },
    campaigns: {
      sentLast30Days: sent.length,
      averageOpenRate: sent.length
        ? sent.reduce((s, c) => s + c.stats.uniqueOpens / c.stats.delivered, 0) / sent.length
        : null,
    },
    forms: {
      responsesLast30Days: Object.values(db.responses).flat().length,
      liveForms: db.forms.filter((f) => f.status === "published").length,
    },
    pending: {
      accessRequests: db.requests.length,
      memberApprovals: db.members.filter((m) => m.status === "pending").length,
      scheduledCampaigns: db.campaigns.filter((c) => c.status === "scheduled").length,
    },
    setup: {
      domainVerified: db.domains.some((d) => d.status === "verified"),
      hasAudience: db.audiences.length > 0,
      hasForm: db.forms.length > 0,
      postalAddressSet: !!db.sending.postalAddress,
    },
  });
});

// Members
route("GET", "/members", (_, q) => page(db.members, q));
route("GET", "/members/export", () => ({
  csv: csv([
    ["Member ID", "First name", "Last name", "Email", "Phone", "Parish", "Status"],
    ...db.members.map((m) => [
      m.memberNumber,
      m.firstName,
      m.lastName,
      m.email,
      m.phone,
      m.parish?.name,
      m.status,
    ]),
  ]),
}));
route("GET", "/members/:id", (_, __, p) => ok(find(db.members, p.id)));
route("POST", "/members", (b) => {
  const m = {
    ...b,
    id: id("mem"),
    memberNumber: `MBR-${10400 + db.members.length}`,
    avatarUrl: null,
    parish: db.parishes.find((x) => x.id === b.parishId) ?? null,
    joinedAt: now(),
    createdAt: now(),
    updatedAt: now(),
    createdBy: { id: db.me.id, name: db.me.name },
  };
  db.members.unshift(m);
  audit("member.created", `Added member ${m.firstName} ${m.lastName}`);
  return ok(m);
});
route("PATCH", "/members/:id", (b, _, p) => {
  const m = find(db.members, p.id);
  Object.assign(m, b, { parish: db.parishes.find((x) => x.id === b.parishId) ?? m.parish, updatedAt: now() });
  audit("member.updated", `Updated member ${m.firstName} ${m.lastName}`);
  return ok(m);
});
route("DELETE", "/members/:id", (_, __, p) => {
  db.members = db.members.filter((m) => m.id !== p.id);
  audit("member.deleted", "Deleted a member", "warning");
  return null;
});
route("POST", "/members/bulk", (b) => {
  const set = new Set(b.ids);
  db.members.forEach((m) => set.has(m.id) && (m.status = b.action === "approve" ? "active" : "inactive"));
  return ok({ updated: set.size });
});
route("POST", "/members/bulk-delete", (b) => {
  const before = db.members.length;
  db.members = db.members.filter((m) => !b.ids.includes(m.id));
  audit("member.deleted", `Deleted ${before - db.members.length} members`, "warning");
  return ok({ deleted: before - db.members.length });
});

// Audiences
route("GET", "/audiences", () => ok(db.audiences.map(audienceView)));
route("GET", "/audiences/:id", (_, __, p) => ok(audienceView(find(db.audiences, p.id))));
route("POST", "/audiences", (b) => {
  const a = { ...b, id: id("aud"), createdAt: now(), updatedAt: now() };
  db.audiences.push(a);
  db.contacts[a.id] = [];
  return ok(audienceView(a));
});
route("PATCH", "/audiences/:id", (b, _, p) =>
  ok(Object.assign(find(db.audiences, p.id), b, { updatedAt: now() })),
);
route("DELETE", "/audiences/:id", (_, __, p) => {
  db.audiences = db.audiences.filter((a) => a.id !== p.id);
  return null;
});
route("GET", "/audiences/:id/contacts", (_, q, p) => page(db.contacts[p.id] ?? notFound(), q));
function addContacts(listId, list) {
  const existing = db.contacts[listId] ?? notFound();
  let created = 0,
    skipped = 0;
  for (const c of list) {
    if (existing.some((x) => x.email === c.email)) {
      skipped++;
      continue;
    }
    existing.unshift({
      id: id("con"),
      email: c.email,
      firstName: c.firstName ?? null,
      lastName: c.lastName ?? null,
      status: "subscribed",
      source: c.source ?? "import",
      memberId: c.memberId ?? null,
      subscribedAt: now(),
      createdAt: now(),
    });
    created++;
  }
  return { created, updated: 0, skipped, invalid: 0 };
}
route("POST", "/audiences/:id/contacts", (b, _, p) => {
  addContacts(p.id, [{ ...b, source: "manual" }]);
  return null;
});
route("POST", "/audiences/:id/imports", (b, _, p) => ok(addContacts(p.id, b.contacts)));
route("POST", "/audiences/:id/sync-members", (b, _, p) =>
  ok(
    addContacts(
      p.id,
      db.members
        .filter((m) => m.emailConsent && m.email && (!b.parishId || m.parish?.id === b.parishId))
        .map((m) => ({
          email: m.email,
          firstName: m.firstName,
          lastName: m.lastName,
          source: "member",
          memberId: m.id,
        })),
    ),
  ),
);
route("POST", "/audiences/:id/contacts/remove", (b, _, p) => {
  const before = db.contacts[p.id].length;
  db.contacts[p.id] = db.contacts[p.id].filter((c) => !b.ids.includes(c.id));
  return ok({ removed: before - db.contacts[p.id].length });
});
route("POST", "/audiences/estimate", (b) => {
  const emails = new Set(
    (b.listIds ?? []).flatMap((lid) =>
      (db.contacts[lid] ?? []).filter((c) => c.status === "subscribed").map((c) => c.email),
    ),
  );
  return ok({ count: emails.size });
});

// Templates
route("GET", "/templates", () => ok(db.templates));
route("GET", "/templates/:id", (_, __, p) => ok(find(db.templates, p.id)));
route("POST", "/templates", (b) => {
  const t = {
    ...b,
    id: id("tpl"),
    description: null,
    updatedAt: now(),
    updatedBy: { id: db.me.id, name: db.me.name },
  };
  db.templates.unshift(t);
  return ok(t);
});
route("PATCH", "/templates/:id", (b, _, p) =>
  ok(
    Object.assign(
      find(db.templates, p.id),
      Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined)),
      { updatedAt: now() },
    ),
  ),
);
route("POST", "/templates/:id/duplicate", (_, __, p) => {
  const t = { ...structuredClone(find(db.templates, p.id)), id: id("tpl") };
  t.name += " (copy)";
  db.templates.unshift(t);
  return ok(t);
});
route("DELETE", "/templates/:id", (_, __, p) => {
  db.templates = db.templates.filter((t) => t.id !== p.id);
  return null;
});

// Campaigns
route("GET", "/campaigns", (_, q) => page(db.campaigns, q));
route("GET", "/campaigns/:id", (_, __, p) => ok(find(db.campaigns, p.id)));
route("GET", "/campaigns/:id/report", (_, __, p) => {
  const c = find(db.campaigns, p.id);
  const s = c.stats ?? stats(0);
  return ok({
    stats: s,
    timeline: Array.from({ length: 18 }, (_, i) => ({
      at: new Date(Date.parse(c.sentAt ?? now()) + i * 3600e3).toISOString(),
      opens: Math.round((s.uniqueOpens / 3) * Math.exp(-i / 3)),
      clicks: 0,
    })),
    links: [{ url: "https://example.org", clicks: s.uniqueClicks }],
  });
});
route("POST", "/campaigns", (b) => {
  const c = {
    ...baseCampaign,
    ...b,
    id: id("cmp"),
    subject: null,
    status: "draft",
    recipientCount: null,
    scheduledAt: null,
    sentAt: null,
    stats: null,
    updatedAt: now(),
    audience: { listIds: [] },
  };
  db.campaigns.unshift(c);
  return ok(c);
});
route("PATCH", "/campaigns/:id", (b, _, p) => {
  const c = find(db.campaigns, p.id);
  if (c.status !== "draft") throw new Fail(409, "CONFLICT", "Only drafts can be edited.");
  if (b.setup) Object.assign(c, b.setup);
  if (b.audience) c.audience = b.audience;
  if (b.content) c.content = b.content;
  c.updatedAt = now();
  return ok(c);
});
route("POST", "/campaigns/:id/test", () => null);
const recipients = (c) =>
  new Set(
    c.audience.listIds.flatMap((l) =>
      (db.contacts[l] ?? []).filter((x) => x.status === "subscribed").map((x) => x.email),
    ),
  ).size;
route("POST", "/campaigns/:id/schedule", (b, _, p) => {
  const c = find(db.campaigns, p.id);
  Object.assign(c, {
    status: "scheduled",
    scheduledAt: b.sendAt,
    recipientCount: recipients(c),
    updatedAt: now(),
  });
  audit("campaign.scheduled", `Scheduled “${c.name}”`);
  return null;
});
route("POST", "/campaigns/:id/send", (_, __, p) => {
  const c = find(db.campaigns, p.id);
  const n = recipients(c);
  Object.assign(c, { status: "sent", sentAt: now(), recipientCount: n, stats: stats(n), updatedAt: now() });
  audit("campaign.sent", `Sent “${c.name}” to ${n} people`);
  return null;
});
route("POST", "/campaigns/:id/unschedule", (_, __, p) => {
  Object.assign(find(db.campaigns, p.id), { status: "draft", scheduledAt: null });
  return null;
});
route("POST", "/campaigns/:id/duplicate", (_, __, p) => {
  const c = {
    ...structuredClone(find(db.campaigns, p.id)),
    id: id("cmp"),
    status: "draft",
    sentAt: null,
    scheduledAt: null,
    stats: null,
    updatedAt: now(),
  };
  c.name += " (copy)";
  db.campaigns.unshift(c);
  return ok(c);
});
route("DELETE", "/campaigns/:id", (_, __, p) => {
  db.campaigns = db.campaigns.filter((c) => c.id !== p.id);
  return null;
});
route("GET", "/email/sender-profile", () =>
  ok({
    fromAddresses: db.domains
      .flatMap((d) => [{ email: `news@${d.domain}`, verified: d.status === "verified" }])
      .concat([{ email: "news@esocs.test", verified: true }]),
    defaultFromName: db.sending.defaultFromName,
    defaultReplyTo: db.sending.defaultReplyTo,
    organisationName: db.sending.organisationName,
    postalAddress: db.sending.postalAddress,
  }),
);

// Sending settings
route("GET", "/email/sending", () => ok({ ...db.sending, domains: db.domains }));
route("PUT", "/email/sending", (b) => {
  Object.assign(db.sending, b);
  return null;
});
route("POST", "/email/domains", (b) => {
  const d = {
    ...structuredClone(db.domains[0] ?? {}),
    id: id("dom"),
    domain: b.domain,
    status: "pending",
    lastCheckedAt: null,
  };
  d.records = (d.records ?? []).map((r) => ({
    ...r,
    host: r.host.replace("esocs.test", b.domain),
    status: "pending",
  }));
  db.domains.push(d);
  return ok(d);
});
route("POST", "/email/domains/:id/verify", (_, __, p) => {
  const d = find(db.domains, p.id);
  d.status = "verified";
  d.records.forEach((r) => (r.status = "verified"));
  d.lastCheckedAt = now();
  return ok(d);
});
route("DELETE", "/email/domains/:id", (_, __, p) => {
  db.domains = db.domains.filter((d) => d.id !== p.id);
  return null;
});

// Forms
route("GET", "/forms", (_, q) => page(db.forms.map(formView), q));
route("GET", "/forms/:id", (_, __, p) => ok(formView(find(db.forms, p.id))));
route("POST", "/forms", (b) => {
  const slug =
    b.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "form";
  const f = {
    id: id("frm"),
    title: b.title,
    slug: `${slug}-${db.forms.length + 1}`,
    status: "draft",
    updatedAt: now(),
    publishedAt: null,
    description: null,
    fields: [],
    settings: {
      submitLabel: "Submit",
      confirmationTitle: "Thank you!",
      confirmationMessage: "Your response has been received.",
      redirectUrl: null,
      closesAt: null,
      responseLimit: null,
      notifyEmails: [],
      audienceId: null,
    },
  };
  db.forms.unshift(f);
  db.responses[f.id] = [];
  return ok(formView(f));
});
route("PATCH", "/forms/:id", (b, _, p) =>
  ok(
    Object.assign(
      find(db.forms, p.id),
      Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined)),
      { updatedAt: now() },
    ),
  ),
);
route("PUT", "/forms/:id/settings", (b, _, p) => {
  find(db.forms, p.id).settings = b;
  return null;
});
route("PUT", "/forms/:id/slug", (b, _, p) => {
  if (db.forms.some((f) => f.slug === b.slug && f.id !== p.id))
    throw new Fail(409, "CONFLICT", "That link is already taken.", { slug: ["That link is already taken."] });
  find(db.forms, p.id).slug = b.slug;
  return null;
});
route("POST", "/forms/:id/publish", (_, __, p) => {
  Object.assign(find(db.forms, p.id), { status: "published", publishedAt: now() });
  return null;
});
route("POST", "/forms/:id/close", (_, __, p) => {
  find(db.forms, p.id).status = "closed";
  return null;
});
route("POST", "/forms/:id/duplicate", (_, __, p) => {
  const f = { ...structuredClone(find(db.forms, p.id)), id: id("frm"), status: "draft" };
  f.title += " (copy)";
  f.slug += "-copy";
  db.forms.unshift(f);
  db.responses[f.id] = [];
  return ok(formView(f));
});
route("DELETE", "/forms/:id", (_, __, p) => {
  db.forms = db.forms.filter((f) => f.id !== p.id);
  return null;
});
route("GET", "/forms/:id/responses", (_, q, p) => page(db.responses[p.id] ?? notFound(), q));
route("GET", "/forms/:id/responses/export", (_, __, p) => {
  const f = find(db.forms, p.id);
  const qs = f.fields.filter((x) => x.type !== "section");
  return {
    csv: csv([
      ["Submitted", ...qs.map((x) => x.label)],
      ...(db.responses[f.id] ?? []).map((r) => [r.submittedAt, ...qs.map((x) => r.answers[x.id])]),
    ]),
  };
});
route("POST", "/forms/:id/responses/delete", (b, _, p) => {
  const before = db.responses[p.id].length;
  db.responses[p.id] = db.responses[p.id].filter((r) => !b.responseIds.includes(r.id));
  return ok({ deleted: before - db.responses[p.id].length });
});
route("GET", "/public/forms/:slug", (_, __, p) => {
  const f = db.forms.find((x) => x.slug === p.slug && x.status !== "draft") ?? notFound();
  return ok({
    slug: f.slug,
    title: f.title,
    description: f.description,
    status: f.status,
    fields: f.fields,
    settings: f.settings,
    organisationName: "ESOCS",
  });
});
route("POST", "/public/forms/:slug/responses", (b, _, p) => {
  const f = db.forms.find((x) => x.slug === p.slug) ?? notFound();
  db.responses[f.id].unshift({ id: id("rsp"), submittedAt: now(), answers: b.answers });
  return null;
});

// Users & roles
route("GET", "/admin-users", (_, q) => page(db.admins, q));
route("POST", "/admin-users/invitations", (b) => {
  const role = find(db.roles, b.roleId);
  db.admins.push({
    id: id("usr"),
    name: b.name || b.email.split("@")[0],
    email: b.email,
    avatarUrl: null,
    role: { id: role.id, name: role.name },
    status: "invited",
    mfaEnabled: false,
    lastActiveAt: null,
    createdAt: now(),
  });
  audit("user.invited", `Invited ${b.email}`, "warning");
  return null;
});
route("POST", "/admin-users/:id/invitation/resend", () => null);
route("DELETE", "/admin-users/:id/invitation", (_, __, p) => {
  db.admins = db.admins.filter((a) => a.id !== p.id);
  return null;
});
route("PUT", "/admin-users/:id/role", (b, _, p) => {
  const r = find(db.roles, b.roleId);
  find(db.admins, p.id).role = { id: r.id, name: r.name };
  audit("user.role_changed", `Changed a role to ${r.name}`, "warning");
  return null;
});
route("POST", "/admin-users/:id/suspend", (_, __, p) => {
  find(db.admins, p.id).status = "suspended";
  audit("user.suspended", "Suspended an administrator", "critical");
  return null;
});
route("POST", "/admin-users/:id/reactivate", (_, __, p) => {
  find(db.admins, p.id).status = "active";
  return null;
});
route("POST", "/admin-users/:id/mfa/reset", (_, __, p) => {
  find(db.admins, p.id).mfaEnabled = false;
  return null;
});
route("GET", "/roles", () => ok(db.roles.map(roleView)));
route("GET", "/roles/:id", (_, __, p) => ok(roleView(find(db.roles, p.id))));
route("POST", "/roles", (b) => {
  const r = { ...b, id: id("rol"), system: false, locked: false };
  db.roles.push(r);
  return ok(roleView(r));
});
route("PUT", "/roles/:id", (b, _, p) => {
  const r = find(db.roles, p.id);
  if (r.locked) throw new Fail(403, "FORBIDDEN", "This role can’t be changed.");
  Object.assign(r, b);
  audit("role.updated", `Changed permissions for ${r.name}`, "warning");
  return null;
});
route("DELETE", "/roles/:id", (_, __, p) => {
  if (db.admins.some((a) => a.role.id === p.id))
    throw new Fail(409, "CONFLICT", "People still have this role.");
  db.roles = db.roles.filter((r) => r.id !== p.id);
  return null;
});
route("GET", "/access-requests", () => ok(db.requests));
route("POST", "/access-requests/:id/approve", (b, _, p) => {
  const q = find(db.requests, p.id);
  const r = find(db.roles, b.roleId);
  db.admins.push({
    id: id("usr"),
    name: q.name,
    email: q.email,
    avatarUrl: null,
    role: { id: r.id, name: r.name },
    status: "active",
    mfaEnabled: false,
    lastActiveAt: null,
    createdAt: now(),
  });
  db.requests = db.requests.filter((x) => x.id !== p.id);
  audit("access.approved", `Approved access for ${q.name}`, "warning");
  return null;
});
route("POST", "/access-requests/:id/reject", (_, __, p) => {
  db.requests = db.requests.filter((x) => x.id !== p.id);
  return null;
});

// Audit
route("GET", "/audit-events", (_, q) => page(db.audit, q));
route("GET", "/audit-events/export", () => ({
  csv: csv([
    ["When", "Action", "Summary", "By"],
    ...db.audit.map((e) => [e.createdAt, e.action, e.summary, e.actor?.name ?? "System"]),
  ]),
}));

// ─── Server ──────────────────────────────────────────────────────────────────
const PUBLIC = /^\/(auth\/(login|refresh|mfa\/verify|signup|verify-email|password)|public\/)/;

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://mock");
    const path = url.pathname.replace(/^\/v1/, "").replace(/\/$/, "") || "/";
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      const send = (status, payload, type = "application/json") => {
        res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
        res.end(type === "application/json" ? JSON.stringify(payload) : payload);
      };
      try {
        if (!PUBLIC.test(path) && !String(req.headers.authorization ?? "").startsWith("Bearer mock-")) {
          throw new Fail(401, "UNAUTHENTICATED", "Your session has ended. Please sign in again.");
        }
        const body = raw ? JSON.parse(raw) : {};
        for (const [method, pattern, handler] of R) {
          const m = path.match(pattern);
          if (method !== req.method || !m) continue;
          const out = handler(body, url.searchParams, m.groups ?? {});
          if (out === null || out === undefined) return send(204, "", "text/plain");
          if (out.csv !== undefined) return send(200, out.csv, "text/csv; charset=utf-8");
          return send(req.method === "POST" && out.data?.id ? 201 : 200, out);
        }
        throw new Fail(404, "NOT_FOUND", `Mock API has no route for ${req.method} ${path}`);
      } catch (e) {
        if (e instanceof Fail)
          return send(e.status, { error: { code: e.code, message: e.message, fields: e.fields } });
        console.error(e);
        return send(500, { error: { code: "UNAVAILABLE", message: "Mock API error." } });
      } finally {
        if (process.env.MOCK_API_LOG !== "0") console.log(`${req.method} ${path} → ${res.statusCode}`);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`\n  Mock API ready on http://localhost:${PORT}/v1  (preview only, in-memory)`);
    console.log(`  Sign in: admin@esocs.test / ${PASSWORD}`);
    console.log(`  Two-step demo: mfa@esocs.test / ${PASSWORD}, code ${MFA_CODE}\n`);
  });
