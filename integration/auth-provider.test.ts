import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, expect, test } from "vitest";
import { AuthProvider } from "../src/modules/m10/auth/provider.server";
import { createDatabase } from "../src/server/database.server";
import { SessionService } from "../src/modules/m10/auth/session.server";
import { localTotp } from "./local-totp";
import { MfaService } from "../src/modules/m10/auth/mfa.server";

const auth = new AuthProvider("http://127.0.0.1:55433");
const db = createDatabase(
  `postgresql://ourspace_runtime:${readFileSync(".local/runtime-db-password", "utf8").trim()}@127.0.0.1:55432/ourspace`,
);
afterAll(() => db.close());
const sessions = new SessionService(db, auth);

test("pending MFA cancellation removes provider factor and permits fresh setup", async () => {
  const credentials = {
    email: `cancel-${randomUUID()}@ourspace.test`,
    password: randomUUID() + "!Aa9",
  };
  await auth.signUp(credentials.email, credentials.password);
  expect(
    (
      await fetch(await confirmationLink(credentials.email), {
        redirect: "manual",
      })
    ).status,
  ).toBe(303);
  const app = await sessions.login(
    credentials.email,
    credentials.password,
    "Synthetic cancellation",
  );
  const service = new MfaService(db, auth);
  const orphanSession = await auth.signIn(
    credentials.email,
    credentials.password,
  );
  const unrelatedResponse = await fetch("http://127.0.0.1:55433/factors", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${orphanSession.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      factor_type: "totp",
      friendly_name: "Independent fixture",
    }),
  });
  expect(unrelatedResponse.status).toBe(200);
  const unrelatedId = (await unrelatedResponse.json()).id;
  const orphan = await auth.enrollTotp(orphanSession.accessToken);
  const setup = await service.start(app.token, credentials, randomUUID());
  await expect(
    auth.challengeTotp(orphanSession.accessToken, orphan.id),
  ).rejects.toMatchObject({ kind: "denied" });
  const cancelled = await service.cancelPending(
    app.token,
    credentials,
    setup.enrollmentId,
    setup.version,
  );
  expect(cancelled.state).toBe("cancelled");
  expect(await sessions.actor(app.token)).toBeNull();
  expect(await service.status(cancelled.session.token)).toBeNull();
  const providerSession = await auth.signIn(
    credentials.email,
    credentials.password,
  );
  expect(
    (await auth.identity(providerSession.accessToken))
      .pendingOurSpaceTotpFactorIds.length,
  ).toBe(0);
  expect(
    (
      await auth.identity(providerSession.accessToken)
    ).pendingTotpFactorIds.includes(unrelatedId),
  ).toBe(true);
  const fresh = await service.start(
    cancelled.session.token,
    credentials,
    randomUUID(),
  );
  const factor = (await auth.identity(providerSession.accessToken))
    .pendingOurSpaceTotpFactorIds[0];
  await auth.unenrollFactor(providerSession.accessToken, factor);
  const reconciled = await service.cancelPending(
    cancelled.session.token,
    credentials,
    fresh.enrollmentId,
    fresh.version,
  );
  expect(await service.status(reconciled.session.token)).toBeNull();
  await expect(
    service.cancelPending(
      cancelled.session.token,
      credentials,
      fresh.enrollmentId,
      fresh.version,
    ),
  ).rejects.toMatchObject({ kind: "denied" });
}, 30_000);

