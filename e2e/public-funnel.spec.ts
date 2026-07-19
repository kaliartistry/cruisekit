import { expect, test } from "playwright/test";

const attributionQuery =
  "utm_source=qa&utm_medium=e2e&utm_campaign=public-funnel&ref=QAPARTNER";

test.beforeEach(async ({ page, baseURL }) => {
  const localBaseURL = new URL(baseURL ?? "http://127.0.0.1:3100");
  const localOrigin = localBaseURL.origin;

  // The page is allowed to load only from the supplied local server. This
  // prevents Firebase, GA, app stores, and other third parties from receiving
  // any test traffic while retaining the visible client-side funnel.
  await page.route("**/*", async (route) => {
    const request = new URL(route.request().url());
    const isLocalDevSocket =
      (request.protocol === "ws:" || request.protocol === "wss:") &&
      request.hostname === localBaseURL.hostname &&
      request.port === localBaseURL.port;
    if (
      request.origin === localOrigin ||
      request.protocol === "data:" ||
      isLocalDevSocket
    ) {
      await route.continue();
      return;
    }
    await route.abort();
  });
});

test("true-cost funnel calculates a visible estimate and retains attribution", async ({
  page,
}) => {
  await page.goto(`/tools/true-cruise-cost?${attributionQuery}`);

  await expect(
    page.getByRole("heading", { name: "True cruise cost calculator" }),
  ).toBeVisible();
  await expect(page.getByLabel("Advertised cruise fare *")).toBeVisible();
  await expect(page.getByLabel("Travelers *")).toBeVisible();
  await expect(page.getByLabel("Cruise days *")).toBeVisible();
  await expect(page.getByLabel("Travel to the port")).toBeVisible();
  await expect(page.getByLabel("Pre-cruise hotel")).toBeVisible();
  await expect(page.getByLabel("Casino or entertainment")).toBeVisible();

  await page.getByLabel("Advertised cruise fare *").fill("1200");
  await page.getByLabel("Travelers *").fill("2");
  await page.getByLabel("Cruise days *").fill("7");
  await page.getByLabel("Taxes and port fees").fill("240");
  await page.getByLabel("Gratuities").fill("224");
  await page.getByLabel("Travel to the port").fill("180");
  await page.getByLabel("Excursions").fill("300");
  await page.getByRole("button", { name: "See my estimate" }).click();

  const resultsPanel = page
    .locator("aside section")
    .filter({ has: page.getByText("Your true cruise cost", { exact: true }) });
  await expect(resultsPanel).toHaveCount(1);
  await expect(resultsPanel.getByText("$2,144", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Apply for Founding 20" })).toBeVisible();
  await expect(page).toHaveURL(
    new RegExp(`/tools/true-cruise-cost/?\\?${attributionQuery}`),
  );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("cruisekit:growth:first-touch:v1");
        return raw ? JSON.parse(raw) : null;
      }),
    )
    .toMatchObject({
      utmSource: "qa",
      utmMedium: "e2e",
      utmCampaign: "public-funnel",
      referralCode: "QAPARTNER",
    });
});
