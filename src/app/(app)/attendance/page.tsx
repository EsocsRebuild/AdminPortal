import { CheckCheck } from "lucide-react";
import type { Metadata } from "next";

import { LiveHeadcountWidget } from "@/components/blocks/live-headcount-widget";
import { Page, PageHeader } from "@/components/layout/page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listHeadcounts } from "@/features/attendance/queries";
import { RecordAttendanceModal } from "@/features/attendance/components/record-attendance-modal";
import { formatDate, formatNumber } from "@/lib/format";
import { requirePermission } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Attendance & Headcount" };

export default async function AttendancePage() {
  const user = await requirePermission("attendance:view");
  const [userUnit, headcounts] = await Promise.all([resolveUserUnit(user.scopeUnitId), listHeadcounts()]);

  return (
    <Page>
      <PageHeader
        title="Attendance & Headcount"
        description={`Historical attendance logs, demographic ratios, and Sunday worship headcount records for ${userUnit.unitName}.`}
        actions={
          <div className="flex items-center gap-2">
            <RecordAttendanceModal />
          </div>
        }
      />

      <div className="mb-6">
        <LiveHeadcountWidget parishName={userUnit.unitName} initialCount={headcounts[0]?.total || 0} />
      </div>

      {/* Headcount Records Table or Clean Empty State */}
      <Card>
        <CardHeader
          title="Recent Service Attendance Logs"
          description={`Verified counts recorded for ${userUnit.unitName}.`}
        />
        <CardContent className="pt-2">
          {headcounts.length === 0 ? (
            <EmptyState
              icon={<CheckCheck />}
              title="No attendance records found"
              description={`No headcount records have been logged yet for ${userUnit.unitName}. Press Alt+H or use the recorder above to record your first service headcount.`}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-2xs font-semibold text-muted-foreground uppercase">
                    <th className="py-2.5 pr-4">Date</th>
                    <th className="px-4 py-2.5">Service Type</th>
                    <th className="px-4 py-2.5 text-center">Men</th>
                    <th className="px-4 py-2.5 text-center">Women</th>
                    <th className="px-4 py-2.5 text-center">Children</th>
                    <th className="px-4 py-2.5 text-center font-bold text-foreground">Total</th>
                    <th className="px-4 py-2.5">Notes</th>
                    <th className="py-2.5 pl-4">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {headcounts.map((hc) => (
                    <tr key={hc.id} className="transition-colors hover:bg-surface-hover">
                      <td className="py-3 pr-4 font-semibold text-foreground">{formatDate(hc.date)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{hc.serviceType}</td>
                      <td className="px-4 py-3 text-center tabular font-medium text-blue-600 dark:text-blue-400">
                        {hc.men}
                      </td>
                      <td className="px-4 py-3 text-center tabular font-medium text-emerald-600 dark:text-emerald-400">
                        {hc.women}
                      </td>
                      <td className="px-4 py-3 text-center tabular font-medium text-amber-600 dark:text-amber-400">
                        {hc.children}
                      </td>
                      <td className="px-4 py-3 text-center tabular text-sm font-bold text-foreground">
                        {formatNumber(hc.total)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{hc.notes ?? "—"}</td>
                      <td className="py-3 pl-4 text-muted-foreground">{hc.recorder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
