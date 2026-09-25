export const severities = ["info", "warning", "critical"] as const;
export type Severity = (typeof severities)[number];
export const severityLabels: Record<Severity, string> = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

export interface AuditEvent {
  id: string;
  /** Machine name, e.g. "member.deleted", "auth.mfa_failed". */
  action: string;
  /** Human sentence written by the API, e.g. "Deleted member Ada Okafor". */
  summary: string;
  severity: Severity;
  actor: { id: string; name: string; email: string } | null;
  target: { type: string; id: string; label: string } | null;
  ip: string | null;
  userAgent: string | null;
  /** Before/after values for updates, and other context. Never contains secrets. */
  changes: Record<string, { from: unknown; to: unknown }> | null;
  createdAt: string;
}

export const periods = ["24h", "7d", "30d", "90d"] as const;
export type Period = (typeof periods)[number];
