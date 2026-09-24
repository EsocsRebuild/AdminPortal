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
  inactive: "neutral",
  archived: "neutral",
  suspended: "danger",
  failed: "danger",
  rejected: "danger",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusTones[status] ?? "neutral";
  return (
    <Badge tone={tone} dot className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
