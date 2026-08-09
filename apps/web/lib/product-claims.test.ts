import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const MARKETING_FILES = [
  "app/layout.tsx",
  "app/hero-section.tsx",
  "app/myday/page.tsx",
  "app/myday/myday-content.tsx",
  "app/app/app-landing-client.tsx",
  "app/faq/page.tsx",
  "app/cruise-group-check-in-app/page.tsx",
  "app/ship-time-vs-port-time/page.tsx",
  "lib/data/blog-posts.ts",
  "lib/data/guides.ts",
];

describe("mobile capability claims", () => {
  it("does not market an authoritative ship clock or scheduled reminders", () => {
    const source = MARKETING_FILES.map((path) =>
      readFileSync(path, "utf8"),
    ).join("\n");

    expect(source).not.toContain("Ship + Port Clocks");
    expect(source).not.toContain("Ship time and port time at a glance");
    expect(source).not.toContain("Personal event schedule with reminders");
    expect(source).not.toContain("ports, reminders, and crew");
    expect(source).not.toContain("Let CruiseKit Keep Ship Time Close");
    expect(source).not.toContain("keep ship time, port time");
    expect(source).toContain("verify official ship time");
    expect(source).toContain("does not schedule event notifications yet");
  });

  it("does not revive removed app pillars or surfaces", () => {
    const scopedFiles = [
      "app/about/page.tsx",
      "app/ai/cruisekit-summary/page.tsx",
      "app/cruise-group-check-in-app/page.tsx",
      "app/features/cruise-itinerary-planner/page.tsx",
      "app/features/explore-map/page.tsx",
      "app/help/page.tsx",
      "app/myday/myday-content.tsx",
      "app/ports/[port-slug]/page.tsx",
      "app/what-is-cruisekit/page.tsx",
      "public/llms.txt",
    ];
    const source = scopedFiles.map((path) => readFileSync(path, "utf8")).join("\n");

    expect(source).not.toContain(
      "MyDay joins Plan, Explore, Coordinate, and Optimize",
    );
    expect(source).not.toContain("Budget vs actual from Plan calculator");
    expect(source).not.toContain("Three tabs. One pillar.");
    expect(source).not.toContain("Browse ports visually from the Explore area.");
    expect(source).not.toContain("Group Hub planning");
    expect(source).not.toContain(
      "The Loyalty Hub compares reward programs",
    );
    expect(source).not.toContain(
      "CruiseKit's optional Explore Map is a separate app view",
    );
  });
});
