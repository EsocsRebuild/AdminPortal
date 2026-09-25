import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { e2eUser, settle, signIn } from "./helpers";

// Runs against a real (staging) API: E2E_BACKEND_URL, E2E_EMAIL, E2E_PASSWORD.
test.describe("signed-in app", () => {
  test.skip(
    !e2eUser.enabled,
    "Set E2E_BACKEND_URL, E2E_EMAIL and E2E_PASSWORD to run against a staging API.",
  );

  test.beforeEach(async ({ page }) => signIn(page));

  const routes = [
    "/dashboard",
    "/members",
    "/campaigns",
    "/audiences",
    "/templates",
    "/forms",
    "/users",
    "/audit-log",
    "/settings/profile",
    "/settings/security",
  ];
  for (const route of routes) {
    test(`${route} renders, fits and is accessible`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(
        results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id),
      ).toEqual([]);
    });
  }

  test("auth cookies are invisible to page scripts", async ({ page }) => {
    expect(await page.evaluate(() => document.cookie)).toBe("");
  });

  test("navigation adapts to the screen size", async ({ page }, info) => {
    const mobile = info.project.name.startsWith("mobile") || info.project.name === "tablet";
    const trigger = page.getByRole("button", { name: "Open navigation" });
    if (mobile) {
      await trigger.click();
      await page.getByRole("dialog").getByRole("link", { name: "Members" }).click();
      await expect(page).toHaveURL(/\/members/);
    } else {
      await expect(trigger).toBeHidden();
    }
  });
});
