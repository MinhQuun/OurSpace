import { randomBytes, randomUUID } from "node:crypto";
import { expect, test, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { RecoveryEnvelopeCodec, RecoveryEnvelopeError } from "./recovery-envelope.server";

function fixture() {
  const key = randomBytes(32).toString("base64url");
  const codec = new RecoveryEnvelopeCodec(key, "https://ourspace.test");
  const now = Date.now();
  const data = { id: randomUUID(), receipt: randomBytes(32).toString("base64url"),
    accessToken: `${randomBytes(24).toString("base64url")}.${randomBytes(180).toString("base64url")}.${randomBytes(32).toString("base64url")}`,
    expiresAt: now + 1000 };
  return { key, codec, now, data };
}

test("recovery envelope is randomized, opaque and expires at the boundary", () => {
  const { codec, now, data } = fixture();
  const sealed = codec.seal(data, now);
  expect(codec.seal(data, now) === sealed).toBe(false);
  expect(sealed.includes(data.receipt) || sealed.includes(data.accessToken)).toBe(false);
  expect(codec.open(sealed, now).accessToken === data.accessToken).toBe(true);
  expect(() => codec.open(sealed, data.expiresAt)).toThrow(RecoveryEnvelopeError);
  expect(() => codec.seal(data, data.expiresAt)).toThrow(RecoveryEnvelopeError);
});

test("tampered ciphertext, tag, nonce, wrong key and wrong origin are denied", () => {
  const { key, codec, now, data } = fixture();
  const sealed = codec.seal(data, now);
  for (const offset of [0, 12, 28, Buffer.from(sealed, "base64url").length - 1]) {
    const bytes = Buffer.from(sealed, "base64url"); bytes[offset] ^= 1;
    expect(() => codec.open(bytes.toString("base64url"), now)).toThrow(RecoveryEnvelopeError);
  }
  for (const other of [new RecoveryEnvelopeCodec(randomBytes(32).toString("base64url"), "https://ourspace.test"),
    new RecoveryEnvelopeCodec(key, "https://other.test")])
    expect(() => other.open(sealed, now)).toThrow(RecoveryEnvelopeError);
  for (const invalid of ["", sealed + "=", "a".repeat(3801)])
    expect(() => codec.open(invalid, now)).toThrow(RecoveryEnvelopeError);
});

test("invalid key and oversized or malformed proof fail closed", () => {
  const { codec, now, data } = fixture();
  expect(() => new RecoveryEnvelopeCodec("", "https://ourspace.test")).toThrow(RecoveryEnvelopeError);
  for (const changed of [{ ...data, accessToken: "a".repeat(2401) }, { ...data, receipt: "bad" },
    { ...data, expiresAt: Number.NaN }])
    expect(() => codec.seal(changed, now)).toThrow(RecoveryEnvelopeError);
});
