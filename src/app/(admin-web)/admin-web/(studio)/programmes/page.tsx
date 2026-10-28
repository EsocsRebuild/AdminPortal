import type { Metadata } from "next";
import { Megaphone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBranchProgrammes } from "@/features/web-cms/queries";
import { StudioProgrammeForm } from "@/features/web-cms/components/studio-programme-form";
import { StudioProgrammesRoster } from "@/features/web-cms/components/studio-programmes-roster";
import { requireSession } from "@/server/session";
import { resolveUserUnit } from "@/server/units";

export const metadata: Metadata = { title: "Programmes Schedule · ESOCS Web Admin" };

export default async function ProgrammesSchedulePage() {
  const user = await requireSession();
  const unitInfo = await resolveUserUnit(user.scopeUnitId);
  const programmes = await getBranchProgrammes(user.scopeUnitId);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="size-5 text-teal-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Programmes & Bulletin Schedule</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Manage church annual summits, quarterly theme schedules, and bulletin attachments for{" "}
              <span className="font-semibold text-amber-300">{unitInfo.unitName}</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Programme Form */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl lg:col-span-1">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <Plus className="size-4 text-teal-400" />
                  Submit Programme Schedule
                </div>
              }
              description={`Submit quarterly themes, keynote speakers, and bulletin links for ${unitInfo.unitName}.`}
            />
            <CardContent>
              <StudioProgrammeForm unitName={unitInfo.unitName} />
            </CardContent>
          </Card>

          {/* Right Column: Interactive Programmes List */}
          <div className="lg:col-span-2">
            <StudioProgrammesRoster
              key={programmes.map((p) => p.id).join(":")}
              initialProgrammes={programmes}
              unitName={unitInfo.unitName}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
