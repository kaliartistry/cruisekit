const admin = require("firebase-admin");
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const {
  createAccountLifecycleHandlers,
} = require("./account-lifecycle");

admin.initializeApp();

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
