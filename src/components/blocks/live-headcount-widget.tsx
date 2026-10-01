"use client";

import * as React from "react";
import { Activity, Church, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRealtimeStream } from "@/hooks/use-realtime-stream";

interface LiveHeadcountProps {
  parishName?: string;
  initialCount?: number;
}

export function LiveHeadcountWidget({
  parishName = "Mount Zion Parish",
  initialCount = 342,
}: LiveHeadcountProps) {
  const [count, setCount] = React.useState(initialCount);
  const { connected } = useRealtimeStream("headcount");

  function handleIncrement(amount: number) {
    setCount((prev) => Math.max(0, prev + amount));
  }

  return (
    <Card className="p-5 border-l-4 border-l-emerald-500 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Church className="size-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-semibold text-sm">{parishName} — Service Attendance</h3>
        </div>
        <Badge tone={connected ? "success" : "neutral"} dot={connected ? "pulse" : false}>
          {connected ? "Live Stream Active" : "Connecting..."}
        </Badge>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-foreground">{count}</div>
          <p className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Activity className="size-3 text-emerald-500 animate-pulse" />
            <span>Updated in real-time from usher mobile check-ins</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="xs" onClick={() => handleIncrement(1)}>
            <Plus className="mr-1 size-3" /> +1 Usher Count
          </Button>
          <Button variant="outline" size="xs" onClick={() => handleIncrement(5)}>
            +5 Group
          </Button>
        </div>
      </div>
    </Card>
  );
}
