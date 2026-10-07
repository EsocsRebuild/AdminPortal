import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Globe,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getBranchEvents } from "@/features/web-cms/queries";

export const metadata: Metadata = { title: "Web Studio Dashboard · ESOCS" };

export default async function WebStudioDashboardPage() {
  const events = await getBranchEvents();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Onboarding Guidance Banner for New Users */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 p-6">
          <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <HelpCircle className="size-3.5" />
                  Branch Admin Guide
                </span>
                <span className="text-xs text-slate-400">Unit Scope: Mount Zion Parish</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Welcome to Mount Zion Web Content Studio
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Submit public church events, revival schedules, and programmes. Every submission is
                automatically tagged with your unit ID (`parish-mount-zion`) and routed to the Super Admin
                Vetting Queue for 1-click approval.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin-web/events">
                <Button className="gap-1.5 bg-emerald-600 text-xs font-medium text-white shadow-md shadow-emerald-950 hover:bg-emerald-500">
                  <Plus className="size-4" />
                  Submit New Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Uncomplicated 3-Card Primary Actions */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Submit Event */}
          <Card className="group border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-emerald-500/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                <Calendar className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold text-white">1. Submit New Event</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Publish revival nights, Sunday services, rallies, or conferences for public web listing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin-web/events">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 text-xs text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800"
                    >
                      Open Events Studio
                      <Plus className="size-3.5 text-emerald-400" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Guided form to create and submit an event for vetting</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Card 2: Track Submissions */}
          <Card className="group border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-emerald-500/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-transform group-hover:scale-110">
                <Clock className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold text-white">2. Track Vetting Status</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Monitor live approvals from the Super Admin Vetting Board in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin-web/events">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 text-xs text-slate-200 hover:border-amber-500/50 hover:bg-slate-800"
                    >
                      View Submission Status
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-2xs font-semibold text-amber-300">
                        {events.length} Active
                      </span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Track Pending, Approved, or Revision-Needed submissions</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Card 3: Preview Live Web Page */}
          <Card className="group border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-emerald-500/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400 transition-transform group-hover:scale-110">
                <Globe className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold text-white">3. Preview Public Page</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Instant live preview of your Parish landing page (`/church/mount-zion`).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/church/mount-zion" target="_blank">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 text-xs text-slate-200 hover:border-teal-500/50 hover:bg-slate-800"
                    >
                      Open Live Web Page
                      <ArrowUpRight className="size-3.5 text-teal-400" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Opens public Mount Zion website in a new tab</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>

        {/* Recent Unit Submissions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Mount Zion Submissions Roster</h3>
              <p className="text-xs text-slate-400">Live submission records and vetting states.</p>
            </div>
            <Link href="/admin-web/events" className="text-xs font-medium text-emerald-400 hover:underline">
              View All Submissions →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors hover:border-slate-700 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{evt.title}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-2xs text-slate-400">
                      {evt.category}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-xs text-slate-400">{evt.description}</p>
                  <div className="flex items-center gap-3 text-2xs text-slate-500">
                    <span>Venue: {evt.venue}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(evt.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {evt.status === "APPROVED_LIVE" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      Approved Live
                    </span>
                  )}
                  {evt.status === "PENDING_REVIEW" && (
                    <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                      <Clock className="size-3.5" />
                      Pending Vetting
                    </span>
                  )}
                  {evt.status === "NEEDS_REVISION" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                      <AlertCircle className="size-3.5" />
                      Needs Revision
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
