"use client";

import * as React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SaveStatus } from "@/components/ui/save-status";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAutosave } from "@/hooks/use-autosave";

import { updateNotificationPrefs } from "../actions";
import type { NotificationPrefs } from "../types";

const items: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: "accessRequests", label: "Account requests", description: "When someone asks for access and you can approve it." },
  { key: "formResponses", label: "Form responses", description: "A daily digest of new responses to forms you manage." },
  { key: "campaignReports", label: "Campaign results", description: "A summary 24 hours after a campaign you created is sent." },
  { key: "weeklySummary", label: "Weekly summary", description: "A Monday email with the week’s key numbers." },
];

export function NotificationPrefsCard({ initial }: { initial: NotificationPrefs }) {
  const [prefs, setPrefs] = React.useState(initial);
  const save = useAutosave(prefs, updateNotificationPrefs, { delay: 500 });
  return (
    <Card>
      <CardHeader title="Email me about" description="Changes save automatically." actions={<SaveStatus state={save.state} onRetry={save.flush} />} />
      <CardContent className="grid gap-4">
        {items.map((i, idx) => (
          <React.Fragment key={i.key}>
            {idx > 0 && <Separator />}
            <Switch label={i.label} description={i.description} checked={prefs[i.key]} onCheckedChange={(v) => setPrefs({ ...prefs, [i.key]: v })} />
          </React.Fragment>
        ))}
        <Separator />
        <Switch label="Security alerts" description="New sign-ins, password changes and two-step changes. Always on." checked disabled />
      </CardContent>
    </Card>
  );
}
