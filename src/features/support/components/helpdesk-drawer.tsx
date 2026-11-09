"use client";

import * as React from "react";
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { lodgeSupportTicketAction, replySupportTicketAction } from "../actions";
import type { SupportTicket, TicketCategory, TicketPriority } from "../types";

interface HelpdeskDrawerProps {
  initialTickets?: SupportTicket[];
  trigger?: React.ReactNode;
  defaultCategory?: TicketCategory;
  defaultCandidateRef?: string;
  defaultSubject?: string;
}

const categoryLabels: Record<TicketCategory, string> = {
  ORDINATION_VETTING: "Ordination & Vetting Clearance",
  PARISH_MEMBERSHIP: "Parish Directory & Records",
  FINANCIAL_STEWARDSHIP: "Remittances & Stewardship Dues",
  MEDIA_AND_WEB: "Church Calendar & Media Studio",
  ACCOUNT_ACCESS: "Sign-In & Administrative Access",
  GENERAL_ENQUIRY: "General Secretariat Enquiry",
};

export function HelpdeskDrawer({
  initialTickets = [],
  trigger,
  defaultCategory = "ORDINATION_VETTING",
  defaultCandidateRef = "",
  defaultSubject = "",
}: HelpdeskDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"lodge" | "tickets">("lodge");
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null);
  const [tickets, setTickets] = React.useState<SupportTicket[]>(initialTickets);

  // Form states
  const [subject, setSubject] = React.useState(defaultSubject);
  const [category, setCategory] = React.useState<TicketCategory>(defaultCategory);
  const [priority, setPriority] = React.useState<TicketPriority>("STANDARD");
  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [candidateRef, setCandidateRef] = React.useState(defaultCandidateRef);
  const [parish, setParish] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = React.useState<SupportTicket | null>(null);

  // Reply state
  const [replyText, setReplyText] = React.useState("");
  const [replyLoading, setReplyLoading] = React.useState(false);

  const handleLodgeTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !name.trim() || !email.trim()) {
      setError("Please complete all required fields so the Secretariat can assist you.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await lodgeSupportTicketAction({
        title: subject.trim(),
        category,
        priority,
        message: message.trim(),
        complainantName: name.trim(),
        complainantEmail: email.trim(),
        complainantPhone: phone.trim() || undefined,
        candidateReferenceId: candidateRef.trim() || undefined,
        parishName: parish.trim() || undefined,
      });

      setLoading(false);
      if (res.ok && res.data) {
        setSubmittedTicket(res.data);
        setTickets((prev) => [res.data!, ...prev]);
        setSubject("");
        setMessage("");
        router.refresh();
      } else {
        setError(res.message || "Unable to submit enquiry. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected network interruption occurred. Please try again.");
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setReplyLoading(true);

    try {
      const res = await replySupportTicketAction({
        ticketId: selectedTicket.id,
        message: replyText.trim(),
        isStaff: false,
      });

      setReplyLoading(false);
      if (res.ok && res.data) {
        const updatedTicket = {
          ...selectedTicket,
          messages: [...selectedTicket.messages, res.data],
        };
        setSelectedTicket(updatedTicket);
        setTickets((prev) =>
          prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)),
        );
        setReplyText("");
        router.refresh();
      }
    } catch {
      setReplyLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
          >
            <LifeBuoy className="size-4" />
            Secretariat Helpdesk & Enquiries
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-border bg-card p-6 text-foreground shadow-2xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <LifeBuoy className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Secretariat Helpdesk & Member Care
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Lodge enquiries, report ordination vetting questions, or communicate with the Central Secretariat.
                </p>
              </div>
            </div>

            {/* Quick Switch Tabs */}
            <div className="flex rounded-lg border border-border bg-surface-muted/60 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("lodge");
                  setSelectedTicket(null);
                }}
                className={`rounded-md px-3 py-1 font-semibold transition-all ${
                  activeTab === "lodge" && !selectedTicket
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                New Enquiry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition-all ${
                  activeTab === "tickets"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Track Issues</span>
                {tickets.length > 0 && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-3xs font-bold text-emerald-600 dark:text-emerald-400">
                    {tickets.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Tab 1: Submit New Enquiry / Complaint */}
        {activeTab === "lodge" && !submittedTicket && (
          <form onSubmit={handleLodgeTicket} className="space-y-4 pt-3 text-xs">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  What is this enquiry regarding? *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="ORDINATION_VETTING">Ordination & Vetting Clearance</option>
                  <option value="PARISH_MEMBERSHIP">Parish Directory & Records</option>
                  <option value="FINANCIAL_STEWARDSHIP">Remittances & Stewardship Dues</option>
                  <option value="MEDIA_AND_WEB">Church Calendar & Media Studio</option>
                  <option value="ACCOUNT_ACCESS">Sign-In & Administrative Access</option>
                  <option value="GENERAL_ENQUIRY">General Secretariat Enquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Urgency Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="STANDARD">Standard Review (Within 24 Hours)</option>
                  <option value="HIGH">High Priority (Within 6 Hours)</option>
                  <option value="URGENT">Immediate Synod Attention</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Subject / Summary *</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly state your question or issue..."
                required
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
              />
            </div>

            {/* Optional Candidate / Member Reference */}
            {category === "ORDINATION_VETTING" && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
                <label className="font-semibold text-amber-600 dark:text-amber-400">
                  Candidate Registration Number or Full Name (Optional)
                </label>
                <Input
                  value={candidateRef}
                  onChange={(e) => setCandidateRef(e.target.value)}
                  placeholder="e.g. ESOCS/ORD/2026/6416 or Bro. Peter Chima"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500"
                />
                <span className="text-3xs text-muted-foreground">
                  Helps the vetting committee locate the candidate dossier immediately.
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Detailed Message / What happened? *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
                placeholder="Kindly explain what you need assistance with in simple words..."
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 gap-3 border-t border-border pt-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-3xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elder David Okoro"
                  required
                  className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="e.g. david@esocs.org"
                  required
                  className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number (Optional)
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 800 000 0000"
                  className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-3xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Parish / Branch (Optional)
                </label>
                <Input
                  value={parish}
                  onChange={(e) => setParish(e.target.value)}
                  placeholder="e.g. Diobu Cathedral Branch, Port Harcourt"
                  className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting to Secretariat...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Lodge Enquiry with Secretariat Desk
                </>
              )}
            </Button>
          </form>
        )}

        {/* Success Confirmation Card */}
        {submittedTicket && (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-md">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Your Enquiry Has Been Received</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                A member care officer at the Secretariat has been assigned to assist you.
              </p>
            </div>

            <div className="mx-auto max-w-md rounded-xl border border-border bg-surface-muted/50 p-4 text-left text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Reference Number:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {submittedTicket.ticketNumber}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-2xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Subject:</strong> {submittedTicket.title}
                </p>
                <p>
                  <strong className="text-foreground">Category:</strong> {categoryLabels[submittedTicket.category]}
                </p>
                <p>
                  <strong className="text-foreground">Status:</strong> Awaiting Secretariat Response
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmittedTicket(null);
                  setSelectedTicket(submittedTicket);
                  setActiveTab("tickets");
                }}
                className="border-border text-xs text-muted-foreground hover:text-foreground"
              >
                View Ticket Thread
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setSubmittedTicket(null);
                  setOpen(false);
                }}
                className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Close & Return
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Track Active Issues & Threaded Conversation */}
        {activeTab === "tickets" && !selectedTicket && (
          <div className="space-y-3 pt-2">
            {tickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <LifeBuoy className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p>You have not logged any complaints or enquiries yet.</p>
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition-all hover:border-border/80 hover:bg-surface-muted/40 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                    <h4 className="text-xs font-bold text-foreground">{t.title}</h4>
                    <p className="text-3xs text-muted-foreground">{categoryLabels[t.category]}</p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-3xs">{new Date(t.createdAt).toLocaleDateString()}</span>
                    <ChevronRight className="size-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Ticket Chat & Details View */}
        {activeTab === "tickets" && selectedTicket && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ← Back to Ticket List
              </button>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {selectedTicket.ticketNumber}
              </span>
            </div>

            <div className="rounded-lg border border-border bg-surface-muted/50 p-2.5 text-xs text-foreground">
              <span className="font-bold text-foreground">{selectedTicket.title}</span>
              <div className="mt-1 flex flex-wrap gap-3 text-3xs text-muted-foreground">
                <span>Category: {categoryLabels[selectedTicket.category]}</span>
                {selectedTicket.candidateReferenceId && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Candidate Ref: {selectedTicket.candidateReferenceId}
                  </span>
                )}
                <span>Status: {selectedTicket.status}</span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl p-3 text-xs ${
                    m.isStaff
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-foreground"
                      : "border border-border bg-card text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-1 text-3xs">
                    <span className="font-semibold text-foreground">
                      {m.senderName} ({m.senderRole})
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="flex gap-2 pt-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a response or follow-up note..."
                className="h-9 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500"
              />
              <Button
                type="button"
                size="sm"
                disabled={replyLoading || !replyText.trim()}
                onClick={handleSendReply}
                className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {replyLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
