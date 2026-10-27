import { Pool } from "pg";
import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { randomBytes, createHash, randomUUID } from "node:crypto";
import { AuthProvider } from "../src/modules/m10/auth/provider.server";
import { localTotp } from "../integration/local-totp";

test("MFA HTTP lifecycle protects receipts and replaces sessions", async ({
  request,
}) => {
  const credentials = {
    email: `mfa-http-${randomUUID()}@ourspace.test`,
    password: randomUUID() + "!Aa9",
  };
  const post = (action: string, data: object) =>
    request.post(`/api/auth/${action}`, {
      headers: { Origin: "http://127.0.0.1:3102" },
      data: { ...credentials, ...data },
    });
  expect((await request.get("/api/auth/mfa-status")).status()).toBe(401);
  expect(
    (await post("signup", { displayName: "Synthetic MFA HTTP" })).status(),
  ).toBe(202);
  const inbox = await (
    await request.get("http://127.0.0.1:55434/api/v1/messages")
  ).json();
  const mail = inbox.messages.find((m: { To: { Address: string }[] }) =>
    m.To.some((to) => to.Address === credentials.email),
  );
  expect(Boolean(mail)).toBe(true);
  const detail = await (
    await request.get(`http://127.0.0.1:55434/api/v1/message/${mail.ID}`)
  ).json();
  const link = String(detail.HTML)
    .match(
      /http:\/\/127\.0\.0\.1:(?:55433\/verify|3102\/account\/recovery-link)[^"<>\s]+/,
    )?.[0]
    .replaceAll("&amp;", "&");
  expect(Boolean(link)).toBe(true);
  expect((await request.get(link!, { maxRedirects: 0 })).status()).toBe(303);
  expect((await post("login", {})).status()).toBe(200);
  expect(
    (await request.post("/api/auth/mfa-start", { data: credentials })).status(),
  ).toBe(403);
  const enrollmentId = randomUUID();
  const start = await post("mfa-start", { enrollmentId });
  expect(start.status()).toBe(200);
  expect(start.headers()["cache-control"]).toBe("no-store");
  const setup = await start.json();
  const verified = await post("mfa-verify", {
    enrollmentId,
    version: setup.version,
    code: localTotp(setup.secret),
  });
  expect(verified.status()).toBe(200);
  expect(Object.keys(await verified.json()).sort()).toEqual([
    "enrollmentId",
    "version",
  ]);
  const issued = await post("mfa-recovery", {
    enrollmentId,
    version: (await verified.json()).version,
    code: localTotp(setup.secret),
  });
  expect(issued.status()).toBe(200);
  const recovery = await issued.json();
  expect(Object.keys(recovery).sort()).toEqual([
    "codes",
    "enrollmentId",
    "version",
  ]);
  const receipt = (await request.storageState()).cookies.find(
    (c) => c.name === "ourspace_mfa_recovery",
  );
  expect(Boolean(receipt?.httpOnly)).toBe(true);
  expect(receipt?.sameSite).toBe("Strict");
  expect(receipt?.path).toBe("/api/auth");
  expect(
    (
      await post("mfa-acknowledge", {
        enrollmentId,
        version: recovery.version,
        code: localTotp(setup.secret),
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await post("mfa-acknowledge", {
        enrollmentId,
        version: recovery.version,
        code: localTotp(setup.secret),
        confirmed: true,
      })
    ).status(),
  ).toBe(200);
  const state = await (await request.get("/api/auth/mfa-status")).json();
  expect(state.enrollment.state).toBe("enabled");
  const prepared = await post("mfa-prepare-removal", {
    enrollmentId,
    version: state.enrollment.version,
    secondFactor: { method: "totp", code: localTotp(setup.secret) },
    confirmed: true,
  });
  expect(prepared.status()).toBe(200);
  expect(Object.keys(await prepared.json()).sort()).toEqual([
    "enrollmentId",
    "state",
  ]);
  expect(
    Boolean(
      (await request.storageState()).cookies.find(
        (c) => c.name === "ourspace_mfa_removal",
      )?.httpOnly,
    ),
  ).toBe(true);
  expect((await request.get("/api/auth/session")).status()).toBe(401);
  expect(
    await (await request.get("/api/auth/mfa-removal-state")).json(),
  ).toEqual({ pending: true });
  const finished = await post("mfa-resume-removal", {
    secondFactor: { method: "totp", code: localTotp(setup.secret) },
  });
  expect(finished.status()).toBe(200);
  expect((await finished.json()).state).toBe("disabled");
  expect(
    await (await request.get("/api/auth/mfa-removal-state")).json(),
  ).toEqual({ pending: false });
  expect((await post("mfa-resume-removal", {})).status()).toBe(401);
  expect((await post("login", {})).status()).toBe(200);
});

test("write endpoints reject cross-site, malformed and oversized requests", async ({
  request,
}) => {
  const headers = {
    Origin: "http://127.0.0.1:3102",
    "Content-Type": "application/json",
  };
  expect(
    (
      await request.post("/api/auth/login", {
        headers: { ...headers, "Sec-Fetch-Site": "cross-site" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  for (const data of [
    "{",
    "null",
    "[]",
    JSON.stringify({ password: "x".repeat(5000) }),
  ]) {
    expect(
      (await request.post("/api/auth/login", { headers, data })).status(),
    ).toBe(400);
  }
  expect(
    (
      await request.post("/api/auth/signup", {
        headers,
        data: { email: "invalid", password: "short", displayName: "" },
      })
    ).status(),
  ).toBe(400);
  expect((await request.get("/api/auth/unknown")).status()).toBe(404);
});

test("verified login uses private cookie and logout invalidates a copied cookie", async ({
  request,
  playwright,
}) => {
  const origin = "http://127.0.0.1:3102";
  const email = `http-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  expect((await request.get("/api/auth/session")).status()).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", { data: { email, password } })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/auth/signup", {
        headers: { Origin: origin },
        data: { email, password, displayName: "HTTP synthetic user" },
      })
    ).status(),
  ).toBe(202);
  expect(
    (
      await request.post("/api/auth/login", {
        headers: { Origin: origin },
        data: { email, password },
      })
    ).status(),
  ).toBe(401);
  const inbox = await (
    await request.get("http://127.0.0.1:55434/api/v1/messages")
  ).json();
  const message = inbox.messages.find((m: { To: { Address: string }[] }) =>
    m.To.some((to) => to.Address === email),
  );
  expect(Boolean(message)).toBe(true);
  const detail = await (
    await request.get(`http://127.0.0.1:55434/api/v1/message/${message.ID}`)
  ).json();
  const link = String(detail.HTML)
    .match(
      /http:\/\/127\.0\.0\.1:(?:55433\/verify|3102\/account\/recovery-link)[^"<>\s]+/,
    )?.[0]
    .replaceAll("&amp;", "&");
  expect(Boolean(link)).toBe(true);
  expect((await request.get(link!, { maxRedirects: 0 })).status()).toBe(303);
  const login = await request.post("/api/auth/login", {
    headers: { Origin: origin },
    data: { email, password },
  });
  expect(login.status()).toBe(200);
  expect(await login.json()).toEqual({ ok: true });
  const cookie = (await request.storageState()).cookies.find(
    (c) => c.name === "ourspace_session",
  )!;
  expect(Boolean(cookie)).toBe(true);
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe("Strict");
  const current = await request.get("/api/auth/session");
  expect(current.status()).toBe(200);
  expect(current.headers()["cache-control"]).toBe("no-store");
  const other = await playwright.request.newContext({ baseURL: origin });
  try {
    expect(
      (
        await other.post("/api/auth/login", {
          headers: { Origin: origin },
          data: { email, password },
        })
      ).status(),
    ).toBe(200);
    const listed = await request.get("/api/auth/sessions");
    expect(listed.status()).toBe(200);
    const entries = (await listed.json()).sessions;
    expect(entries.length).toBe(2);
    expect(
      entries.filter((entry: { is_current: boolean }) => entry.is_current)
        .length,
    ).toBe(1);
    expect(Object.keys(entries[0]).sort()).toEqual([
      "created_at",
      "expires_at",
      "id",
      "is_current",
      "last_seen",
      "revoked_at",
    ]);
    const revoked = await request.post("/api/auth/revoke-other-sessions", {
      headers: { Origin: origin },
    });
    expect(await revoked.json()).toEqual({ revoked: 1 });
    expect((await other.get("/api/auth/session")).status()).toBe(401);
    expect((await other.get("/api/auth/sessions")).status()).toBe(401);
    expect((await request.get("/api/auth/session")).status()).toBe(200);
  } finally {
    await other.dispose();
  }
  const provider = new AuthProvider("http://127.0.0.1:55433");
  const providerSession = await provider.signIn(email, password);
  const factor = await provider.enrollTotp(providerSession.accessToken);
  const challenge = await provider.challengeTotp(
    providerSession.accessToken,
    factor.id,
  );
  const elevated = await provider.verifyTotp(
    providerSession.accessToken,
    factor.id,
    challenge,
    localTotp(factor.secret),
  );
  const codes = await provider.generateRecoveryCodes(elevated.accessToken);
  const mfaClient = await playwright.request.newContext({ baseURL: origin });
  try {
    const required = await mfaClient.post("/api/auth/login", {
      headers: { Origin: origin },
      data: { email, password },
    });
    expect(required.status()).toBe(401);
    expect(await required.json()).toEqual({ error: "mfa_required" });
    expect((await mfaClient.get("/api/auth/session")).status()).toBe(401);
    const totp = await mfaClient.post("/api/auth/login", {
      headers: { Origin: origin },
      data: {
        email,
        password,
        secondFactor: { method: "totp", code: localTotp(factor.secret) },
      },
    });
    expect(totp.status()).toBe(200);
    expect((await mfaClient.get("/api/auth/session")).status()).toBe(200);
    await mfaClient.post("/api/auth/logout", { headers: { Origin: origin } });
    const recovery = {
      email,
      password,
      secondFactor: { method: "recovery", code: codes[0] },
    };
    expect(
      (
        await mfaClient.post("/api/auth/login", {
          headers: { Origin: origin },
          data: recovery,
        })
      ).status(),
    ).toBe(200);
    await mfaClient.post("/api/auth/logout", { headers: { Origin: origin } });
    expect(
      (
        await mfaClient.post("/api/auth/login", {
          headers: { Origin: origin },
          data: recovery,
        })
      ).status(),
    ).toBe(401);
    expect((await mfaClient.get("/api/auth/session")).status()).toBe(401);
  } finally {
    await mfaClient.dispose();
  }
  expect(
    (
      await request.post("/api/auth/logout", {
        headers: { Origin: "https://wrong.test" },
      })
    ).status(),
  ).toBe(403);
  expect((await request.get("/api/auth/session")).status()).toBe(200);
  expect(
    (
      await request.post("/api/auth/logout", { headers: { Origin: origin } })
    ).status(),
  ).toBe(200);
  expect(
    (
      await request.get("/api/auth/session", {
        headers: { Cookie: `ourspace_session=${cookie.value}` },
      })
    ).status(),
  ).toBe(401);
});

test("password reset HTTP seals proof and requires cookie, origin and confirmation", async ({
  request,
  playwright,
}) => {
  const email = `reset-http-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  const next = randomUUID() + "!Bb8";
  const headers = { Origin: "http://127.0.0.1:3102" };
  const post = (action: string, data: object) =>
    request.post(`/api/auth/${action}`, { headers, data });
  const mailLink = async () => {
    const inbox = await (
      await request.get("http://127.0.0.1:55434/api/v1/messages")
    ).json();
    const mail = inbox.messages.find((m: { To: { Address: string }[] }) =>
      m.To.some((to) => to.Address === email),
    );
    expect(Boolean(mail)).toBe(true);
    const detail = await (
      await request.get(`http://127.0.0.1:55434/api/v1/message/${mail.ID}`)
    ).json();
    const link = String(detail.HTML)
      .match(
        /http:\/\/127\.0\.0\.1:(?:55433\/verify|3102\/account\/recovery-link)[^"<>\s]+/,
      )?.[0]
      .replaceAll("&amp;", "&");
    expect(Boolean(link)).toBe(true);
    return new URL(link!);
  };
  expect(
    (
      await post("signup", {
        email,
        password,
        displayName: "Synthetic reset HTTP",
      })
    ).status(),
  ).toBe(202);
  expect(
    (await request.get((await mailLink()).href, { maxRedirects: 0 })).status(),
  ).toBe(303);
  expect((await post("login", { email, password })).status()).toBe(200);
  expect(
    (
      await request.post("/api/auth/password-recovery", { data: { email } })
    ).status(),
  ).toBe(403);
  const absent = await post("password-recovery", {
    email: `absent-${randomUUID()}@ourspace.test`,
  });
  const known = await post("password-recovery", { email });
  expect(absent.status()).toBe(202);
  expect(known.status()).toBe(202);
  expect(await absent.json()).toEqual(await known.json());
  const link = await mailLink();
  expect(link.searchParams.get("type")).toBe("recovery");
  expect(link.pathname).toBe("/account/recovery-link");
  for (let scan = 0; scan < 2; scan++) {
    const landing = await request.get(link.href, { maxRedirects: 0 });
    expect(landing.status()).toBe(303);
    expect(landing.headers()["cache-control"]).toBe("no-store");
    expect(landing.headers()["referrer-policy"]).toBe("no-referrer");
    const target = new URL(landing.headers().location, "http://127.0.0.1:3102");
    expect(target.pathname === "/account/reset" && !target.search).toBe(true);
    expect(
      new URLSearchParams(target.hash.slice(1)).get("token") ===
        link.searchParams.get("token"),
    ).toBe(true);
  }
  const prepared = await post("password-prepare", {
    tokenHash: link.searchParams.get("token"),
  });
  expect(prepared.status()).toBe(200);
  expect(await prepared.json()).toEqual({ prepared: true });
  expect(prepared.headers()["cache-control"]).toBe("no-store");
  const cookie = (await request.storageState()).cookies.find(
    (c) => c.name === "ourspace_password_recovery",
  )!;
  expect(Boolean(cookie)).toBe(true);
  expect(
    cookie.httpOnly &&
      cookie.sameSite === "Strict" &&
      cookie.path === "/api/auth",
  ).toBe(true);
  expect(
    cookie.expires > Date.now() / 1000 &&
      cookie.expires <= Date.now() / 1000 + 901,
  ).toBe(true);
  expect(cookie.value.includes(link.searchParams.get("token")!)).toBe(false);
  expect((await request.get("/api/auth/session")).status()).toBe(401);
  expect((await post("password-complete", { password: next })).status()).toBe(
    400,
  );
  const attacker = await playwright.request.newContext();
  try {
    const altered =
      (cookie.value[0] === "A" ? "B" : "A") + cookie.value.slice(1);
    expect(
      (
        await attacker.post(
          "http://127.0.0.1:3102/api/auth/password-complete",
          {
            headers: {
              ...headers,
              Cookie: `ourspace_password_recovery=${altered}`,
            },
            data: { password: next, confirmed: true },
          },
        )
      ).status(),
    ).toBe(401);
  } finally {
    await attacker.dispose();
  }
  expect(
    (
      await post("password-complete", { password: next, confirmed: true })
    ).status(),
  ).toBe(200);
  expect(
    Boolean(
      (await request.storageState()).cookies.find(
        (c) => c.name === "ourspace_password_recovery",
      ),
    ),
  ).toBe(false);
  expect(
    (
      await post("password-complete", { password: next, confirmed: true })
    ).status(),
  ).toBe(401);
  expect((await post("login", { email, password })).status()).toBe(401);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  expect((await post("login", { email, password: next })).status()).toBe(200);
});

test("pairing HTTP enforces session, origin, capability and two-party consent", async ({
  playwright,
}) => {
  const contexts = await Promise.all(
    [0, 1, 2].map(() =>
      playwright.request.newContext({ baseURL: "http://127.0.0.1:3102" }),
    ),
  );
  const [a, b, c] = contexts;
  const headers = { Origin: "http://127.0.0.1:3102" };
  const credentials: { email: string; password: string }[] = [];
  try {
    expect((await a.get("/api/pairing/list")).status()).toBe(401);
    for (const request of contexts) {
      const email = `pair-http-${randomUUID()}@ourspace.test`,
        password = randomUUID() + "!Aa9";
      credentials.push({ email, password });
      expect(
        (
          await request.post("/api/auth/signup", {
            headers,
            data: { email, password, displayName: "Synthetic pairing" },
          })
        ).status(),
      ).toBe(202);
      const inbox = await (
        await request.get("http://127.0.0.1:55434/api/v1/messages")
      ).json();
      const mail = inbox.messages.find((m: { To: { Address: string }[] }) =>
        m.To.some((to) => to.Address === email),
      );
      expect(Boolean(mail)).toBe(true);
      const detail = await (
        await request.get(`http://127.0.0.1:55434/api/v1/message/${mail.ID}`)
      ).json();
      const link = String(detail.HTML)
        .match(/http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/)?.[0]
        .replaceAll("&amp;", "&");
      expect(Boolean(link)).toBe(true);
      expect((await request.get(link!, { maxRedirects: 0 })).status()).toBe(
        303,
      );
      expect(
        (
          await request.post("/api/auth/login", {
            headers,
            data: { email, password },
          })
        ).status(),
      ).toBe(200);
    }
    expect(
      (
        await a.post("/api/pairing/create", { data: { confirmed: true } })
      ).status(),
    ).toBe(403);
    expect(
      (
        await a.post("/api/pairing/create", {
          headers,
          data: { confirmed: false },
        })
      ).status(),
    ).toBe(400);
    expect(
      (
        await a.post("/api/pairing/create", {
          headers,
          data: { padding: "x".repeat(5000) },
        })
      ).status(),
    ).toBe(400);
    const created = await a.post("/api/pairing/create", {
      headers,
      data: { confirmed: true },
    });
    expect(created.status()).toBe(201);
    expect(created.headers()["cache-control"]).toBe("no-store");
    const invite = await created.json();
    expect(
      (
        await b.post("/api/pairing/inspect", {
          headers,
          data: { id: invite.id },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await b.post("/api/pairing/inspect", {
          headers,
          data: { id: invite.id, token: invite.token },
        })
      ).status(),
    ).toBe(200);
    const accept = {
      id: invite.id,
      token: invite.token,
      commandId: randomUUID(),
      confirmed: true,
    };
    expect(
      (await b.post("/api/pairing/accept", { headers, data: accept })).status(),
    ).toBe(200);
    expect(
      (
        await c.post("/api/pairing/inspect", {
          headers,
          data: { id: invite.id, token: invite.token },
        })
      ).status(),
    ).toBe(403);
    const inspected = await (
      await a.post("/api/pairing/inspect", { headers, data: { id: invite.id } })
    ).json();
    expect(inspected.space_id).toBeNull();
    const confirm = {
      id: invite.id,
      recipientId: inspected.recipient_id,
      version: Number(inspected.version),
      commandId: randomUUID(),
      confirmed: true,
    };
    expect(
      (
        await b.post("/api/pairing/confirm", { headers, data: confirm })
      ).status(),
    ).toBe(403);
    const paired = await a.post("/api/pairing/confirm", {
      headers,
      data: confirm,
    });
    expect(paired.status()).toBe(200);
    expect(
      await (
        await a.post("/api/pairing/confirm", { headers, data: confirm })
      ).json(),
    ).toEqual(await paired.json());
    expect(
      (
        await b.post("/api/pairing/create", {
          headers,
          data: { confirmed: true },
        })
      ).status(),
    ).toBe(403);
    expect(await (await c.get("/api/pairing/list")).json()).toEqual({
      invitations: [],
    });
    // c already spent one inspect attempt; denied attempts must consume budget too.
    for (let index = 0; index < 29; index++) {
      expect(
        (
          await c.post("/api/pairing/inspect", {
            headers,
            data: { id: invite.id },
          })
        ).status(),
      ).toBe(403);
    }
    const limited = await c.post("/api/pairing/inspect", {
      headers,
      data: { id: invite.id },
    });
    expect(limited.status()).toBe(429);
    expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0);
    expect(limited.headers()["cache-control"]).toBe("no-store");
    expect((await c.get("/api/pairing/list")).status()).toBe(200);
    expect(
      (
        await a.post("/api/pairing/inspect", {
          headers,
          data: { id: invite.id },
        })
      ).status(),
    ).toBe(200);
    const current = (await (await a.get("/api/spaces/list")).json()).spaces[0];
    expect(current.state).toBe("active");
    const aclOwner = new Pool({
      host: "127.0.0.1",
      port: 55432,
      database: "ourspace",
      user: "ourspace_owner",
      password: readFileSync(".local/db-password", "utf8").trim(),
      max: 1,
    });
    const resourceId = randomUUID(),
      kind = "http_" + randomUUID().replaceAll("-", "");
    try {
      const members = (
        await aclOwner.query(
          "SELECT account_id FROM m10.couple_memberships WHERE space_id=$1 ORDER BY slot",
          [current.id],
        )
      ).rows;
      await aclOwner.query(
        "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01',$2,$3)",
        [resourceId, kind, members[0].account_id],
      );
      await aclOwner.query(
        "INSERT INTO app_internal.resource_role_policies(module,kind,role) VALUES ('M01',$1,'viewer')",
        [kind],
      );
      const data = {
        resourceId,
        commandId: randomUUID(),
        spaceId: current.id,
        recipientId: members[1].account_id,
        role: "viewer",
        version: 1,
        confirmed: true,
      };
      expect((await a.post("/api/permissions/grant", { data })).status()).toBe(
        403,
      );
      expect(
        (
          await a.post("/api/permissions/grant", {
            headers,
            data: { ...data, confirmed: false },
          })
        ).status(),
      ).toBe(400);
      expect(
        (
          await a.post("/api/permissions/grant", {
            headers,
            data: { ...data, padding: "x".repeat(4097) },
          })
        ).status(),
      ).toBe(400);
      expect(
        (await b.post("/api/permissions/grant", { headers, data })).status(),
      ).toBe(403);
      const issued = await a.post("/api/permissions/grant", { headers, data });
      expect(issued.status()).toBe(200);
      expect(issued.headers()["cache-control"]).toBe("no-store");
      const grant = await issued.json();
      expect(
        await (
          await a.post("/api/permissions/grant", { headers, data })
        ).json(),
      ).toEqual(grant);
      const listUrl = `/api/permissions/grants?resourceId=${resourceId}`;
      expect((await (await a.get(listUrl)).json()).grants).toHaveLength(1);
      expect(await (await b.get(listUrl)).json()).toEqual({ grants: [] });
      expect(
        (
          await b.get(`/api/permissions/inspect?resourceId=${resourceId}`)
        ).status(),
      ).toBe(200);
      const revoke = {
        resourceId,
        commandId: randomUUID(),
        grantId: grant.grantId,
        version: 2,
        confirmed: true,
      };
      expect(
        (
          await b.post("/api/permissions/revoke", { headers, data: revoke })
        ).status(),
      ).toBe(403);
      expect(
        (
          await a.post("/api/permissions/revoke", {
            headers,
            data: { ...revoke, version: 1 },
          })
        ).status(),
      ).toBe(409);
      expect(
        await (
          await a.post("/api/permissions/revoke", { headers, data: revoke })
        ).json(),
      ).toEqual(grant);
      expect(
        (
          await b.get(`/api/permissions/inspect?resourceId=${resourceId}`)
        ).status(),
      ).toBe(404);
      expect(await (await a.get(listUrl)).json()).toEqual({ grants: [] });
      await aclOwner.query(
        "UPDATE app_internal.pairing_request_budgets SET requests=20 WHERE account_id=$1 AND action='permission_grant'",
        [members[0].account_id],
      );
      const limited = await a.post("/api/permissions/grant", { headers, data });
      expect(limited.status()).toBe(429);
      expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0);
      expect(
        (
          await a.post("/api/permissions/revoke", { headers, data: revoke })
        ).status(),
      ).toBe(200);
    } finally {
      await aclOwner.query(
        "DELETE FROM app_internal.resource_role_policies WHERE module='M01' AND kind=$1",
        [kind],
      );
      await aclOwner.end();
    }

    expect((await (await c.get("/api/spaces/list")).json()).spaces).toEqual([]);
    const disconnect = {
      ...credentials[0],
      spaceId: current.id,
      version: Number(current.version),
      commandId: randomUUID(),
      confirmed: true,
    };
    expect(
      (await a.post("/api/spaces/disconnect", { data: disconnect })).status(),
    ).toBe(403);
    expect(
      (
        await a.post("/api/spaces/disconnect", {
          headers,
          data: { ...disconnect, confirmed: false },
        })
      ).status(),
    ).toBe(400);
    expect(
      (
        await a.post("/api/spaces/disconnect", {
          headers,
          data: { ...disconnect, ...credentials[1] },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await c.post("/api/spaces/disconnect", {
          headers,
          data: { ...disconnect, ...credentials[2] },
        })
      ).status(),
    ).toBe(403);
    expect((await b.post("/api/auth/logout", { headers })).status()).toBe(200);
    const stopped = await a.post("/api/spaces/disconnect", {
      headers,
      data: disconnect,
    });
    expect(stopped.status()).toBe(200);
    expect(stopped.headers()["cache-control"]).toBe("no-store");
    expect(await stopped.json()).toEqual({ spaceId: current.id });
    expect(
      (
        await a.post("/api/spaces/disconnect", { headers, data: disconnect })
      ).status(),
    ).toBe(200);
    expect(
      (await (await a.get("/api/spaces/list")).json()).spaces[0].state,
    ).toBe("frozen");
    expect(
      (
        await a.post("/api/spaces/disconnect", {
          headers,
          data: { padding: "x".repeat(5000) },
        })
      ).status(),
    ).toBe(400);
    let exhausted = false;
    for (let index = 0; index < 10; index++) {
      const attempt = await a.post("/api/spaces/disconnect", {
        headers,
        data: { ...disconnect, confirmed: false },
      });
      if (attempt.status() === 429) {
        expect(Number(attempt.headers()["retry-after"])).toBeGreaterThan(0);
        exhausted = true;
        break;
      }
      expect(attempt.status()).toBe(400);
    }
    expect(exhausted).toBe(true);
    expect((await a.get("/api/spaces/list")).status()).toBe(200);
    expect((await a.post("/api/auth/logout", { headers })).status()).toBe(200);
    expect((await a.get("/api/spaces/list")).status()).toBe(401);
    expect((await a.get("/api/pairing/list")).status()).toBe(401);
  } finally {
    await Promise.all(contexts.map((context) => context.dispose()));
  }
});

test("permission Inspector HTTP hides private objects and rechecks sessions", async ({
  request,
}) => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const actor = randomUUID(),
    outsider = randomUUID(),
    resource = randomUUID(),
    session = randomUUID();
  const token = randomBytes(32).toString("base64url");
  const url = `/api/permissions/inspect?resourceId=${resource}`;
  const headers = { Cookie: `ourspace_session=${session}:${token}` };
  try {
    expect((await request.get(url)).status()).toBe(401);
    await owner.query(
      "INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",
      [actor, outsider],
    );
    await owner.query(
      "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
      [session, actor, createHash("sha256").update(token).digest("hex")],
    );
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2)",
      [resource, outsider],
    );
    const hidden = await request.get(url, { headers });
    const missing = await request.get(
      `/api/permissions/inspect?resourceId=${randomUUID()}`,
      { headers },
    );
    expect(hidden.status()).toBe(404);
    expect(missing.status()).toBe(404);
    expect(await hidden.json()).toEqual(await missing.json());
    expect(hidden.headers()["cache-control"]).toBe("no-store");
    expect(
      (
        await request.get(url, {
          headers: { ...headers, "Sec-Fetch-Site": "cross-site" },
        })
      ).status(),
    ).toBe(403);
    expect(
      (await request.get(url + "&subject=" + outsider, { headers })).status(),
    ).toBe(400);
    expect(
      (
        await request.get("/api/permissions/inspect?resourceId=invalid", {
          headers,
        })
      ).status(),
    ).toBe(400);
    const mine = randomUUID();
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2)",
      [mine, actor],
    );
    const visible = await request.get(
      `/api/permissions/inspect?resourceId=${mine}`,
      { headers },
    );
    expect(visible.status()).toBe(200);
    expect(visible.headers()["cache-control"]).toBe("no-store");
    expect(await visible.json()).toEqual({
      inspection: {
        resource_id: mine,
        resource_version: "1",
        role: "owner",
        base_read_allowed: true,
        read_reason: "base_acl_allowed",
      },
    });
    await owner.query(
      "UPDATE app_internal.pairing_request_budgets SET requests=60 WHERE account_id=$1 AND action='permission_inspect'",
      [actor],
    );
    const limited = await request.get(url, { headers });
    expect(limited.status()).toBe(429);
    expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0);
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",
      [session],
    );
    expect((await request.get(url, { headers })).status()).toBe(401);
  } finally {
    await owner.query(
      "DELETE FROM m10.resources WHERE owner_id=ANY($1::uuid[])",
      [[actor, outsider]],
    );
    await owner.query(
      "DELETE FROM app_internal.pairing_request_budgets WHERE account_id=$1",
      [actor],
    );
    await owner.query("DELETE FROM m10.sessions WHERE id=$1", [session]);
    await owner.query("DELETE FROM m10.accounts WHERE id=ANY($1::uuid[])", [
      [actor, outsider],
    ]);
    await owner.end();
  }
});
