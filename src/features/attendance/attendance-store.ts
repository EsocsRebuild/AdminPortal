import type { HeadcountRecord } from "./queries";

const inMemoryHeadcounts: HeadcountRecord[] = [];

export function getLocalHeadcounts(): HeadcountRecord[] {
  return inMemoryHeadcounts;
}

export function addLocalHeadcount(record: HeadcountRecord): void {
  inMemoryHeadcounts.unshift(record);
}

export function updateLatestLiveCount(delta: number): number {
  if (inMemoryHeadcounts.length > 0) {
    inMemoryHeadcounts[0].total = Math.max(0, inMemoryHeadcounts[0].total + delta);
    return inMemoryHeadcounts[0].total;
  }
  return 0;
}
