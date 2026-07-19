const admin = require("firebase-admin");
const crypto = require("node:crypto");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");
const { Resend } = require("resend");

admin.initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");
const growthRateLimitSecret = defineSecret("GROWTH_RATE_LIMIT_SECRET");
const growthIdentitySecret = defineSecret("GROWTH_IDENTITY_SECRET");

const DEFAULT_TO = "info@cruisekit.app";
const DEFAULT_FROM = "CruiseKit <info@cruisekit.app>";

const GROWTH_APPLICATION_TYPES = new Set([
  "founding20",
  "captain",
  "advisor",
  "creator",
]);

const GROWTH_APPLICATION_STATUSES = new Set([
  "new",
  "reviewed",
  "contacted",
  "scheduled",
  "onboarded",
  "activated",
  "sailing_completed",
  "interview_completed",
  "declined",
]);

const GROWTH_REFERRAL_TYPES = new Set([
  "founding_user",
  "sailing_captain",
  "cruise_creator",
  "travel_advisor",
  "community_administrator",
  "internal_campaign",
]);

const GROWTH_EVENT_NAMES = new Set([
  "landing_page_viewed",
  "founding20_application_started",
  "founding20_application_submitted",
  "calculator_started",
  "calculator_completed",
  "calculator_result_shared",
  "sailing_save_started",
  "sailing_saved",
  "store_link_clicked",
  "app_store_click",
  "google_play_click",
  "activation_completed",
  "mycrew_invite_created",
  "mycrew_invite_sent",
  "mycrew_invite_accepted",
  "captain_application_submitted",
  "advisor_application_submitted",
  "creator_application_submitted",
  "feedback_submitted",
  "review_prompt_displayed",
  "experiment_variant_viewed",
  "budget_updated",
  "spend_recorded",
  "day_planned",
  "myday_used",
  "app_handoff_imported",
]);

const QUALIFYING_GROWTH_ACTIONS = new Set([
  "calculator_completed",
  "budget_updated",
  "spend_recorded",
  "day_planned",
  "mycrew_invite_sent",
  "mycrew_invite_accepted",
  "myday_used",
]);

const ANONYMOUS_GROWTH_EVENTS = new Set([
  "landing_page_viewed",
  "founding20_application_started",
  "calculator_started",
  "calculator_completed",
  "calculator_result_shared",
  "sailing_save_started",
  "store_link_clicked",
  "app_store_click",
  "google_play_click",
  "experiment_variant_viewed",
]);

const GROWTH_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const GROWTH_APPLICATION_RATE_LIMIT = 5;
const GROWTH_REFERRAL_RATE_LIMIT = 40;
const GROWTH_EVENT_RATE_LIMIT = 120;

exports.findGroupByInvite = onCall(
  { region: "us-central1", maxInstances: 20 },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Sign in is required.");
    }
    const inviteCode =
      typeof request.data?.inviteCode === "string"
        ? request.data.inviteCode.trim().toUpperCase()
        : "";
    if (!/^[A-Z2-9]{6}$/.test(inviteCode)) {
      throw new HttpsError("invalid-argument", "A valid invite code is required.");
    }

    const result = await admin
      .firestore()
      .collection("groups")
      .where("inviteCode", "==", inviteCode)
      .limit(1)
      .get();
    if (result.empty) {
      throw new HttpsError("not-found", "Invite not found.");
    }
    const snapshot = result.docs[0];
    const group = snapshot.data();
    const memberUserIds = Array.isArray(group.memberUserIds)
      ? group.memberUserIds
      : [];
    return {
      id: snapshot.id,
      name: truncate(String(group.name || "MyCrew"), 120),
      organizerName: truncate(String(group.organizerName || ""), 120),
      cruiseLineId: truncate(String(group.cruiseLineId || ""), 80),
      shipName: truncate(String(group.shipName || ""), 120),
      departureDate: truncate(String(group.departureDate || ""), 40),
      inviteCode,
      isMember: memberUserIds.includes(request.auth.uid),
    };
  },
);

// ───── Growth Engine V1 ─────
//
// Growth collections are server-owned. Public forms and analytics flow through
// these callables so contact information, attribution, activation, and admin
// pipeline state cannot be forged through direct Firestore writes.

