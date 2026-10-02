"use client";

import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface JourneyStage {
  id: string;
  label: string;
  count: number;
  color: string;
  description: string;
}

const defaultStages: JourneyStage[] = [
  {
    id: "visitor",
    label: "First-Time Guest",
    count: 48,
    color: "bg-blue-500",
    description: "Follow-up SMS within 24h",
  },
  {
    id: "convert",
    label: "New Convert",
    count: 32,
    color: "bg-amber-500",
    description: "Discipleship foundation class",
  },
  {
    id: "baptized",
    label: "Baptized / Sanctified",
    count: 195,
    color: "bg-emerald-500",
    description: "Active sacramental life",
  },
  {
    id: "regular",
    label: "Regular Member",
    count: 142,
    color: "bg-indigo-500",
    description: "Committed tither & attendee",
  },
  {
    id: "worker",
    label: "Ordained / Worker",
    count: 35,
    color: "bg-purple-500",
    description: "Elders, choir, ushers, clergy",
  },
];

export function MemberStageFunnel({
  stages = defaultStages,
  className,
}: {
  stages?: JourneyStage[];
  className?: string;
}) {
  const maxCount = Math.max(...stages.map((s) => s.count));
  const total = stages.reduce((acc, s) => acc + s.count, 0);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        title="Spiritual Journey & Discipleship Funnel"
        description="Progression pipeline of souls from first-time visitor to active ordained servant."
      />
      <CardContent className="space-y-4 pt-1">
        <div className="space-y-3">
          {stages.map((stage) => {
            const widthPercent = Math.max(12, (stage.count / maxCount) * 100);

            return (
              <div key={stage.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{stage.label}</span>
                    <span className="hidden text-2xs text-muted-foreground sm:inline">
                      • {stage.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{formatNumber(stage.count)}</span>
                    <span className="text-2xs text-muted-foreground">
                      ({Math.round((stage.count / total) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar representing funnel width */}
                <div className="h-4 w-full overflow-hidden rounded-control bg-surface-muted">
                  <div
                    className={cn("h-full rounded-control transition-all duration-500", stage.color)}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Funnel Insights */}
        <div className="mt-4 flex flex-col gap-2 rounded-control border border-border bg-surface-muted/30 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>
              Visitor to Convert retention rate: <strong className="text-foreground">66.7%</strong>
            </span>
          </div>
          <div className="text-2xs text-muted-foreground">
            Automated alerts remind pastoral team when visitors stall past 14 days without follow-up.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
