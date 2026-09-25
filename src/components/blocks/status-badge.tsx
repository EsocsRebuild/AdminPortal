import { Badge, type BadgeProps } from "@/components/ui/badge";

type Tone = NonNullable<BadgeProps["tone"]>;

/** Map domain statuses to tones once, so they read the same everywhere. */
const statusTones: Record<string, Tone> = {
  active: "success",
  approved: "success",
  paid: "success",
  published: "success",
  pending: "warning",
  draft: "neutral",
  scheduled: "info",
  sending: "info",
  invited: "info",
  subscribed: "success",
  verified: "success",
  delivered: "success",
  unsubscribed: "neutral",
  closed: "neutral",
  paused: "warning",
  bounced: "danger",
  complained: "danger",
  critical: "danger",
  warning: "warning",
  info: "info",
  inactive: "neutral",
  archived: "neutral",
  suspended: "danger",
  failed: "danger",
  rejected: "danger",
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const tone = statusTones[status] ?? "neutral";
  return (
    <Badge tone={tone} dot={status === "sending" ? "pulse" : true} className={className}>
      {label ?? (status.charAt(0).toUpperCase() + status.slice(1)).replace(/_/g, " ")}
    </Badge>
  );
}
