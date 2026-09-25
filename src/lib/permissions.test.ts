import { describe, expect, it } from "vitest";

import { can, canAll, canAny } from "./permissions";

const editor = { permissions: ["campaigns:view", "campaigns:manage", "templates:manage"] };

describe("permissions", () => {
  it("grants only what the backend returned", () => {
    expect(can(editor, "campaigns:manage")).toBe(true);
    expect(can(editor, "campaigns:send")).toBe(false);
  });

  it("denies when signed out", () => {
    expect(can(null, "dashboard:view")).toBe(false);
  });

  it("combines checks", () => {
    expect(canAny(editor, ["users:manage", "templates:manage"])).toBe(true);
    expect(canAll(editor, ["users:manage", "templates:manage"])).toBe(false);
  });
});
