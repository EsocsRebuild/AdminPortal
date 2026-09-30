"use client";

import * as React from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Church,
  Compass,
  ExternalLink,
  Flame,
  HelpCircle,
  Keyboard,
  Layers,
  Lightbulb,
  Sparkles,
  Users,
} from "lucide-react";

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
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHotkey } from "@/hooks/use-hotkey";

export function QuickTipsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = React.useState("sunday");

  // Keyboard shortcut '?' or Shift+/ toggles the Quick Tips modal
  useHotkey("?", () => onOpenChange(!open));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="sm:max-w-2xl">
        <DialogHeader className="border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-panel bg-amber-500/10 text-amber-500 dark:bg-amber-400/15 dark:text-amber-400">
              <Lightbulb className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle>Church Admin Quick Guide & Pro Tips</DialogTitle>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary">
                  <Sparkles className="size-3" /> Interactive
                </span>
              </div>
              <DialogDescription className="text-sm">
                Essential best practices to manage your parish, fellowship sections, and Sunday operations smoothly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4 pt-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="pill" className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="sunday" className="gap-2 text-xs sm:text-sm">
                <CalendarCheck className="size-4" />
                Sunday Readiness
              </TabsTrigger>
              <TabsTrigger value="scoping" className="gap-2 text-xs sm:text-sm">
                <Church className="size-4" />
                Parish Scoping
              </TabsTrigger>
              <TabsTrigger value="sections" className="gap-2 text-xs sm:text-sm">
                <Layers className="size-4" />
                Fellowships & Sections
              </TabsTrigger>
              <TabsTrigger value="shortcuts" className="gap-2 text-xs sm:text-sm">
                <Keyboard className="size-4" />
                Shortcuts
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Sunday Readiness */}
            <TabsContent value="sunday" className="space-y-4 pt-4">
              <div className="rounded-control border border-border bg-surface-muted/50 p-3.5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Flame className="size-4 text-primary" />
                  The 4-Step Sunday Service Operating Workflow
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow these four steps each Lord's Day to keep your parish records 100% up-to-date and visitor follow-up effortless.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex gap-3 rounded-control border border-border p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    1
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Pre-Service Bulletin</h5>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Publish announcements under <span className="font-medium text-foreground">Communications</span> to push the order of service and hymn list to the public web portal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-control border border-border p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    2
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Mid-Service Headcount</h5>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Use the Quick Action button or press <Kbd keys={["Alt", "H"]} /> to record Men, Women, and Children counts directly during sermon time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-control border border-border p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    3
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Instant Guest Intake</h5>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Ushering team registers first-time guests using <Kbd keys={["Alt", "N"]} />. Marking them as "First-Time Guest" queues immediate pastoral care.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-control border border-border p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    4
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Tithes & Offerings</h5>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Close the Sunday giving batch under <span className="font-medium text-foreground">Giving &gt; Batches</span> with cash and POS totals for audit reconciliation.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Parish Scoping */}
            <TabsContent value="scoping" className="space-y-4 pt-4">
              <div className="rounded-control border border-border bg-surface-muted/50 p-3.5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Compass className="size-4 text-primary" />
                  Understanding Your Administrative Unit Scope
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Data in the ESOCS Platform is strictly partitioned to safeguard privacy and reduce clutter.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-control border border-border p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <h5 className="text-sm font-semibold text-foreground">Parish Administrators (e.g. Mount Zion)</h5>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Your account is permanently scoped to your local parish. You only see Mount Zion's members, attendance figures, finances, and forms. Submitting records automatically tags them to Mount Zion.
                  </p>
                </div>

                <div className="rounded-control border border-border p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <h5 className="text-sm font-semibold text-foreground">Super Administrators & Provincial Overseers</h5>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Use the <span className="font-medium text-foreground">Unit Switcher</span> in the top header bar to toggle between Global HQ overview and individual parishes or fellowships at any time.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Fellowships & Sections */}
            <TabsContent value="sections" className="space-y-4 pt-4">
              <div className="rounded-control border border-border bg-surface-muted/50 p-3.5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="size-4 text-primary" />
                  Autonomous Fellowship & Directorate Architecture
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Specialized arms have their own dedicated digital spaces with isolated rosters and event feeds.
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-control border border-border p-3">
                  <span className="text-xs font-semibold text-primary">🕊️ Women Fellowship</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Autonomous conference registrations, mothers' summit dues, and national directory updates.
                  </p>
                </div>
                <div className="rounded-control border border-border p-3">
                  <span className="text-xs font-semibold text-primary">⚡ Youth Fellowship</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Youth camp attendee passes, dynamic rally forms, and talent bank management.
                  </p>
                </div>
                <div className="rounded-control border border-border p-3">
                  <span className="text-xs font-semibold text-primary">🎵 Music Directorate / Choir</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choir rosters, rehearsal schedules, cantata tickets, and music library resources.
                  </p>
                </div>
                <div className="rounded-control border border-border p-3">
                  <span className="text-xs font-semibold text-primary">🤝 Welfare & Evangelism</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Charity distributions, benevolence requests, and soul-winning tracking.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Keyboard Shortcuts */}
            <TabsContent value="shortcuts" className="space-y-4 pt-4">
              <div className="rounded-control border border-border bg-surface-muted/50 p-3.5">
                <h4 className="text-sm font-semibold text-foreground">Power User Keyboard Shortcuts</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Speed through routine operations without taking your hands off the keyboard.
                </p>
              </div>

              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Global Command Menu</span>
                  <Kbd keys={["⌘", "K"]} />
                </div>
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Toggle Sidebar</span>
                  <Kbd keys={["⌘", "B"]} />
                </div>
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Quick Add Member</span>
                  <Kbd keys={["Alt", "N"]} />
                </div>
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Quick Sunday Headcount</span>
                  <Kbd keys={["Alt", "H"]} />
                </div>
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Open Quick Tips</span>
                  <Kbd keys={["?"]} />
                </div>
                <div className="flex items-center justify-between rounded-control border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">Quick Search</span>
                  <Kbd keys={["/"]} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogBody>

        <DialogFooter className="border-t border-border-subtle pt-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
