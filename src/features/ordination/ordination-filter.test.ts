import { describe, it, expect } from "vitest";
import { getOrdinationCandidates } from "./queries";

describe("Ordination Candidates Jurisdiction & Filtering Engine", () => {
  it("strictly isolates Diobu Province data and excludes Lagos Central candidates like peter chima tester", async () => {
    const result = await getOrdinationCandidates({ province: "Diobu Province" });

    // Every returned candidate MUST be in Diobu Province
    expect(result.candidates.length).toBeGreaterThan(0);
    for (const c of result.candidates) {
      expect((c.provinceName || "").toLowerCase()).toContain("diobu");
    }

    // peter chima tester from Lagos Central Province must NOT appear
    const peter = result.candidates.find((c) => c.fullName.toLowerCase().includes("peter chima"));
    expect(peter).toBeUndefined();

    // Diobu candidate must be present
    const diobuCandidate = result.candidates.find((c) =>
      c.fullName.toLowerCase().includes("daniel w. briggs"),
    );
    expect(diobuCandidate).toBeDefined();
    expect(diobuCandidate?.provinceName).toBe("Diobu Province");
  });

  it("returns Lagos Central Province candidates only when scoped to Lagos Central", async () => {
    const result = await getOrdinationCandidates({ province: "Lagos Central Province" });

    expect(result.candidates.length).toBeGreaterThan(0);
    for (const c of result.candidates) {
      expect((c.provinceName || "").toLowerCase()).toContain("lagos central");
    }

    // peter chima tester belongs to Lagos Central Province
    const peter = result.candidates.find((c) => c.fullName.toLowerCase().includes("peter chima"));
    expect(peter).toBeDefined();

    // Diobu candidate must NOT be present
    const diobuCandidate = result.candidates.find((c) =>
      c.fullName.toLowerCase().includes("daniel w. briggs"),
    );
    expect(diobuCandidate).toBeUndefined();
  });

  it("filters accurately by dues reconciliation status", async () => {
    const clearedResult = await getOrdinationCandidates({ duesStatus: "cleared" });
    for (const c of clearedResult.candidates) {
      expect(c.duesStatus).toBe("cleared");
    }

    const pendingResult = await getOrdinationCandidates({ duesStatus: "pending" });
    for (const c of pendingResult.candidates) {
      expect(c.duesStatus).toBe("pending");
    }
  });

  it("filters accurately by vetting pipeline stage", async () => {
    const stage1Result = await getOrdinationCandidates({ stage: "STAGE_1_BRANCH" });
    for (const c of stage1Result.candidates) {
      expect(c.stageCurrent === "STAGE_1_BRANCH" || c.stageCurrent === "STAGE_1_PARISH").toBe(true);
    }

    const stage3Result = await getOrdinationCandidates({ stage: "STAGE_3_PROVINCIAL" });
    for (const c of stage3Result.candidates) {
      expect(c.stageCurrent === "STAGE_3_PROVINCIAL" || c.stageCurrent === "STAGE_3_ZONAL").toBe(true);
    }
  });

  it("accurately identifies provincial worshippers at provincial cathedrals", async () => {
    const result = await getOrdinationCandidates({ province: "Diobu Province" });
    const diobu = result.candidates.find((c) => c.fullName.includes("Daniel W. Briggs"));
    expect(diobu?.isProvincialWorshipper).toBe(true);
  });

  it("performs multi-field search across candidate name, regNumber, and parish", async () => {
    const searchByName = await getOrdinationCandidates({ search: "daniel" });
    expect(searchByName.candidates.length).toBeGreaterThan(0);
    expect(searchByName.candidates[0].fullName).toContain("Daniel");

    const searchByParish = await getOrdinationCandidates({ search: "Diobu Central Cathedral" });
    expect(searchByParish.candidates.length).toBeGreaterThan(0);
    expect(searchByParish.candidates[0].parishName).toContain("Diobu Central Cathedral");
  });

  it("sorts candidates by target rank hierarchy correctly", async () => {
    const result = await getOrdinationCandidates({ sort: "rank" });
    expect(result.candidates.length).toBeGreaterThan(1);

    // Apostle (hierarchical weight 9) must come before Rabbi (4) or Aladura (2)
    const apostleIndex = result.candidates.findIndex((c) => c.rankTarget === "APOSTLE");
    const aladuraIndex = result.candidates.findIndex((c) => c.rankTarget === "ALADURA");
    if (apostleIndex !== -1 && aladuraIndex !== -1) {
      expect(apostleIndex).toBeLessThan(aladuraIndex);
    }
  });
});
