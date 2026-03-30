/**
 * Resolve Unsplash photo slugs to CDN image URLs
 */
const https = require("https");

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

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHTML(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
  });
}

async function main() {
  const results = {};

  for (const [dest, slug] of Object.entries(PHOTOS)) {
    try {
      const html = await fetchHTML(`https://unsplash.com/photos/${slug}`);
      // Look for the CDN image URL in the HTML
      const match = html.match(/https:\/\/images\.unsplash\.com\/photo-[^"?\s]+/);
      if (match) {
        results[dest] = match[0];
        console.log(`${dest}: ${match[0]}`);
      } else {
        // Try alternate pattern
        const alt = html.match(/images\.unsplash\.com\/([^"?\s]+)/);
        if (alt) {
          results[dest] = `https://images.unsplash.com/${alt[1]}`;
          console.log(`${dest}: https://images.unsplash.com/${alt[1]}`);
        } else {
          console.log(`${dest}: NOT FOUND in HTML (${html.length} chars)`);
        }
      }
    } catch (e) {
      console.log(`${dest}: ERROR ${e.message}`);
    }
  }

  console.log("\n\n// Copy-paste mapping:");
  console.log("const VERIFIED_IMAGES: Record<string, string> = {");
  for (const [dest, url] of Object.entries(results)) {
    const photoId = url.match(/photo-[^?]+/)?.[0] || url;
    console.log(`  "${dest}": "https://images.unsplash.com/${photoId}",`);
  }
  console.log("};");
}

main();
