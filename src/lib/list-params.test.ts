import { describe, expect, it } from "vitest";

import { enumParam, parseListParams } from "./list-params";

describe("parseListParams", () => {
  it("applies defaults", () => {
    expect(parseListParams({})).toMatchObject({ page: 1, pageSize: 20 });
  });

  it("ignores hostile or invalid values instead of failing", () => {
    const p = parseListParams({ page: "-4", pageSize: "5000", sort: "name;drop", dir: "sideways" });
    expect(p).toMatchObject({ page: 1, pageSize: 20, sort: undefined, dir: undefined });
  });

  it("parses page-specific filters", () => {
    const p = parseListParams({ status: ["active", "x"], q: "  ada  " }, { status: enumParam(["active", "pending"]) });
    expect(p.status).toBe("active");
    expect(p.q).toBe("ada");
  });
});