exports.submitGrowthApplication = onCall(
  {
    region: "us-central1",
    maxInstances: 20,
    secrets: [growthRateLimitSecret, growthIdentitySecret],
  },
  async (request) => {
    const payload = validateGrowthApplicationPayload(request.data);
    const database = admin.firestore();
    const rateSecret = requiredSecret(
      growthRateLimitSecret,
      "Growth submission protection is not configured.",
    );

    await consumeGrowthRateLimit({
      database,
      request,
      secret: rateSecret,
      scope: `application:${payload.applicationType}`,
      maxAttempts: GROWTH_APPLICATION_RATE_LIMIT,
    });

    const uid = authenticatedGrowthUid(request);
    const identitySecret = payload.attribution?.anonymousId
      ? requiredSecret(
          growthIdentitySecret,
          "Growth attribution is not configured.",
        )
      : null;
    const attribution = await upsertGrowthAttribution({
      database,
      attribution: payload.attribution,
      uid,
      identitySecret,
    });

    const applicationRef = database.collection("growthApplications").doc();
    const application = {
      schemaVersion: 1,
      applicationType: payload.applicationType,
      status: "new",
      contact: payload.contact,
      details: payload.details,
      consent: {
        contact: true,
        disclosureVersion: "growth-pilot-v1",
        capturedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      attribution: storedAttributionSnapshot(attribution),
      ...(uid ? { applicantUid: uid } : {}),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await applicationRef.create(application);

    const applicationEventName = applicationSubmittedEventName(
      payload.applicationType,
    );
    try {
      await writeGrowthEvent({
        database,
        eventId: `application_${applicationRef.id}`,
        eventName: applicationEventName,
        uid,
        anonymousIdHash: attribution.anonymousIdHash,
        attribution,
        context: {
          applicationType: payload.applicationType,
          platform: payload.details.preferredPlatform ??
            payload.details.primaryPlatform,
          cruiseLineId: payload.details.cruiseLine,
        },
        applicationId: applicationRef.id,
        source: "application_submission",
      });
    } catch (error) {
      // A durable application is more important than a non-essential analytics
      // ledger entry. Keep the failure observable without asking a visitor to
      // resubmit personal information.
      logger.error("Growth application event write failed", {
        applicationId: applicationRef.id,
        error: errorMessage(error),
      });
    }

    return { ok: true, applicationId: applicationRef.id };
  },
);

exports.resolveReferral = onCall(
  {
    region: "us-central1",
    maxInstances: 20,
    secrets: [growthRateLimitSecret, growthIdentitySecret],
  },
  async (request) => {
    let payload;
    try {
      payload = validateReferralResolutionPayload(request.data);
    } catch (error) {
      if (error instanceof HttpsError && error.code === "invalid-argument") {
        return { active: false };
      }
      throw error;
    }
    const database = admin.firestore();
    const rateSecret = requiredSecret(
      growthRateLimitSecret,
      "Referral protection is not configured.",
    );
    await consumeGrowthRateLimit({
      database,
      request,
      secret: rateSecret,
      scope: "referral-resolution",
      maxAttempts: GROWTH_REFERRAL_RATE_LIMIT,
    });

    const referralSnapshot = await database
      .collection("referralCodes")
      .doc(payload.code)
      .get();
    const referral = referralSnapshot.data();
    if (!referralSnapshot.exists || referral?.isActive !== true) {
      return { active: false };
    }

    let targetPath;
    try {
      targetPath = normalizeInternalPath(referral.destinationPath);
    } catch (error) {
      logger.error("Referral record has an invalid destination", {
        code: payload.code,
        error: errorMessage(error),
      });
      return { active: false };
    }
    const partnerType = referral.partnerType;
    if (!GROWTH_REFERRAL_TYPES.has(partnerType)) {
      logger.error("Referral record has an invalid partner type", {
        code: payload.code,
      });
      return { active: false };
    }

    const uid = authenticatedGrowthUid(request);
    const referralTouch = {
      sourceType: sourceTypeForReferral(partnerType),
      sourceId: payload.code,
      landingContext: "generic",
      referralCode: payload.code,
      landingPath: targetPath,
      ...(typeof referral.campaign === "string"
        ? { utmCampaign: referral.campaign }
        : {}),
    };
    const attribution = payload.anonymousId
      ? {
          anonymousId: payload.anonymousId,
          firstTouch: referralTouch,
          lastTouch: referralTouch,
        }
      : null;
    if (attribution || uid) {
      await upsertGrowthAttribution({
        database,
        attribution,
        uid,
        identitySecret: attribution
          ? requiredSecret(
              growthIdentitySecret,
              "Growth attribution is not configured.",
            )
          : null,
      });
    }

    return { active: true, code: payload.code, targetPath };
  },
);

exports.linkGrowthIdentity = onCall(
  {
    region: "us-central1",
    maxInstances: 20,
    secrets: [growthIdentitySecret],
  },
  async (request) => {
    const uid = requireKnownGrowthUser(request);
    const attribution = validateIdentityLinkPayload(request.data, uid);
    const database = admin.firestore();
    const linkedAttribution = await upsertGrowthAttribution({
      database,
      attribution,
      uid,
      identitySecret: requiredSecret(
        growthIdentitySecret,
        "Growth attribution is not configured.",
      ),
    });
    await linkGrowthApplicationsToIdentity({
      database,
      uid,
      anonymousIdHash: linkedAttribution.anonymousIdHash,
    });
    return { ok: true };
  },
);

exports.recordGrowthEvent = onCall(
  {
    region: "us-central1",
    maxInstances: 30,
    secrets: [growthIdentitySecret, growthRateLimitSecret],
  },
  async (request) => {
    const payload = validateGrowthEventPayload(request.data);
    const uid = authenticatedGrowthUid(request);
    if (!uid && !ANONYMOUS_GROWTH_EVENTS.has(payload.eventName)) {
      throw new HttpsError(
        "unauthenticated",
        "Sign in is required for this CruiseKit action.",
      );
    }
    if (!uid && !payload.attribution?.anonymousId) {
      throw new HttpsError(
        "invalid-argument",
        "Anonymous attribution is required for this event.",
      );
    }

    const database = admin.firestore();
    await consumeGrowthRateLimit({
      database,
      request,
      secret: requiredSecret(
        growthRateLimitSecret,
        "Growth event protection is not configured.",
      ),
      scope: `event:${payload.eventName}`,
      maxAttempts: GROWTH_EVENT_RATE_LIMIT,
    });
    let verifiedMyCrew = false;
    if (uid && payload.eventName.startsWith("mycrew_invite_")) {
      await verifyMyCrewGrowthEvent({
        database,
        uid,
        eventName: payload.eventName,
        groupId: payload.context.groupId,
      });
      verifiedMyCrew = true;
    }

    const attribution = await upsertGrowthAttribution({
      database,
      attribution: payload.attribution,
      uid,
      identitySecret: payload.attribution?.anonymousId
        ? requiredSecret(
            growthIdentitySecret,
            "Growth attribution is not configured.",
          )
        : null,
    });
    if (uid && attribution.anonymousIdHash) {
      await linkGrowthApplicationsToIdentity({
        database,
        uid,
        anonymousIdHash: attribution.anonymousIdHash,
      });
    }

    let profileResult = null;
    if (uid) {
      profileResult = await updateGrowthProfileForEvent({
        database,
        uid,
        eventName: payload.eventName,
        attribution,
        actionSource: "client_event",
        verifiedMyCrew,
      });
    }

    if (profileResult?.becameActivated) {
      await writeActivationCompletedEvent({
        database,
        uid,
        sailing: profileResult.sailing,
        attribution,
        source: "derived_profile_event",
      });
    }

    // A saved sailing is emitted by the trusted Firestore trigger below.
    // Ignore the client echo so one save cannot inflate the funnel.
    if (payload.eventName === "sailing_saved") {
      return {
        ok: true,
        deduplicated: true,
        activation: profileResult?.activation ?? { state: "pending" },
      };
    }

    const eventWrite = await writeGrowthEvent({
      database,
      eventId: payload.eventId,
      eventName: payload.eventName,
      uid,
      anonymousIdHash: attribution.anonymousIdHash,
      attribution,
      context: payload.context,
      source: "client_event",
    });

    return {
      ok: true,
      deduplicated: eventWrite.deduplicated,
      activation: profileResult?.activation ?? { state: "pending" },
    };
  },
);

exports.manageReferralCode = onCall(
  { region: "us-central1", maxInstances: 10 },
  async (request) => {
    const uid = requireKnownGrowthUser(request);
    await requireAdminUser(uid);
    const payload = validateReferralManagementPayload(request.data);
    const database = admin.firestore();

    if (payload.action === "create") {
      const referral = await createReferralCode({
        database,
        uid,
        partnerType: payload.partnerType,
        destinationPath: payload.destinationPath,
        label: payload.label,
        ownerUid: payload.ownerUid,
        campaign: payload.campaign,
      });
      return { ok: true, referral };
    }

    if (payload.action === "revoke") {
      const referralRef = database.collection("referralCodes").doc(payload.code);
      const referralSnapshot = await referralRef.get();
      if (!referralSnapshot.exists) {
        throw new HttpsError("not-found", "Referral code was not found.");
      }
      await referralRef.update({
        isActive: false,
        revokedAt: admin.firestore.FieldValue.serverTimestamp(),
        revokedBy: uid,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { ok: true };
    }

    const limit = payload.limit ?? 100;
    const snapshots = await database
      .collection("referralCodes")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return {
      ok: true,
      referrals: snapshots.docs.map((snapshot) =>
        serializeReferral(snapshot.id, snapshot.data()),
      ),
    };
  },
);

exports.manageGrowthApplication = onCall(
  { region: "us-central1", maxInstances: 10 },
  async (request) => {
    const uid = requireKnownGrowthUser(request);
    await requireAdminUser(uid);
    const payload = validateGrowthConsolePayload(request.data);
    const database = admin.firestore();

    if (payload.action === "update") {
      const applicationRef = database
        .collection("growthApplications")
        .doc(payload.applicationId);
      const applicationSnapshot = await applicationRef.get();
      if (!applicationSnapshot.exists) {
        throw new HttpsError("not-found", "Application was not found.");
      }

      const patch = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid,
        ...(payload.status !== undefined ? { status: payload.status } : {}),
        ...(payload.founderNotes !== undefined
          ? { founderNote: payload.founderNotes }
          : {}),
        ...(payload.followUpDate !== undefined
          ? {
              followUpDate: payload.followUpDate === null
                ? admin.firestore.FieldValue.delete()
                : payload.followUpDate,
            }
          : {}),
      };
      await applicationRef.update(patch);
      const updated = await applicationRef.get();
      return {
        ok: true,
        application: await serializeGrowthApplication(database, updated),
      };
    }

    const applications = await listGrowthApplications(
      database,
      payload.filters,
      payload.limit,
    );
    const funnel = await buildGrowthFunnel(database, applications);

    if (payload.action === "summary") {
      const profiles = await database.collection("growthProfiles").limit(500).get();
      return {
        ok: true,
        directional: true,
        summary: buildGrowthSummary(applications, profiles.docs, funnel),
      };
    }

    if (payload.action === "export") {
      return {
        ok: true,
        rows: applications.map(growthApplicationExportRow),
      };
    }

    return { ok: true, applications, funnel };
  },
);

exports.deriveGrowthFromSavedCruise = onDocumentWritten(
  {
    document: "users/{uid}/savedCruises/active",
    region: "us-central1",
    maxInstances: 20,
  },
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;

    const savedCruise = after.data();
    const sailing = readRealSavedSailing(savedCruise);
    if (!sailing) return;

    const uid = event.params.uid;
    const database = admin.firestore();
    const hasCalculatorSnapshot = hasTrustedCalculatorSnapshot(savedCruise);
    const attribution = sanitizeSavedCruiseAttribution(savedCruise.attribution);
    const profileResult = await updateGrowthProfile({
      database,
      uid,
      savedCruise,
      action: hasCalculatorSnapshot ? "calculator_completed" : null,
      actionSource: "saved_cruise_snapshot",
      attribution,
    });
    if (profileResult.becameActivated) {
      await writeActivationCompletedEvent({
        database,
        uid,
        sailing: profileResult.sailing,
        attribution,
        source: "saved_cruise_trigger",
      });
    }
    const sailingEventKey = stableGrowthEventKey(
      `sailing|${uid}|${sailing.id}|${sailing.departureDate}`,
    );

    await writeGrowthEvent({
      database,
      eventId: `saved_${sailingEventKey}`,
      eventName: "sailing_saved",
      uid,
      attribution,
      context: growthSailingContext(sailing),
      source: "saved_cruise_trigger",
    });

    if (hasCalculatorSnapshot) {
      await writeGrowthEvent({
        database,
        eventId: `calculator_snapshot_${sailingEventKey}`,
        eventName: "calculator_completed",
        uid,
        attribution,
        context: growthSailingContext(sailing),
        source: "saved_cruise_snapshot",
      });
    }

    logger.info("Growth profile derived from real saved sailing", {
      uid,
      sailingId: sailing.id,
      activated: profileResult.activation.state === "activated",
    });
  },
);

exports.emailDealLeadRequest = onDocumentCreated(
  {
    document: "dealLeadRequests/{requestId}",
    region: "us-central1",
    secrets: [resendApiKey],
    maxInstances: 10,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("Lead email trigger received no snapshot", {
        requestId: event.params.requestId,
      });
      return;
    }

    const requestId = event.params.requestId;

    try {
      const result = await sendLeadEmails({
        requestId,
        lead: snapshot.data(),
        ref: snapshot.ref,
      });

      logger.info("Deal lead email sent", {
        requestId,
        notificationId: result.notificationId,
        confirmationId: result.confirmationId,
      });
    } catch (error) {
      logger.error("Deal lead email failed", {
        requestId,
        error: errorMessage(error),
      });
      await snapshot.ref.update({
        status: "email_failed",
        emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
        emailError: truncate(errorMessage(error), 500),
      });
    }
  },
);

exports.retryDealLeadEmail = onCall(
  {
    region: "us-central1",
    secrets: [resendApiKey],
    maxInstances: 10,
  },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Sign in is required.");
    }

    const isAdmin = await admin.firestore().doc(`adminUsers/${uid}`).get();
    if (!isAdmin.exists) {
      throw new HttpsError("permission-denied", "Admin access is required.");
    }

    const requestId = request.data?.requestId;
    if (
      typeof requestId !== "string" ||
      requestId.length < 1 ||
      requestId.length > 160 ||
      requestId.includes("/")
    ) {
      throw new HttpsError("invalid-argument", "A valid requestId is required.");
    }

    const ref = admin.firestore().doc(`dealLeadRequests/${requestId}`);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      throw new HttpsError("not-found", "Lead request not found.");
    }

    await ref.update({
      emailRetryRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
      emailRetryRequestedBy: uid,
    });

    try {
      const result = await sendLeadEmails({
        requestId,
        lead: snapshot.data(),
        ref,
        retryBy: uid,
      });

      logger.info("Deal lead email retry sent", {
        requestId,
        uid,
        notificationId: result.notificationId,
        confirmationId: result.confirmationId,
      });

      return {
        ok: true,
        status: "email_sent",
        notificationId: result.notificationId,
        confirmationId: result.confirmationId,
        customerConfirmationSent: result.customerConfirmationSent,
      };
    } catch (error) {
      logger.error("Deal lead email retry failed", {
        requestId,
        uid,
        error: errorMessage(error),
      });
      await ref.update({
        status: "email_failed",
        emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
        emailRetriedAt: admin.firestore.FieldValue.serverTimestamp(),
        emailRetryCount: admin.firestore.FieldValue.increment(1),
        emailRetryRequestedBy: uid,
        emailError: truncate(errorMessage(error), 500),
      });
      throw new HttpsError("internal", "Email retry failed.");
    }
  },
);

