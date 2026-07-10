import { afterEach, describe, expect, it, vi } from "vitest";
import { hasAnalyticsConsent, trackEvent } from "./analytics";

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

    trackEvent("test_event", { source: "test" });

    expect(hasAnalyticsConsent()).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends events after the stored choice is granted", () => {
    const gtag = vi.fn();
    installWindow("granted", gtag);

    trackEvent("test_event", { source: "test" });

    expect(hasAnalyticsConsent()).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "test_event", {
      source: "test",
    });
  });
});

function installWindow(choice: string, gtag: ReturnType<typeof vi.fn>) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      gtag,
      localStorage: {
        getItem: vi.fn(() => choice),
      },
    },
  });
}
