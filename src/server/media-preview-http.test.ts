import { describe, expect, it, vi } from "vitest";
import { mediaPreviewHandler } from "./media-preview-http.server";

vi.mock("server-only", () => ({}));

const origin = "https://ourspace.example";
const id = "10000000-0000-4000-8000-000000000001";
const secret = "a".repeat(42) + "Q";
const cookie = `ourspace_session=${id}:${secret}`;

function fixture() {
  const actor = vi.fn<(session: string) => Promise<string | null>>(async () => id);
  const consumeRequest = vi.fn<(session: string, action: string) => Promise<{ allowed: boolean; retry_after: number }>>(async () => ({ allowed: true, retry_after: 0 }));
  const read = vi.fn<(session: string, id: string, signal?: AbortSignal) => Promise<Buffer | null>>(async () => Buffer.from("thumbnail"));
  return {
    actor, consumeRequest, read,
    handler: mediaPreviewHandler({ origin, sessions: { actor }, budgets: { consumeRequest }, previews: { read } }),
  };
}

function request(query = `?mediaId=${id}`, headers: HeadersInit = { Cookie: cookie }) {
  return new Request(`${origin}/api/media/preview${query}`, { headers });
}

describe("private media preview HTTP", () => {
  it("returns only the authorized WebP and sends no-store and same-origin headers", async () => {
    const f = fixture();
    const r = request();
    const response = await f.handler(r);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Vary")).toBe("Cookie");
    expect(await response.text()).toBe("thumbnail");
    expect(f.actor).toHaveBeenCalledWith(secret);
    expect(f.consumeRequest).toHaveBeenCalledWith(secret, "media_preview");
    expect(f.read).toHaveBeenCalledWith(secret, id, r.signal);
  });

  it("rejects different origins, missing or duplicate cookies, and revoked sessions without touching storage", async () => {
    const f = fixture();
    expect((await f.handler(request(undefined, { Cookie: cookie, Origin: "https://else.example" }))).status).toBe(403);
    expect((await f.handler(request(undefined, { Cookie: cookie, "Sec-Fetch-Site": "same-site" }))).status).toBe(403);
    expect((await f.handler(request(undefined, {}))).status).toBe(401);
    expect((await f.handler(request(undefined, { Cookie: `${cookie}; ${cookie}` }))).status).toBe(401);
    expect(f.actor).not.toHaveBeenCalled();
    f.actor.mockResolvedValueOnce(null);
    expect((await f.handler(request())).status).toBe(401);
    expect(f.consumeRequest).not.toHaveBeenCalled();
    expect(f.read).not.toHaveBeenCalled();
  });

  it("rejects malformed ids and refuses storage work when the preview budget is exhausted", async () => {
    const f = fixture();
    for (const query of ["", "?mediaId=bad", `?mediaId=${id}&mediaId=${id}`, `?mediaId=${id}&bucket=private`])
      expect((await f.handler(request(query))).status).toBe(400);
    expect(f.consumeRequest).not.toHaveBeenCalled();
    f.consumeRequest.mockResolvedValueOnce({ allowed: false, retry_after: 11 });
    const response = await f.handler(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("11");
    expect(f.read).not.toHaveBeenCalled();
  });

  it("does not disclose missing sources or internal storage errors", async () => {
    const f = fixture();
    f.read.mockResolvedValueOnce(null);
    const missing = await f.handler(request());
    expect(missing.status).toBe(404);
    expect(missing.headers.get("Cache-Control")).toBe("no-store");
    expect(await missing.json()).toEqual({ error: "not_found" });
    f.read.mockRejectedValueOnce(new Error("private backend path"));
    const unavailable = await f.handler(request());
    expect(unavailable.status).toBe(503);
    expect(await unavailable.json()).toEqual({ error: "unavailable" });
  });
});
