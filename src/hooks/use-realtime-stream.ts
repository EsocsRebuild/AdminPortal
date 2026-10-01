"use client";

import * as React from "react";

export interface RealtimeEvent<T = unknown> {
  type: string;
  channel: string;
  unitId?: string;
  timestamp: string;
  payload?: T;
}

export function useRealtimeStream<T = unknown>(channel = "global", unitId?: string) {
  const [connected, setConnected] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState<RealtimeEvent<T> | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams({ channel });
    if (unitId) params.set("unitId", unitId);

    const es = new EventSource(`/api/realtime/stream?${params.toString()}`);

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const parsed: RealtimeEvent<T> = JSON.parse(event.data);
        setLastEvent(parsed);
      } catch {
        // ignore parse error
      }
    };

    es.onerror = () => {
      setConnected(false);
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [channel, unitId]);

  return { connected, lastEvent };
}
