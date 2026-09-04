import { describe, expect, it } from "vitest";
import sitemap, { toCanonicalSitemapUrl } from "./sitemap";

describe("sitemap canonical URLs", () => {
  it("emits the final trailing-slash form for every page", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.length).toBeGreaterThan(100);
    expect(urls.every((url) => url.endsWith("/"))).toBe(true);
    expect(urls.every((url) => !url.includes("?"))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("normalizes root and nested paths", () => {
    expect(toCanonicalSitemapUrl()).toBe("https://cruisekit.app/");
    expect(toCanonicalSitemapUrl("/ports/aruba"))
      .toBe("https://cruisekit.app/ports/aruba/");
    expect(toCanonicalSitemapUrl("/ports/aruba/"))
      .toBe("https://cruisekit.app/ports/aruba/");
  });

  it("keeps measured calculator parameter URLs live but out of the sitemap", () => {
    expect(
      sitemap().some((entry) => entry.url.includes("/calculator/?"))
    ).toBe(false);
  });

  it("lists the new planning tools and removes the redirected tipping guide", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://cruisekit.app/cruise-gratuity-calculator/");
    expect(urls).toContain("https://cruisekit.app/cruise-payment-deadline-calculator/");
    expect(urls).not.toContain("https://cruisekit.app/guides/cruise-tipping-guide/");
  });
});
