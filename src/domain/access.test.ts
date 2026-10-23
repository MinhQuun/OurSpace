import { describe, expect, it } from "vitest";
import { decideObjectAccess, type ContentAction } from "./access";

const context = {
  actor: {
    id: "b",
    accountActive: true,
    sessionActive: true,
    sessionExpiresAt: 200,
  },
  resource: { ownerId: "a", grants: [], trashed: false },
  action: "read" as ContentAction,
  now: 100,
  domainAllows: true,
  relationshipAllows: true,
};
const grant = {
  actorId: "b",
  actions: ["read", "edit"] as ContentAction[],
  revoked: false,
  expiresAt: null,
};

describe("deny-by-default object policy foundation", () => {
  it("pairing alone never shares private content", () => {
    expect(decideObjectAccess(context).allowed).toBe(false);
  });
  it("requires explicit action grants and never inherits parent access", () => {
    const sharedParent = {
      ...context,
      resource: { ...context.resource, grants: [grant] },
    };
    expect(decideObjectAccess(sharedParent).allowed).toBe(true);
    expect(decideObjectAccess(context).allowed).toBe(false);
    expect(
      decideObjectAccess({ ...sharedParent, action: "export" }).allowed,
    ).toBe(false);
  });
  it.each(["revoked", "expired", "invalid-expiry"] as const)(
    "rejects %s grants",
    (state) => {
      const invalid = {
        ...grant,
        revoked: state === "revoked",
        expiresAt: state === "invalid-expiry" ? NaN : 100,
      };
      expect(
        decideObjectAccess({
          ...context,
          resource: { ...context.resource, grants: [invalid] },
        }).allowed,
      ).toBe(false);
    },
  );
  it("blocks owner when a domain guard denies or identity is inactive", () => {
    const owner = { ...context, actor: { ...context.actor, id: "a" } };
    expect(decideObjectAccess(owner).allowed).toBe(true);
    expect(decideObjectAccess({ ...owner, domainAllows: false }).allowed).toBe(
      false,
    );
    expect(
      decideObjectAccess({
        ...owner,
        actor: { ...owner.actor, sessionActive: false },
      }).allowed,
    ).toBe(false);
    expect(
      decideObjectAccess({
        ...owner,
        actor: { ...owner.actor, sessionExpiresAt: 100 },
      }).allowed,
    ).toBe(false);
  });
  it("relationship guard blocks partner writes while personal owner access remains", () => {
    expect(
      decideObjectAccess({
        ...context,
        relationshipAllows: false,
        resource: { ...context.resource, grants: [grant] },
      }).allowed,
    ).toBe(false);
    expect(
      decideObjectAccess({
        ...context,
        relationshipAllows: false,
        actor: { ...context.actor, id: "a" },
      }).allowed,
    ).toBe(true);
  });
  it("never infers business approval or delegation from generic content access", () => {
    expect(
      decideObjectAccess({
        ...context,
        actor: { ...context.actor, id: "a" },
        action: "approve" as ContentAction,
      }).allowed,
    ).toBe(false);
    expect(
      decideObjectAccess({
        ...context,
        action: "share",
        resource: {
          ...context.resource,
          grants: [{ ...grant, actions: ["share"] }],
        },
      }).allowed,
    ).toBe(false);
  });
  it("fails closed for missing identity, trash or invalid clock", () => {
    expect(decideObjectAccess({ ...context, actor: null }).allowed).toBe(false);
    expect(decideObjectAccess({ ...context, now: NaN }).allowed).toBe(false);
    expect(
      decideObjectAccess({
        ...context,
        actor: { ...context.actor, id: "a" },
        resource: { ...context.resource, trashed: true },
      }).allowed,
    ).toBe(false);
  });
});
