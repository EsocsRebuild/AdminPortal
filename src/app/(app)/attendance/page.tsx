import * as React from "react";
import { CheckCheck, Download, Filter, Plus, UsersRound } from "lucide-react";
import type { Metadata } from "next";

import { AttendanceChart } from "@/components/charts/attendance-chart";
import { LiveHeadcountWidget } from "@/components/blocks/live-headcount-widget";
import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextualTipCard } from "@/components/ui/contextual-tip-card";
import { formatDate, formatNumber } from "@/lib/format";
import { requirePermission } from "@/server/session";

export const metadata: Metadata = { title: "Attendance & Headcount" };

interface HeadcountRecord {
  id: string;
  date: string;
  serviceType: string;
  men: number;
  women: number;
  children: number;
  total: number;
  notes?: string;
  recorder: string;
}

const mockHeadcounts: HeadcountRecord[] = [
  {
    id: "hc-1",
    date: "2026-09-27",
    serviceType: "Sunday Morning Worship",
    men: 146,
    women: 185,
    children: 94,
    total: 425,
    notes: "Communion Sunday & Baby Dedication",
    recorder: "Brother Daniel (Ushering)",
  },
  {
    id: "hc-2",
    date: "2026-09-23",
    serviceType: "Wednesday Midweek Prayer",
    men: 52,
    women: 78,
    children: 30,
    total: 160,
    recorder: "Sister Grace (Secretariat)",
  },
  {
    id: "hc-3",
    date: "2026-09-20",
    serviceType: "Sunday Morning Worship",
    men: 142,
    women: 178,
    children: 90,
    total: 410,
    notes: "Mothers' Day Special Service",
    recorder: "Brother Daniel (Ushering)",
  },
  {
    id: "hc-4",
    date: "2026-09-13",
    serviceType: "Sunday Morning Worship",
    men: 130,
    women: 168,
    children: 84,
    total: 382,
    recorder: "Brother Michael (Ushering)",
  },
  {
    id: "hc-5",
    date: "2026-09-06",
    serviceType: "Sunday Morning Worship",
    men: 135,
    women: 170,
    children: 85,
    total: 390,
    notes: "First Sunday Thanksgiving",
    recorder: "Brother Daniel (Ushering)",
  },
];

export default async function AttendancePage() {
  const user = await requirePermission("attendance:view");

  return (
    <Page>
      <PageHeader
        title="Attendance & Headcount"
        description="Historical attendance logs, demographic ratios, and Sunday worship headcount records."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" leftIcon={<Download className="size-4" />}>
              Export Log
            </Button>
          </div>
        }
      />

      <ContextualTipCard
        id="attendance_quick_recording"
        title="Sunday Headcount Hotkey"
        description="Press Alt+H anywhere in the portal to open the instant headcount counter during the sermon."
        actionText="Got it"
        className="mb-4"
      />

      <div className="mb-6">
        <LiveHeadcountWidget parishName="Mount Zion Parish" initialCount={425} />
      </div>

      {/* Main Attendance Chart */}
      <AttendanceChart className="mb-6" />

      {/* Headcount Records Table */}
      <Card>
        <CardHeader
          title="Recent Service Attendance Logs"
          description="Verified counts recorded by parish ushering officers."
        />
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-2xs font-semibold uppercase text-muted-foreground">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 px-4">Service Type</th>
                  <th className="py-2.5 px-4 text-center">Men</th>
                  <th className="py-2.5 px-4 text-center">Women</th>
                  <th className="py-2.5 px-4 text-center">Children</th>
                  <th className="py-2.5 px-4 text-center font-bold text-foreground">Total</th>
                  <th className="py-2.5 px-4">Notes</th>
                  <th className="py-2.5 pl-4">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {mockHeadcounts.map((hc) => (
                  <tr key={hc.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 pr-4 font-semibold text-foreground">{formatDate(hc.date)}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{hc.serviceType}</td>
                    <td className="py-3 px-4 text-center tabular text-blue-600 dark:text-blue-400 font-medium">
                      {hc.men}
                    </td>
                    <td className="py-3 px-4 text-center tabular text-emerald-600 dark:text-emerald-400 font-medium">
                      {hc.women}
                    </td>
                    <td className="py-3 px-4 text-center tabular text-amber-600 dark:text-amber-400 font-medium">
                      {hc.children}
                    </td>
                    <td className="py-3 px-4 text-center tabular font-bold text-foreground text-sm">
                      {formatNumber(hc.total)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{hc.notes ?? "—"}</td>
                    <td className="py-3 pl-4 text-muted-foreground">{hc.recorder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
