import type { Permission } from "./permissions";

/** Plain-language descriptions for the role editor. Order is display order. */
export const permissionCatalog: {
  area: string;
  items: { permission: Permission; label: string; description: string; sensitive?: boolean }[];
}[] = [
  {
    area: "Overview",
    items: [
      {
        permission: "dashboard:view",
        label: "See the dashboard",
        description: "Key numbers and recent activity.",
      },
    ],
  },
  {
    area: "Members & Households",
    items: [
      {
        permission: "members:view",
        label: "View members",
        description: "Look up people and their details across your church branch.",
      },
      {
        permission: "members:manage",
        label: "Add and edit members",
        description: "Register new members, update profiles, and manage status.",
        sensitive: true,
      },
      {
        permission: "members:export",
        label: "Export members",
        description: "Download the congregation roster safely as a spreadsheet.",
        sensitive: true,
      },
      {
        permission: "households:manage",
        label: "Manage family households",
        description: "Group member records into family and household units.",
      },
    ],
  },
  {
    area: "Church Services & Events",
    items: [
      {
        permission: "events:view",
        label: "View church calendar",
        description: "Browse upcoming church gatherings, revivals, and scheduled services.",
      },
      {
        permission: "events:manage",
        label: "Schedule and manage services",
        description: "Create, schedule, edit, and publish church gatherings to the calendar.",
        sensitive: true,
      },
      {
        permission: "attendance:view",
        label: "View attendance records",
        description: "Inspect congregation headcount and service attendance figures.",
      },
      {
        permission: "attendance:record",
        label: "Record service attendance",
        description: "Take headcount, record attendees, and save service attendance reports.",
      },
    ],
  },
  {
    area: "Giving & Stewardship",
    items: [
      {
        permission: "giving:view",
        label: "View stewardship records",
        description: "Inspect tithes, pledges, and general thanksgiving batches.",
      },
      {
        permission: "giving:manage",
        label: "Manage giving & batch records",
        description: "Enter, reconcile, and post church offering batches and tithe envelopes.",
        sensitive: true,
      },
    ],
  },
  {
    area: "Fellowships & Autonomous Wings",
    items: [
      {
        permission: "groups:view",
        label: "View fellowship wings",
        description: "Browse women's fellowship, youth societies, and ministerial bands.",
      },
      {
        permission: "groups:manage",
        label: "Manage fellowship wings",
        description: "Configure leadership and programmes for fellowship societies.",
        sensitive: true,
      },
    ],
  },
  {
    area: "Ordination & Pastoral Ministry",
    items: [
      {
        permission: "pastoral:view",
        label: "View ordination pipeline",
        description: "Review candidates recommended for ordination ranks.",
      },
      {
        permission: "pastoral:manage",
        label: "Manage candidate dossiers",
        description: "Update candidate clearance, provincial recommendations, and ordination vetting.",
        sensitive: true,
      },
    ],
  },
  {
    area: "Website & Public Announcements",
    items: [
      {
        permission: "content:view",
        label: "View public content & studio",
        description: "Open the Web Studio, browse published bulletins, events, and media.",
      },
      {
        permission: "content:manage",
        label: "Publish bulletins and programmes",
        description: "Compose announcements, upload sermons, and manage church publications.",
        sensitive: true,
      },
    ],
  },
  {
    area: "Email marketing",
    items: [
      {
        permission: "campaigns:view",
        label: "View campaigns",
        description: "See campaigns and their results.",
      },
      {
        permission: "campaigns:manage",
        label: "Prepare campaigns",
        description: "Write and edit campaigns and send tests.",
      },
      {
        permission: "campaigns:send",
        label: "Send campaigns",
        description: "Send or schedule emails to audiences.",
        sensitive: true,
      },
      { permission: "audiences:view", label: "View audiences", description: "See lists and who’s on them." },
      {
        permission: "audiences:manage",
        label: "Manage audiences",
        description: "Create lists, import and remove contacts.",
        sensitive: true,
      },
      {
        permission: "templates:manage",
        label: "Manage templates",
        description: "Create and edit email designs.",
      },
    ],
  },
  {
    area: "Forms",
    items: [
      {
        permission: "forms:view",
        label: "View forms and responses",
        description: "Read answers people submitted.",
      },
      {
        permission: "forms:manage",
        label: "Build and publish forms",
        description: "Create, publish, close and delete forms.",
        sensitive: true,
      },
    ],
  },
  {
    area: "Administration",
    items: [
      {
        permission: "users:view",
        label: "View administrators",
        description: "See who has access to the portal.",
      },
      {
        permission: "users:manage",
        label: "Manage administrators",
        description: "Invite people, approve requests and change roles.",
        sensitive: true,
      },
      {
        permission: "roles:manage",
        label: "Edit roles",
        description: "Change what each role is allowed to do.",
        sensitive: true,
      },
      { permission: "audit:view", label: "View the audit log", description: "See who did what and when." },
      {
        permission: "settings:manage",
        label: "Organisation settings",
        description: "Email sending domains and organisation details.",
        sensitive: true,
      },
    ],
  },
];
