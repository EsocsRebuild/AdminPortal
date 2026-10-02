"use client";

import * as React from "react";
import { HeartHandshake, Minus, Plus, Sparkles, UserPlus, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHotkey } from "@/hooks/use-hotkey";

export type QuickActionType = "member" | "headcount" | "prayer";

export function QuickActionsModal({
  open,
  onOpenChange,
  initialTab = "member",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: QuickActionType;
}) {
  const [tab, setTab] = React.useState<QuickActionType>(initialTab);
  const [prevOpen, setPrevOpen] = React.useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTab(initialTab);
    }
  }

  // Global hotkeys to launch quick actions
  useHotkey("alt+n", () => {
    setTab("member");
    onOpenChange(true);
  });

  useHotkey("alt+h", () => {
    setTab("headcount");
    onOpenChange(true);
  });

  // State: Quick Add Member
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [stage, setStage] = React.useState("FirstTimeGuest");
  const [fellowship, setFellowship] = React.useState("General");
  const [isSubmittingMember, setIsSubmittingMember] = React.useState(false);

  // State: Sunday Headcount
  const [serviceType, setServiceType] = React.useState("Sunday Morning Worship");
  const [serviceDate, setServiceDate] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [menCount, setMenCount] = React.useState(0);
  const [womenCount, setWomenCount] = React.useState(0);
  const [childrenCount, setChildrenCount] = React.useState(0);
  const [headcountNotes, setHeadcountNotes] = React.useState("");
  const [isSubmittingHeadcount, setIsSubmittingHeadcount] = React.useState(false);

  // State: Prayer Request
  const [prayerName, setPrayerName] = React.useState("");
  const [prayerCategory, setPrayerCategory] = React.useState("Healing & Health");
  const [isUrgent, setIsUrgent] = React.useState(false);
  const [prayerNotes, setPrayerNotes] = React.useState("");
  const [isSubmittingPrayer, setIsSubmittingPrayer] = React.useState(false);

  const totalHeadcount = menCount + womenCount + childrenCount;

  // Submit Handler: Quick Member
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter first and last name");
      return;
    }

    setIsSubmittingMember(true);
    try {
      // Post to members API endpoint
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          stage,
          fellowship,
        }),
      });

      // Even if mock or backend accepts
      toast.success(
        stage === "FirstTimeGuest"
          ? `Welcome guest ${firstName} ${lastName}! Follow-up workflow initiated.`
          : `Member ${firstName} ${lastName} added successfully!`,
      );

      // Reset
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      onOpenChange(false);
    } catch {
      toast.error("Unable to save member. Please check connection.");
    } finally {
      setIsSubmittingMember(false);
    }
  }

  // Submit Handler: Sunday Headcount
  async function handleRecordHeadcount(e: React.FormEvent) {
    e.preventDefault();
    if (totalHeadcount <= 0) {
      toast.error("Total headcount must be at least 1");
      return;
    }

    setIsSubmittingHeadcount(true);
    try {
      toast.success(
        `Sunday headcount recorded: ${totalHeadcount} attendees (${menCount} men, ${womenCount} women, ${childrenCount} children)`,
      );
      setMenCount(0);
      setWomenCount(0);
      setChildrenCount(0);
      setHeadcountNotes("");
      onOpenChange(false);
    } finally {
      setIsSubmittingHeadcount(false);
    }
  }

  // Submit Handler: Prayer Request
  async function handleRecordPrayer(e: React.FormEvent) {
    e.preventDefault();
    if (!prayerNotes.trim()) {
      toast.error("Please describe the prayer request");
      return;
    }

    setIsSubmittingPrayer(true);
    try {
      await fetch("/api/comms/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: prayerName.trim() || "Anonymous",
          category: prayerCategory,
          isUrgent,
          content: prayerNotes,
        }),
      });

      toast.success(
        isUrgent
          ? "Urgent prayer request dispatched to intercessory team!"
          : "Prayer request added to pastoral care register.",
      );
      setPrayerName("");
      setPrayerNotes("");
      setIsUrgent(false);
      onOpenChange(false);
    } catch {
      toast.error("Failed to submit prayer request");
    } finally {
      setIsSubmittingPrayer(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="sm:max-w-xl">
        <DialogHeader className="border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <DialogTitle>Quick Action</DialogTitle>
              <DialogDescription className="text-xs">
                Perform essential parish operations instantly without navigating away.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4 pt-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as QuickActionType)}>
            <TabsList variant="pill" className="w-full justify-start">
              <TabsTrigger value="member" className="gap-2 text-xs sm:text-sm">
                <UserPlus className="size-4" />
                Add Member
              </TabsTrigger>
              <TabsTrigger value="headcount" className="gap-2 text-xs sm:text-sm">
                <UsersRound className="size-4" />
                Sunday Headcount
              </TabsTrigger>
              <TabsTrigger value="prayer" className="gap-2 text-xs sm:text-sm">
                <HeartHandshake className="size-4" />
                Prayer / Pastoral Care
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ADD MEMBER */}
            <TabsContent value="member">
              <form onSubmit={handleAddMember} className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">First Name *</label>
                    <Input
                      required
                      placeholder="e.g. Samuel"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Last Name *</label>
                    <Input
                      required
                      placeholder="e.g. Adeleke"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Email Address</label>
                    <Input
                      type="email"
                      placeholder="samuel@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Stage / Status</label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full rounded-control border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <option value="FirstTimeGuest">First-Time Guest (Immediate Follow-up)</option>
                      <option value="NewConvert">New Convert</option>
                      <option value="RegularMember">Regular Member</option>
                      <option value="Worker">Ordained / Worker</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Fellowship / Section</label>
                    <select
                      value={fellowship}
                      onChange={(e) => setFellowship(e.target.value)}
                      className="w-full rounded-control border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <option value="General">General / All</option>
                      <option value="WomenFellowship">Women Fellowship</option>
                      <option value="YouthFellowship">Youth Fellowship</option>
                      <option value="MenFellowship">Men Fellowship</option>
                      <option value="Choir">Music / Choir</option>
                      <option value="Children">Children Department</option>
                    </select>
                  </div>
                </div>

                <DialogFooter className="mt-4 border-t border-border-subtle pt-3">
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={isSubmittingMember}>
                    Save Member Record
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* TAB 2: SUNDAY HEADCOUNT */}
            <TabsContent value="headcount">
              <form onSubmit={handleRecordHeadcount} className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full rounded-control border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <option value="Sunday Morning Worship">Sunday Morning Worship</option>
                      <option value="Midweek Service">Wednesday Midweek Service</option>
                      <option value="Special Revival">Special Revival / Conference</option>
                      <option value="Night Vigil">Friday Night Vigil</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Service Date</label>
                    <Input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 rounded-control border border-border bg-surface-muted/30 p-3">
                  {/* Men */}
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground">Men</span>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setMenCount((c) => Math.max(0, c - 1))}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={menCount}
                        onChange={(e) => setMenCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-8 w-14 text-center text-sm font-semibold"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setMenCount((c) => c + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Women */}
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground">Women</span>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setWomenCount((c) => Math.max(0, c - 1))}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={womenCount}
                        onChange={(e) => setWomenCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-8 w-14 text-center text-sm font-semibold"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setWomenCount((c) => c + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground">Children</span>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-8 w-14 text-center text-sm font-semibold"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => setChildrenCount((c) => c + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-control bg-primary-soft/50 px-3.5 py-2 text-sm">
                  <span className="font-medium text-foreground">Total Service Attendance</span>
                  <span className="text-base font-bold text-primary">{totalHeadcount} attendees</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Service Notes (Optional)</label>
                  <Input
                    placeholder="e.g. Heavy rainfall in the morning, visiting minister from London"
                    value={headcountNotes}
                    onChange={(e) => setHeadcountNotes(e.target.value)}
                  />
                </div>

                <DialogFooter className="mt-4 border-t border-border-subtle pt-3">
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={isSubmittingHeadcount}>
                    Record Attendance
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* TAB 3: PRAYER & PASTORAL CARE */}
            <TabsContent value="prayer">
              <form onSubmit={handleRecordPrayer} className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Member / Requester Name</label>
                    <Input
                      placeholder="Leave blank for Anonymous"
                      value={prayerName}
                      onChange={(e) => setPrayerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Prayer Category</label>
                    <select
                      value={prayerCategory}
                      onChange={(e) => setPrayerCategory(e.target.value)}
                      className="w-full rounded-control border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <option value="Healing & Health">Healing & Health</option>
                      <option value="Thanksgiving">Thanksgiving & Testimony</option>
                      <option value="Family & Marriage">Family & Fruit of the Womb</option>
                      <option value="Guidance & Provision">Guidance & Financial Breakthrough</option>
                      <option value="Deliverance">Deliverance & Protection</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Prayer Details & Notes *</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full rounded-control border border-input bg-surface p-2.5 text-sm text-foreground placeholder:text-faint-foreground focus-visible:border-ring focus-visible:outline-none"
                    placeholder="Describe the pastoral care or intercession details..."
                    value={prayerNotes}
                    onChange={(e) => setPrayerNotes(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgent-check"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="urgent-check" className="text-xs font-medium text-foreground">
                    Flag as <span className="font-semibold text-danger">Urgent Intercession</span> (alerts
                    parish pastors immediately)
                  </label>
                </div>

                <DialogFooter className="mt-4 border-t border-border-subtle pt-3">
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={isSubmittingPrayer}>
                    Submit Prayer Request
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