test("MFA service enrolls and verifies with atomic session replacement", async () => {
  const credentials = {
    email: `service-${randomUUID()}@ourspace.test`,
    password: randomUUID() + "!Aa9",
  };
  await auth.signUp(credentials.email, credentials.password);
  expect(
    (
      await fetch(await confirmationLink(credentials.email), {
        redirect: "manual",
      })
    ).status,
  ).toBe(303);
  const app = await sessions.login(
    credentials.email,
    credentials.password,
    "Synthetic service",
  );
  const other = await sessions.login(credentials.email, credentials.password);
  const service = new MfaService(db, auth);
  await expect(
    service.start("invalid", credentials, randomUUID()),
  ).rejects.toMatchObject({ kind: "denied" });
  const started = await service.start(app.token, credentials, randomUUID());
  expect(started.version).toBe("2");
  expect(Object.keys(started).sort()).toEqual([
    "enrollmentId",
    "secret",
    "uri",
    "version",
  ]);
  await expect(
    service.verify(
      app.token,
      credentials,
      started.enrollmentId,
      "1",
      localTotp(started.secret),
    ),
  ).rejects.toMatchObject({ kind: "denied" });
  const verified = await service.verify(
    app.token,
    credentials,
    started.enrollmentId,
    started.version,
    localTotp(started.secret),
  );
  expect(verified.version).toBe("3");
  await expect(
    service.cancelPending(
      verified.session.token,
      credentials,
      started.enrollmentId,
      verified.version,
    ),
  ).rejects.toMatchObject({ kind: "denied" });
  expect(await sessions.actor(app.token)).toBeNull();
  expect(await sessions.actor(other.token)).toBeNull();
  expect(Boolean(await sessions.actor(verified.session.token))).toBe(true);
  expect(Object.keys(verified).sort()).toEqual([
    "enrollmentId",
    "session",
    "version",
  ]);
  await expect(
    service.verify(
      app.token,
      credentials,
      started.enrollmentId,
      "3",
      localTotp(started.secret),
    ),
  ).rejects.toMatchObject({ kind: "denied" });
  let recovery = await service.issueRecovery(
    verified.session.token,
    credentials,
    started.enrollmentId,
    verified.version,
    localTotp(started.secret),
  );
  expect(recovery.version).toBe("4");
  expect(Object.keys(recovery).sort()).toEqual([
    "codes",
    "enrollmentId",
    "receipt",
    "version",
  ]);
  await expect(
    service.acknowledgeRecovery(
      verified.session.token,
      credentials,
      started.enrollmentId,
      recovery.version,
      localTotp(started.secret),
      randomBytes(32).toString("base64url"),
    ),
  ).rejects.toThrow("Database operation unavailable");
  expect(Boolean(await sessions.actor(verified.session.token))).toBe(true);
  const oldRecovery = recovery;
  // Real external-state divergence: provider set is absent while the app still
  // records issuance, as can happen across interrupted recovery operations.
  const proof = await auth.signIn(credentials.email, credentials.password);
  const factorId = (await auth.identity(proof.accessToken)).totpFactorIds[0];
  const recoveryChallenge = await auth.challengeTotp(
    proof.accessToken,
    factorId,
  );
  const elevatedRecovery = await auth.verifyTotp(
    proof.accessToken,
    factorId,
    recoveryChallenge,
    localTotp(started.secret),
  );
  await auth.deleteRecoveryCodes(elevatedRecovery.accessToken);
  expect(
    await auth.recoveryStatusIfEnrolled(elevatedRecovery.accessToken),
  ).toBeNull();
  await expect(
    auth.recoveryStatusIfEnrolled("invalid-test-token"),
  ).rejects.toMatchObject({ kind: "denied" });
  recovery = await service.replaceRecovery(
    verified.session.token,
    credentials,
    started.enrollmentId,
    recovery.version,
    localTotp(started.secret),
  );
  expect(recovery.version).toBe("5");
  const resumed = await service.status(verified.session.token);
  expect(resumed?.state).toBe("verified");
  expect(resumed?.version).toBe("5");
  expect("recovery_receipt_hash" in resumed!).toBe(false);
  const regenerated = recovery;
  recovery = await service.replaceRecovery(
    verified.session.token,
    credentials,
    started.enrollmentId,
    recovery.version,
    localTotp(started.secret),
  );
  expect(recovery.version).toBe("6");
  await expect(
    sessions.login(credentials.email, credentials.password, undefined, {
      method: "recovery",
      code: regenerated.codes[0],
    }),
  ).rejects.toMatchObject({ kind: "denied" });
  await expect(
    service.acknowledgeRecovery(
      verified.session.token,
      credentials,
      started.enrollmentId,
      recovery.version,
      localTotp(started.secret),
      oldRecovery.receipt,
    ),
  ).rejects.toThrow("Database operation unavailable");
  await expect(
    sessions.login(credentials.email, credentials.password, undefined, {
      method: "recovery",
      code: oldRecovery.codes[0],
    }),
  ).rejects.toMatchObject({ kind: "denied" });
  const enabled = await service.acknowledgeRecovery(
    verified.session.token,
    credentials,
    started.enrollmentId,
    recovery.version,
    localTotp(started.secret),
    recovery.receipt,
  );
  expect(enabled.version).toBe("7");
  expect(await sessions.actor(verified.session.token)).toBeNull();
  expect(Boolean(await sessions.actor(enabled.session.token))).toBe(true);
  const recovered = await sessions.login(
    credentials.email,
    credentials.password,
    undefined,
    { method: "recovery", code: recovery.codes[0] },
  );
  expect(Boolean(await sessions.actor(recovered.token))).toBe(true);
}, 30_000);

