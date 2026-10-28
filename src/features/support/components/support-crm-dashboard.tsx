"use client";

import * as React from "react";
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  User,
  Search,
  Send,
  Loader2,
  Award,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  replySupportTicketAction,
  updateTicketStatusAction,
} from "../actions";
import type { SupportTicket, SupportKpis, TicketCategory, TicketStatus } from "../types";

interface SupportCrmDashboardProps {
  initialTickets: SupportTicket[];
  kpis: SupportKpis;
}

const categoryLabels: Record<TicketCategory, string> = {
  ORDINATION_VETTING: "Ordination & Vetting Clearance",
  PARISH_MEMBERSHIP: "Parish Directory & Records",
  FINANCIAL_STEWARDSHIP: "Remittances & Stewardship Dues",
  MEDIA_AND_WEB: "Church Calendar & Media Studio",
  ACCOUNT_ACCESS: "Sign-In & Administrative Access",
  GENERAL_ENQUIRY: "General Secretariat Enquiry",
};

export function SupportCrmDashboard({ initialTickets, kpis }: SupportCrmDashboardProps) {
  const router = useRouter();
  const [tickets, setTickets] = React.useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string>(
    initialTickets[0]?.id || "",
  );
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | TicketStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Officer reply state
  const [replyText, setReplyText] = React.useState("");
  const [resolutionSummary, setResolutionSummary] = React.useState("");
  const [targetStatus, setTargetStatus] = React.useState<TicketStatus>("IN_REVIEW");
  const [loading, setLoading] = React.useState(false);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchName = t.complainantName.toLowerCase().includes(q);
      const matchParish = (t.parishName || "").toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchName && !matchParish) return false;
    }
    return true;
  });

  const handleOfficerReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setLoading(true);
    setActionSuccess(null);

    try {
      const res = await replySupportTicketAction({
        ticketId: selectedTicket.id,
        message: replyText.trim(),
        isStaff: true,
        newStatus: targetStatus,
      });

      setLoading(false);
      if (res.ok && res.data) {
        const updatedTicket: SupportTicket = {
          ...selectedTicket,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
          messages: [...selectedTicket.messages, res.data],
        };
        setTickets((prev) =>
          prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)),
        );
        setReplyText("");
        setActionSuccess("Official Secretariat response recorded and dispatched.");
        router.refresh();
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    setLoading(true);
    setActionSuccess(null);

    try {
      const res = await updateTicketStatusAction({
        ticketId: selectedTicket.id,
        status: newStatus,
        resolutionSummary: resolutionSummary.trim() || undefined,
      });

      setLoading(false);
      if (res.ok) {
        const updatedTicket: SupportTicket = {
          ...selectedTicket,
          status: newStatus,
          resolutionSummary: resolutionSummary.trim() || selectedTicket.resolutionSummary,
          updatedAt: new Date().toISOString(),
        };
        setTickets((prev) =>
          prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)),
        );
        setActionSuccess(`Ticket status updated to ${newStatus}`);
        router.refresh();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Enquiries
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <LifeBuoy className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{kpis.openTickets}</div>
          <span className="text-3xs text-muted-foreground">Requiring Secretariat attention</span>
        </Card>

        <Card className="border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Under Review
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{kpis.inReviewTickets}</div>
          <span className="text-3xs text-muted-foreground">Investigation in progress</span>
        </Card>

        <Card className="border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ordination Matters
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Award className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{kpis.ordinationIssues}</div>
          <span className="text-3xs text-muted-foreground">Vetting & docket queries</span>
        </Card>

        <Card className="border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resolved Cases
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{kpis.resolvedTickets}</div>
          <span className="text-3xs text-muted-foreground">Avg. response: {kpis.avgResolutionHours} hrs</span>
        </Card>
      </div>

      {/* Main Two-Pane CRM Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Tickets Queue (5 Cols) */}
        <div className="space-y-3 lg:col-span-5">
          {/* Search & Filter Bar */}
          <div className="space-y-2 rounded-xl border border-border bg-card p-3 shadow-xs">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticket #, parish, name..."
                className="h-8 pl-8 text-xs border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-7 w-full rounded border border-input bg-background px-2 text-2xs text-foreground focus:outline-none"
            >
              <option value="ALL">All Enquiry Categories</option>
              <option value="ORDINATION_VETTING">Ordination & Vetting Clearance</option>
              <option value="PARISH_MEMBERSHIP">Parish Directory & Records</option>
              <option value="FINANCIAL_STEWARDSHIP">Remittances & Dues</option>
              <option value="MEDIA_AND_WEB">Church Calendar & Media</option>
              <option value="ACCOUNT_ACCESS">Sign-In & Admin Access</option>
              <option value="GENERAL_ENQUIRY">General Enquiries</option>
            </select>

            <div className="flex flex-wrap items-center gap-1.5 text-2xs">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                  statusFilter === "ALL"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-surface-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("OPEN")}
                className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                  statusFilter === "OPEN"
                    ? "bg-cyan-600 text-white shadow-xs"
                    : "bg-surface-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Open ({kpis.openTickets})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("IN_REVIEW")}
                className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                  statusFilter === "IN_REVIEW"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-surface-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                In Review ({kpis.inReviewTickets})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("RESOLVED")}
                className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                  statusFilter === "RESOLVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Resolved ({kpis.resolvedTickets})
              </button>
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="space-y-2">
            {filteredTickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <LifeBuoy className="mx-auto mb-2 size-8 text-muted-foreground/60" />
                <p>No enquiries found matching your criteria.</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-primary/60 bg-primary/5 shadow-xs"
                        : "border-border bg-card hover:border-border/80 hover:bg-surface-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xs font-bold text-muted-foreground">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-3xs font-semibold ${
                          t.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : t.status === "IN_REVIEW"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        }`}
                      >
                        {t.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-foreground line-clamp-1">{t.title}</h4>

                    <div className="mt-2 flex items-center justify-between text-2xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="size-3 text-primary shrink-0" />
                        <span className="truncate">{t.complainantName}</span>
                      </div>
                      <span className="text-3xs">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>

                    {t.candidateReferenceId && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-3xs font-semibold text-amber-600 dark:text-amber-400">
                        <Award className="size-2.5" />
                        Candidate: {t.candidateReferenceId}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Resolution Desk (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader
                title={
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {selectedTicket.ticketNumber}
                        </span>
                        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-3xs font-medium text-foreground">
                          {categoryLabels[selectedTicket.category]}
                        </span>
                      </div>
                      <h2 className="mt-1 text-base font-bold text-foreground">
                        {selectedTicket.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedTicket.status !== "RESOLVED" ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={loading}
                          onClick={() => handleUpdateStatus("RESOLVED")}
                          className="gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="size-3.5" />
                          Mark Resolved
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          onClick={() => handleUpdateStatus("IN_REVIEW")}
                          className="text-xs"
                        >
                          Reopen Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                }
                description={
                  <div className="mt-1 grid grid-cols-1 gap-2 pt-1 text-2xs text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3 text-muted-foreground shrink-0" />
                      <span>{selectedTicket.complainantName} ({selectedTicket.complainantEmail})</span>
                    </div>
                    {selectedTicket.parishName && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3 text-muted-foreground shrink-0" />
                        <span>{selectedTicket.parishName} • {selectedTicket.provinceName || "National"}</span>
                      </div>
                    )}
                  </div>
                }
              />

              <CardContent className="space-y-4 pt-2">
                {actionSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                {/* Candidate Link Alert if applicable */}
                {selectedTicket.candidateReferenceId && (
                  <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Award className="size-4 text-amber-500" />
                      <div>
                        <span className="font-bold text-foreground">
                          Candidate Reference: {selectedTicket.candidateReferenceId}
                        </span>
                        <p className="text-2xs text-muted-foreground">
                          This complaint references a national ordination candidate vetting docket.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/ordination")}
                      className="gap-1 text-2xs"
                    >
                      View Ordination
                      <ArrowUpRight className="size-3" />
                    </Button>
                  </div>
                )}

                {/* Conversation Thread */}
                <div className="space-y-3">
                  <h3 className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Enquiry & Response History ({selectedTicket.messages.length})
                  </h3>

                  <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-xl p-3.5 text-xs ${
                          m.isStaff
                            ? "border border-primary/20 bg-primary/5 text-foreground"
                            : "border border-border bg-surface-muted/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-border pb-1.5 text-3xs">
                          <span className="font-bold text-foreground">
                            {m.senderName} ({m.senderRole})
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {new Date(m.sentAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-foreground">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secretariat Official Reply Box */}
                <div className="space-y-3 rounded-xl border border-border bg-surface-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">
                      Reply as Central Secretariat Officer
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-3xs text-muted-foreground">Set Status:</span>
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value as TicketStatus)}
                        className="h-7 rounded border border-input bg-background px-2 text-3xs font-medium text-foreground focus:outline-none"
                      >
                        <option value="IN_REVIEW">Under Review</option>
                        <option value="RESOLVED">Resolved & Closed</option>
                        <option value="ESCALATED">Escalate to Supreme Council</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Write an official response to the church member or district secretariat..."
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />

                  {targetStatus === "RESOLVED" && (
                    <Input
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      placeholder="Optional: Brief resolution summary for the church audit records..."
                      className="h-8 border-input bg-background text-2xs text-foreground placeholder:text-muted-foreground"
                    />
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      disabled={loading || !replyText.trim()}
                      onClick={handleOfficerReply}
                      className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          Send Official Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
              Select an enquiry from the left queue to view and resolve.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
