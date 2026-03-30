const { chromium } = require("playwright");

const SEARCHES = [
  { dest: "cococay", query: "cococay bahamas" },
  { dest: "bimini", query: "bimini bahamas beach" },
  { dest: "celebration key", query: "carnival celebration key" },
  { dest: "st kitts", query: "st kitts basseterre" },
  { dest: "san juan", query: "old san juan puerto rico colorful" },
  { dest: "montego bay", query: "montego bay jamaica" },
  { dest: "great stirrup cay", query: "great stirrup cay" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  });

  for (const { dest, query } of SEARCHES) {
    try {
      const page = await context.newPage();
      const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(4000);

      // Get first few image results
      const results = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img[srcset*="images.unsplash.com"]');
        const found = [];
        for (const img of Array.from(imgs).slice(0, 3)) {
          const srcset = img.srcset || img.src || "";
          const match = srcset.match(/(photo-[a-f0-9-]+)/);
          if (match && !found.includes(match[1])) {
            found.push(match[1]);
          }
        }
        return found;
      });

      if (results.length > 0) {
        console.log(`${dest}: ${results[0]} (${results.length} results)`);
      } else {
        console.log(`${dest}: no results`);
      }
      await page.close();
    } catch (e) {
      console.log(`${dest}: ERROR ${e.message.substring(0, 60)}`);
    }
  }

  await browser.close();
}

main();
