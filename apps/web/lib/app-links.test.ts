import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("mobile app links", () => {
  it("publishes the verified iOS MyCrew association without guessing Android credentials", () => {
    const association = JSON.parse(
      readFileSync("public/.well-known/apple-app-site-association", "utf8"),
    );

    expect(association.applinks.details).toEqual([
      {
        appID: "8FCKSS2JB5.com.cruisekit.mobile",
        paths: ["/mycrew/join*"],
      },
    ]);
    expect(() =>
      readFileSync("public/.well-known/assetlinks.json", "utf8"),
    ).toThrow();
  });
});
