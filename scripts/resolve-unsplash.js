const { chromium } = require("playwright");

const PHOTOS = {
  kralendijk: "M6Vv0F4WuXE",
  "san juan": "a4ZH6OcTzvk",
  "amber cove": "MihUZkpY874",
  roatan: "fUKzRMTV9Xc",
  cozumel: "Ox_6M68VqfQ",
  nassau: "rMaWin9-9Gk",
  "st. thomas": "XlaaMo03pLE",
  "st. maarten": "WOyBhxyB8KI",
  "grand cayman": "PuQK6Fng-F8",
  bermuda: "apdbXDriykI",
  aruba: "WLD2CQuHVhU",
  curacao: "zGfclKr5T54",
  "st. lucia": "zFLjLliBlY4",
  "key west": "z5ficbI0QV0",
  labadee: "J5gG0dNOjOQ",
  "ocho rios": "WAP2_qkTe18",
  falmouth: "afVzV0gvnpY",
  cartagena: "L6T_6Rp2iEk",
  barbados: "i6rUak-BrfA",
  antigua: "KqNY-MD-wRs",
  tortola: "Fd5jZpc9PDc",
  grenada: "c9yXt2dL1JI",
  "grand turk": "St1iI_US2mk",
  belize: "U7iqVFWF1rI",
  progreso: "UfK0P6WygEE",
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  });

  const results = {};

  for (const [dest, slug] of Object.entries(PHOTOS)) {
    try {
      const page = await context.newPage();
      await page.goto(`https://unsplash.com/photos/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      await page.waitForTimeout(3000);

      const photoId = await page.evaluate(() => {
        // Find og:image or any images.unsplash.com URL
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;
        // Try srcset or src
        const imgs = document.querySelectorAll('img[src*="images.unsplash.com"]');
        for (const img of imgs) {
          if (img.src.includes("photo-")) return img.src;
        }
        return null;
      });

      if (photoId) {
        // Extract just the photo-XXXX part
        const match = photoId.match(/(photo-[a-f0-9-]+)/);
        if (match) {
          results[dest] = match[1];
          console.log(`${dest}: ${match[1]}`);
        } else {
          console.log(`${dest}: got URL but no photo-ID: ${photoId.substring(0, 100)}`);
        }
      } else {
        console.log(`${dest}: no image found`);
      }
      await page.close();
    } catch (e) {
      console.log(`${dest}: ERROR ${e.message.substring(0, 60)}`);
    }
  }

  await browser.close();

  console.log("\n// Verified destination image IDs:");
  console.log("const PORT_IMAGES: Record<string, string> = {");
  for (const [dest, id] of Object.entries(results)) {
    console.log(`  "${dest}": "https://images.unsplash.com/${id}?w=800&q=80",`);
  }
  console.log("};");
}

main();
