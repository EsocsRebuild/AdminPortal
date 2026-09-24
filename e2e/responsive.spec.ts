import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/dashboard",
  "/members",
  "/settings",
  "/design-system",
  "/login",
  "/signup",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

for (const route of routes) {
  test(`${route} fits the viewport without horizontal scroll`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    // Let entrance animations finish so contrast is measured on the settled page.
    await page.waitForLoadState("networkidle");
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => {})),
      ),
    );
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}

test("navigation adapts to the screen size", async ({ page }, info) => {
  await page.goto("/dashboard");
  const mobile = info.project.name.startsWith("mobile") || info.project.name === "tablet";
  const trigger = page.getByRole("button", { name: "Open navigation" });
  if (mobile) {
    await trigger.click();
    await page.getByRole("dialog").getByRole("link", { name: "Members" }).click();
    await expect(page).toHaveURL(/\/members/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } else {
    await expect(trigger).toBeHidden();
    await page.getByRole("complementary").getByRole("link", { name: "Members" }).click();
    await expect(page).toHaveURL(/\/members/);
  }
});
