import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("mobile app links", () => {
  it("publishes verified iOS handoff routes", () => {
    const association = JSON.parse(
      readFileSync("public/.well-known/apple-app-site-association", "utf8"),
    );

    expect(association.applinks.details).toEqual([
      {
        appID: "8FCKSS2JB5.com.cruisekit.mobile",
        paths: ["/mycrew/join*", "/cruise/handoff*"],
      },
    ]);
  });

  it("publishes the verified Android App Links statement", () => {
    const statements = JSON.parse(
      readFileSync("public/.well-known/assetlinks.json", "utf8"),
    );

    expect(statements).toEqual([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.cruisekit.mobile",
          sha256_cert_fingerprints: [
            "A0:C9:44:74:E6:D8:AF:B1:0C:5D:30:B2:05:E6:6A:6A:19:88:BA:B1:01:90:9D:32:E2:05:74:E0:89:39:A0:97",
          ],
        },
      },
    ]);
    expect(statements[0].target.sha256_cert_fingerprints[0]).toMatch(
      /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/,
    );
  });
});
