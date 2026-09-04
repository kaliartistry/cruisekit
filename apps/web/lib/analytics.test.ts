import { afterEach, describe, expect, it, vi } from "vitest";
import {
  hasAnalyticsConsent,
  trackCalculatorCompleted,
  trackEvent,
} from "./analytics";

const originalWindow = globalThis.window;

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: originalWindow,
  });
});

describe("analytics consent gate", () => {
  it("does not send events until analytics is explicitly allowed", () => {
    const gtag = vi.fn();
    installWindow("denied", gtag);

    trackEvent("save_trip_clicked", { source_surface: "cruises" });

    expect(hasAnalyticsConsent()).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends events after the stored choice is granted", () => {
    const gtag = vi.fn();
    installWindow("granted", gtag);

    trackEvent("save_trip_clicked", { source_surface: "cruises" });

    expect(hasAnalyticsConsent()).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "save_trip_clicked", {
      source_surface: "cruises",
    });
  });

  it("deduplicates total-cost result events on a bounded signature", () => {
    const gtag = vi.fn();
    installWindow("granted", gtag);
    const context = {
      cruiseLineId: "carnival",
      partySize: 2,
      nights: 7,
      hasManualFare: true,
      resultKind: "single" as const,
      costCategoriesCount: 5,
    };

    trackCalculatorCompleted(context);
    trackCalculatorCompleted(context);

    expect(gtag.mock.calls.filter((call) => call[1] === "calculator_completed"))
      .toHaveLength(1);
    expect(
      gtag.mock.calls.filter(
        (call) => call[1] === "calculator_result_generated",
      ),
    ).toHaveLength(1);
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/2499|email|@/i);
  });
});

function installWindow(choice: string, gtag: ReturnType<typeof vi.fn>) {
  const session = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      gtag,
      innerWidth: 1280,
      location: { pathname: "/calculator" },
      localStorage: {
        getItem: vi.fn(() => choice),
      },
      sessionStorage: {
        getItem: vi.fn((key: string) => session.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => session.set(key, value)),
      },
    },
  });
}
