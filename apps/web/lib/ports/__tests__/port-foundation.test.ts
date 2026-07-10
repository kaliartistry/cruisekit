import { describe, expect, it } from "vitest";
import mobilePortTimeZones from "../../../../../data/bundles/mobile/port-timezones.json";
import { PORTS } from "../../data/ports";
import {
  PORT_TIME_ZONE_CONTRACT,
  ianaTimeZoneForPort,
  validatePortCatalog,
  validatePortTimeZoneContract,
} from "../port-governance";
import {
  formatTimeInZone,
  utcOffsetMinutes,
  zoneDifferenceLabel,
} from "../port-time";

describe("port catalog governance", () => {
  it("covers every current port with one stable ID and IANA time zone", () => {
    expect(PORTS).toHaveLength(106);
    expect(new Set(PORTS.map((port) => port.slug)).size).toBe(PORTS.length);
    expect(new Set(PORTS.map((port) => port.canonicalId)).size).toBe(
      PORTS.length,
    );
    expect(Object.keys(PORT_TIME_ZONE_CONTRACT.timeZones)).toHaveLength(
      PORTS.length,
    );
    expect(() => validatePortCatalog(PORTS)).not.toThrow();
  });

  it("does not imply that unsourced editorial fields have been reviewed", () => {
    expect(PORTS.every((port) => port.governance.reviewStatus === "needs-review"))
      .toBe(true);
    expect(
      PORTS.every((port) => port.governance.lastEditorialReviewAt === null),
    ).toBe(true);
  });

  it("resolves explicit aliases while keeping distinct external ports distinct", () => {
    expect(ianaTimeZoneForPort("piraeus-athens")).toBe("Europe/Athens");
    expect(PORT_TIME_ZONE_CONTRACT.aliases["piraeus-athens"]).toBe("piraeus");
    expect(ianaTimeZoneForPort("cape-liberty")).toBe("America/New_York");
    expect(PORT_TIME_ZONE_CONTRACT.aliases).not.toHaveProperty("cape-liberty");
  });

  it("rejects aliases that collide with concrete records", () => {
    expect(() =>
      validatePortTimeZoneContract({
        timeZones: { cozumel: "America/Cancun" },
        externalTimeZones: {},
        aliases: { cozumel: "cozumel" },
      }),
    ).toThrow(/alias collides/i);
  });

  it("publishes one flattened time-zone map for mobile consumption", () => {
    expect(Object.keys(mobilePortTimeZones.portTimeZones)).toHaveLength(118);
    expect(mobilePortTimeZones.portTimeZones["piraeus-athens"]).toBe(
      mobilePortTimeZones.portTimeZones.piraeus,
    );
    expect(mobilePortTimeZones.portTimeZones["cape-liberty"]).toBe(
      "America/New_York",
    );
    expect(mobilePortTimeZones.aliases).not.toHaveProperty("cape-liberty");
  });
});

describe("port-local time", () => {
  it("models Cozumel separately from New York during US daylight time", () => {
    const summer = new Date("2026-07-09T16:00:00.000Z");
    expect(utcOffsetMinutes(summer, "America/Cancun")).toBe(-300);
    expect(utcOffsetMinutes(summer, "America/New_York")).toBe(-240);
    expect(
      zoneDifferenceLabel(summer, "America/Cancun", "America/New_York"),
    ).toBe("(−1h)");
  });

  it("accounts for seasonal alignment without hard-coded abbreviations", () => {
    const winter = new Date("2026-01-09T16:00:00.000Z");
    expect(utcOffsetMinutes(winter, "America/Cancun")).toBe(-300);
    expect(utcOffsetMinutes(winter, "America/New_York")).toBe(-300);
    expect(
      zoneDifferenceLabel(winter, "America/Cancun", "America/New_York"),
    ).toBeNull();
  });

  it("never falls back to the device clock for invalid port data", () => {
    const instant = new Date("2026-07-09T16:00:00.000Z");
    expect(formatTimeInZone(instant, "EST (no DST)", "en-US")).toBeNull();
    expect(utcOffsetMinutes(instant, "EST (no DST)")).toBeNull();
  });

  it("handles date boundaries and large zone differences", () => {
    const instant = new Date("2026-07-09T23:30:00.000Z");
    expect(
      zoneDifferenceLabel(instant, "Asia/Tokyo", "America/Los_Angeles"),
    ).toBe("(+16h)");
  });
});
