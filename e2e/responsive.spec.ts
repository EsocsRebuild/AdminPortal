import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { settle } from "./helpers";

// Public pages render without an API (they show a friendly "can't connect" state if needed).
const routes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/reset-password?token=0123456789abcdef0123",
  "/f/example-form",
];

for (const route of routes) {
  test(`${route} fits the viewport without horizontal scroll`, async ({ page }) => {
    await page.goto(route);
    await settle(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await settle(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
