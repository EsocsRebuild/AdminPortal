import type { VettingStage } from "../types";
import { Building2, ShieldCheck, Award, UserCheck, Check, type LucideIcon } from "lucide-react";

const stages: { stage: VettingStage; label: string; icon: LucideIcon }[] = [
  { stage: "STAGE_1_PARISH", label: "Stage 1: Parish Nomination", icon: Building2 },
  { stage: "STAGE_2_DISTRICT", label: "Stage 2: District Vetting", icon: ShieldCheck },
  { stage: "STAGE_3_ZONAL", label: "Stage 3: Zonal Exam Clearance", icon: Award },
  { stage: "STAGE_4_SUPREME_APPROVED", label: "Stage 4: Supreme Council Approval", icon: UserCheck },
];

const stageOrder: Record<VettingStage, number> = {
  STAGE_1_PARISH: 1,
  STAGE_2_DISTRICT: 2,
  STAGE_3_ZONAL: 3,
  STAGE_4_SUPREME_APPROVED: 4,
};

export function CandidateStageBar({ currentStage }: { currentStage: VettingStage }) {
  const currentIdx = stageOrder[currentStage];

  return (
    <div className="w-full space-y-3 py-2">
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentIdx || currentStage === "STAGE_4_SUPREME_APPROVED";
          const isCurrent = stepNum === currentIdx && currentStage !== "STAGE_4_SUPREME_APPROVED";
          const Icon = s.icon;

          return (
            <div key={s.stage} className="flex flex-col items-center space-y-1.5 text-center">
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
              <span
                className={`max-w-[120px] text-2xs leading-tight font-semibold ${isDone || isCurrent ? "text-slate-200" : "text-slate-500"}`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
          style={{ width: `${(currentIdx / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
