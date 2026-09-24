import { describe, expect, it } from "vitest";

import { passwordScore } from "./password-strength";

describe("passwordScore", () => {
  it("counts the rules a password meets", () => {
    expect(passwordScore("")).toBe(0);
    expect(passwordScore("abcdefgh")).toBe(1);
    expect(passwordScore("abcdefg1")).toBe(2);
    expect(passwordScore("Abcdefg1")).toBe(3);
    expect(passwordScore("Abcdefg1!")).toBe(4);
  });
});
