import type { Page } from "@playwright/test";

/** Wait for entrance animations so contrast is measured on the settled page. */
export async function settle(page: Page) {
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
}

export const e2eUser = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
  enabled: Boolean(process.env.E2E_BACKEND_URL && process.env.E2E_EMAIL && process.env.E2E_PASSWORD),
};

export async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(e2eUser.email!);
  await page.locator("#password").fill(e2eUser.password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/dashboard/);
}