test("factor binding requires current version and verification requires signed AAL2", async () => {
  const email = `binding-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  await auth.signUp(email, password);
  expect(
    (await fetch(await confirmationLink(email), { redirect: "manual" })).status,
  ).toBe(303);
  const app = await sessions.login(email, password, "Synthetic binding");
  const hash = createHash("sha256").update(app.token).digest("hex");
  const providerSession = await auth.signIn(email, password);
  const id = randomUUID();
  await db.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3)", [
    hash,
    providerSession.accessToken,
    id,
  ]);
  const factor = await auth.enrollTotp(providerSession.accessToken);
  const record = (
    token: string,
    version: number,
    factorId: string,
    verified: boolean,
  ) =>
    db.query(
      "SELECT app_internal.record_mfa_factor($1,$2,$3,$4,$5,$6) AS version",
      [hash, token, id, version, factorId, verified],
    );
  await expect(
    record(providerSession.accessToken, 99, factor.id, false),
  ).rejects.toThrow("Database operation unavailable");
  expect(
    (await record(providerSession.accessToken, 1, factor.id, false)).rows[0]
      .version,
  ).toBe("2");
  expect(
    (await record(providerSession.accessToken, 2, factor.id, false)).rows[0]
      .version,
  ).toBe("2");
  await expect(
    record(providerSession.accessToken, 2, randomUUID(), false),
  ).rejects.toThrow("Database operation unavailable");
  await expect(
    record(providerSession.accessToken, 2, factor.id, true),
  ).rejects.toThrow("Database operation unavailable");
  const challenge = await auth.challengeTotp(
    providerSession.accessToken,
    factor.id,
  );
  const elevated = await auth.verifyTotp(
    providerSession.accessToken,
    factor.id,
    challenge,
    localTotp(factor.secret),
  );
  expect(
    (await auth.identity(elevated.accessToken)).totpFactorIds.includes(
      factor.id,
    ),
  ).toBe(true);
  const attempts = await Promise.allSettled([
    record(elevated.accessToken, 2, factor.id, true),
    record(elevated.accessToken, 2, factor.id, true),
  ]);
  expect(
    attempts.filter((result) => result.status === "fulfilled").length,
  ).toBe(1);
  expect(await sessions.actor(app.token)).toBeNull();
  await expect(
    record(elevated.accessToken, 3, factor.id, true),
  ).rejects.toThrow("Database operation unavailable");
  const fresh = await sessions.login(email, password, undefined, {
    method: "totp",
    code: localTotp(factor.secret),
  });
  const status = await db.query(
    "SELECT * FROM app_internal.current_mfa_enrollment($1)",
    [createHash("sha256").update(fresh.token).digest("hex")],
  );
  expect(status.rows[0].state).toBe("verified");
  expect(status.rows[0].version).toBe("3");
  expect(status.rows[0].enabled_at).toBeNull();
  const freshHash = createHash("sha256").update(fresh.token).digest("hex");
  const receiptHash = createHash("sha256")
    .update(randomBytes(32))
    .digest("hex");
  const recovery = (
    token: string,
    version: number,
    receipt: string,
    acknowledge: boolean,
  ) =>
    db.query(
      "SELECT app_internal.record_mfa_recovery($1,$2,$3,$4,$5,$6) AS version",
      [freshHash, token, id, version, receipt, acknowledge],
    );
  await expect(
    recovery(elevated.accessToken, 3, receiptHash, true),
  ).rejects.toThrow("Database operation unavailable");
  const low = await auth.signIn(email, password);
  await expect(
    recovery(low.accessToken, 3, receiptHash, false),
  ).rejects.toThrow("Database operation unavailable");
  const codes = await auth.generateRecoveryCodes(elevated.accessToken);
  expect((await auth.recoveryStatus(elevated.accessToken)).remaining).toBe(
    codes.length,
  );
  expect(
    (await recovery(elevated.accessToken, 3, receiptHash, false)).rows[0]
      .version,
  ).toBe("4");
  expect(
    (await recovery(elevated.accessToken, 4, receiptHash, false)).rows[0]
      .version,
  ).toBe("4");
  await expect(
    recovery(elevated.accessToken, 3, receiptHash, true),
  ).rejects.toThrow("Database operation unavailable");
  await expect(
    recovery(elevated.accessToken, 4, "a".repeat(64), true),
  ).rejects.toThrow("Database operation unavailable");
  const acknowledgments = await Promise.allSettled([
    recovery(elevated.accessToken, 4, receiptHash, true),
    recovery(elevated.accessToken, 4, receiptHash, true),
  ]);
  expect(
    acknowledgments.filter((result) => result.status === "fulfilled").length,
  ).toBe(1);
  expect(await sessions.actor(fresh.token)).toBeNull();
  const enabledSession = await sessions.login(email, password, undefined, {
    method: "recovery",
    code: codes[0],
  });
  const enabled = await db.query(
    "SELECT * FROM app_internal.current_mfa_enrollment($1)",
    [createHash("sha256").update(enabledSession.token).digest("hex")],
  );
  expect(enabled.rows[0].state).toBe("enabled");
  expect(enabled.rows[0].version).toBe("5");
  expect(Boolean(enabled.rows[0].recovery_acknowledged_at)).toBe(true);
  expect("recovery_receipt_hash" in enabled.rows[0]).toBe(false);
}, 30_000);

async function confirmationLink(email: string): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const listing = await (
      await fetch("http://127.0.0.1:55434/api/v1/messages")
    ).json();
    const message = listing.messages.find(
      (item: { To: { Address: string }[] }) =>
        item.To.some((to) => to.Address === email),
    );
    if (message) {
      const detail = await (
        await fetch(
          `http://127.0.0.1:55434/api/v1/message/${encodeURIComponent(message.ID)}`,
        )
      ).json();
      const link = String(detail.HTML).match(
        /http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/,
      );
      if (link) return link[0].replaceAll("&amp;", "&");
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Local confirmation message was not received");
}

