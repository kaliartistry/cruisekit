import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "cruisekit-app-test";
const ALICE = "alice-uid";
const BOB = "bob-uid";
const CAROL = "carol-uid";
const ADMIN = "admin-uid";
const GROUP_ID = "g1";

let env: RulesTestEnvironment;

function validUserDoc() {
  return {
    displayName: "Alice",
    email: "alice@example.com",
    photoURL: "https://example.com/a.png",
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
}

function validSavedDeal() {
  return {
    cruiseLineId: "carnival",
    shipName: "Carnival Vista",
    duration: 7,
    departurePort: "Miami",
    ports: ["Cozumel", "Roatán"],
    fromPrice: 599,
    departureDate: "2026-09-12",
    itineraryTitle: "Western Caribbean",
    cruiseLine: "Carnival",
    imageUrl: "https://example.com/ship.jpg",
    bookingUrl: "https://example.com/book",
    savedAt: new Date().toISOString(),
  };
}

function validActiveCruise(
  status: "active" | "deleted" = "active",
  overrides: Record<string, unknown> = {},
) {
  const base = {
    schemaVersion: 1,
    status,
    sourcePlatform: "web",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (status === "deleted") {
    return { ...base, ...overrides };
  }

  return {
    ...base,
    sailing: {
      id: "carnival-vista-20260912",
      cruiseLineId: "carnival",
      shipName: "Carnival Vista",
      shipId: "carnival-vista",
      departureDate: "2026-09-12",
      returnDate: "2026-09-19",
      duration: 7,
      departurePort: "Miami, FL",
      region: "caribbean",
      itinerary: [
        { day: 1, type: "departure", portName: "Miami, FL" },
        {
          day: 2,
          type: "port",
          portName: "Cozumel",
          portSlug: "cozumel",
          isTender: false,
        },
      ],
    },
    confirmedItinerary: [
      { day: 1, type: "departure", portName: "Miami, FL" },
      {
        day: 2,
        type: "port",
        portName: "Cozumel",
        portSlug: "cozumel",
        isTender: false,
      },
    ],
    itineraryTitle: "Western Caribbean",
    imageUrl: "https://example.com/ship.jpg",
    sourceUrl: "https://example.com/book",
    ...overrides,
  };
}

function validLeadRequest(uid = ALICE) {
  return {
    createdAt: serverTimestamp(),
    status: "new",
    sourcePlatform: "mobile",
    sourceSurface: "deal_handoff_sheet",
    requesterUid: uid,
    requesterIsAnonymous: true,
    contactName: "Alice Traveler",
    contactEmail: "alice@example.com",
    contactPhone: "555-123-4567",
    note: "Looking for a balcony cabin and current total price.",
    dealId: "carnival-vista-20260912",
    cruiseLineId: "carnival",
    cruiseLine: "Carnival",
    shipName: "Carnival Vista",
    itineraryTitle: "Western Caribbean",
    departureDate: "2026-09-12",
    fromPrice: 599,
    currency: "USD",
    lastVerified: "2026-05-16",
    bookingUrl: "https://example.com/book",
  };
}

async function grantAdmin(uid = ADMIN) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "adminUsers", uid), {
      createdAt: serverTimestamp(),
      email: "kali@example.com",
    });
  });
}

async function seedLeadRequest(id = "lead1", uid = ALICE) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(
      doc(ctx.firestore(), "dealLeadRequests", id),
      validLeadRequest(uid),
    );
  });
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8181,
    },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