exports.sendDealLeadReply = onCall(
  {
    region: "us-central1",
    secrets: [resendApiKey],
    maxInstances: 10,
  },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Sign in is required.");
    }

    const isAdmin = await admin.firestore().doc(`adminUsers/${uid}`).get();
    if (!isAdmin.exists) {
      throw new HttpsError("permission-denied", "Admin access is required.");
    }

    const requestId = request.data?.requestId;
    const message = typeof request.data?.message === "string" ? request.data.message.trim() : "";

    if (
      typeof requestId !== "string" ||
      requestId.length < 1 ||
      requestId.length > 160 ||
      requestId.includes("/")
    ) {
      throw new HttpsError("invalid-argument", "A valid requestId is required.");
    }
    if (message.length < 1 || message.length > 4000) {
      throw new HttpsError("invalid-argument", "Reply message must be 1-4000 characters.");
    }

    const ref = admin.firestore().doc(`dealLeadRequests/${requestId}`);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      throw new HttpsError("not-found", "Lead request not found.");
    }

    const lead = snapshot.data();
    if (!isValidEmail(lead.contactEmail)) {
      throw new HttpsError("failed-precondition", "Lead does not have a valid email address.");
    }

    try {
      const recipient = process.env.LEAD_EMAIL_TO || DEFAULT_TO;
      const from = process.env.LEAD_EMAIL_FROM || DEFAULT_FROM;
      const resend = new Resend(resendApiKey.value());
      const email = await sendCustomerReplyEmail({
        resend,
        requestId,
        lead,
        message,
        from,
        replyTo: recipient,
      });

      await ref.update({
        status: "contacted",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid,
        contactedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastCustomerReplyAt: admin.firestore.FieldValue.serverTimestamp(),
        lastCustomerReplyBy: uid,
        lastCustomerReplyPreview: truncate(message, 240),
        lastCustomerReplyResendId: email.id,
        customerReplyCount: admin.firestore.FieldValue.increment(1),
      });

      logger.info("Deal lead reply sent", {
        requestId,
        uid,
        emailId: email.id,
      });

      return {
        ok: true,
        status: "contacted",
        emailId: email.id,
      };
    } catch (error) {
      logger.error("Deal lead reply failed", {
        requestId,
        uid,
        error: errorMessage(error),
      });
      throw new HttpsError("internal", "CruiseKit reply failed.");
    }
  },
);

