import { describe, expect, it } from "vitest";

import { passwordScore } from "@/lib/password";

describe("passwordScore", () => {
  it("requires length before anything else counts", () => {
    expect(passwordScore("")).toBe(0);
    expect(passwordScore("Ab1!ab")).toBe(0);
    expect(passwordScore("Ab1!abcd")).toBe(1);
  });

  it("scores long passwords by the hints they meet", () => {
    expect(passwordScore("correct horse battery")).toBe(1);
    expect(passwordScore("correct horse battery 9")).toBe(2);
    expect(passwordScore("Correct horse battery 9")).toBe(3);
    expect(passwordScore("Correct horse battery 9!")).toBe(4);
  });
});