describe("users/{uid}", () => {
  it("denies unauthed read", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "users", ALICE)));
  });

  it("allows owner to create with valid fields", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(setDoc(doc(db, "users", ALICE), validUserDoc()));
  });

  it("denies create with extra junk field", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(doc(db, "users", ALICE), { ...validUserDoc(), isAdmin: true }),
    );
  });

  it("allows owner to read own doc", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", ALICE), validUserDoc());
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(getDoc(doc(db, "users", ALICE)));
  });

  it("allows owner to update lastLoginAt", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", ALICE), validUserDoc());
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "users", ALICE), { lastLoginAt: serverTimestamp() }),
    );
  });

  it("denies update that touches createdAt", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", ALICE), validUserDoc());
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      updateDoc(doc(db, "users", ALICE), { createdAt: serverTimestamp() }),
    );
  });

  it("denies cross-user read", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", BOB), validUserDoc());
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "users", BOB)));
  });

  it("denies cross-user write", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(setDoc(doc(db, "users", BOB), validUserDoc()));
  });

  it("denies owner deleting own doc", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", ALICE), validUserDoc());
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(deleteDoc(doc(db, "users", ALICE)));
  });
});

describe("users/{uid}/savedDeals/{dealId}", () => {
  it("denies unauthed read", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "users", ALICE, "savedDeals", "d1")));
  });

  it("allows owner to create a valid saved deal", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      setDoc(doc(db, "users", ALICE, "savedDeals", "d1"), validSavedDeal()),
    );
  });

  it("allows owner to read own saved deal", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", ALICE, "savedDeals", "d1"),
        validSavedDeal(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(getDoc(doc(db, "users", ALICE, "savedDeals", "d1")));
  });

  it("allows owner to delete own saved deal", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", ALICE, "savedDeals", "d1"),
        validSavedDeal(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      deleteDoc(doc(db, "users", ALICE, "savedDeals", "d1")),
    );
  });

  it("denies non-owner read", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", BOB, "savedDeals", "d1"),
        validSavedDeal(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "users", BOB, "savedDeals", "d1")));
  });

  it("denies non-owner write", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(doc(db, "users", BOB, "savedDeals", "d1"), validSavedDeal()),
    );
  });
});

describe("users/{uid}/activeCruise/current", () => {
  it("denies unauthed read", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      getDoc(doc(db, "users", ALICE, "activeCruise", "current")),
    );
  });

  it("denies unauthed create", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      setDoc(
        doc(db, "users", ALICE, "activeCruise", "current"),
        validActiveCruise(),
      ),
    );
  });

  it("allows owner to create a valid active cruise", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      setDoc(
        doc(db, "users", ALICE, "activeCruise", "current"),
        validActiveCruise(),
      ),
    );
  });

  it("allows owner to read own active cruise", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", ALICE, "activeCruise", "current"),
        validActiveCruise(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      getDoc(doc(db, "users", ALICE, "activeCruise", "current")),
    );
  });

  it("allows owner to update active cruise with approved fields", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    const ref = doc(db, "users", ALICE, "activeCruise", "current");
    await assertSucceeds(setDoc(ref, validActiveCruise()));
    const snapshot = await getDoc(ref);
    await assertSucceeds(
      setDoc(
        ref,
        validActiveCruise("active", {
          createdAt: snapshot.data()?.createdAt,
          itineraryTitle: "Updated Western Caribbean",
        }),
      ),
    );
  });

  it("allows owner to tombstone active cruise", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    const ref = doc(db, "users", ALICE, "activeCruise", "current");
    await assertSucceeds(setDoc(ref, validActiveCruise()));
    const snapshot = await getDoc(ref);
    await assertSucceeds(
      setDoc(
        ref,
        validActiveCruise("deleted", {
          createdAt: snapshot.data()?.createdAt,
        }),
      ),
    );
  });

  it("denies cross-user read", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", BOB, "activeCruise", "current"),
        validActiveCruise(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "users", BOB, "activeCruise", "current")));
  });

  it("denies cross-user write", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(
        doc(db, "users", BOB, "activeCruise", "current"),
        validActiveCruise(),
      ),
    );
  });

  it("denies sensitive active cruise fields", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(
        doc(db, "users", ALICE, "activeCruise", "current"),
        validActiveCruise("active", {
          cabinNumber: "8242",
          bookingRef: "ABC123",
          spend: 1200,
        }),
      ),
    );
  });

  it("denies deleting the sync document", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "users", ALICE, "activeCruise", "current"),
        validActiveCruise(),
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      deleteDoc(doc(db, "users", ALICE, "activeCruise", "current")),
    );
  });
});

