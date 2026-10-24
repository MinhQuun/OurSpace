import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "../src/modules/m10/auth/provider.server";
import { localTotp } from "../integration/local-totp";

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
    .match(/http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/)?.[0]
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
