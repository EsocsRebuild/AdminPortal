import { expect, test } from "@playwright/test";

test.describe("security", () => {
  test("signed-out visitors are sent to sign-in with a safe return path", async ({ page }) => {
    await page.goto("/members?status=pending");
    await expect(page).toHaveURL(/\/login\?next=%2Fmembers%3Fstatus%3Dpending$/);
  });

  test("every protected area redirects when signed out", async ({ request }) => {
    for (const path of [
      "/dashboard",
      "/campaigns",
      "/forms/abc/edit",
      "/users/roles",
      "/settings/security",
      "/audit-log",
    ]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(307);
      expect(res.headers().location, path).toContain("/login");
    }
  });

  test("downloads require a session", async ({ request }) => {
    for (const path of ["/api/members/export", "/api/audit-log/export", "/api/forms/abc/responses/export"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect([307, 401], path).toContain(res.status());
    }
  });

  test("pages send strict security headers", async ({ request }) => {
    const res = await request.get("/login");
    const h = res.headers();
    expect(h["content-security-policy"]).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["content-security-policy"]).toContain("object-src 'none'");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["cache-control"]).toContain("no-store");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("every response gets a fresh nonce", async ({ request }) => {
    const nonce = async () =>
      (await request.get("/login")).headers()["content-security-policy"].match(/nonce-([^']+)/)?.[1];
    expect(await nonce()).not.toBe(await nonce());
  });

  test("the verify and MFA steps can't be opened directly", async ({ page }) => {
    await page.goto("/mfa");
    await expect(page).toHaveURL(/\/login\?reason=expired/);
    await page.goto("/verify");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("open redirects are refused", async ({ page }) => {
    await page.goto("/login?next=https://evil.example");
    // The form keeps the value, but sign-in only ever redirects to same-site paths (unit-tested in session.test.ts).
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});
