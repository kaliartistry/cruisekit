import { afterEach, describe, expect, it, vi } from "vitest";
import { getHeroMessageVariant } from "./experiments";

const experimentStorageKey = "cruisekit:experiment:founding20_hero_message_v1";

function installStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const localStorage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };

  vi.stubGlobal("window", { localStorage });
  return localStorage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getHeroMessageVariant", () => {
  it("is deterministic for the same anonymous visitor when storage is unavailable", () => {
    vi.stubGlobal("window", undefined);

    const first = getHeroMessageVariant("visitor-123");
    const second = getHeroMessageVariant("visitor-123");

    expect(first).toBe(second);
    expect(["A", "B"]).toContain(first);
  });

  it("persists a new assignment and keeps it stable across a changed identifier", () => {
    const localStorage = installStorage();

    const assigned = getHeroMessageVariant("first-device-id");
    const later = getHeroMessageVariant("rotated-device-id");

    expect(localStorage.setItem).toHaveBeenCalledWith(experimentStorageKey, assigned);
    expect(later).toBe(assigned);
  });

  it("honors an existing valid assignment", () => {
    const localStorage = installStorage({ [experimentStorageKey]: "B" });

    expect(getHeroMessageVariant("any-visitor-id")).toBe("B");
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("falls back to a deterministic assignment when browser storage throws", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("Storage unavailable");
        },
        setItem: () => {
          throw new Error("Storage unavailable");
        },
      },
    });

    expect(getHeroMessageVariant("privacy-mode-visitor")).toBe(
      getHeroMessageVariant("privacy-mode-visitor"),
    );
  });
});
