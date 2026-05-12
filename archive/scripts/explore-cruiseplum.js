const { chromium } = require("playwright");

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("Loading CruisePlum hot deals...");
    await page.goto("https://www.cruiseplum.com/hot", {
      waitUntil: "load",
      timeout: 30000,
    });

    console.log("Waiting for JS render...");
    await page.waitForTimeout(10000);

    // Check for tables
    const tables = await page.$$("table");
    console.log("Tables found:", tables.length);

    const rows = await page.$$("tr");
    console.log("Table rows found:", rows.length);

    // Get all text and find price-related lines
    const allText = await page.evaluate(() => document.body.innerText);
    const lines = allText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 10);

    // Find lines with dollar signs or cruise-related keywords
    const priceLines = lines.filter(
      (l) =>
        l.includes("$") ||
        l.includes("Night") ||
        l.includes("Caribbean") ||
        l.includes("Royal") ||
        l.includes("Carnival") ||
        l.includes("Norwegian")
    );

    console.log("\n--- Price/cruise-related lines (" + priceLines.length + ") ---");
    priceLines.slice(0, 30).forEach((l) => console.log("  ", l.substring(0, 150)));

    // Also dump first 50 non-empty lines to understand page structure
    console.log("\n--- First 50 lines of page content ---");
    lines.slice(0, 50).forEach((l, i) => console.log(`  [${i}]`, l.substring(0, 150)));

    // Check for specific CSS selectors that might contain data
    const dataRows = await page.$$("[class*='row'], [class*='deal'], [class*='result'], [class*='cruise']");
    console.log("\nData-like elements found:", dataRows.length);

  } catch (e) {
    console.error("Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
})();