function growthInvalid(message) {
  throw new HttpsError("invalid-argument", message);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertAllowedKeys(value, allowedKeys, label) {
  if (!isPlainObject(value)) {
    growthInvalid(`${label} must be an object.`);
  }
  const unexpected = Object.keys(value).filter((key) => !allowedKeys.includes(key));
  if (unexpected.length > 0) {
    growthInvalid(`${label} contains unsupported fields.`);
  }
}

function requiredString(value, label, maxLength) {
  if (typeof value !== "string") {
    growthInvalid(`${label} is required.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    growthInvalid(`${label} must be between 1 and ${maxLength} characters.`);
  }
  return normalized;
}

function optionalString(value, label, maxLength) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    growthInvalid(`${label} must be text.`);
  }
  const normalized = value.trim();
  if (!normalized) return undefined;
  if (normalized.length > maxLength) {
    growthInvalid(`${label} must be at most ${maxLength} characters.`);
  }
  return normalized;
}

function requiredPositiveInteger(value, label, maxValue = 99999) {
  const normalized =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value.trim())
        ? Number(value.trim())
        : NaN;
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > maxValue) {
    growthInvalid(`${label} must be a whole number between 1 and ${maxValue}.`);
  }
  return normalized;
}

function optionalPositiveInteger(value, label, maxValue = 99999) {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredPositiveInteger(value, label, maxValue);
}

function normalizedChoiceKey(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeChoice(value, choices, label) {
  const raw = requiredString(value, label, 160);
  const normalized = choices[normalizedChoiceKey(raw)];
  if (!normalized) {
    growthInvalid(`${label} is not supported.`);
  }
  return normalized;
}

function optionalChoice(value, choices, label) {
  if (value === undefined || value === null || value === "") return undefined;
  return normalizeChoice(value, choices, label);
}

function requireIsoDate(value, label, { future = false } = {}) {
  const date = requiredString(value, label, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    growthInvalid(`${label} must use YYYY-MM-DD.`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const milliseconds = Date.UTC(year, month - 1, day);
  const parsed = new Date(milliseconds);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    growthInvalid(`${label} must be a real calendar date.`);
  }
  if (future) {
    const now = new Date();
    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    if (milliseconds <= today) {
      growthInvalid(`${label} must be a future date.`);
    }
  }
  return date;
}

function optionalIsoDate(value, label, options) {
  if (value === undefined || value === null || value === "") return undefined;
  return requireIsoDate(value, label, options);
}

function optionalHttpUrl(value, label) {
  const url = optionalString(value, label, 500);
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (
      (parsed.protocol !== "https:" && parsed.protocol !== "http:") ||
      parsed.username ||
      parsed.password
    ) {
      growthInvalid(`${label} must be an http(s) URL.`);
    }
    return parsed.toString();
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    growthInvalid(`${label} must be an http(s) URL.`);
  }
}

function requireAnonymousId(value) {
  const anonymousId = requiredString(value, "Anonymous ID", 128);
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(anonymousId)) {
    growthInvalid("Anonymous ID is invalid.");
  }
  return anonymousId;
}

function normalizeReferralCode(value) {
  const code = requiredString(value, "Referral code", 32).toUpperCase();
  if (!/^[A-Z2-9]{8,32}$/.test(code)) {
    growthInvalid("Referral code is invalid.");
  }
  return code;
}

function normalizeLandingPath(value) {
  const raw = requiredString(value, "Landing path", 512);
  if (
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\") ||
    /%2f|%5c/i.test(raw)
  ) {
    growthInvalid("Landing path must be an internal path.");
  }
  try {
    const parsed = new URL(raw, "https://cruisekit.invalid");
    if (parsed.origin !== "https://cruisekit.invalid") {
      growthInvalid("Landing path must be an internal path.");
    }
    return parsed.pathname;
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    growthInvalid("Landing path must be an internal path.");
  }
}

function normalizeInternalPath(value) {
  if (value === undefined || value === null || value === "") {
    return "/founding-20";
  }
  const path = normalizeLandingPath(value);
  if (typeof value === "string" && (value.includes("?") || value.includes("#"))) {
    growthInvalid("Referral destinations cannot include a query or fragment.");
  }
  return path;
}

function authenticatedGrowthUid(request) {
  const provider = request.auth?.token?.firebase?.sign_in_provider;
  if (!request.auth?.uid || provider === "anonymous") return null;
  return request.auth.uid;
}

function requireKnownGrowthUser(request) {
  const uid = authenticatedGrowthUid(request);
  if (!uid) {
    throw new HttpsError("unauthenticated", "Sign in is required.");
  }
  return uid;
}

function requiredSecret(secret, message) {
  const value = secret.value();
  if (typeof value !== "string" || value.length < 24) {
    throw new HttpsError("failed-precondition", message);
  }
  return value;
}

function hmacHash(secret, value) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function stableGrowthEventKey(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 40);
}

function assertEmptyHoneypot(value) {
  if (value === undefined || value === null) return;
  if (typeof value !== "string" || value.length > 200 || value.trim()) {
    throw new HttpsError("invalid-argument", "Unable to submit this form.");
  }
}

function normalizeApplicationType(value) {
  const applicationType = requiredString(value, "Application type", 40)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  if (!GROWTH_APPLICATION_TYPES.has(applicationType)) {
    growthInvalid("Application type is invalid.");
  }
  return applicationType;
}

function normalizeEmail(value) {
  const email = requiredString(value, "Email address", 320).toLowerCase();
  if (!isValidEmail(email)) {
    growthInvalid("Email address is invalid.");
  }
  return email;
}

function requireContactConsent(value) {
  if (value !== true) {
    growthInvalid("Contact consent is required.");
  }
  return true;
}

function withOptional(target, key, value) {
  if (value !== undefined) target[key] = value;
  return target;
}

function validateGrowthApplicationPayload(data) {
  assertAllowedKeys(data, ["applicationType", "form", "attribution", "honeypot"], "Application");
  const applicationType = normalizeApplicationType(data.applicationType);
  assertEmptyHoneypot(data.honeypot);
  const attribution = sanitizeGrowthAttribution(data.attribution);
  const form = data.form;
  if (!isPlainObject(form)) growthInvalid("Application form must be an object.");

  const common = ["contactConsent", "website"];
  let contact;
  let details;

  if (applicationType === "founding20") {
    assertAllowedKeys(
      form,
      [
        "firstName",
        "email",
        "phone",
        "cruiseLine",
        "ship",
        "departureDate",
        "travelers",
        "cruiseExperience",
        "primaryConcern",
        "preferredPlatform",
        ...common,
      ],
      "Founding 20 form",
    );
    assertEmptyHoneypot(form.website);
    requireContactConsent(form.contactConsent);
    contact = {
      firstName: requiredString(form.firstName, "First name", 120),
      email: normalizeEmail(form.email),
    };
    withOptional(contact, "phone", optionalString(form.phone, "Phone number", 40));
    details = {
      cruiseLine: requiredString(form.cruiseLine, "Cruise line", 120),
      ship: requiredString(form.ship, "Ship", 120),
      departureDate: requireIsoDate(form.departureDate, "Departure date", {
        future: true,
      }),
      travelers: requiredPositiveInteger(form.travelers, "Travelers"),
      cruiseExperience: normalizeChoice(
        form.cruiseExperience,
        {
          first: "first_cruise",
          first_cruise: "first_cruise",
          experienced: "experienced_cruiser",
          experienced_cruiser: "experienced_cruiser",
        },
        "Cruise experience",
      ),
      primaryConcern: normalizeChoice(
        form.primaryConcern,
        {
          budget: "budget",
          drink_package: "drink_package",
          daily_organization: "daily_organization",
          ports: "ports",
          group_coordination: "group_coordination",
          packing: "packing",
          other: "other",
        },
        "Primary concern",
      ),
      preferredPlatform: normalizeChoice(
        form.preferredPlatform,
        { iphone: "iphone", android: "android", web: "web" },
        "Preferred platform",
      ),
    };
  } else if (applicationType === "captain") {
    assertAllowedKeys(
      form,
      [
        "name",
        "email",
        "cruiseLine",
        "ship",
        "departureDate",
        "groupSize",
        "groupRole",
        "preferredPlatform",
        ...common,
      ],
      "Captain form",
    );
    assertEmptyHoneypot(form.website);
    requireContactConsent(form.contactConsent);
    contact = {
      firstName: requiredString(form.name, "Name", 120),
      email: normalizeEmail(form.email),
    };
    details = {};
    withOptional(details, "cruiseLine", optionalString(form.cruiseLine, "Cruise line", 120));
    withOptional(details, "ship", optionalString(form.ship, "Ship", 120));
    withOptional(
      details,
      "departureDate",
      optionalIsoDate(form.departureDate, "Departure date", { future: true }),
    );
    withOptional(details, "groupSize", optionalPositiveInteger(form.groupSize, "Group size"));
    withOptional(
      details,
      "groupRole",
      optionalChoice(
        form.groupRole,
        {
          group_chat: "group_chat",
          social_community: "social_community",
          travel_party: "travel_party",
          other: "other",
        },
        "Group role",
      ),
    );
    withOptional(
      details,
      "preferredPlatform",
      optionalChoice(
        form.preferredPlatform,
        { iphone: "iphone", android: "android", web: "web" },
        "Preferred platform",
      ),
    );
  } else if (applicationType === "advisor") {
    assertAllowedKeys(
      form,
      [
        "name",
        "email",
        "agencyName",
        "companyWebsite",
        "primaryMarket",
        "cruiseNiche",
        "preferredPlatform",
        ...common,
      ],
      "Advisor form",
    );
    assertEmptyHoneypot(form.website);
    requireContactConsent(form.contactConsent);
    contact = {
      firstName: requiredString(form.name, "Name", 120),
      email: normalizeEmail(form.email),
    };
    details = {};
    withOptional(details, "agencyName", optionalString(form.agencyName, "Agency name", 160));
    withOptional(
      details,
      "companyWebsite",
      optionalHttpUrl(form.companyWebsite, "Company website"),
    );
    withOptional(
      details,
      "primaryMarket",
      optionalChoice(
        form.primaryMarket,
        {
          families: "families",
          couples: "couples",
          groups: "groups",
          luxury: "luxury",
          premium: "premium",
          other: "other",
        },
        "Primary market",
      ),
    );
    withOptional(details, "cruiseNiche", optionalString(form.cruiseNiche, "Cruise niche", 200));
    withOptional(
      details,
      "preferredPlatform",
      optionalChoice(
        form.preferredPlatform,
        { iphone: "iphone", android: "android", web: "web" },
        "Preferred platform",
      ),
    );
  } else {
    assertAllowedKeys(
      form,
      [
        "name",
        "email",
        "primaryPlatform",
        "profileUrl",
        "audienceSizeRange",
        "cruiseNiche",
        "upcomingSailing",
        "preferredCollaborationType",
        ...common,
      ],
      "Creator form",
    );
    assertEmptyHoneypot(form.website);
    requireContactConsent(form.contactConsent);
    contact = {
      firstName: requiredString(form.name, "Name", 120),
      email: normalizeEmail(form.email),
    };
    details = {
      primaryPlatform: normalizeChoice(
        form.primaryPlatform,
        {
          instagram: "instagram",
          tiktok: "tiktok",
          youtube: "youtube",
          blog: "blog",
          facebook: "facebook",
          other: "other",
        },
        "Primary platform",
      ),
    };
    withOptional(details, "profileUrl", optionalHttpUrl(form.profileUrl, "Profile URL"));
    withOptional(
      details,
      "audienceSizeRange",
      optionalChoice(
        form.audienceSizeRange,
        {
          under_1_000: "under_1000",
          "1_000_9_999": "1000_9999",
          "10_000_49_999": "10000_49999",
          "50_000_249_999": "50000_249999",
          "250_000": "250000_plus",
          prefer_not_to_say: "prefer_not_to_say",
        },
        "Audience size range",
      ),
    );
    withOptional(details, "cruiseNiche", optionalString(form.cruiseNiche, "Cruise niche", 200));
    withOptional(
      details,
      "upcomingSailing",
      optionalString(form.upcomingSailing, "Upcoming sailing", 200),
    );
    withOptional(
      details,
      "preferredCollaborationType",
      optionalChoice(
        form.preferredCollaborationType,
        {
          cost_breakdown_content: "cost_breakdown_content",
          cruise_planning_content: "cruise_planning_content",
          product_feedback: "product_feedback",
          other: "other",
        },
        "Preferred collaboration type",
      ),
    );
  }

  return { applicationType, contact, details, attribution };
}

function sanitizeGrowthAttribution(value) {
  if (value === undefined || value === null) return null;
  assertAllowedKeys(value, ["anonymousId", "firstTouch", "lastTouch"], "Attribution");
  const anonymousId =
    value.anonymousId === undefined ? undefined : requireAnonymousId(value.anonymousId);
  const firstTouch =
    value.firstTouch === undefined
      ? undefined
      : sanitizeGrowthTouch(value.firstTouch, "First touch");
  const lastTouch =
    value.lastTouch === undefined
      ? undefined
      : sanitizeGrowthTouch(value.lastTouch, "Last touch");
  if (!anonymousId && !firstTouch && !lastTouch) return null;
  return {
    ...(anonymousId ? { anonymousId } : {}),
    ...(firstTouch ? { firstTouch } : {}),
    ...(lastTouch ? { lastTouch } : {}),
  };
}

function sanitizeGrowthTouch(value, label) {
  assertAllowedKeys(
    value,
    [
      "sourceType",
      "sourceId",
      "landingContext",
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "utmContent",
      "utmTerm",
      "referralCode",
      "landingPath",
      "landingPage",
      "occurredAt",
      "capturedAt",
    ],
    label,
  );
  const landingPathValue = value.landingPath ?? value.landingPage;
  const referralCode =
    value.referralCode === undefined || value.referralCode === ""
      ? undefined
      : normalizeReferralCode(value.referralCode);
  const utmSource = optionalString(value.utmSource, "UTM source", 120);
  const touch = {};
  withOptional(
    touch,
    "sourceType",
    optionalChoice(
      value.sourceType,
      {
        calculator: "calculator",
        traveler: "traveler",
        advisor: "advisor",
        creator: "creator",
        organic: "organic",
        direct: "direct",
      },
      "Source type",
    ) ?? (referralCode ? "traveler" : utmSource ? "organic" : "direct"),
  );
  withOptional(touch, "sourceId", optionalString(value.sourceId, "Source ID", 120));
  withOptional(
    touch,
    "landingContext",
    optionalChoice(
      value.landingContext,
      {
        generic: "generic",
        cruise_line: "cruise_line",
        ship: "ship",
        sailing: "sailing",
        itinerary: "itinerary",
        port: "port",
      },
      "Landing context",
    ) ?? "generic",
  );
  withOptional(
    touch,
    "landingPath",
    landingPathValue === undefined || landingPathValue === ""
      ? undefined
      : normalizeLandingPath(landingPathValue),
  );
  withOptional(touch, "utmSource", utmSource);
  withOptional(touch, "utmMedium", optionalString(value.utmMedium, "UTM medium", 120));
  withOptional(touch, "utmCampaign", optionalString(value.utmCampaign, "UTM campaign", 120));
  withOptional(touch, "utmContent", optionalString(value.utmContent, "UTM content", 120));
  withOptional(touch, "utmTerm", optionalString(value.utmTerm, "UTM term", 120));
  withOptional(touch, "referralCode", referralCode);
  return touch;
}

function validateIdentityLinkPayload(data, uid) {
  assertAllowedKeys(data, ["anonymousId", "attribution", "userId"], "Identity link");
  if (data.userId !== undefined && requiredString(data.userId, "User ID", 128) !== uid) {
    growthInvalid("Identity link does not match the signed-in user.");
  }
  const attribution = data.attribution
    ? sanitizeGrowthAttribution(data.attribution)
    : sanitizeGrowthAttribution({ anonymousId: data.anonymousId });
  if (!attribution?.anonymousId) {
    growthInvalid("Anonymous attribution is required.");
  }
  return attribution;
}

function validateReferralResolutionPayload(data) {
  assertAllowedKeys(data, ["code", "anonymousId"], "Referral resolution");
  return {
    code: normalizeReferralCode(data.code),
    ...(data.anonymousId === undefined
      ? {}
      : { anonymousId: requireAnonymousId(data.anonymousId) }),
  };
}

function validateGrowthEventPayload(data) {
  assertAllowedKeys(data, ["eventName", "eventId", "context", "attribution"], "Growth event");
  const eventName = requiredString(data.eventName, "Event name", 80).toLowerCase();
  if (!GROWTH_EVENT_NAMES.has(eventName)) {
    growthInvalid("Event name is not supported.");
  }
  if (eventName === "activation_completed") {
    growthInvalid("Activation is derived by CruiseKit.");
  }
  let eventId = data.eventId;
  if (eventId === undefined || eventId === null || eventId === "") {
    eventId = crypto.randomUUID();
  } else {
    eventId = requiredString(eventId, "Event ID", 128);
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(eventId)) {
      growthInvalid("Event ID is invalid.");
    }
  }
  return {
    eventName,
    eventId,
    context: sanitizeGrowthEventContext(data.context),
    attribution: sanitizeGrowthAttribution(data.attribution),
  };
}

function sanitizeGrowthEventContext(value) {
  if (value === undefined || value === null) return {};
  assertAllowedKeys(
    value,
    [
      "cruiseLineId",
      "cruiseLine",
      "platform",
      "landingPath",
      "landingPage",
      "referralCode",
      "campaign",
      "utmCampaign",
      "sourceType",
      "sourceId",
      "landingContext",
      "experimentId",
      "experimentVariant",
      "applicationType",
      "groupId",
      "sailingDepartureWindow",
      "departureWindow",
      "deviceCategory",
      "store",
    ],
    "Growth event context",
  );
  const context = {};
  withOptional(
    context,
    "cruiseLineId",
    optionalString(value.cruiseLineId ?? value.cruiseLine, "Cruise line", 80),
  );
  withOptional(
    context,
    "platform",
    optionalChoice(
      value.platform,
      { iphone: "iphone", ios: "iphone", android: "android", web: "web" },
      "Platform",
    ),
  );
  const landingPath = value.landingPath ?? value.landingPage;
  withOptional(
    context,
    "landingPath",
    landingPath === undefined || landingPath === ""
      ? undefined
      : normalizeLandingPath(landingPath),
  );
  withOptional(
    context,
    "referralCode",
    value.referralCode === undefined || value.referralCode === ""
      ? undefined
      : normalizeReferralCode(value.referralCode),
  );
  withOptional(
    context,
    "campaign",
    optionalString(value.campaign ?? value.utmCampaign, "Campaign", 120),
  );
  withOptional(
    context,
    "sourceType",
    optionalChoice(
      value.sourceType,
      {
        calculator: "calculator",
        traveler: "traveler",
        advisor: "advisor",
        creator: "creator",
        organic: "organic",
        direct: "direct",
      },
      "Source type",
    ),
  );
  withOptional(context, "sourceId", optionalString(value.sourceId, "Source ID", 120));
  withOptional(
    context,
    "landingContext",
    optionalChoice(
      value.landingContext,
      {
        generic: "generic",
        cruise_line: "cruise_line",
        ship: "ship",
        sailing: "sailing",
        itinerary: "itinerary",
        port: "port",
      },
      "Landing context",
    ),
  );
  withOptional(
    context,
    "experimentId",
    optionalString(value.experimentId, "Experiment ID", 120),
  );
  withOptional(
    context,
    "experimentVariant",
    optionalString(value.experimentVariant, "Experiment variant", 120),
  );
  withOptional(
    context,
    "applicationType",
    value.applicationType === undefined || value.applicationType === ""
      ? undefined
      : normalizeApplicationType(value.applicationType),
  );
  if (value.groupId !== undefined && value.groupId !== null && value.groupId !== "") {
    const groupId = requiredString(value.groupId, "Group ID", 128);
    if (groupId.includes("/")) growthInvalid("Group ID is invalid.");
    context.groupId = groupId;
  }
  const departureWindow = value.sailingDepartureWindow ?? value.departureWindow;
  if (departureWindow !== undefined && departureWindow !== null && departureWindow !== "") {
    const normalizedWindow = requiredString(
      departureWindow,
      "Sailing departure window",
      7,
    );
    const match = /^(\d{4})-(\d{2})$/.exec(normalizedWindow);
    if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
      growthInvalid("Sailing departure window must use YYYY-MM.");
    }
    context.sailingDepartureWindow = normalizedWindow;
  }
  withOptional(
    context,
    "deviceCategory",
    optionalChoice(
      value.deviceCategory,
      { mobile: "mobile", tablet: "tablet", desktop: "desktop", unknown: "unknown" },
      "Device category",
    ),
  );
  withOptional(
    context,
    "store",
    optionalChoice(
      value.store,
      {
        apple: "apple",
        app_store: "apple",
        google: "google",
        google_play: "google",
      },
      "Store",
    ),
  );
  return context;
}

function clientAddress(request) {
  const rawRequest = request.rawRequest;
  if (typeof rawRequest?.ip === "string" && rawRequest.ip) {
    return rawRequest.ip;
  }
  const forwarded = rawRequest?.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) {
    return forwarded.split(",")[0].trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(",")[0].trim() || "unknown";
  }
  return "unknown";
}

async function consumeGrowthRateLimit({
  database,
  request,
  secret,
  scope,
  maxAttempts,
}) {
  const now = Date.now();
  const windowStart = Math.floor(now / GROWTH_RATE_LIMIT_WINDOW_MS) *
    GROWTH_RATE_LIMIT_WINDOW_MS;
  const windowEnd = windowStart + GROWTH_RATE_LIMIT_WINDOW_MS;
  const addressHash = hmacHash(
    secret,
    `growth-rate-v1|${scope}|${windowStart}|${clientAddress(request)}`,
  );
  const safeScope = scope.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 80);
  const rateLimitRef = database
    .collection("growthRateLimits")
    .doc(`${safeScope}_${addressHash.slice(0, 40)}`);

  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitRef);
    const existing = snapshot.exists ? snapshot.data() : {};
    const currentCount = Number.isInteger(existing?.count) ? existing.count : 0;
    if (currentCount >= maxAttempts) {
      throw new HttpsError(
        "resource-exhausted",
        "Please wait before trying again.",
      );
    }
    transaction.set(
      rateLimitRef,
      {
        scope: safeScope,
        count: currentCount + 1,
        windowStartedAt: admin.firestore.Timestamp.fromMillis(windowStart),
        expiresAt: admin.firestore.Timestamp.fromMillis(
          windowEnd + GROWTH_RATE_LIMIT_WINDOW_MS,
        ),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...(snapshot.exists
          ? {}
          : { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );
  });
}

function storedAttributionSnapshot(attribution) {
  if (!attribution) return {};
  const snapshot = {};
  withOptional(snapshot, "firstTouch", attribution.firstTouch);
  withOptional(snapshot, "lastTouch", attribution.lastTouch);
  withOptional(snapshot, "anonymousIdHash", attribution.anonymousIdHash);
  return snapshot;
}

function sanitizeSavedCruiseAttribution(value) {
  if (!isPlainObject(value)) return null;
  try {
    const firstTouch = isPlainObject(value.firstTouch)
      ? sanitizeGrowthTouch(value.firstTouch, "Saved cruise first touch")
      : undefined;
    const lastTouch = isPlainObject(value.convertingTouch)
      ? sanitizeGrowthTouch(value.convertingTouch, "Saved cruise converting touch")
      : undefined;
    if (!firstTouch && !lastTouch) return null;
    return {
      ...(firstTouch ? { firstTouch } : {}),
      ...(lastTouch ? { lastTouch } : {}),
    };
  } catch (error) {
    logger.warn("Ignoring malformed saved-cruise attribution", {
      error: errorMessage(error),
    });
    return null;
  }
}

function mergeAttribution(existing, incoming, anonymousIdHash) {
  const current = isPlainObject(existing) ? existing : {};
  const next = {};
  const firstTouch = current.firstTouch ?? incoming?.firstTouch;
  const lastTouch =
    incoming?.lastTouch ?? incoming?.firstTouch ?? current.lastTouch;
  withOptional(next, "firstTouch", firstTouch);
  withOptional(next, "lastTouch", lastTouch);
  withOptional(
    next,
    "anonymousIdHash",
    anonymousIdHash ?? current.anonymousIdHash,
  );
  return next;
}

async function upsertGrowthAttribution({
  database,
  attribution,
  uid,
  identitySecret,
}) {
  if (!attribution) return {};
  const anonymousIdHash = attribution.anonymousId
    ? hmacHash(identitySecret, `growth-identity-v1|${attribution.anonymousId}`)
    : undefined;
  const attributionRef = anonymousIdHash
    ? database.collection("growthAttributions").doc(anonymousIdHash)
    : null;
  const profileRef = uid ? database.collection("growthProfiles").doc(uid) : null;
  let result = {};

  await database.runTransaction(async (transaction) => {
    const reads = [];
    if (attributionRef) reads.push(transaction.get(attributionRef));
    if (profileRef) reads.push(transaction.get(profileRef));
    const snapshots = await Promise.all(reads);
    const attributionSnapshot = attributionRef ? snapshots.shift() : null;
    const profileSnapshot = profileRef ? snapshots.shift() : null;
    const currentAttribution = attributionSnapshot?.exists
      ? attributionSnapshot.data()
      : {};
    const currentProfile = profileSnapshot?.exists ? profileSnapshot.data() : {};

    if (
      currentAttribution?.linkedUid &&
      uid &&
      currentAttribution.linkedUid !== uid
    ) {
      throw new HttpsError(
        "failed-precondition",
        "This visitor identity is already linked to another account.",
      );
    }

    const merged = mergeAttribution(
      currentAttribution,
      attribution,
      anonymousIdHash,
    );
    if (attributionRef) {
      transaction.set(
        attributionRef,
        {
          schemaVersion: 1,
          ...merged,
          ...(uid ? { linkedUid: uid } : {}),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          ...(attributionSnapshot?.exists
            ? {}
            : { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
        },
        { merge: true },
      );
    }

    const profileAttribution = mergeAttribution(
      currentProfile?.attribution,
      {
        firstTouch: merged.firstTouch ?? attribution.firstTouch,
        lastTouch: merged.lastTouch ?? attribution.lastTouch,
      },
      anonymousIdHash,
    );
    if (profileRef) {
      transaction.set(
        profileRef,
        {
          schemaVersion: 1,
          uid,
          attribution: profileAttribution,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          ...(profileSnapshot?.exists
            ? {}
            : { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
        },
        { merge: true },
      );
    }
    result = {
      ...(anonymousIdHash ? { anonymousIdHash } : {}),
      ...(merged.firstTouch ? { firstTouch: merged.firstTouch } : {}),
      ...(merged.lastTouch ? { lastTouch: merged.lastTouch } : {}),
    };
  });
  return result;
}

async function linkGrowthApplicationsToIdentity({
  database,
  uid,
  anonymousIdHash,
}) {
  if (!anonymousIdHash) return;
  const applications = await database
    .collection("growthApplications")
    .where("attribution.anonymousIdHash", "==", anonymousIdHash)
    .limit(25)
    .get();
  const batch = database.batch();
  let updates = 0;
  for (const application of applications.docs) {
    const currentUid = application.data()?.applicantUid;
    if (currentUid && currentUid !== uid) continue;
    if (currentUid === uid) continue;
    batch.update(application.ref, {
      applicantUid: uid,
      linkedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    updates += 1;
  }
  if (updates > 0) await batch.commit();
}

function applicationSubmittedEventName(applicationType) {
  if (applicationType === "founding20") {
    return "founding20_application_submitted";
  }
  return `${applicationType}_application_submitted`;
}

function isAlreadyExistsError(error) {
  return error?.code === 6 || error?.code === "already-exists";
}

async function writeGrowthEvent({
  database,
  eventId,
  eventName,
  uid,
  anonymousIdHash,
  attribution,
  context,
  applicationId,
  source,
}) {
  const eventRef = database.collection("growthEvents").doc(eventId);
  const event = {
    schemaVersion: 1,
    eventName,
    source,
    context: context ?? {},
    attribution: storedAttributionSnapshot(attribution),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...(uid ? { userId: uid } : {}),
    ...(anonymousIdHash ? { anonymousIdHash } : {}),
    ...(applicationId ? { applicationId } : {}),
  };
  try {
    await eventRef.create(event);
    return { deduplicated: false };
  } catch (error) {
    if (isAlreadyExistsError(error)) return { deduplicated: true };
    throw error;
  }
}

async function verifyMyCrewGrowthEvent({ database, uid, eventName, groupId }) {
  if (!groupId) {
    growthInvalid("A MyCrew group is required for this event.");
  }
  const groupSnapshot = await database.collection("groups").doc(groupId).get();
  if (!groupSnapshot.exists) {
    throw new HttpsError("failed-precondition", "MyCrew group was not found.");
  }
  const group = groupSnapshot.data();
  if (
    eventName === "mycrew_invite_created" ||
    eventName === "mycrew_invite_sent"
  ) {
    if (group.organizerId !== uid) {
      throw new HttpsError(
        "permission-denied",
        "Only the MyCrew organizer can record an invitation.",
      );
    }
    return;
  }
  const members = Array.isArray(group.memberUserIds) ? group.memberUserIds : [];
  if (!members.includes(uid)) {
    throw new HttpsError(
      "permission-denied",
      "Only a MyCrew member can record acceptance.",
    );
  }
}

function readRealSavedSailing(savedCruise) {
  const sailing = isPlainObject(savedCruise?.sailing) ? savedCruise.sailing : null;
  if (!sailing || sailing.isRealUpcoming !== true) return null;
  if (
    typeof sailing.id !== "string" ||
    !sailing.id.trim() ||
    sailing.id.length > 160 ||
    typeof sailing.cruiseLineId !== "string" ||
    !sailing.cruiseLineId.trim() ||
    sailing.cruiseLineId.length > 80 ||
    typeof sailing.shipName !== "string" ||
    sailing.shipName.trim().length < 3 ||
    sailing.shipName.length > 120 ||
    typeof sailing.departureDate !== "string"
  ) {
    return null;
  }
  const shipKey = sailing.shipName.trim().toLowerCase().replace(/\s+/g, " ");
  if (
    ["cruise not selected yet", "not selected yet", "unknown", "tbd", "cruise"].includes(
      shipKey,
    )
  ) {
    return null;
  }
  try {
    const departureDate = requireIsoDate(sailing.departureDate, "Departure date", {
      future: true,
    });
    return {
      id: sailing.id.trim(),
      cruiseLineId: sailing.cruiseLineId.trim(),
      shipName: sailing.shipName.trim(),
      departureDate,
      departureMonth: departureDate.slice(0, 7),
    };
  } catch (error) {
    return null;
  }
}

function hasTrustedCalculatorSnapshot(savedCruise) {
  const snapshot = isPlainObject(savedCruise?.calculatorSnapshot)
    ? savedCruise.calculatorSnapshot
    : null;
  const estimate = isPlainObject(snapshot?.estimate) ? snapshot.estimate : null;
  if (!snapshot || snapshot.version !== "1" || !estimate) return false;
  return [
    estimate.advertisedFare,
    estimate.estimatedTotal,
    estimate.totalAdditional,
  ].every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0);
}

function growthSailingContext(sailing) {
  return {
    cruiseLineId: sailing.cruiseLineId,
    sailingDepartureWindow: sailing.departureMonth,
  };
}

function safeQualifyingActions(value) {
  if (!isPlainObject(value)) return {};
  const actions = {};
  for (const action of Object.keys(value)) {
    if (QUALIFYING_GROWTH_ACTIONS.has(action) && isPlainObject(value[action])) {
      actions[action] = value[action];
    }
  }
  return actions;
}

function safeGrowthSailing(value) {
  if (!isPlainObject(value)) return undefined;
  const required = ["id", "cruiseLineId", "shipName", "departureDate", "departureMonth"];
  if (!required.every((key) => typeof value[key] === "string" && value[key])) {
    return undefined;
  }
  return {
    id: value.id,
    cruiseLineId: value.cruiseLineId,
    shipName: value.shipName,
    departureDate: value.departureDate,
    departureMonth: value.departureMonth,
  };
}

async function updateGrowthProfile({
  database,
  uid,
  savedCruise,
  action,
  actionSource,
  attribution,
}) {
  const profileRef = database.collection("growthProfiles").doc(uid);
  const incomingSailing = readRealSavedSailing(savedCruise);
  return database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const current = snapshot.exists ? snapshot.data() : {};
    const qualifyingActions = safeQualifyingActions(current?.qualifyingActions);
    if (action && QUALIFYING_GROWTH_ACTIONS.has(action) && !qualifyingActions[action]) {
      qualifyingActions[action] = {
        source: actionSource,
        recordedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    }

    const sailing = incomingSailing ?? safeGrowthSailing(current?.sailing);
    const actionNames = Object.keys(qualifyingActions);
    const priorActivation = isPlainObject(current?.activation)
      ? current.activation
      : {};
    const alreadyActivated = priorActivation.state === "activated";
    const shouldActivate = Boolean(sailing && actionNames.length > 0);
    const activation = alreadyActivated
      ? priorActivation
      : shouldActivate
        ? {
            state: "activated",
            isActivated: true,
            activatedAt: admin.firestore.FieldValue.serverTimestamp(),
            qualifyingAction: action ?? actionNames[0],
            version: 1,
          }
        : { state: "pending", isActivated: false, version: 1 };
    const profileAttribution = mergeAttribution(
      current?.attribution,
      attribution,
      attribution?.anonymousIdHash,
    );
    const update = {
      schemaVersion: 1,
      uid,
      qualifyingActions,
      activation,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(sailing ? { sailing } : {}),
      ...(Object.keys(profileAttribution).length > 0
        ? { attribution: profileAttribution }
        : {}),
      ...(snapshot.exists
        ? {}
        : { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
    };
    transaction.set(profileRef, update, { merge: true });
    return {
      activation: {
        state: activation.state === "activated" ? "activated" : "pending",
        isActivated: activation.state === "activated",
      },
      becameActivated: !alreadyActivated && shouldActivate,
      sailing,
    };
  });
}

async function updateGrowthProfileForEvent({
  database,
  uid,
  eventName,
  attribution,
  actionSource,
  verifiedMyCrew,
}) {
  const savedCruiseSnapshot = await database
    .collection("users")
    .doc(uid)
    .collection("savedCruises")
    .doc("active")
    .get();
  const savedCruise = savedCruiseSnapshot.exists ? savedCruiseSnapshot.data() : null;
  const calculatorAction =
    eventName === "calculator_completed" &&
    Boolean(readRealSavedSailing(savedCruise)) &&
    hasTrustedCalculatorSnapshot(savedCruise);
  const myCrewAction =
    verifiedMyCrew &&
    (eventName === "mycrew_invite_sent" || eventName === "mycrew_invite_accepted");
  return updateGrowthProfile({
    database,
    uid,
    savedCruise,
    action: calculatorAction || myCrewAction ? eventName : null,
    actionSource,
    attribution,
  });
}

async function writeActivationCompletedEvent({
  database,
  uid,
  sailing,
  attribution,
  source,
}) {
  if (!sailing) return;
  const key = stableGrowthEventKey(
    `activation|${uid}|${sailing.id}|${sailing.departureDate}`,
  );
  await writeGrowthEvent({
    database,
    eventId: `activation_${key}`,
    eventName: "activation_completed",
    uid,
    attribution,
    context: growthSailingContext(sailing),
    source,
  });
}

function normalizeReferralPartnerType(value) {
  return normalizeChoice(
    value,
    {
      founding_user: "founding_user",
      sailing_captain: "sailing_captain",
      cruise_creator: "cruise_creator",
      travel_advisor: "travel_advisor",
      community_administrator: "community_administrator",
      community_admin: "community_administrator",
      internal_campaign: "internal_campaign",
    },
    "Referral partner type",
  );
}

function sourceTypeForReferral(partnerType) {
  if (partnerType === "travel_advisor") return "advisor";
  if (partnerType === "cruise_creator") return "creator";
  if (partnerType === "internal_campaign") return "organic";
  return "traveler";
}

function validateReferralManagementPayload(data) {
  assertAllowedKeys(
    data,
    [
      "action",
      "code",
      "partnerType",
      "destinationPath",
      "targetPath",
      "label",
      "ownerUid",
      "campaign",
      "limit",
    ],
    "Referral management request",
  );
  const action = requiredString(data.action, "Action", 20).toLowerCase();
  if (!new Set(["create", "revoke", "list"]).has(action)) {
    growthInvalid("Referral action is invalid.");
  }
  if (action === "create") {
    const ownerUid = optionalString(data.ownerUid, "Owner UID", 128);
    if (ownerUid?.includes("/")) growthInvalid("Owner UID is invalid.");
    return {
      action,
      partnerType: normalizeReferralPartnerType(data.partnerType),
      destinationPath: normalizeInternalPath(
        data.destinationPath ?? data.targetPath ?? "/founding-20",
      ),
      ...(optionalString(data.label, "Referral label", 160)
        ? { label: optionalString(data.label, "Referral label", 160) }
        : {}),
      ...(ownerUid ? { ownerUid } : {}),
      ...(optionalString(data.campaign, "Campaign", 120)
        ? { campaign: optionalString(data.campaign, "Campaign", 120) }
        : {}),
    };
  }
  if (action === "revoke") {
    return { action, code: normalizeReferralCode(data.code) };
  }
  return {
    action,
    ...(data.limit === undefined
      ? {}
      : { limit: requiredPositiveInteger(data.limit, "Limit", 100) }),
  };
}

function randomReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(14);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function createReferralCode({
  database,
  uid,
  partnerType,
  destinationPath,
  label,
  ownerUid,
  campaign,
}) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomReferralCode();
    const referral = {
      schemaVersion: 1,
      code,
      partnerType,
      destinationPath,
      isActive: true,
      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(label ? { label } : {}),
      ...(ownerUid ? { ownerUid } : {}),
      ...(campaign ? { campaign } : {}),
    };
    try {
      await database.collection("referralCodes").doc(code).create(referral);
      return {
        code,
        partnerType,
        targetPath: destinationPath,
        active: true,
        ...(label ? { label } : {}),
        ...(ownerUid ? { ownerUid } : {}),
        ...(campaign ? { campaign } : {}),
      };
    } catch (error) {
      if (!isAlreadyExistsError(error)) throw error;
    }
  }
  throw new HttpsError("aborted", "Could not allocate a referral code. Try again.");
}

function timestampToIso(value) {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value.toDate === "function") return value.toDate().toISOString();
  if (value && typeof value._seconds === "number") {
    return new Date(value._seconds * 1000).toISOString();
  }
  return undefined;
}

function serializeReferral(code, referral) {
  return {
    code,
    partnerType: typeof referral?.partnerType === "string" ? referral.partnerType : "",
    targetPath: typeof referral?.destinationPath === "string"
      ? referral.destinationPath
      : "/founding-20",
    active: referral?.isActive === true,
    ...(typeof referral?.label === "string" ? { label: referral.label } : {}),
    ...(typeof referral?.ownerUid === "string" ? { ownerUid: referral.ownerUid } : {}),
    ...(typeof referral?.campaign === "string" ? { campaign: referral.campaign } : {}),
    ...(timestampToIso(referral?.createdAt)
      ? { createdAt: timestampToIso(referral.createdAt) }
      : {}),
    ...(timestampToIso(referral?.revokedAt)
      ? { revokedAt: timestampToIso(referral.revokedAt) }
      : {}),
  };
}

async function requireAdminUser(uid) {
  const adminSnapshot = await admin.firestore().collection("adminUsers").doc(uid).get();
  if (!adminSnapshot.exists) {
    throw new HttpsError("permission-denied", "Admin access is required.");
  }
}

function normalizeApplicationStatus(value) {
  const status = requiredString(value, "Application status", 40)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  if (!GROWTH_APPLICATION_STATUSES.has(status)) {
    growthInvalid("Application status is invalid.");
  }
  return status;
}

function validateGrowthConsoleFilters(value) {
  if (value === undefined || value === null) return {};
  assertAllowedKeys(
    value,
    [
      "date",
      "applicationType",
      "status",
      "campaign",
      "referralCode",
      "platform",
      "cruiseLine",
      "activationState",
    ],
    "Growth filters",
  );
  const filters = {};
  withOptional(filters, "date", optionalIsoDate(value.date, "Filter date"));
  withOptional(
    filters,
    "applicationType",
    value.applicationType === undefined || value.applicationType === ""
      ? undefined
      : normalizeApplicationType(value.applicationType),
  );
  withOptional(
    filters,
    "status",
    value.status === undefined || value.status === "" || value.status === "all"
      ? undefined
      : normalizeApplicationStatus(value.status),
  );
  withOptional(filters, "campaign", optionalString(value.campaign, "Campaign", 120));
  withOptional(
    filters,
    "referralCode",
    value.referralCode === undefined || value.referralCode === ""
      ? undefined
      : normalizeReferralCode(value.referralCode),
  );
  withOptional(
    filters,
    "platform",
    optionalChoice(
      value.platform,
      { iphone: "iphone", android: "android", web: "web" },
      "Platform",
    ),
  );
  withOptional(filters, "cruiseLine", optionalString(value.cruiseLine, "Cruise line", 120));
  withOptional(
    filters,
    "activationState",
    optionalChoice(
      value.activationState,
      { activated: "activated", pending: "pending" },
      "Activation state",
    ),
  );
  return filters;
}

function validateGrowthConsolePayload(data) {
  assertAllowedKeys(
    data,
    [
      "action",
      "applicationId",
      "patch",
      "filters",
      "limit",
      "status",
      "founderNote",
      "founderNotes",
      "followUpDate",
    ],
    "Growth console request",
  );
  const action = requiredString(data.action, "Action", 20).toLowerCase();
  if (!new Set(["list", "update", "summary", "export"]).has(action)) {
    growthInvalid("Growth console action is invalid.");
  }
  const common = {
    action,
    filters: validateGrowthConsoleFilters(data.filters),
    ...(data.limit === undefined
      ? {}
      : { limit: requiredPositiveInteger(data.limit, "Limit", 100) }),
  };
  if (action !== "update") return common;

  const applicationId = requiredString(data.applicationId, "Application ID", 128);
  if (applicationId.includes("/")) growthInvalid("Application ID is invalid.");
  const patch = data.patch === undefined
    ? {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.founderNotes !== undefined
          ? { founderNotes: data.founderNotes }
          : data.founderNote !== undefined
            ? { founderNotes: data.founderNote }
            : {}),
        ...(data.followUpDate !== undefined ? { followUpDate: data.followUpDate } : {}),
      }
    : data.patch;
  assertAllowedKeys(patch, ["status", "founderNotes", "founderNote", "followUpDate"], "Application patch");
  if (Object.keys(patch).length === 0) {
    growthInvalid("Application patch cannot be empty.");
  }
  const founderNotesValue = patch.founderNotes ?? patch.founderNote;
  let founderNotes;
  if (founderNotesValue !== undefined) {
    if (typeof founderNotesValue !== "string" || founderNotesValue.length > 4000) {
      growthInvalid("Founder notes must be at most 4000 characters.");
    }
    founderNotes = founderNotesValue.trim();
  }
  let followUpDate;
  if (patch.followUpDate !== undefined) {
    followUpDate = patch.followUpDate === "" || patch.followUpDate === null
      ? null
      : requireIsoDate(patch.followUpDate, "Follow-up date");
  }
  return {
    ...common,
    applicationId,
    ...(patch.status === undefined
      ? {}
      : { status: normalizeApplicationStatus(patch.status) }),
    ...(founderNotes !== undefined ? { founderNotes } : {}),
    ...(followUpDate !== undefined ? { followUpDate } : {}),
  };
}

function plainObject(value) {
  return isPlainObject(value) ? value : {};
}

function profileActionNames(profile) {
  return Object.keys(safeQualifyingActions(profile?.qualifyingActions));
}

function profileInvitationCounts(profile) {
  const actions = profileActionNames(profile);
  return {
    sent: actions.includes("mycrew_invite_sent") ? 1 : 0,
    accepted: actions.includes("mycrew_invite_accepted") ? 1 : 0,
  };
}

async function serializeGrowthApplication(database, snapshot) {
  const application = snapshot.data() ?? {};
  const contact = plainObject(application.contact);
  const details = plainObject(application.details);
  let profile = null;
  if (typeof application.applicantUid === "string") {
    const profileSnapshot = await database
      .collection("growthProfiles")
      .doc(application.applicantUid)
      .get();
    profile = profileSnapshot.exists ? profileSnapshot.data() : null;
  }
  const attribution = plainObject(application.attribution);
  const touch = plainObject(attribution.lastTouch ?? attribution.firstTouch);
  const activation = plainObject(profile?.activation);
  const activated = activation.state === "activated";
  const cruiseLine = typeof details.cruiseLine === "string" ? details.cruiseLine : "";
  const ship = typeof details.ship === "string" ? details.ship : "";
  const departureDate = typeof details.departureDate === "string"
    ? details.departureDate
    : "";
  const platform = typeof details.preferredPlatform === "string"
    ? details.preferredPlatform
    : typeof details.primaryPlatform === "string"
      ? details.primaryPlatform
      : "";
  const actionNames = profileActionNames(profile);
  return {
    id: snapshot.id,
    type: typeof application.applicationType === "string" ? application.applicationType : "",
    applicationType: typeof application.applicationType === "string"
      ? application.applicationType
      : "",
    status: typeof application.status === "string" ? application.status : "new",
    ...(timestampToIso(application.createdAt)
      ? { createdAt: timestampToIso(application.createdAt) }
      : {}),
    contact: {
      firstName: typeof contact.firstName === "string" ? contact.firstName : "",
      email: typeof contact.email === "string" ? contact.email : "",
      ...(typeof contact.phone === "string" ? { phone: contact.phone } : {}),
    },
    firstName: typeof contact.firstName === "string" ? contact.firstName : "",
    email: typeof contact.email === "string" ? contact.email : "",
    ...(typeof contact.phone === "string" ? { phone: contact.phone } : {}),
    cruise: { cruiseLine, ship, departureDate },
    cruiseLine,
    ship,
    departureDate,
    platform,
    attribution,
    ...(typeof touch.utmCampaign === "string" ? { campaign: touch.utmCampaign } : {}),
    ...(typeof touch.referralCode === "string"
      ? { referralCode: touch.referralCode }
      : {}),
    ...(typeof touch.sourceType === "string"
      ? { referralPartner: touch.sourceType }
      : {}),
    activation: {
      state: activated ? "activated" : "pending",
      isActivated: activated,
      ...(timestampToIso(activation.activatedAt)
        ? { activatedAt: timestampToIso(activation.activatedAt) }
        : {}),
    },
    meaningfulActions: actionNames,
    invites: profileInvitationCounts(profile),
    ...(typeof application.founderNote === "string"
      ? { founderNotes: application.founderNote }
      : {}),
    ...(typeof application.followUpDate === "string"
      ? { followUpDate: application.followUpDate }
      : {}),
  };
}

function matchesGrowthFilters(application, filters) {
  if (filters.applicationType && application.applicationType !== filters.applicationType) {
    return false;
  }
  if (filters.status && application.status !== filters.status) return false;
  if (filters.campaign && application.campaign !== filters.campaign) return false;
  if (filters.referralCode && application.referralCode !== filters.referralCode) {
    return false;
  }
  if (filters.platform && application.platform !== filters.platform) return false;
  if (filters.cruiseLine && application.cruiseLine !== filters.cruiseLine) {
    return false;
  }
  if (filters.activationState && application.activation?.state !== filters.activationState) {
    return false;
  }
  if (filters.date && !application.createdAt?.startsWith(filters.date)) return false;
  return true;
}

async function listGrowthApplications(database, filters = {}, limit = 100) {
  const requestedLimit = limit ?? 100;
  const fetchLimit = Math.min(500, Math.max(100, requestedLimit * 5));
  const snapshots = await database
    .collection("growthApplications")
    .orderBy("createdAt", "desc")
    .limit(fetchLimit)
    .get();
  const applications = await Promise.all(
    snapshots.docs.map((snapshot) => serializeGrowthApplication(database, snapshot)),
  );
  return applications
    .filter((application) => matchesGrowthFilters(application, filters))
    .slice(0, requestedLimit);
}

function growthApplicationExportRow(application) {
  return {
    id: application.id,
    applicationType: application.applicationType,
    status: application.status,
    createdAt: application.createdAt ?? "",
    firstName: application.firstName,
    email: application.email,
    phone: application.phone ?? "",
    cruiseLine: application.cruiseLine,
    ship: application.ship,
    departureDate: application.departureDate,
    platform: application.platform,
    campaign: application.campaign ?? "",
    referralCode: application.referralCode ?? "",
    activated: application.activation?.isActivated === true,
    meaningfulActions: application.meaningfulActions.join("; "),
    invitationsSent: application.invites.sent,
    invitationsAccepted: application.invites.accepted,
    followUpDate: application.followUpDate ?? "",
    founderNotes: application.founderNotes ?? "",
  };
}

async function buildGrowthFunnel(database, applications) {
  const [eventsSnapshot, profilesSnapshot] = await Promise.all([
    database.collection("growthEvents").orderBy("createdAt", "desc").limit(2000).get(),
    database.collection("growthProfiles").limit(500).get(),
  ]);
  const funnel = {
    landing_page_viewed: 0,
    calculator_started: 0,
    calculator_completed: 0,
    founding20_application_submitted: 0,
    sailing_saved: 0,
    activation_completed: 0,
    mycrew_invite_sent: 0,
    mycrew_invite_accepted: 0,
    app_store_click: 0,
    google_play_click: 0,
  };
  for (const eventSnapshot of eventsSnapshot.docs) {
    const event = eventSnapshot.data();
    const eventName = event.eventName;
    if (Object.prototype.hasOwnProperty.call(funnel, eventName)) {
      funnel[eventName] += 1;
    }
    if (eventName === "store_link_clicked") {
      if (event.context?.store === "apple") funnel.app_store_click += 1;
      if (event.context?.store === "google") funnel.google_play_click += 1;
    }
  }
  const foundingApplications = applications.filter(
    (application) => application.applicationType === "founding20",
  ).length;
  funnel.founding20_application_submitted = Math.max(
    funnel.founding20_application_submitted,
    foundingApplications,
  );
  funnel.activation_completed = Math.max(
    funnel.activation_completed,
    profilesSnapshot.docs.filter(
      (profile) => profile.data()?.activation?.state === "activated",
    ).length,
  );
  return funnel;
}

function buildGrowthSummary(applications, profiles, funnel) {
  const byType = {};
  const byStatus = {};
  for (const application of applications) {
    byType[application.applicationType] = (byType[application.applicationType] ?? 0) + 1;
    byStatus[application.status] = (byStatus[application.status] ?? 0) + 1;
  }
  const activatedProfiles = profiles.filter(
    (profile) => profile.data()?.activation?.state === "activated",
  ).length;
  return {
    directional: true,
    applicationCount: applications.length,
    activatedProfiles,
    applicationsByType: byType,
    applicationsByStatus: byStatus,
    funnel,
  };
}

async function sendLeadEmails({ requestId, lead, ref, retryBy }) {
  const recipient = process.env.LEAD_EMAIL_TO || DEFAULT_TO;
  const from = process.env.LEAD_EMAIL_FROM || DEFAULT_FROM;
  const sendCustomerConfirmation =
    process.env.LEAD_EMAIL_SEND_CUSTOMER_CONFIRMATION !== "false";
  const resend = new Resend(resendApiKey.value());

  const internal = await sendLeadNotification({
    resend,
    requestId,
    lead,
    from,
    to: recipient,
  });

  let confirmation = null;
  if (sendCustomerConfirmation && isValidEmail(lead.contactEmail)) {
    confirmation = await sendCustomerConfirmationEmail({
      resend,
      requestId,
      lead,
      from,
      replyTo: recipient,
    });
  }

  await ref.update({
    status: "email_sent",
    notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    notificationTo: recipient,
    resendNotificationId: internal.id,
    customerConfirmationSent: Boolean(confirmation),
    ...(confirmation ? { resendConfirmationId: confirmation.id } : {}),
    ...(retryBy
      ? {
          emailRetriedAt: admin.firestore.FieldValue.serverTimestamp(),
          emailRetryCount: admin.firestore.FieldValue.increment(1),
          emailRetryRequestedBy: retryBy,
          emailError: admin.firestore.FieldValue.delete(),
        }
      : {}),
  });

  return {
    notificationId: internal.id,
    confirmationId: confirmation?.id || null,
    customerConfirmationSent: Boolean(confirmation),
  };
}

async function sendLeadNotification({ resend, requestId, lead, from, to }) {
  const subject = `New CruiseKit lead: ${lead.cruiseLine || "Cruise"} ${
    lead.shipName || "request"
  }`;
  const html = leadNotificationHtml({ requestId, lead });
  const text = leadNotificationText({ requestId, lead });

  return sendEmail(resend, {
    from,
    to,
    subject,
    html,
    text,
    replyTo: isValidEmail(lead.contactEmail) ? lead.contactEmail : undefined,
  });
}

async function sendCustomerConfirmationEmail({
  resend,
  requestId,
  lead,
  from,
  replyTo,
}) {
  const subject = "We received your CruiseKit request";
  const html = customerConfirmationHtml({ requestId, lead });
  const text = customerConfirmationText({ requestId, lead });

  return sendEmail(resend, {
    from,
    to: lead.contactEmail,
    subject,
    html,
    text,
    replyTo,
  });
}

async function sendCustomerReplyEmail({
  resend,
  requestId,
  lead,
  message,
  from,
  replyTo,
}) {
  const subject = `Re: ${lead.itineraryTitle || "Your CruiseKit request"}`;
  const html = customerReplyHtml({ requestId, lead, message });
  const text = customerReplyText({ requestId, lead, message });

  return sendEmail(resend, {
    from,
    to: lead.contactEmail,
    subject,
    html,
    text,
    replyTo,
  });
}

async function sendEmail(resend, message) {
  const { data, error } = await resend.emails.send(message);
  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }
  if (!data?.id) {
    throw new Error("Resend did not return an email id.");
  }
  return data;
}

function leadNotificationHtml({ requestId, lead }) {
  return layoutHtml(`
    <h1>New CruiseKit lead</h1>
    <p><strong>${escapeHtml(lead.contactName || "Guest")}</strong> requested help with a cruise deal.</p>
    ${detailTable([
      ["Request ID", requestId],
      ["Name", lead.contactName],
      ["Email", lead.contactEmail],
      ["Phone", lead.contactPhone],
      ["Cruise line", lead.cruiseLine],
      ["Ship", lead.shipName],
      ["Itinerary", lead.itineraryTitle],
      ["Departure", lead.departureDate],
      ["Starting fare", formatPrice(lead.fromPrice, lead.currency)],
      ["Last verified", lead.lastVerified],
      ["Deal ID", lead.dealId],
    ])}
    ${lead.note ? `<h2>Note</h2><p>${escapeHtml(lead.note)}</p>` : ""}
    ${
      lead.bookingUrl
        ? `<p><a href="${escapeAttribute(lead.bookingUrl)}">Open source booking page</a></p>`
        : ""
    }
  `);
}

function leadNotificationText({ requestId, lead }) {
  return [
    "New CruiseKit lead",
    "",
    `Request ID: ${requestId}`,
    `Name: ${lead.contactName || ""}`,
    `Email: ${lead.contactEmail || ""}`,
    `Phone: ${lead.contactPhone || ""}`,
    `Cruise line: ${lead.cruiseLine || ""}`,
    `Ship: ${lead.shipName || ""}`,
    `Itinerary: ${lead.itineraryTitle || ""}`,
    `Departure: ${lead.departureDate || ""}`,
    `Starting fare: ${formatPrice(lead.fromPrice, lead.currency)}`,
    `Last verified: ${lead.lastVerified || ""}`,
    `Deal ID: ${lead.dealId || ""}`,
    "",
    lead.note ? `Note: ${lead.note}` : "",
    lead.bookingUrl ? `Booking URL: ${lead.bookingUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function customerConfirmationHtml({ requestId, lead }) {
  const cruiseLabel = [lead.cruiseLine, lead.shipName].filter(Boolean).join(" ");
  return layoutHtml(`
    <h1>We received your CruiseKit request</h1>
    <p>Thanks${lead.contactName ? `, ${escapeHtml(lead.contactName)}` : ""}. We received your request${cruiseLabel ? ` for ${escapeHtml(cruiseLabel)}` : ""}.</p>
    <p>Prices and availability can change quickly, so CruiseKit will confirm details against the source before follow-up.</p>
    ${detailTable([
      ["Request ID", requestId],
      ["Itinerary", lead.itineraryTitle],
      ["Departure", lead.departureDate],
      ["Starting fare", formatPrice(lead.fromPrice, lead.currency)],
    ])}
    <p>If you want to add anything, reply to this email with your preferred dates, number of travelers, cabin type, departure port, and budget.</p>
  `);
}

function customerConfirmationText({ requestId, lead }) {
  const cruiseLabel = [lead.cruiseLine, lead.shipName].filter(Boolean).join(" ");
  return [
    "We received your CruiseKit request",
    "",
    `Thanks${lead.contactName ? `, ${lead.contactName}` : ""}. We received your request${
      cruiseLabel ? ` for ${cruiseLabel}` : ""
    }.`,
    "Prices and availability can change quickly, so CruiseKit will confirm details against the source before follow-up.",
    "",
    `Request ID: ${requestId}`,
    `Itinerary: ${lead.itineraryTitle || ""}`,
    `Departure: ${lead.departureDate || ""}`,
    `Starting fare: ${formatPrice(lead.fromPrice, lead.currency)}`,
    "",
    "If you want to add anything, reply to this email with your preferred dates, number of travelers, cabin type, departure port, and budget.",
  ].join("\n");
}

function customerReplyHtml({ requestId, lead, message }) {
  return layoutHtml(`
    <h1>CruiseKit follow-up</h1>
    <p>Hi${lead.contactName ? ` ${escapeHtml(lead.contactName)}` : ""},</p>
    ${messageHtml(message)}
    ${detailTable([
      ["Request ID", requestId],
      ["Itinerary", lead.itineraryTitle],
      ["Departure", lead.departureDate],
      ["Starting fare", formatPrice(lead.fromPrice, lead.currency)],
    ])}
    <p>You can reply directly to this email with any updates.</p>
  `);
}

function customerReplyText({ requestId, lead, message }) {
  return [
    `Hi${lead.contactName ? ` ${lead.contactName}` : ""},`,
    "",
    message,
    "",
    `Request ID: ${requestId}`,
    `Itinerary: ${lead.itineraryTitle || ""}`,
    `Departure: ${lead.departureDate || ""}`,
    `Starting fare: ${formatPrice(lead.fromPrice, lead.currency)}`,
    "",
    "You can reply directly to this email with any updates.",
  ].join("\n");
}

function layoutHtml(body) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#1e293b;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
        ${body}
      </div>
      <p style="font-size:12px;color:#64748b;margin:16px 4px 0;">CruiseKit • Plan it. Coordinate it. Explore it.</p>
    </div>
  </body>
</html>`;
}

function messageHtml(message) {
  return escapeHtml(message)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function detailTable(rows) {
  const visibleRows = rows.filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (visibleRows.length === 0) return "";
  const body = visibleRows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 10px;border-top:1px solid #e2e8f0;color:#64748b;width:140px;">${escapeHtml(label)}</td>
        <td style="padding:8px 10px;border-top:1px solid #e2e8f0;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${body}</table>`;
}

function formatPrice(value, currency) {
  if (typeof value !== "number") return "";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return amount;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function truncate(value, maxLength) {
  return value.length <= maxLength ? value : value.slice(0, maxLength);
}

function errorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Focused unit tests exercise pure validation and activation predicates without
// exporting internal helpers in deployed Cloud Functions.
if (process.env.FUNCTIONS_TEST_MODE === "1") {
  module.exports.__growthTest = {
    validateGrowthApplicationPayload,
    validateGrowthEventPayload,
    validateIdentityLinkPayload,
    validateGrowthConsolePayload,
    validateReferralManagementPayload,
    validateReferralResolutionPayload,
    sanitizeGrowthAttribution,
    readRealSavedSailing,
    hasTrustedCalculatorSnapshot,
    normalizeInternalPath,
    normalizeReferralCode,
  };
}
