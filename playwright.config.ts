import { defineConfig, devices } from "playwright/test";

// E2E tests intentionally default to a local server. Set PLAYWRIGHT_BASE_URL
// to a local preview or already-running development server when needed.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const hostname = new URL(baseURL).hostname;

if (["cruisekit.app", "www.cruisekit.app"].includes(hostname)) {
  throw new Error("Refusing to run public-funnel tests against production.");
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  outputDir: ".playwright-cli/test-results",
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  reporter: "line",
  retries: process.env.CI ? 2 : 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
});