describe("default deny", () => {
  it("denies authed read of arbitrary collection", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "randomCollection", "foo")));
  });
});

describe("dealLeadRequests/{requestId}", () => {
  it("allows an authenticated user to create a valid lead request", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      addDoc(collection(db, "dealLeadRequests"), validLeadRequest(ALICE)),
    );
  });

  it("denies unauthenticated create", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), validLeadRequest(ALICE)),
    );
  });

  it("denies create when requesterUid does not match auth uid", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), validLeadRequest(BOB)),
    );
  });

  it("denies create with extra fields", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), {
        ...validLeadRequest(ALICE),
        internalPriority: "high",
      }),
    );
  });

  it("denies create without a plausible email address", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), {
        ...validLeadRequest(ALICE),
        contactEmail: "alice.example.com",
      }),
    );
  });

  it("denies create with whitespace in email address", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), {
        ...validLeadRequest(ALICE),
        contactEmail: "alice @example.com",
      }),
    );
  });

  it("denies create unless status is new", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), {
        ...validLeadRequest(ALICE),
        status: "contacted",
      }),
    );
  });

  it("denies overlong notes", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      addDoc(collection(db, "dealLeadRequests"), {
        ...validLeadRequest(ALICE),
        note: "x".repeat(2001),
      }),
    );
  });

  it("denies client reads of lead requests", async () => {
    await seedLeadRequest();
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "dealLeadRequests", "lead1")));
  });

  it("denies client updates and deletes", async () => {
    await seedLeadRequest();
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      updateDoc(doc(db, "dealLeadRequests", "lead1"), { status: "contacted" }),
    );
    await assertFails(deleteDoc(doc(db, "dealLeadRequests", "lead1")));
  });

  it("allows an admin user to read the lead queue", async () => {
    await grantAdmin();
    await seedLeadRequest();
    const db = env.authenticatedContext(ADMIN).firestore();
    await assertSucceeds(getDoc(doc(db, "dealLeadRequests", "lead1")));
    await assertSucceeds(getDocs(collection(db, "dealLeadRequests")));
  });

  it("allows an admin user to update operational lead status fields", async () => {
    await grantAdmin();
    await seedLeadRequest();
    const db = env.authenticatedContext(ADMIN).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "dealLeadRequests", "lead1"), {
        status: "contacted",
        internalNote: "Reached out by email.",
        updatedAt: serverTimestamp(),
        updatedBy: ADMIN,
        contactedAt: serverTimestamp(),
      }),
    );
  });

  it("denies admin updates to captured customer or deal fields", async () => {
    await grantAdmin();
    await seedLeadRequest();
    const db = env.authenticatedContext(ADMIN).firestore();
    await assertFails(
      updateDoc(doc(db, "dealLeadRequests", "lead1"), {
        contactEmail: "changed@example.com",
        updatedAt: serverTimestamp(),
        updatedBy: ADMIN,
      }),
    );
  });

  it("denies admin deleting lead requests", async () => {
    await grantAdmin();
    await seedLeadRequest();
    const db = env.authenticatedContext(ADMIN).firestore();
    await assertFails(deleteDoc(doc(db, "dealLeadRequests", "lead1")));
  });
});

// Helpers for the Flutter group tests.
function seedGroup(memberUids: string[], organizerId = ALICE) {
  return {
    name: "Test Group",
    organizerId,
    organizerName: "Alice",
    inviteCode: "ABC123",
    createdAt: serverTimestamp(),
    cruiseLineId: "carnival",
    shipName: "Carnival Vista",
    departureDate: "2026-09-12",
    memberUserIds: memberUids,
    members: memberUids.map((uid) => ({
      userId: uid,
      name: uid === organizerId ? "Alice" : "Member",
      role: uid === organizerId ? "organizer" : "member",
      joinedAt: new Date().toISOString(),
    })),
  };
}

