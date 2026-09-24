import { describe, expect, it } from "vitest";

import { can, canAll, canAny } from "./permissions";

describe("permissions", () => {
  it("grants everything to super admins", () => {
    expect(can({ role: "super_admin" }, "settings:manage")).toBe(true);
  });

  it("limits roles to their permission list", () => {
    expect(can({ role: "finance" }, "finance:manage")).toBe(true);
    expect(can({ role: "finance" }, "users:manage")).toBe(false);
    expect(can({ role: "viewer" }, "members:manage")).toBe(false);
  });

  it("denies when signed out", () => {
    expect(can(null, "dashboard:view")).toBe(false);
  });

  it("combines checks", () => {
    expect(canAny({ role: "editor" }, ["finance:view", "content:publish"])).toBe(true);
    expect(canAll({ role: "editor" }, ["finance:view", "content:publish"])).toBe(false);
  });
});
