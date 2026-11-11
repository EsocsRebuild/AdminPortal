import "server-only";

import type { OrdinationCandidate, VettingStage } from "./types";

const inMemoryCandidates: OrdinationCandidate[] = [];

export function getLocalCandidates(): OrdinationCandidate[] {
  return inMemoryCandidates;
}

export function getLocalCandidateById(id: string): OrdinationCandidate | null {
  return inMemoryCandidates.find((c) => c.id === id || c.memberId === id) ?? null;
}

export function addLocalCandidate(cand: OrdinationCandidate): void {
  inMemoryCandidates.unshift(cand);
}

export function updateLocalCandidateDetails(id: string, updates: Partial<OrdinationCandidate>): boolean {
  const c = inMemoryCandidates.find((item) => item.id === id || item.memberId === id);
  if (!c) return false;
  Object.assign(c, updates);
  return true;
}

export function updateLocalCandidateStage(
  candidateId: string,
  newStage: VettingStage,
  handlerId: string,
  notes: string,
): boolean {
  const candidate = inMemoryCandidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  const now = new Date().toISOString();
  candidate.stageCurrent = newStage;

  if (!candidate.vettingHistory) candidate.vettingHistory = [];
  candidate.vettingHistory.push({
    stage: newStage,
    action: "APPROVED",
    handlerId,
    timestamp: now,
    notes,
  });

  return true;
}

export function rejectLocalCandidate(candidateId: string, handlerId: string, reason: string): boolean {
  const candidate = inMemoryCandidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  const now = new Date().toISOString();
  candidate.stageCurrent = "STAGE_4_NATIONAL"; // or current stage terminal
  if (!candidate.vettingHistory) candidate.vettingHistory = [];
  candidate.vettingHistory.push({
    stage: candidate.stageCurrent,
    action: "REJECTED",
    handlerId,
    timestamp: now,
    notes: reason,
  });

  return true;
}
