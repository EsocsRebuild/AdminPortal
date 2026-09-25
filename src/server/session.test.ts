import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn(), headers: vi.fn() }));

import { safeNext } from "./session";

describe("safeNext (post-login redirect)", () => {
  it("keeps same-site relative paths", () => {
    expect(safeNext("/members?status=pending")).toBe("/members?status=pending");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "members", 42, undefined])(
    "rejects %s",
    (value) => {
      expect(safeNext(value)).toBe("/dashboard");
    },
  );

  it("never sends people back to auth pages", () => {
    expect(safeNext("/login?next=/x")).toBe("/dashboard");
    expect(safeNext("/mfa")).toBe("/dashboard");
  });
});
