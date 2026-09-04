import { describe, expect, it } from "vitest";
import {
  appleCampaignForSurface,
  buildAppleCampaignUrl,
  buildPlayInstallReferrerUrl,
} from "./app-attribution";

describe("store attribution URLs", () => {
  it("uses the App Store Connect provider token and bounded campaign label", () => {
    const url = new URL(
      buildAppleCampaignUrl("calculator_result", {
        appleProviderToken: "128557928",
      }),
    );

    expect(url.hostname).toBe("apps.apple.com");
    expect(url.pathname).toBe("/app/apple-store/id6770305548");
    expect(url.searchParams.get("pt")).toBe("128557928");
    expect(url.searchParams.get("ct")).toBe("cost_result");
    expect(url.searchParams.get("mt")).toBe("8");
    expect(appleCampaignForSurface("port_page")).toBe("port_guide");
  });

  it("keeps a valid App Store link when a provider token is absent", () => {
    const url = new URL(
      buildAppleCampaignUrl("calculator_result", { appleProviderToken: null }),
    );

    expect(url.hostname).toBe("apps.apple.com");
    expect(url.searchParams.has("pt")).toBe(false);
    expect(url.searchParams.has("ct")).toBe(false);
  });

  it("preserves safe incoming UTM values in the Play Install Referrer", () => {
    const url = new URL(
      buildPlayInstallReferrerUrl(
        "calculator_result",
        "?utm_source=facebook&utm_medium=organic_social&utm_campaign=fall_cost",
      ),
    );
    const referrer = new URLSearchParams(url.searchParams.get("referrer") ?? "");

    expect(url.hostname).toBe("play.google.com");
    expect(referrer.get("utm_source")).toBe("facebook");
    expect(referrer.get("utm_medium")).toBe("organic_social");
    expect(referrer.get("utm_campaign")).toBe("fall_cost");
    expect(referrer.get("utm_content")).toBe("calculator_result");
  });

  it("rejects PII-like or URL campaign values before building a referrer", () => {
    const url = new URL(
      buildPlayInstallReferrerUrl(
        "calculator_result",
        "?utm_source=kali%40example.com&utm_campaign=https%3A%2F%2Fexample.com%2Fx",
      ),
    );
    const referrer = new URLSearchParams(url.searchParams.get("referrer") ?? "");

    expect(referrer.get("utm_source")).toBe("cruisekit_web");
    expect(referrer.get("utm_campaign")).toBe("cost_result");
    expect(referrer.toString()).not.toMatch(/kali|example\.com|https/i);
  });
});
