const { HttpsError } = require("firebase-functions/v2/https");

const DELETE_CONFIRMATION = "DELETE";
const INVITE_CODE_PATTERN = /^[A-Z0-9]{6}$/;
const DELETE_BATCH_SIZE = 200;

/**
 * Account and invite-code handlers with injected Firebase dependencies so the
 * destructive behavior can be exercised against the Firestore emulator.
 */
function createAccountLifecycleHandlers({ db, auth, logger, FieldValue }) {
  if (!db || !auth || !logger || !FieldValue) {
    throw new Error("Account lifecycle handlers require Firebase dependencies.");
  }

  async function findGroupByInvite(request) {
    const uid = requireAuthenticatedUid(request);
    const inviteCode = normalizeInviteCode(request.data?.inviteCode);

    if (!INVITE_CODE_PATTERN.test(inviteCode)) {
      throw new HttpsError(
        "invalid-argument",
        "Enter a valid six-character invite code.",
      );
    }

    const snapshot = await db
      .collection("groups")
      .where("inviteCode", "==", inviteCode)
      .limit(3)
      .get();
    const activeGroups = snapshot.docs.filter(
      (document) => !document.data().accountDeletionPendingAt,
    );

    if (activeGroups.length === 0) {
      throw new HttpsError("not-found", "No MyCrew group uses that invite code.");
    }
    if (activeGroups.length > 1) {
      logger.error("Duplicate MyCrew invite code", {
        inviteCode,
        groupCount: activeGroups.length,
      });
      throw new HttpsError(
        "failed-precondition",
        "That invite code is temporarily unavailable. Ask the organizer for a new code.",
      );
    }

    const document = activeGroups[0];
    const data = document.data();
    return {
      id: document.id,
      name: safeOptionalString(data.name),
      cruiseLineId: safeOptionalString(data.cruiseLineId),
      shipName: safeOptionalString(data.shipName),
      departureDate: safeOptionalString(data.departureDate),
      isMember:
        Array.isArray(data.memberUserIds) && data.memberUserIds.includes(uid),
    };
  }

  async function deleteUserAccount(request) {
    const uid = requireAuthenticatedUid(request);
    if (request.data?.confirmation !== DELETE_CONFIRMATION) {
      throw new HttpsError(
        "invalid-argument",
        `Set confirmation to ${DELETE_CONFIRMATION} to delete this account.`,
      );
    }
    requireRecentAuthentication(request);

    logger.info("Account deletion started", { uid });

    try {
      const groupRefs = await findUserGroupRefs(db, uid);

      // Messages are queried independently of membership so a retry can finish
      // after a previous attempt already removed the user from a group.
      await deleteMatchingDocuments(
        db.collectionGroup("messages").where("senderId", "==", uid),
        db,
      );

      for (const groupRef of groupRefs) {
        // Remove the user's per-group location before membership changes. A
        // retry can still discover the group if this step succeeds alone.
        await db.recursiveDelete(groupRef.collection("locations").doc(uid));
        const outcome = await removeUserFromGroup({
          db,
          groupRef,
          uid,
          FieldValue,
        });
        if (outcome.deleteGroup) {
          await db.recursiveDelete(groupRef);
        }
      }

      // Close the small race where a final message was sent immediately before
      // membership removal, and make retries independent of group discovery.
      await deleteMatchingDocuments(
        db.collectionGroup("messages").where("senderId", "==", uid),
        db,
      );

      await deleteMatchingDocuments(
        db.collection("dealLeadRequests").where("requesterUid", "==", uid),
        db,
      );
      await db.recursiveDelete(db.doc(`users/${uid}`));
      await db.doc(`adminUsers/${uid}`).delete();

      // Firebase Auth is deliberately last. If an earlier operation fails, the
      // signed-in user can retry the callable; deleting a missing Auth user is
      // treated as a successful idempotent retry.
      await deleteAuthUserIdempotently(auth, uid);

      logger.info("Account deletion completed", { uid });
      return { ok: true };
    } catch (error) {
      logger.error("Account deletion failed", {
        uid,
        error: errorMessage(error),
      });
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        "internal",
        "Account deletion could not be completed. Please try again or contact CruiseKit support.",
      );
    }
  }

  return { deleteUserAccount, findGroupByInvite };
}

