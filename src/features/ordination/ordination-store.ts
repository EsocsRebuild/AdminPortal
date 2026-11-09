import fs from "node:fs";
import path from "node:path";
import type { OrdinationCandidate, VettingStage } from "./types";

const DB_PATH = path.join(process.cwd(), "src/features/ordination/ordination-db.json");

function loadCandidatesFromDisk(): OrdinationCandidate[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // fallback if file read fails
  }

  return [];
}

function saveCandidatesToDisk(candidates: OrdinationCandidate[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(candidates, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function getLocalCandidates(): OrdinationCandidate[] {
  return loadCandidatesFromDisk();
}

export function getLocalCandidateById(id: string): OrdinationCandidate | null {
  const candidates = loadCandidatesFromDisk();
  return candidates.find((c) => c.id === id || c.memberId === id) ?? null;
}

export function updateLocalCandidateStage(
  candidateId: string,
  newStage: VettingStage,
  handlerId: string,
  notes: string,
): boolean {
  const candidates = loadCandidatesFromDisk();
  const candidate = candidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  candidate.stageCurrent = newStage;
  candidate.vettingHistory.push({
    stage: newStage,
    action: "APPROVED",
    handlerId,
    notes,
    timestamp: new Date().toISOString(),
  });

  saveCandidatesToDisk(candidates);
  return true;
}

export function updateLocalCandidateDetails(
  candidateId: string,
  updates: {
    duesStatus?: "pending" | "cleared" | "exempt";
    conductRating?: string;
    screeningNote?: string;
  },
): boolean {
  const candidates = loadCandidatesFromDisk();
  const candidate = candidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  if (updates.duesStatus) candidate.duesStatus = updates.duesStatus;
  if (updates.conductRating) candidate.conductRating = updates.conductRating;
  if (updates.screeningNote) {
    candidate.vettingHistory.push({
      stage: candidate.stageCurrent,
      action: "NEEDS_INFO",
      handlerId: "Secretariat Administration",
      notes: updates.screeningNote,
      timestamp: new Date().toISOString(),
    });
  }

  saveCandidatesToDisk(candidates);
  return true;
}

export function advanceLocalCandidateStage(
  candidateId: string,
  newStage: VettingStage,
  handlerId: string,
  notes: string,
): boolean {
  return updateLocalCandidateStage(candidateId, newStage, handlerId, notes);
}

export function rejectLocalCandidateStage(
  candidateId: string,
  stage: VettingStage,
  handlerId: string,
  notes: string,
): boolean {
  const candidates = loadCandidatesFromDisk();
  const candidate = candidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  candidate.vettingHistory.push({
    stage,
    action: "REJECTED",
    handlerId,
    notes,
    timestamp: new Date().toISOString(),
  });

  saveCandidatesToDisk(candidates);
  return true;
}

export function flagLocalCandidateStage(
  candidateId: string,
  stage: VettingStage,
  handlerId: string,
  notes: string,
): boolean {
  const candidates = loadCandidatesFromDisk();
  const candidate = candidates.find((c) => c.id === candidateId || c.memberId === candidateId);
  if (!candidate) return false;

  candidate.vettingHistory.push({
    stage,
    action: "NEEDS_INFO",
    handlerId,
    notes,
    timestamp: new Date().toISOString(),
  });

  saveCandidatesToDisk(candidates);
  return true;
}

export function addLocalCandidate(candidate: OrdinationCandidate): void {
  const candidates = loadCandidatesFromDisk();
  const existingIdx = candidates.findIndex((c) => c.id === candidate.id || c.memberId === candidate.memberId);
  if (existingIdx !== -1) {
    candidates[existingIdx] = candidate;
  } else {
    candidates.unshift(candidate);
  }
  saveCandidatesToDisk(candidates);
}
