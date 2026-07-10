const admin = require("firebase-admin");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");
const { Resend } = require("resend");
const {
  createAccountLifecycleHandlers,
} = require("./account-lifecycle");

admin.initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

const DEFAULT_TO = "info@cruisekit.app";
const DEFAULT_FROM = "CruiseKit <info@cruisekit.app>";

const accountLifecycle = createAccountLifecycleHandlers({
  db: admin.firestore(),
  auth: admin.auth(),
  logger,
  FieldValue: admin.firestore.FieldValue,
});

exports.findGroupByInvite = onCall(
  { region: "us-central1", maxInstances: 20 },
  accountLifecycle.findGroupByInvite,
);

exports.deleteUserAccount = onCall(
  { region: "us-central1", maxInstances: 10 },
  accountLifecycle.deleteUserAccount,
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