async function seedGroupDoc(memberUids: string[], organizerId = ALICE) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(
      doc(ctx.firestore(), "groups", GROUP_ID),
      seedGroup(memberUids, organizerId),
    );
  });
}

describe("groups/{groupId}", () => {
  it("denies unauthed read", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "groups", GROUP_ID)));
  });

  it("allows any signed-in user to read (invite-code lookup is open by design)", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(getDoc(doc(db, "groups", GROUP_ID)));
  });

  it("allows organizer to create a valid group", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      setDoc(doc(db, "groups", GROUP_ID), seedGroup([ALICE])),
    );
  });

  it("denies create where organizerId is not self", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(doc(db, "groups", GROUP_ID), seedGroup([ALICE], BOB)),
    );
  });

  it("denies create when self is not in memberUserIds", async () => {
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(doc(db, "groups", GROUP_ID), seedGroup([BOB], ALICE)),
    );
  });

  it("allows organizer to rename the group", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "groups", GROUP_ID), { name: "Renamed" }),
    );
  });

  it("denies organizer changing organizerId", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      updateDoc(doc(db, "groups", GROUP_ID), { organizerId: BOB }),
    );
  });

  it("denies organizer changing inviteCode", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(
      updateDoc(doc(db, "groups", GROUP_ID), { inviteCode: "XYZ999" }),
    );
  });

  it("allows non-member to self-join via arrayUnion", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "groups", GROUP_ID), {
        memberUserIds: arrayUnion(BOB),
        members: arrayUnion({
          userId: BOB,
          name: "Bob",
          role: "member",
          joinedAt: new Date().toISOString(),
        }),
      }),
    );
  });

  it("denies a user adding a different user to memberUserIds", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      updateDoc(doc(db, "groups", GROUP_ID), {
        memberUserIds: arrayUnion(CAROL),
      }),
    );
  });

  it("allows member to self-leave", async () => {
    await seedGroupDoc([ALICE, BOB]);
    let memberObj: Record<string, unknown> | undefined;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const snap = await getDoc(doc(ctx.firestore(), "groups", GROUP_ID));
      const data = snap.data() as { members: Array<Record<string, unknown>> };
      memberObj = data.members.find((m) => m.userId === BOB);
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "groups", GROUP_ID), {
        memberUserIds: arrayRemove(BOB),
        members: arrayRemove(memberObj!),
      }),
    );
  });

  it("denies non-organizer removing another member", async () => {
    await seedGroupDoc([ALICE, BOB, CAROL]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      updateDoc(doc(db, "groups", GROUP_ID), {
        memberUserIds: arrayRemove(CAROL),
      }),
    );
  });

  it("allows organizer to remove another member", async () => {
    await seedGroupDoc([ALICE, BOB]);
    let memberObj: Record<string, unknown> | undefined;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const snap = await getDoc(doc(ctx.firestore(), "groups", GROUP_ID));
      const data = snap.data() as { members: Array<Record<string, unknown>> };
      memberObj = data.members.find((m) => m.userId === BOB);
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      updateDoc(doc(db, "groups", GROUP_ID), {
        memberUserIds: arrayRemove(BOB),
        members: arrayRemove(memberObj!),
      }),
    );
  });

  it("denies anyone deleting the group doc", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(ALICE).firestore();
    await assertFails(deleteDoc(doc(db, "groups", GROUP_ID)));
  });
});

