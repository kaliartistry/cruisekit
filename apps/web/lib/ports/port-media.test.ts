import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PORTS } from "@/lib/data/ports";
import { resolvePortHeroMedia } from "./port-media";

describe("port hero media", () => {
  it("resolves every port to a real hosted asset", () => {
    const missing = PORTS.flatMap((port) => {
      const media = resolvePortHeroMedia(port);
      const available = existsSync(
        join(process.cwd(), "public", media.url.replace(/^\//, "")),
      );
      return available ? [] : [`${port.slug}: ${media.url}`];
    });

    expect(missing).toEqual([]);
  });

  it("uses an attributed static map when editorial hero art is missing", () => {
    const port = PORTS.find((candidate) => candidate.slug === "san-diego");
    expect(port).toBeDefined();

    const media = resolvePortHeroMedia(port!);

    expect(media.isMapFallback).toBe(true);
    expect(media.url).toBe("/assets/maps/static/port-san-diego.webp");
    expect(media.alt).toContain("Static street map");
  });
});
