import { describe, expect, it } from "vitest";
import {
  ANALYTICS_EVENT_CONTRACT,
  sanitizeAnalyticsParams,
} from "./analytics-contract";

describe("website analytics contract", () => {
  it("contains the required result and app-offer funnel events", () => {
    expect(Object.keys(ANALYTICS_EVENT_CONTRACT)).toEqual(
      expect.arrayContaining([
        "calculator_viewed",
        "calculator_started",
        "calculator_result_generated",
        "calculator_result_saved",
        "calculator_result_returned",
        "calculator_result_shared",
        "result_copied",
        "app_offer_viewed",
        "qr_offer_displayed",
        "app_store_click",
        "google_play_click",
      ]),
    );
  });

  it("drops full URLs, query strings, PII-like tokens, exact fares, and unknown params", () => {
    const params = sanitizeAnalyticsParams("calculator_result_generated", {
      calculator_family: "total_cost",
      cruise_line_id: "carnival",
      entry_path: "/calculator?fare=2499&email=kali@example.com",
      has_manual_fare: true,
      party_size_bucket: "2",
      nights_bucket: "7_9",
      cost_categories_count: 99,
      // @ts-expect-error exact monetary values are not in the contract
      exact_fare: 2499,
    });

    expect(params).toEqual({
      calculator_family: "total_cost",
      cruise_line_id: "carnival",
      has_manual_fare: true,
      party_size_bucket: "2",
      nights_bucket: "7_9",
      cost_categories_count: 16,
    });
    expect(JSON.stringify(params)).not.toMatch(/2499|example\.com|\?|https?:/);
  });

  it("keeps only bounded opaque campaign tokens and pathname-only landings", () => {
    expect(
      sanitizeAnalyticsParams("utm_landing_visit", {
        landing_path: "/calculator/carnival/",
        utm_source: "organic_social",
        utm_campaign: "cost-result",
        utm_content: "kali@example.com",
        utm_term: "https://example.com/path",
      }),
    ).toEqual({
      landing_path: "/calculator/carnival/",
      utm_source: "organic_social",
      utm_campaign: "cost-result",
    });
  });
});
