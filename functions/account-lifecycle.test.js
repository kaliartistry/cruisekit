const assert = require("node:assert/strict");
const { after, beforeEach, test } = require("node:test");
const admin = require("firebase-admin");
const {
  createAccountLifecycleHandlers,
  normalizeInviteCode,
} = require("./account-lifecycle");

const PROJECT_ID = process.env.GCLOUD_PROJECT || "cruisekit-app";
const app = admin.initializeApp({ projectId: PROJECT_ID }, "account-lifecycle-tests");
const db = app.firestore();

const quietLogger = {
  info() {},
  error() {},
};

beforeEach(async () => {
  const collections = await db.listCollections();
  await Promise.all(
    collections.map((collection) => db.recursiveDelete(collection)),
  );
});

after(async () => {
  await app.delete();
});

test("invite-code lookup requires auth, normalizes input, and returns only safe fields", async () => {
  await db.doc("groups/g-safe").set({
    name: "Family Cruise",
    organizerId: "alice",
    organizerName: "Alice Private",
    inviteCode: "ABC123",
    cruiseLineId: "carnival",
    shipName: "Carnival Vista",
    departureDate: "2026-09-12",
    memberUserIds: ["alice"],
    members: [{ userId: "alice", name: "Alice Private" }],
  });
  const handlers = handlersWithAuth();

  await assert.rejects(
    handlers.findGroupByInvite({ data: { inviteCode: "ABC123" } }),
    (error) => error.code === "unauthenticated",
  );

  const result = await handlers.findGroupByInvite({
    auth: { uid: "bob" },
    data: { inviteCode: " abc-123 " },
  });

  assert.deepEqual(result, {
    id: "g-safe",
    name: "Family Cruise",
    cruiseLineId: "carnival",
    shipName: "Carnival Vista",
    departureDate: "2026-09-12",
    isMember: false,
  });
  assert.equal("organizerId" in result, false);
  assert.equal("members" in result, false);
  assert.equal("inviteCode" in result, false);
});

test("invite-code lookup fails closed for duplicate or malformed codes", async () => {
  await Promise.all([
    db.doc("groups/g-one").set({ inviteCode: "ABC123" }),
    db.doc("groups/g-two").set({ inviteCode: "ABC123" }),
  ]);
  const handlers = handlersWithAuth();

  await assert.rejects(
    handlers.findGroupByInvite({
      auth: { uid: "bob" },
      data: { inviteCode: "ABC123" },
    }),
    (error) => error.code === "failed-precondition",
  );
  await assert.rejects(
    handlers.findGroupByInvite({
      auth: { uid: "bob" },
      data: { inviteCode: "too-long" },
    }),
    (error) => error.code === "invalid-argument",
  );
});

test("account deletion preserves other members and removes user-owned data before Auth", async () => {
  await seedAccountDeletionFixture();
  const authCalls = [];
  const auth = {
    async deleteUser(uid) {
      assert.equal((await db.doc(`users/${uid}`).get()).exists, false);
      assert.equal((await db.doc(`adminUsers/${uid}`).get()).exists, false);
      assert.equal(
        (
          await db
            .collection("dealLeadRequests")
            .where("requesterUid", "==", uid)
            .get()
        ).empty,
        true,
      );
      authCalls.push(uid);
    },
  };
  const handlers = createAccountLifecycleHandlers({
    db,
    auth,
    logger: quietLogger,
    FieldValue: admin.firestore.FieldValue,
  });

  await assert.rejects(
    handlers.deleteUserAccount({ auth: recentAuth("alice"), data: {} }),
    (error) => error.code === "invalid-argument",
  );

  const result = await handlers.deleteUserAccount({
    auth: recentAuth("alice"),
    data: { confirmation: "DELETE" },
  });
  assert.deepEqual(result, { ok: true });
  assert.deepEqual(authCalls, ["alice"]);

  const transferred = await db.doc("groups/with-members").get();
  assert.equal(transferred.exists, true);
  assert.equal(transferred.data().organizerId, "bob");
  assert.deepEqual(transferred.data().memberUserIds, ["bob"]);
  assert.deepEqual(
    transferred.data().members.map((member) => member.userId),
    ["bob"],
  );
  assert.equal(transferred.data().members[0].role, "organizer");
  assert.equal(
    (await db.doc("groups/with-members/locations/alice").get()).exists,
    false,
  );
  assert.equal(
    (await db.doc("groups/with-members/locations/bob").get()).exists,
    true,
  );
  assert.equal(
    (await db.doc("groups/with-members/messages/alice-message").get()).exists,
    false,
  );
  assert.equal(
    (await db.doc("groups/with-members/messages/bob-message").get()).exists,
    true,
  );

  const bobOwned = await db.doc("groups/bob-owned").get();
  assert.equal(bobOwned.exists, true);
  assert.equal(bobOwned.data().organizerId, "bob");
  assert.deepEqual(bobOwned.data().memberUserIds, ["bob"]);
  assert.equal((await db.doc("groups/alice-only").get()).exists, false);
  assert.equal(
    (await db.doc("groups/alice-only/messages/only-message").get()).exists,
    false,
  );

  assert.equal((await db.doc("dealLeadRequests/alice-lead").get()).exists, false);
  assert.equal((await db.doc("dealLeadRequests/bob-lead").get()).exists, true);
});

