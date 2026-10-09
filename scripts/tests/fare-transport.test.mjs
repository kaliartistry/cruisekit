import { test } from "node:test";
import assert from "node:assert/strict";
import { boundedReader } from "../lib/fare-verification.mjs";

const limits = { maxRequests: 1, maxAttempts: 1, timeoutMs: 100, minDelayMs: 0, maxRetryDelayMs: 0, maxBytes: 100 };
const completion = new Date("2026-10-09T12:00:00Z");
for (const [age, expected, reason] of [[null, null, "missing"], ["", null, "invalid"], ["-1", null, "invalid"], ["1.5", null, "invalid"], ["garbage", null, "invalid"], ["1, 2", null, "invalid"], ["9007199254740992", null, "invalid"], ["0", 0, "explicit"], ["300", 300, "explicit"], ["301", 301, "explicit"]]) {
  test(`HTTP Age ${JSON.stringify(age)} is preserved without manufactured zero`, async () => {
    const headers = { "last-modified": "Wed, 01 Jul 2026 00:00:00 GMT" };
    if (age !== null) headers.age = age;
    const reader = boundedReader("https://fixture.example", limits, { clock: () => completion, fetchImpl: async () => new Response("fixture", { headers }) });
    const result = await reader.read("https://fixture.example/quote");
    assert.equal(result.responseAgeSeconds, expected);
    assert.match(result.responseAgeReason, new RegExp(reason));
    assert.equal(result.sourceTimestamp, null);
    assert.equal(result.documentLastModified, headers["last-modified"]);
    assert.equal(result.observedAt, completion.toISOString());
  });
}

test("ISO Last-Modified never becomes provider quote freshness", async () => {
  const reader = boundedReader("https://fixture.example", limits, { clock: () => completion, fetchImpl: async () => new Response("fixture", { headers: { age: "0", "last-modified": completion.toISOString() } }) });
  const result = await reader.read("https://fixture.example/quote");
  assert.equal(result.documentLastModified, completion.toISOString());
  assert.equal(result.sourceTimestamp, null);
});