test("real provider requires email confirmation and isolates two identities", async () => {
  const identities: string[] = [];
  let foreignRecoveryCode = "";
  const issued: Awaited<ReturnType<SessionService["login"]>>[] = [];
  let firstProviderToken = "";
  for (const label of ["a", "b"]) {
    const email = `provider-${label}-${randomUUID()}@ourspace.test`;
    const password = randomUUID() + "!Aa9";
    await auth.signUp(email, password);
    await expect(auth.signIn(email, password)).rejects.toMatchObject({
      kind: "denied",
    });
    await expect(
      sessions.login(email, password, "Synthetic"),
    ).rejects.toMatchObject({ kind: "denied" });
    const link = await confirmationLink(email);
    const verification = await fetch(link, { redirect: "manual" });
    expect(verification.status).toBe(303);
    const session = await auth.signIn(email, password);
    expect(typeof session.accessToken).toBe("string");
    const identity = await auth.identity(session.accessToken);
    expect(identity.email === email).toBe(true);
    identities.push(identity.id);
    const current = await sessions.login(email, password, `Synthetic ${label}`);
    issued.push(current);
    const currentHash = createHash("sha256")
      .update(current.token)
      .digest("hex");
    const enrollmentId = randomUUID();
    if (label === "a") firstProviderToken = session.accessToken;
    if (label === "b") {
      await expect(
        db.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3)", [
          currentHash,
          firstProviderToken,
          enrollmentId,
        ]),
      ).rejects.toThrow("Database operation unavailable");
      await expect(
        db.query("SELECT app_internal.record_mfa_factor($1,$2,$3,$4,$5,$6)", [
          currentHash,
          firstProviderToken,
          enrollmentId,
          1,
          randomUUID(),
          false,
        ]),
      ).rejects.toThrow("Database operation unavailable");
    }
    const begin = () =>
      db.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3) AS id", [
        currentHash,
        session.accessToken,
        enrollmentId,
      ]);
    const retries = await Promise.all([begin(), begin()]);
    expect(retries.every((result) => result.rows[0].id === enrollmentId)).toBe(
      true,
    );
    await expect(
      db.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3)", [
        currentHash,
        session.accessToken,
        randomUUID(),
      ]),
    ).rejects.toThrow("Database operation unavailable");
    const enrollment = await db.query(
      "SELECT * FROM app_internal.current_mfa_enrollment($1)",
      [currentHash],
    );
    expect(enrollment.rows.length).toBe(1);
    expect(enrollment.rows[0].id).toBe(enrollmentId);
    expect(enrollment.rows[0].state).toBe("pending");
    expect(enrollment.rows[0].version).toBe("1");
    expect(
      (
        await db.query(
          "SELECT * FROM app_internal.current_mfa_enrollment($1)",
          ["invalid"],
        )
      ).rows.length,
    ).toBe(0);
    await expect(db.query("SELECT * FROM m10.mfa_enrollments")).rejects.toThrow(
      "Database operation unavailable",
    );
    expect(await sessions.actor(current.token)).toBe(identity.id);
    const other = await sessions.login(email, password);
    expect(other.token === current.token).toBe(false);
    expect(await sessions.revoke(current.token, other.id)).toBe(true);
    expect(await sessions.actor(other.token)).toBeNull();
    const revokedHash = createHash("sha256").update(other.token).digest("hex");
    await expect(
      db.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3)", [
        revokedHash,
        session.accessToken,
        enrollmentId,
      ]),
    ).rejects.toThrow("Database operation unavailable");
    expect(
      (
        await db.query(
          "SELECT * FROM app_internal.current_mfa_enrollment($1)",
          [revokedHash],
        )
      ).rows.length,
    ).toBe(0);
    const additional = await sessions.login(email, password);
    const ownList = await sessions.list(current.token);
    expect(
      ownList.some((item) => item.id === current.id && item.is_current),
    ).toBe(true);
    expect(
      ownList.some((item) => item.id === additional.id && !item.is_current),
    ).toBe(true);
    expect(await sessions.revokeOthers(current.token)).toBe(1);
    expect(await sessions.actor(additional.token)).toBeNull();
    expect(await sessions.actor(current.token)).toBe(identity.id);
    expect(await sessions.revokeOthers(current.token)).toBe(0);
    const hash = createHash("sha256").update(randomBytes(32)).digest("hex");
    const appSessionId = randomUUID();
    await db.query("SELECT app_internal.issue_verified_session($1,$2,$3,$4)", [
      session.accessToken,
      `Synthetic ${label}`,
      appSessionId,
      hash,
    ]);
    expect(
      (await db.query("SELECT app_internal.session_actor($1) AS actor", [hash]))
        .rows[0].actor,
    ).toBe(identity.id);
    await expect(
      db.query("SELECT * FROM app_internal.auth_verifier"),
    ).rejects.toThrow("Database operation unavailable");
    const parts = session.accessToken.split(".");
    const forgedClaims = JSON.parse(
      Buffer.from(parts[1], "base64url").toString(),
    );
    forgedClaims.sub = randomUUID();
    const forged =
      parts[0] +
      "." +
      Buffer.from(JSON.stringify(forgedClaims)).toString("base64url") +
      "." +
      parts[2];
    await expect(
      db.query("SELECT app_internal.issue_verified_session($1,$2,$3,$4)", [
        forged,
        "Forged",
        randomUUID(),
        hash,
      ]),
    ).rejects.toThrow("Database operation unavailable");
    await expect(
      auth.signIn(email, randomUUID() + "!Aa9"),
    ).rejects.toMatchObject({ kind: "denied" });
    if (label === "a") {
      const factor = await auth.enrollTotp(session.accessToken);
      const challenge = await auth.challengeTotp(
        session.accessToken,
        factor.id,
      );
      const wrongCode = String(
        (Number(localTotp(factor.secret)) + 1) % 1000000,
      ).padStart(6, "0");
      await expect(
        auth.verifyTotp(session.accessToken, factor.id, challenge, wrongCode),
      ).rejects.toMatchObject({ kind: "denied" });
      const verified = await auth.verifyTotp(
        session.accessToken,
        factor.id,
        challenge,
        localTotp(factor.secret),
      );
      expect((await auth.identity(verified.accessToken)).id).toBe(identity.id);
      await expect(
        auth.verifyTotp(
          session.accessToken,
          factor.id,
          challenge,
          localTotp(factor.secret),
        ),
      ).rejects.toMatchObject({ kind: "denied" });
      expect((await auth.identity(session.accessToken)).mfaRequired).toBe(true);
      await expect(sessions.login(email, password)).rejects.toMatchObject({
        kind: "mfa_required",
      });
      const recoveryProbe = await fetch(
        "http://127.0.0.1:55433/factors/recovery-codes",
        {
          headers: { Authorization: `Bearer ${verified.accessToken}` },
        },
      );
      expect(recoveryProbe.status).toBe(404);
      expect((await recoveryProbe.json()).error_code).toBe(
        "mfa_factor_not_found",
      );
      const low = await auth.signIn(email, password);
      await expect(
        auth.generateRecoveryCodes(low.accessToken),
      ).rejects.toMatchObject({ kind: "denied" });
      const codes = await auth.generateRecoveryCodes(verified.accessToken);
      const status = await auth.recoveryStatus(verified.accessToken);
      expect(status.remaining).toBe(codes.length);
      const redeemed = await auth.verifyRecoveryCode(low.accessToken, codes[0]);
      expect((await auth.identity(redeemed.accessToken)).id).toBe(identity.id);
      await expect(
        auth.verifyRecoveryCode(low.accessToken, codes[0]),
      ).rejects.toMatchObject({ kind: "denied" });
      expect((await auth.recoveryStatus(verified.accessToken)).remaining).toBe(
        codes.length - 1,
      );
      const concurrent = await Promise.allSettled([
        auth.verifyRecoveryCode(low.accessToken, codes[1]),
        auth.verifyRecoveryCode(low.accessToken, codes[1]),
      ]);
      expect(
        concurrent.filter((result) => result.status === "fulfilled").length,
      ).toBe(1);
      expect(
        concurrent.filter((result) => result.status === "rejected").length,
      ).toBe(1);
      const rotated = await auth.generateRecoveryCodes(
        verified.accessToken,
        true,
      );
      foreignRecoveryCode = rotated[1];
      await expect(
        auth.verifyRecoveryCode(low.accessToken, codes[2]),
      ).rejects.toMatchObject({ kind: "denied" });
      expect((await auth.recoveryStatus(verified.accessToken)).remaining).toBe(
        rotated.length,
      );
      const recovered = await auth.verifyRecoveryCode(
        low.accessToken,
        rotated[0],
      );
      expect((await auth.identity(recovered.accessToken)).id).toBe(identity.id);
      const recoveryLogin = await sessions.login(email, password, undefined, {
        method: "recovery",
        code: rotated[2],
      });
      expect(await sessions.actor(recoveryLogin.token)).toBe(identity.id);
      await expect(
        sessions.login(email, password, undefined, {
          method: "recovery",
          code: rotated[2],
        }),
      ).rejects.toMatchObject({ kind: "denied" });
      await expect(
        sessions.login(email, password, undefined, {
          method: "totp",
          code: "123456",
          factorId: randomUUID(),
        }),
      ).rejects.toMatchObject({ kind: "denied" });
      const totpLogin = await sessions.login(email, password, undefined, {
        method: "totp",
        code: localTotp(factor.secret),
      });
      expect(await sessions.actor(totpLogin.token)).toBe(identity.id);
    } else {
      await expect(
        auth.verifyRecoveryCode(session.accessToken, foreignRecoveryCode),
      ).rejects.toMatchObject({ kind: "denied" });
    }
  }
  expect(new Set(identities).size).toBe(2);
  expect(await sessions.revoke(issued[0].token, issued[1].id)).toBe(false);
  expect(
    (await sessions.list(issued[0].token)).some(
      (item) => item.id === issued[1].id,
    ),
  ).toBe(false);
  expect(await sessions.revoke(issued[0].token, issued[0].id)).toBe(true);
  expect(await sessions.actor(issued[0].token)).toBeNull();
  expect(await sessions.actor(issued[1].token)).toBe(identities[1]);
  expect(await sessions.actor("malformed")).toBeNull();
  await expect(auth.identity("invalid-test-token")).rejects.toMatchObject({
    kind: "denied",
  });
}, 30_000);

