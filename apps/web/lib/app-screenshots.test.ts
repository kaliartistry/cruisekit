import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const APPROVED_SCREENSHOTS = {
  "myday-home.png":
    "127253792f2d53f773468678642c44b682f49a70a716ca02acb3006aed7b1ea8",
  "drink-package.png":
    "2fc6e70dece160c66ad38fa46ddea62e0fa0f70546a49bbdfef48bfb53dbedc3",
  "add-cruise.png":
    "5d75a3d42d155ece4968c083e53a854472d1a91ffb8abe420b9b837f56d8155e",
  "itinerary-ports.png":
    "54e25a2d371621ec21eacb36763942d054bb11bd98908a7163efd5194722ed2d",
  "port-map.png":
    "5a3c711c8170504c6040c3c4003043af8c20933ecd59b9f44b8f63699f543893",
  "port-guide.png":
    "cd9f18e845c2db1ea28897d4cd897a6c15b58faa654aa44734c9e243ec8e4a6c",
  "mycrew-invite.png":
    "bf179860d48869c94e26deb97acaabe89fbd581cf61058a01560a8f313750f3c",
  "spend-exact.png":
    "d9e1adba00d072ffb04dd17b00edf22a40f5d5085f2ff57d9d72433de7edf346",
  "mobile-feature-graphic.png":
    "5059f3e4da1b1bbcb15362138c65a59b6dc9cb367cf636847077a377087518e8",
  "myday-hero-screen.png":
    "e471bf1414b89c700fb06c75279847d97a942ddb32a45362a08567405569b09b",
  "itinerary-hero-screen.png":
    "b7b51ab84a172b24da48fd6a739362cdcc813f92a563f590bc5186311d30a426",
  "mycrew-hero-screen.png":
    "0976bdc6b0f3d876ef1afbc425b77248ebc375ba7fd3270569754b01c3278adf",
} as const;

const RETIRED_SCREENSHOT_PATHS = [
  "/assets/app-screenshots/myday-today.png",
  "/assets/app-screenshots/myday-itinerary.png",
  "/assets/app-screenshots/myday-crew-map.png",
] as const;

function readTsxTree(directory: string): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return [readTsxTree(path)];
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        return [readFileSync(path, "utf8")];
      }
      return [];
    })
    .join("\n");
}

describe("approved mobile screenshot assets", () => {
  it("matches the approved CruiseKit 1.0.18 release artwork", () => {
    for (const [fileName, expectedHash] of Object.entries(
      APPROVED_SCREENSHOTS,
    )) {
      const bytes = readFileSync(
        join("public/assets/app-screenshots", fileName),
      );
      const actualHash = createHash("sha256").update(bytes).digest("hex");
      expect(actualHash, fileName).toBe(expectedHash);
    }
  });

  it("does not reference the retired five-tab screenshot set", () => {
    const appSource = readTsxTree("app");

    for (const retiredPath of RETIRED_SCREENSHOT_PATHS) {
      expect(appSource).not.toContain(retiredPath);
    }
  });
});
