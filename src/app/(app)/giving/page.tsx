import * as React from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Download,
  FileSpreadsheet,
  Lock,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";

import { GivingChart } from "@/components/charts/giving-chart";
import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextualTipCard } from "@/components/ui/contextual-tip-card";
import { formatDate } from "@/lib/format";
import { requirePermission } from "@/server/session";

export const metadata: Metadata = { title: "Giving & Stewardship" };

function formatCurrency(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

interface FundLedger {
  id: string;
  name: string;
  code: string;
  description: string;
  currentBalance: number;
  monthToDate: number;
  status: "active" | "restricted";
}

const mockFunds: FundLedger[] = [
  {
    id: "fnd-tithes",
    name: "General Tithes (Malachi 3:10)",
    code: "TTH-01",
    description: "Ten percent sacred offering dedicated to the upkeep of the Holy Order and clergy.",
    currentBalance: 14250000,
    monthToDate: 2900000,
    status: "active",
  },
  {
    id: "fnd-offering",
    name: "Sunday Worship Collections",
    code: "OFF-01",
    description: "Regular Sunday service cash, transfer, and POS worship offerings.",
    currentBalance: 5820000,
    monthToDate: 980000,
    status: "active",
  },
  {
    id: "fnd-building",
    name: "Cathedral Expansion & Building Project",
    code: "BLD-01",
    description: "Dedicated capital expenditure fund for structural roofing and audio-visual installations.",
    currentBalance: 28400000,
    monthToDate: 850000,
    status: "restricted",
  },
  {
    id: "fnd-welfare",
    name: "Widows, Orphans & Mercy Ministry",
    code: "WLF-01",
    description: "Benevolence disbursements for elderly welfare, student stipends, and medical relief.",
    currentBalance: 3120000,
    monthToDate: 380000,
    status: "active",
  },
];

interface GivingBatch {
  id: string;
  batchNumber: string;
  date: string;
  cashTotal: number;
  posTotal: number;
  onlineTotal: number;
  total: number;
  status: "open" | "verified" | "reconciled";
  verifiedBy: string;
}

const mockBatches: GivingBatch[] = [
  {
    id: "bat-2026-09-27",
    batchNumber: "BAT-MZP-20260927",
    date: "2026-09-27",
    cashTotal: 1450000,
    posTotal: 1820000,
    onlineTotal: 1840000,
    total: 5110000,
    status: "reconciled",
    verifiedBy: "Elder Adeleke & Pastor Johnson",
  },
  {
    id: "bat-2026-09-20",
    batchNumber: "BAT-MZP-20260920",
    date: "2026-09-20",
    cashTotal: 1280000,
    posTotal: 1650000,
    onlineTotal: 1680000,
    total: 4610000,
    status: "reconciled",
    verifiedBy: "Elder Adeleke & Pastor Johnson",
  },
  {
    id: "bat-2026-09-13",
    batchNumber: "BAT-MZP-20260913",
    date: "2026-09-13",
    cashTotal: 1100000,
    posTotal: 1420000,
    onlineTotal: 1590000,
    total: 4110000,
    status: "reconciled",
    verifiedBy: "Elder Adeleke & Pastor Johnson",
  },
];

export default async function GivingPage() {
  const user = await requirePermission("giving:view");

  const totalFundsInVault = mockFunds.reduce((acc, f) => acc + f.currentBalance, 0);
  const totalMonthToDate = mockFunds.reduce((acc, f) => acc + f.monthToDate, 0);

  return (
    <Page>
      <PageHeader
        title="Giving & Stewardship"
        description="Parish tithes, Sunday collection batches, dedicated building funds, and welfare ledgers."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" leftIcon={<FileSpreadsheet className="size-4" />}>
              Giving Statements
            </Button>
            <Button variant="primary" leftIcon={<Plus className="size-4" />}>
              New Fund Ledger
            </Button>
          </div>
        }
      />

      <ContextualTipCard
        id="giving_reconciliation_tip"
        title="Dual-Control Batch Closing"
        description="Sunday collection batches require sign-off by both the Financial Secretary and Parish Pastor before closing."
        actionText="Read Policy"
        className="mb-4"
      />

      {/* Summary KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold uppercase text-muted-foreground">Total Parish Treasury</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalFundsInVault)}</div>
          <span className="text-2xs text-muted-foreground">Across 4 verified accounts</span>
        </div>
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold uppercase text-primary">Month-to-Date Collections</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalMonthToDate)}</div>
          <span className="text-2xs text-success font-semibold flex items-center gap-1">
            <ArrowUpRight className="size-3" /> +14.2% vs previous month
          </span>
        </div>
        <div className="rounded-control border border-border bg-surface p-4 shadow-xs">
          <span className="text-2xs font-semibold uppercase text-purple-600 dark:text-purple-400">Restricted Capital Funds</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{formatCurrency(28400000)}</div>
          <span className="text-2xs text-muted-foreground">Cathedral Building Project</span>
        </div>
      </div>

      {/* Interactive Giving Trends Chart */}
      <GivingChart className="mb-6" />

      {/* Fund Ledgers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {mockFunds.map((f) => (
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
              description={f.description}
            />
            <CardContent className="mt-auto border-t border-border-subtle pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs text-muted-foreground">Current Balance</span>
                  <div className="text-base font-bold text-foreground">{formatCurrency(f.currentBalance)}</div>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-muted-foreground">This Month</span>
                  <div className="text-sm font-semibold text-primary">{formatCurrency(f.monthToDate)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sunday Batches Reconciliation Table */}
      <Card>
        <CardHeader
          title="Sunday Collection Batches"
          description="Verified reconciliations of cash, POS machine terminals, and online transfers."
        />
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-2xs font-semibold uppercase text-muted-foreground">
                  <th className="py-2.5 pr-4">Batch Number</th>
                  <th className="py-2.5 px-4">Service Date</th>
                  <th className="py-2.5 px-4 text-right">Cash</th>
                  <th className="py-2.5 px-4 text-right">POS Terminals</th>
                  <th className="py-2.5 px-4 text-right">Online Transfer</th>
                  <th className="py-2.5 px-4 text-right font-bold text-foreground">Total Verified</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 pl-4">Verified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {mockBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 pr-4 font-mono font-semibold text-primary">{b.batchNumber}</td>
                    <td className="py-3 px-4 text-foreground">{formatDate(b.date)}</td>
                    <td className="py-3 px-4 text-right tabular text-muted-foreground">{formatCurrency(b.cashTotal)}</td>
                    <td className="py-3 px-4 text-right tabular text-muted-foreground">{formatCurrency(b.posTotal)}</td>
                    <td className="py-3 px-4 text-right tabular text-muted-foreground">{formatCurrency(b.onlineTotal)}</td>
                    <td className="py-3 px-4 text-right tabular font-bold text-foreground">{formatCurrency(b.total)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Reconciled
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-muted-foreground">{b.verifiedBy}</td>
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