describe("groups/{groupId}/locations/{userId}", () => {
  it("allows member to write own location", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      setDoc(
        doc(db, "groups", GROUP_ID, "locations", BOB),
        {
          lat: 25.7,
          lng: -80.2,
          whereabouts: "Pool deck",
          lastUpdated: serverTimestamp(),
        },
        { merge: true },
      ),
    );
  });

  it("denies member writing another member's location", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      setDoc(doc(db, "groups", GROUP_ID, "locations", ALICE), {
        lat: 0,
        lng: 0,
        lastUpdated: serverTimestamp(),
      }),
    );
  });

  it("denies non-member writing own location in a group", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      setDoc(doc(db, "groups", GROUP_ID, "locations", BOB), {
        lat: 0,
        lng: 0,
        lastUpdated: serverTimestamp(),
      }),
    );
  });

  it("allows member to read another member's location", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "locations", ALICE),
        { lat: 1, lng: 1 },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      getDoc(doc(db, "groups", GROUP_ID, "locations", ALICE)),
    );
  });

  it("denies non-member reading any location in a group", async () => {
    await seedGroupDoc([ALICE]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "locations", ALICE),
        { lat: 1, lng: 1 },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      getDoc(doc(db, "groups", GROUP_ID, "locations", ALICE)),
    );
  });

  it("denies unauthed location read", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      getDoc(doc(db, "groups", GROUP_ID, "locations", ALICE)),
    );
  });

  it("allows organizer to delete another member's location (kick)", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "locations", BOB),
        { lat: 1, lng: 1 },
      );
    });
    const db = env.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      deleteDoc(doc(db, "groups", GROUP_ID, "locations", BOB)),
    );
  });

  it("allows member to delete own location (leave)", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "locations", BOB),
        { lat: 1, lng: 1 },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      deleteDoc(doc(db, "groups", GROUP_ID, "locations", BOB)),
    );
  });
});

describe("groups/{groupId}/messages/{msgId}", () => {
  it("allows member to send message with own senderId", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      addDoc(collection(db, "groups", GROUP_ID, "messages"), {
        senderId: BOB,
        senderName: "Bob",
        text: "hello crew",
        timestamp: serverTimestamp(),
      }),
    );
  });

  it("denies member sending message with someone else's senderId", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      addDoc(collection(db, "groups", GROUP_ID, "messages"), {
        senderId: ALICE,
        senderName: "Alice (spoofed)",
        text: "spoofed",
        timestamp: serverTimestamp(),
      }),
    );
  });

  it("denies non-member sending a message", async () => {
    await seedGroupDoc([ALICE]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      addDoc(collection(db, "groups", GROUP_ID, "messages"), {
        senderId: BOB,
        senderName: "Bob",
        text: "hi",
        timestamp: serverTimestamp(),
      }),
    );
  });

  it("denies messages with text longer than 5000 chars", async () => {
    await seedGroupDoc([ALICE, BOB]);
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      addDoc(collection(db, "groups", GROUP_ID, "messages"), {
        senderId: BOB,
        senderName: "Bob",
        text: "x".repeat(5001),
        timestamp: serverTimestamp(),
      }),
    );
  });

  it("allows member to read messages", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "messages", "m1"),
        { senderId: ALICE, senderName: "Alice", text: "hi", timestamp: new Date() },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertSucceeds(
      getDoc(doc(db, "groups", GROUP_ID, "messages", "m1")),
    );
  });

  it("denies non-member reading messages", async () => {
    await seedGroupDoc([ALICE]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "messages", "m1"),
        { senderId: ALICE, senderName: "Alice", text: "hi", timestamp: new Date() },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      getDoc(doc(db, "groups", GROUP_ID, "messages", "m1")),
    );
  });

  it("denies updating an existing message", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "messages", "m1"),
        { senderId: BOB, senderName: "Bob", text: "hi", timestamp: new Date() },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      updateDoc(doc(db, "groups", GROUP_ID, "messages", "m1"), {
        text: "edited",
      }),
    );
  });

  it("denies deleting an existing message", async () => {
    await seedGroupDoc([ALICE, BOB]);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), "groups", GROUP_ID, "messages", "m1"),
        { senderId: BOB, senderName: "Bob", text: "hi", timestamp: new Date() },
      );
    });
    const db = env.authenticatedContext(BOB).firestore();
    await assertFails(
      deleteDoc(doc(db, "groups", GROUP_ID, "messages", "m1")),
    );
  });
});
