import type { VettingStage } from "../types";
import { Building2, ShieldCheck, Award, UserCheck, Check, type LucideIcon } from "lucide-react";

interface CandidateStageBarProps {
  currentStage: VettingStage;
  isProvincialWorshipper?: boolean;
}

const stageOrder: Record<VettingStage, number> = {
  STAGE_1_BRANCH: 1,
  STAGE_1_PARISH: 1,
  STAGE_2_DISTRICT: 2,
  STAGE_3_PROVINCIAL: 3,
  STAGE_3_ZONAL: 3,
  STAGE_4_NATIONAL: 4,
  STAGE_4_SUPREME_APPROVED: 4,
};

export function CandidateStageBar({ currentStage, isProvincialWorshipper = false }: CandidateStageBarProps) {
  const currentIdx = stageOrder[currentStage] || 1;
  const isFinalStage = currentStage === "STAGE_4_NATIONAL" || currentStage === "STAGE_4_SUPREME_APPROVED";

  const stages: {
    key: string;
    label: string;
    subtext?: string;
    icon: LucideIcon;
  }[] = [
    {
      key: "STAGE_1_BRANCH",
      label: "Stage 1: Branch Level Nomination",
      subtext: isProvincialWorshipper ? "Provincial Cathedral Branch" : "Local Branch Parish",
      icon: Building2,
    },
    {
      key: "STAGE_2_DISTRICT",
      label: isProvincialWorshipper ? "Stage 2: District Review (Direct Seat)" : "Stage 2: District Review",
      subtext: isProvincialWorshipper ? "Direct Provincial Jurisdiction" : "District Council Vetting",
      icon: ShieldCheck,
    },
    {
      key: "STAGE_3_PROVINCIAL",
      label: "Stage 3: Provincial Review",
      subtext: "Provincial Advisory Council",
      icon: Award,
    },
    {
      key: "STAGE_4_NATIONAL",
      label: "Stage 4: National Level",
      subtext: "Holy Synod Ratification",
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full space-y-3 py-2">
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s, idx) => {
          const stepNum = idx + 1;
          // If candidate worships at the provincial level and is at Stage 3 or beyond, District was automatically passed
          const isDone = stepNum < currentIdx || isFinalStage;
          const isCurrent = stepNum === currentIdx && !isFinalStage;
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center space-y-1.5 text-center">
              <div
                className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                  isDone
                    ? "border-emerald-400 bg-emerald-500 font-bold text-slate-950 shadow-md shadow-emerald-950/40"
                    : isCurrent
                      ? "animate-pulse border-amber-400 bg-amber-500/20 font-bold text-amber-400 ring-4 ring-amber-500/10"
                      : "border-slate-800 bg-slate-900 text-slate-500"
                }`}
              >
                {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
              </div>
              <div className="flex flex-col">
                <span
                  className={`max-w-32 text-2xs leading-tight font-semibold ${
                    isDone || isCurrent ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
                {s.subtext && (
                  <span className="text-3xs mt-0.5 truncate text-muted-foreground/75">{s.subtext}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-linear-to-r from-emerald-500 to-amber-400 transition-all duration-500"
          style={{ width: `${(currentIdx / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