test("account deletion treats a missing Auth user as an idempotent retry", async () => {
  const handlers = createAccountLifecycleHandlers({
    db,
    auth: {
      async deleteUser() {
        const error = new Error("missing");
        error.code = "auth/user-not-found";
        throw error;
      },
    },
    logger: quietLogger,
    FieldValue: admin.firestore.FieldValue,
  });

  const result = await handlers.deleteUserAccount({
    auth: recentAuth("already-deleted"),
    data: { confirmation: "DELETE" },
  });
  assert.deepEqual(result, { ok: true });
});

test("linked account deletion requires recent authentication", async () => {
  const handlers = handlersWithAuth();

  await assert.rejects(
    handlers.deleteUserAccount({
      auth: {
        uid: "stale-user",
        token: {
          auth_time: Math.floor(Date.now() / 1000) - 601,
          firebase: { sign_in_provider: "google.com" },
        },
      },
      data: { confirmation: "DELETE" },
    }),
    (error) => error.code === "failed-precondition",
  );

  const anonymousResult = await handlers.deleteUserAccount({
    auth: {
      uid: "anonymous-user",
      token: { firebase: { sign_in_provider: "anonymous" } },
    },
    data: { confirmation: "DELETE" },
  });
  assert.deepEqual(anonymousResult, { ok: true });
});

test("normalizeInviteCode accepts common visual formatting", () => {
  assert.equal(normalizeInviteCode(" ab c-123 "), "ABC123");
  assert.equal(normalizeInviteCode(null), "");
});

function handlersWithAuth() {
  return createAccountLifecycleHandlers({
    db,
    auth: { async deleteUser() {} },
    logger: quietLogger,
    FieldValue: admin.firestore.FieldValue,
  });
}

function recentAuth(uid) {
  return {
    uid,
    token: {
      auth_time: Math.floor(Date.now() / 1000),
      firebase: { sign_in_provider: "google.com" },
    },
  };
}

async function seedAccountDeletionFixture() {
  await db.doc("users/alice").set({ displayName: "Alice" });
  await db.doc("users/alice/savedDeals/deal-1").set({ name: "Saved cruise" });
  await db.doc("users/alice/savedCruises/active").set({ shipName: "Vista" });
  await db.doc("adminUsers/alice").set({ enabled: true });
  await db.doc("dealLeadRequests/alice-lead").set({ requesterUid: "alice" });
  await db.doc("dealLeadRequests/bob-lead").set({ requesterUid: "bob" });

  await db.doc("groups/with-members").set(
    groupData({ organizerId: "alice", memberUserIds: ["alice", "bob"] }),
  );
  await db.doc("groups/with-members/locations/alice").set({ status: "Pool" });
  await db.doc("groups/with-members/locations/bob").set({ status: "Cafe" });
  await db.doc("groups/with-members/messages/alice-message").set({
    senderId: "alice",
    senderName: "Alice",
    text: "Meet at noon",
  });
  await db.doc("groups/with-members/messages/bob-message").set({
    senderId: "bob",
    senderName: "Bob",
    text: "Sounds good",
  });

  await db.doc("groups/alice-only").set(
    groupData({ organizerId: "alice", memberUserIds: ["alice"] }),
  );
  await db.doc("groups/alice-only/messages/only-message").set({
    senderId: "alice",
    senderName: "Alice",
    text: "Private group",
  });

  await db.doc("groups/bob-owned").set(
    groupData({ organizerId: "bob", memberUserIds: ["bob", "alice"] }),
  );
  await db.doc("groups/bob-owned/locations/alice").set({ status: "Deck" });
}

function groupData({ organizerId, memberUserIds }) {
  return {
    name: "Test group",
    organizerId,
    organizerName: organizerId === "alice" ? "Alice" : "Bob",
    inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    memberUserIds,
    members: memberUserIds.map((userId) => ({
      userId,
      name: userId === "alice" ? "Alice" : "Bob",
      role: userId === organizerId ? "organizer" : "member",
    })),
  };
}
