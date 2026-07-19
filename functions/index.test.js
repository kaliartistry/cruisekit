process.env.FUNCTIONS_TEST_MODE = "1";

const assert = require("node:assert/strict");
const test = require("node:test");

const { __growthTest } = require("./index");

const ANONYMOUS_ID = "d5d95f3e-0fab-4c98-a543-09f947ff75f0";

function browserAttribution() {
  return {
    anonymousId: ANONYMOUS_ID,
    firstTouch: {
      landingPage: "/founding-20?utm_source=instagram",
      utmSource: "instagram",
      utmCampaign: "first-20",
      capturedAt: "2026-07-19T10:00:00.000Z",
    },
    lastTouch: {
      landingPage: "/calculator",
      referralCode: "ABCDEFGH",
      capturedAt: "2026-07-19T10:05:00.000Z",
    },
  };
}

function realSavedCruise() {
  return {
    sailing: {
      id: "carnival-celebration-2099-08-02",
      cruiseLineId: "carnival",
      shipName: "Carnival Celebration",
      departureDate: "2099-08-02",
      isRealUpcoming: true,
    },
    calculatorSnapshot: {
      version: "1",
      estimate: {
        advertisedFare: 1200,
        estimatedTotal: 2200,
        totalAdditional: 1000,
      },
    },
  };
}

test("accepts the Founding 20 browser form and strips client timestamps", () => {
  const payload = __growthTest.validateGrowthApplicationPayload({
    applicationType: "founding20",
    honeypot: "",
    attribution: browserAttribution(),
    form: {
      firstName: "Kali",
      email: "KALI@EXAMPLE.COM",
      phone: "555-123-4567",
      cruiseLine: "Carnival Cruise Line",
      ship: "Carnival Celebration",
      departureDate: "2099-08-02",
      travelers: "2",
      cruiseExperience: "First cruise",
      primaryConcern: "Daily organization",
      preferredPlatform: "iPhone",
      contactConsent: true,
      website: "",
    },
  });

  assert.equal(payload.contact.firstName, "Kali");
  assert.equal(payload.contact.email, "kali@example.com");
  assert.equal(payload.details.travelers, 2);
  assert.equal(payload.details.cruiseExperience, "first_cruise");
  assert.equal(payload.details.preferredPlatform, "iphone");
  assert.equal(payload.attribution.firstTouch.landingPath, "/founding-20");
  assert.equal("capturedAt" in payload.attribution.firstTouch, false);
});

test("rejects spam and fields outside the public application contract", () => {
  const valid = {
    applicationType: "founding20",
    attribution: browserAttribution(),
    form: {
      firstName: "Kali",
      email: "kali@example.com",
      cruiseLine: "Carnival",
      ship: "Carnival Celebration",
      departureDate: "2099-08-02",
      travelers: 2,
      cruiseExperience: "Experienced cruiser",
      primaryConcern: "Budget",
      preferredPlatform: "Web",
      contactConsent: true,
      website: "",
    },
  };

  assert.throws(
    () => __growthTest.validateGrowthApplicationPayload({ ...valid, honeypot: "bot" }),
    /Unable to submit/,
  );
  assert.throws(
    () => __growthTest.validateGrowthApplicationPayload({
      ...valid,
      form: { ...valid.form, status: "activated" },
    }),
    /unsupported fields/,
  );
  assert.throws(
    () => __growthTest.sanitizeGrowthAttribution({
      ...browserAttribution(),
      email: "do-not-store@example.com",
    }),
    /unsupported fields/,
  );
});

test("accepts current creator form choices and a safe referral default", () => {
  const creator = __growthTest.validateGrowthApplicationPayload({
    applicationType: "creator",
    attribution: browserAttribution(),
    form: {
      name: "Creator",
      email: "creator@example.com",
      primaryPlatform: "TikTok",
      profileUrl: "https://example.com/creator",
      audienceSizeRange: "1,000–9,999",
      cruiseNiche: "Family cruises",
      upcomingSailing: "Carnival Celebration, August 2099",
      preferredCollaborationType: "Cost breakdown content",
      contactConsent: true,
      website: "",
    },
  });
  const referral = __growthTest.validateReferralManagementPayload({
    action: "create",
    partnerType: "community_admin",
    label: "Summer sailing group",
  });

  assert.equal(creator.details.primaryPlatform, "tiktok");
  assert.equal(creator.details.audienceSizeRange, "1000_9999");
  assert.equal(referral.partnerType, "community_administrator");
  assert.equal(referral.destinationPath, "/founding-20");
  assert.throws(
    () => __growthTest.normalizeInternalPath("https://example.com"),
    /internal path/,
  );
});

test("keeps activation tied to a substantive future sailing and a valid snapshot", () => {
  const saved = realSavedCruise();
  assert.equal(__growthTest.readRealSavedSailing(saved).shipName, "Carnival Celebration");
  assert.equal(__growthTest.hasTrustedCalculatorSnapshot(saved), true);

  assert.equal(
    __growthTest.readRealSavedSailing({
      ...saved,
      sailing: { ...saved.sailing, isRealUpcoming: false },
    }),
    null,
  );
  assert.equal(
    __growthTest.readRealSavedSailing({
      ...saved,
      sailing: { ...saved.sailing, shipName: "Cruise not selected yet" },
    }),
    null,
  );
  assert.equal(
    __growthTest.hasTrustedCalculatorSnapshot({
      ...saved,
      calculatorSnapshot: { version: "1", estimate: { estimatedTotal: 12 } },
    }),
    false,
  );
});

test("normalizes browser event and identity-link payloads without trusting direct activation", () => {
  const event = __growthTest.validateGrowthEventPayload({
    eventName: "calculator_completed",
    attribution: browserAttribution(),
    context: {
      cruiseLine: "carnival",
      departureWindow: "2099-08",
      platform: "web",
      landingPage: "/calculator?utm_campaign=first-20",
      deviceCategory: "mobile",
      experimentId: "founding-hero-v1",
      experimentVariant: "A",
      store: "apple",
    },
  });
  const identity = __growthTest.validateIdentityLinkPayload(
    { userId: "known-user", attribution: browserAttribution() },
    "known-user",
  );

  assert.equal(event.context.cruiseLineId, "carnival");
  assert.equal(event.context.sailingDepartureWindow, "2099-08");
  assert.equal(event.context.landingPath, "/calculator");
  assert.equal(event.context.deviceCategory, "mobile");
  assert.equal(event.context.experimentId, "founding-hero-v1");
  assert.equal(event.context.store, "apple");
  assert.equal(identity.anonymousId, ANONYMOUS_ID);
  assert.throws(
    () => __growthTest.validateGrowthEventPayload({ eventName: "activation_completed" }),
    /derived by CruiseKit/,
  );
});

test("accepts the Growth Console patch contract and rejects mutable server fields", () => {
  const update = __growthTest.validateGrowthConsolePayload({
    action: "update",
    applicationId: "application-123",
    patch: {
      status: "Contacted",
      founderNotes: "Email after the current sailing.",
      followUpDate: "2099-08-10",
    },
  });

  assert.equal(update.status, "contacted");
  assert.equal(update.founderNotes, "Email after the current sailing.");
  assert.equal(update.followUpDate, "2099-08-10");
  assert.throws(
    () => __growthTest.validateGrowthConsolePayload({
      action: "update",
      applicationId: "application-123",
      patch: { activation: { isActivated: true } },
    }),
    /unsupported fields/,
  );
});
