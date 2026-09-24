import { afterEach, describe, expect, it, vi } from "vitest";

import { api, ApiError, buildUrl } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("buildUrl", () => {
  it("skips empty values and repeats arrays", () => {
    expect(buildUrl("/members", { page: 2, q: "", status: ["active", "pending"], x: undefined })).toBe(
      "/api/members?page=2&status=active&status=pending",
    );
  });
});

describe("api", () => {
  it("throws ApiError with the server message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Not allowed" }), {
          status: 403,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const err = (await api.get("/members").catch((e: unknown) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe("Not allowed");
    expect(err.isForbidden).toBe(true);
  });

  it("sends JSON bodies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    await api.post("/members", { body: { name: "Ada" } });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"name":"Ada"}');
    expect(init.headers["Content-Type"]).toBe("application/json");
  });
});
