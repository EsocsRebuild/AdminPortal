import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ImageIcon,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getBranchEvents } from "@/features/web-cms/queries";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Web Studio Dashboard · ESOCS" };

export default async function WebStudioDashboardPage() {
  const user = await requireSession();
  const unitInfo = await resolveUserUnit(user.scopeUnitId);
  const events = await getBranchEvents(user.scopeUnitId);

  const unitName = unitInfo.unitName;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Onboarding Guidance Banner for Web Administrators */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold tracking-wide text-amber-400 uppercase">
                  <ShieldCheck className="size-3.5" />
                  Content Administration Studio
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  <Building2 className="size-3 text-amber-400" />
                  {unitName}
                </span>
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-2xs font-semibold text-amber-300">
                  {user.role?.name ?? "Administrator"}
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Welcome, {user.name}
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Create and manage public church announcements, bulletins, programmes, and event listings for{" "}
                <span className="font-semibold text-amber-300">{unitName}</span>. All content is saved
                directly to the central church database.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/admin-web/events">
                <Button className="gap-1.5 bg-amber-500 text-xs font-bold text-slate-950 shadow-lg shadow-amber-950/50 hover:bg-amber-400">
                  <Plus className="size-4" />
                  Submit New Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3-Card Primary Actions */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Submit Event */}
          <Card className="group border-slate-800 bg-slate-900/80 transition-all duration-200 hover:border-amber-400/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                <Calendar className="size-5" />
              </div>
              <CardTitle className="text-base font-bold text-white">1. Submit New Event</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Publish revival nights, Sunday services, rallies, or conferences for public listing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin-web/events">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 bg-slate-950/60 text-xs text-slate-200 hover:border-amber-400/50 hover:bg-slate-800"
                    >
                      Open Events Studio
                      <Plus className="size-3.5 text-amber-400" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Guided form to create and submit an event</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Card 2: Track Submissions */}
          <Card className="group border-slate-800 bg-slate-900/80 transition-all duration-200 hover:border-amber-400/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                <Clock className="size-5" />
              </div>
              <CardTitle className="text-base font-bold text-white">2. Track Publications</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Monitor live publications and clearance records in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin-web/events">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 bg-slate-950/60 text-xs text-slate-200 hover:border-amber-400/50 hover:bg-slate-800"
                    >
                      View Events Status
                      <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-2xs font-semibold text-amber-300">
                        {events.length} Active
                      </span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Track Published, Draft, or Scheduled events</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Card 3: Media Gallery */}
          <Card className="group border-slate-800 bg-slate-900/80 transition-all duration-200 hover:border-amber-400/40">
            <CardHeader className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                <ImageIcon className="size-5" />
              </div>
              <CardTitle className="text-base font-bold text-white">3. Media Asset Library</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Upload and organize banners, logos, and public photos for your publications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin-web/media">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 bg-slate-950/60 text-xs text-slate-200 hover:border-amber-400/50 hover:bg-slate-800"
                    >
                      Open Media Gallery
                      <ArrowRight className="size-3.5 text-amber-400" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                  <p>Manage church banners and photographic assets</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>

        {/* Recent Unit Submissions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{unitName} Submissions</h3>
              <p className="text-xs text-slate-400">
                Live submission records and publication states for your unit.
              </p>
            </div>
            <Link href="/admin-web/events" className="text-xs font-semibold text-amber-400 hover:underline">
              View All Events & Bulletins →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <Calendar className="size-6" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-white">No events published yet for {unitName}</h4>
              <p className="mt-1 max-w-md text-xs text-slate-400">
                Your unit has not submitted any public events or service bulletins yet. Get started by
                publishing your first church programme.
              </p>
              <Link href="/admin-web/events" className="mt-4">
                <Button className="gap-1.5 bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400">
                  <Plus className="size-4" />
                  Submit First Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors hover:border-slate-700 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{evt.title}</span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-2xs text-amber-300">
                        {evt.category}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-slate-400">{evt.description}</p>
                    <div className="flex items-center gap-3 text-2xs text-slate-400">
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
                        Pending Clearance
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
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
