import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined) }),
  headers: async () => new Headers(),
}));
vi.mock("next/navigation", () => ({ unstable_rethrow: () => {}, redirect: vi.fn(), forbidden: vi.fn() }));

const session = vi.hoisted(() => ({ user: null as null | { id: string; permissions: string[] } }));
vi.mock("./session", () => ({ getSession: async () => session.user }));

import { secureAction } from "./action";
import { BackendError } from "./backend";
import { COOKIE } from "./cookies";

const handler = vi.fn(async (input: { name: string }) => `hello ${input.name}`);
const action = secureAction({ schema: z.object({ name: z.string().min(2) }), permission: "members:manage", sudo: true }, handler);

beforeEach(() => {
  handler.mockClear();
  cookieStore.clear();
  session.user = { id: "u1", permissions: ["members:manage"] };
  cookieStore.set(COOKIE.sudo, "sudo-token");
});

describe("secureAction", () => {
  it("rejects when signed out, before doing anything else", async () => {
    session.user = null;
    expect(await action({ name: "Ada" })).toMatchObject({ ok: false, code: "UNAUTHENTICATED" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("rejects without the permission", async () => {
    session.user = { id: "u1", permissions: ["members:view"] };
    expect(await action({ name: "Ada" })).toMatchObject({ ok: false, code: "FORBIDDEN" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("asks for re-authentication when sudo is required and missing", async () => {
    cookieStore.clear();
    expect(await action({ name: "Ada" })).toMatchObject({ ok: false, code: "REAUTH_REQUIRED" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const res = await action({ name: "A" });
    expect(res).toMatchObject({ ok: false, code: "VALIDATION" });
    expect(!res.ok && res.fieldErrors?.name?.[0]).toBeTruthy();
  });

  it("runs the handler when everything checks out", async () => {
    expect(await action({ name: "Ada" })).toEqual({ ok: true, data: "hello Ada", message: undefined });
  });

  it("maps API errors and hides unexpected ones", async () => {
    handler.mockRejectedValueOnce(new BackendError("CONFLICT", "Already exists", 409));
    expect(await action({ name: "Ada" })).toMatchObject({ ok: false, code: "CONFLICT", message: "Already exists" });
    vi.spyOn(console, "error").mockImplementation(() => {});
    handler.mockRejectedValueOnce(new Error("database password is hunter2"));
    const res = await action({ name: "Ada" });
    expect(res).toMatchObject({ ok: false, code: "UNKNOWN" });
    expect(JSON.stringify(res)).not.toContain("hunter2");
  });
});
