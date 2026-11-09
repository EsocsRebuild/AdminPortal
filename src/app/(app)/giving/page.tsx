import * as React from "react";
import { ArrowUpRight, FileSpreadsheet, Plus, Wallet } from "lucide-react";
import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/server/session";
import { resolveUserUnit } from "@/server/units";
import { getGivingSummary, listBatches, listFunds } from "@/features/giving/queries";
import { NewFundModal } from "@/features/giving/components/new-fund-modal";
import { RecordBatchModal } from "@/features/giving/components/record-batch-modal";
import { BatchStatusToggle } from "@/features/giving/components/batch-status-toggle";

export const metadata: Metadata = { title: "Giving & Stewardship" };

function formatCurrency(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default async function GivingPage() {
  const session = await requirePermission("giving:view");
  const userUnit = await resolveUserUnit(session.scopeUnitId);

  const [funds, batches, summary] = await Promise.all([listFunds(), listBatches(), getGivingSummary()]);

  const totalFundsInVault = summary?.total ?? funds.reduce((acc, f) => acc + f.currentBalance, 0);
  const totalMonthToDate =
    summary?.byMonth?.at(-1)?.total ?? funds.reduce((acc, f) => acc + f.monthToDate, 0);
  const restrictedFundsTotal = funds
    .filter((f) => f.status === "restricted")
    .reduce((acc, f) => acc + f.currentBalance, 0);

  return (
    <Page>
      <PageHeader
        title="Giving & Stewardship"
        description={`Parish tithes, Sunday collection batches, and dedicated fund ledgers for ${userUnit.unitName}.`}
        actions={
          <div className="flex items-center gap-2">
            <RecordBatchModal />
            <NewFundModal />
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold text-muted-foreground uppercase">Total Unit Treasury</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalFundsInVault)}
          </div>
          <span className="text-2xs text-muted-foreground">
            Across {funds.length} verified {funds.length === 1 ? "ledger" : "ledgers"}
          </span>
        </div>
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold text-primary uppercase">Month-to-Date Collections</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalMonthToDate)}
          </div>
          <span className="flex items-center gap-1 text-2xs font-semibold text-muted-foreground">
            <ArrowUpRight className="size-3" /> Current billing cycle
          </span>
        </div>
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold text-purple-600 uppercase dark:text-purple-400">
            Restricted Capital Funds
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(restrictedFundsTotal)}
          </div>
          <span className="text-2xs text-muted-foreground">
            {restrictedFundsTotal > 0 ? "Designated capital projects" : "No restricted funds active"}
          </span>
        </div>
      </div>

      {/* Fund Ledgers Section */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Active Fund Ledgers</h2>
          <span className="text-2xs text-muted-foreground">{funds.length} configured</span>
        </div>

        {funds.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-6">
              <EmptyState
                icon={<Wallet className="size-6 text-amber-500" />}
                title="No Fund Ledgers Configured"
                description={`No active tithe, collection, or capital project ledgers have been created for ${userUnit.unitName}.`}
                action={
                  <Button variant="primary" leftIcon={<Plus className="size-4" />}>
                    Create First Fund Ledger
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {funds.map((f) => (
              <Card key={f.id} className="flex flex-col justify-between">
                <CardHeader
                  title={
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">{f.name}</span>
                      <Badge tone={f.status === "active" ? "success" : "info"} className="text-2xs uppercase">
                        {f.status}
                      </Badge>
                    </div>
                  }
                  description={f.description || `Ledger code: ${f.code}`}
                />
                <CardContent className="mt-auto border-t border-border-subtle pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xs text-muted-foreground">Current Balance</span>
                      <div className="text-base font-bold text-foreground">
                        {formatCurrency(f.currentBalance)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xs text-muted-foreground">This Month</span>
                      <div className="text-sm font-semibold text-primary">
                        {formatCurrency(f.monthToDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sunday Batches Reconciliation Table */}
      <Card>
        <CardHeader
          title="Sunday Collection Batches"
          description="Verified reconciliations of cash, POS machine terminals, and online transfers."
        />
        <CardContent className="pt-2">
          {batches.length === 0 ? (
            <EmptyState
              size="compact"
              icon={<FileSpreadsheet className="size-5 text-muted-foreground" />}
              title="No Collection Batches Recorded"
              description={`Sunday worship collections and teller counts for ${userUnit.unitName} will appear here.`}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-2xs font-semibold text-muted-foreground uppercase">
                    <th className="py-2.5 pr-4">Batch Number</th>
                    <th className="px-4 py-2.5">Service Date</th>
                    <th className="px-4 py-2.5 text-right">Cash</th>
                    <th className="px-4 py-2.5 text-right">POS Terminals</th>
                    <th className="px-4 py-2.5 text-right">Online Transfer</th>
                    <th className="px-4 py-2.5 text-right font-bold text-foreground">Total Verified</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                    <th className="py-2.5 pl-4">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {batches.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-surface-hover">
                      <td className="py-3 pr-4 font-mono font-semibold text-primary">{b.batchNumber}</td>
                      <td className="px-4 py-3 text-foreground">{formatDate(b.date)}</td>
                      <td className="px-4 py-3 text-right tabular text-muted-foreground">
                        {formatCurrency(b.cashTotal)}
                      </td>
                      <td className="px-4 py-3 text-right tabular text-muted-foreground">
                        {formatCurrency(b.posTotal)}
                      </td>
                      <td className="px-4 py-3 text-right tabular text-muted-foreground">
                        {formatCurrency(b.onlineTotal)}
                      </td>
                      <td className="px-4 py-3 text-right tabular font-bold text-foreground">
                        {formatCurrency(b.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <BatchStatusToggle batchId={b.id} initialStatus={b.status} />
                      </td>
                      <td className="py-3 pl-4 text-muted-foreground">{b.verifiedBy}</td>
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