test("provider cancellation and MFA removal enforce ownership and step-up", async () => {
  const email = `lifecycle-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  await auth.signUp(email, password);
  expect(
    (await fetch(await confirmationLink(email), { redirect: "manual" })).status,
  ).toBe(303);
  const initial = await auth.signIn(email, password);
  const pending = await auth.enrollTotp(initial.accessToken);
  expect((await auth.identity(initial.accessToken)).mfaRequired).toBe(false);
  await auth.unenrollFactor(initial.accessToken, pending.id);
  await expect(
    auth.challengeTotp(initial.accessToken, pending.id),
  ).rejects.toMatchObject({ kind: "denied" });
  await expect(
    auth.unenrollFactor(initial.accessToken, pending.id),
  ).rejects.toMatchObject({ kind: "denied" });
  const factor = await auth.enrollTotp(initial.accessToken);
  const challenge = await auth.challengeTotp(initial.accessToken, factor.id);
  const elevated = await auth.verifyTotp(
    initial.accessToken,
    factor.id,
    challenge,
    localTotp(factor.secret),
  );
  const codes = await auth.generateRecoveryCodes(elevated.accessToken);
  const low = await auth.signIn(email, password);
  await expect(
    auth.unenrollFactor(low.accessToken, factor.id),
  ).rejects.toMatchObject({ kind: "denied" });
  await expect(auth.deleteRecoveryCodes(low.accessToken)).rejects.toMatchObject(
    { kind: "denied" },
  );
  expect((await auth.recoveryStatus(elevated.accessToken)).remaining).toBe(
    codes.length,
  );
  const otherEmail = `lifecycle-other-${randomUUID()}@ourspace.test`;
  await auth.signUp(otherEmail, password);
  expect(
    (await fetch(await confirmationLink(otherEmail), { redirect: "manual" }))
      .status,
  ).toBe(303);
  const other = await auth.signIn(otherEmail, password);
  await expect(
    auth.unenrollFactor(other.accessToken, factor.id),
  ).rejects.toMatchObject({ kind: "denied" });
  expect((await auth.identity(elevated.accessToken)).mfaRequired).toBe(true);
  await auth.deleteRecoveryCodes(elevated.accessToken);
  await expect(auth.recoveryStatus(elevated.accessToken)).rejects.toMatchObject(
    { kind: "denied" },
  );
  await expect(
    auth.verifyRecoveryCode(low.accessToken, codes[0]),
  ).rejects.toMatchObject({ kind: "denied" });
  await auth.unenrollFactor(elevated.accessToken, factor.id);
  const fresh = await auth.signIn(email, password);
  expect((await auth.identity(fresh.accessToken)).mfaRequired).toBe(false);
  await expect(
    auth.challengeTotp(fresh.accessToken, factor.id),
  ).rejects.toMatchObject({ kind: "denied" });
}, 30_000);