function requireAuthenticatedUid(request) {
  const uid = request.auth?.uid;
  if (typeof uid !== "string" || uid.length === 0) {
    throw new HttpsError("unauthenticated", "Sign in is required.");
  }
  return uid;
}

function requireRecentAuthentication(request) {
  const provider = request.auth?.token?.firebase?.sign_in_provider;
  if (provider === "anonymous") return;

  const authTime = request.auth?.token?.auth_time;
  const ageSeconds = Math.floor(Date.now() / 1000) - Number(authTime);
  if (!Number.isFinite(ageSeconds) || ageSeconds < 0 || ageSeconds > 600) {
    throw new HttpsError(
      "failed-precondition",
      "Confirm your sign-in again before deleting this account.",
    );
  }
}

function normalizeInviteCode(value) {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase().replace(/[\s-]+/g, "");
}

async function findUserGroupRefs(db, uid) {
  const [memberSnapshot, organizerSnapshot] = await Promise.all([
    db.collection("groups").where("memberUserIds", "array-contains", uid).get(),
    db.collection("groups").where("organizerId", "==", uid).get(),
  ]);
  const refs = new Map();
  for (const document of [...memberSnapshot.docs, ...organizerSnapshot.docs]) {
    refs.set(document.ref.path, document.ref);
  }
  return [...refs.values()];
}

async function removeUserFromGroup({ db, groupRef, uid, FieldValue }) {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(groupRef);
    if (!snapshot.exists) return { deleteGroup: false };

    const data = snapshot.data() || {};
    const memberUserIds = Array.isArray(data.memberUserIds)
      ? data.memberUserIds.filter((value) => typeof value === "string")
      : [];
    const members = Array.isArray(data.members) ? data.members : [];
    const remainingUserIds = memberUserIds.filter((value) => value !== uid);
    let remainingMembers = members.filter(
      (member) => !member || member.userId !== uid,
    );
    const isOrganizer = data.organizerId === uid;

    if (!isOrganizer && !memberUserIds.includes(uid)) {
      return { deleteGroup: false };
    }

    if (isOrganizer && remainingUserIds.length === 0) {
      transaction.set(
        groupRef,
        {
          memberUserIds: [],
          members: [],
          accountDeletionPendingAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return { deleteGroup: true };
    }

    const updates = {
      memberUserIds: remainingUserIds,
      members: remainingMembers,
    };

    if (isOrganizer) {
      const successorId = remainingUserIds[0];
      const successor = remainingMembers.find(
        (member) => member?.userId === successorId,
      );
      remainingMembers = remainingMembers.map((member) =>
        member?.userId === successorId
          ? { ...member, role: "organizer" }
          : member,
      );
      updates.members = remainingMembers;
      updates.organizerId = successorId;
      updates.organizerName =
        safeOptionalString(successor?.name) ||
        safeOptionalString(successor?.displayName) ||
        "Crew organizer";
    }

    transaction.update(groupRef, updates);
    return { deleteGroup: false };
  });
}

async function deleteMatchingDocuments(query, db) {
  let deleted = 0;
  while (true) {
    const snapshot = await query.limit(DELETE_BATCH_SIZE).get();
    if (snapshot.empty) return deleted;
    const batch = db.batch();
    for (const document of snapshot.docs) {
      batch.delete(document.ref);
    }
    await batch.commit();
    deleted += snapshot.size;
  }
}

async function deleteAuthUserIdempotently(auth, uid) {
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    if (error?.code !== "auth/user-not-found") throw error;
  }
}

function safeOptionalString(value) {
  return typeof value === "string" ? value.slice(0, 240) : null;
}

function errorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

module.exports = {
  DELETE_CONFIRMATION,
  createAccountLifecycleHandlers,
  normalizeInviteCode,
};
