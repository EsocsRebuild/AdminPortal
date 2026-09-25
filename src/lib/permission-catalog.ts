import type { Permission } from "./permissions";

/** Plain-language descriptions for the role editor. Order is display order. */
export const permissionCatalog: { area: string; items: { permission: Permission; label: string; description: string; sensitive?: boolean }[] }[] = [
  {
    area: "Overview",
    items: [{ permission: "dashboard:view", label: "See the dashboard", description: "Key numbers and recent activity." }],
  },
  {
    area: "Members",
    items: [
      { permission: "members:view", label: "View members", description: "Look up people and their details." },
      { permission: "members:manage", label: "Add and edit members", description: "Create, update, approve and delete member records.", sensitive: true },
      { permission: "members:export", label: "Export members", description: "Download the member list as a spreadsheet.", sensitive: true },
    ],
  },
  {
    area: "Email marketing",
    items: [
      { permission: "campaigns:view", label: "View campaigns", description: "See campaigns and their results." },
      { permission: "campaigns:manage", label: "Prepare campaigns", description: "Write and edit campaigns and send tests." },
      { permission: "campaigns:send", label: "Send campaigns", description: "Send or schedule emails to audiences.", sensitive: true },
      { permission: "audiences:view", label: "View audiences", description: "See lists and who’s on them." },
      { permission: "audiences:manage", label: "Manage audiences", description: "Create lists, import and remove contacts.", sensitive: true },
      { permission: "templates:manage", label: "Manage templates", description: "Create and edit email designs." },
    ],
  },
  {
    area: "Forms",
    items: [
      { permission: "forms:view", label: "View forms and responses", description: "Read answers people submitted." },
      { permission: "forms:manage", label: "Build and publish forms", description: "Create, publish, close and delete forms.", sensitive: true },
    ],
  },
  {
    area: "Administration",
    items: [
      { permission: "users:view", label: "View administrators", description: "See who has access to the portal." },
      { permission: "users:manage", label: "Manage administrators", description: "Invite people, approve requests and change roles.", sensitive: true },
      { permission: "roles:manage", label: "Edit roles", description: "Change what each role is allowed to do.", sensitive: true },
      { permission: "audit:view", label: "View the audit log", description: "See who did what and when." },
      { permission: "settings:manage", label: "Organisation settings", description: "Email sending domains and organisation details.", sensitive: true },
    ],
  },
];
