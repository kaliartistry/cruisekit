import { describe, expect, it } from "vitest";
import {
  getPortArrivalPilot,
  getPortArrivalPilotSlugs,
  getPortPlaceLabel,
  TENDER_PORT_ANSWER_PILOT_ENABLED,
} from "./port-arrival-pilot";

describe("tender-port answer pilot", () => {
  it("is controlled by one explicit switch and targets exactly five ports", () => {
    expect(TENDER_PORT_ANSWER_PILOT_ENABLED).toBe(true);
    expect(getPortArrivalPilotSlugs().sort()).toEqual(
      [
        "aruba",
        "celebration-key",
        "curacao",
        "falmouth",
        "half-moon-cay",
      ].sort()
    );
    expect(getPortArrivalPilot("cozumel")).toBeUndefined();
  });

  it("keeps conditional arrival answers conditional", () => {
    expect(getPortArrivalPilot("aruba")?.status).toBe("conditional");
    expect(getPortArrivalPilot("half-moon-cay")?.status).toBe("conditional");
  });

  it("does not duplicate a place name when country and destination match", () => {
    expect(getPortPlaceLabel("Aruba", "Aruba")).toBe("Aruba");
    expect(getPortPlaceLabel("Curaçao", "Curaçao")).toBe("Curaçao");
    expect(getPortPlaceLabel("Falmouth", "Jamaica")).toBe(
      "Falmouth, Jamaica"
    );
  });
});
