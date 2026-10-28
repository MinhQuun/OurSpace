import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { Pool } from "pg";
import { createServer, type Server } from "node:http";
import { once } from "node:events";
import { binaryDownloadHandler } from "../src/server/binary-http.server";
import { SessionService } from "../src/modules/m10/auth/session.server";
import { AuthProvider } from "../src/modules/m10/auth/provider.server";
import { PairingService } from "../src/modules/m10/pairing/service.server";
import { createDatabase } from "../src/server/database.server";
import { BinaryDownloadService } from "../src/server/binary-download.server";
import { PermissionService } from "../src/modules/m10/permissions/service.server";
import {
  PrivateStorage,
  StorageUnavailableError,
} from "../src/server/private-storage.server";

const base = "http://127.0.0.1:55435";
function credential(role = "service_role") {
  const key = readFileSync(".local/storage-jwt-secret", "utf8").trim();
  const now = Math.floor(Date.now() / 1000);
  const data = [
    { alg: "HS256", typ: "JWT" },
    { role, iat: now, exp: now + 300 },
  ]
    .map((value) => Buffer.from(JSON.stringify(value)).toString("base64url"))
    .join(".");
  return (
    data + "." + createHmac("sha256", key).update(data).digest("base64url")
  );
}

test("private transport verifies real bytes and fails closed on integrity/access errors", async () => {
  const headers = {
    Authorization: `Bearer ${credential()}`,
    "Content-Type": "application/json",
  };
  const bucket = "adapter-" + randomUUID();
  const key = randomUUID();
  const bytes = randomBytes(8193);
  const location = {
    bucket,
    object_key: key,
    byte_size: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
  const storage = new PrivateStorage(base, async () => credential(), 16384);
  expect(
    (
      await fetch(base + "/bucket", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: bucket, name: bucket, public: false }),
      })
    ).status,
  ).toBe(200);
  try {
    expect(
      (
        await fetch(`${base}/object/${bucket}/${key}`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/octet-stream" },
          body: bytes,
        })
      ).status,
    ).toBe(200);
    expect(await storage.read(location)).toEqual(bytes);
    for (const invalid of [
      { ...location, sha256: "0".repeat(64) },
      { ...location, byte_size: 8192 },
      { ...location, byte_size: 8194 },
      { ...location, byte_size: 20000 },
      { ...location, object_key: randomUUID() },
      { ...location, object_key: "../other" },
      { ...location, bucket: "../other" },
    ])
      await expect(storage.read(invalid)).rejects.toThrow(
        StorageUnavailableError,
      );
    const unprivileged = new PrivateStorage(
      base,
      async () => credential("authenticated"),
      16384,
    );
    await expect(unprivileged.read(location)).rejects.toThrow(
      "Storage operation unavailable",
    );
    const controller = new AbortController();
    controller.abort();
    await expect(storage.read(location, controller.signal)).rejects.toThrow(
      StorageUnavailableError,
    );
  } finally {
    expect(
      (
        await fetch(base + "/bucket/" + bucket + "/empty", {
          method: "POST",
          headers,
          body: "{}",
        })
      ).status,
    ).toBe(200);
    expect(
      (await fetch(base + "/bucket/" + bucket, { method: "DELETE", headers }))
        .status,
    ).toBe(200);
  }
});

test("transport rejects unsafe configuration without exposing credentials", () => {
  for (const url of [
    "http://example.test",
    "https://user:secret@example.test",
    "https://example.test?key=secret",
    "https://example.test/other",
    "invalid",
  ]) {
    expect(() => new PrivateStorage(url, async () => "unused", 1024)).toThrow(
      "Storage operation unavailable",
    );
  }
});

test("download service rechecks live source ACL around real Storage bytes", async () => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const db = createDatabase(
    `postgresql://ourspace_runtime:${readFileSync(".local/runtime-db-password", "utf8").trim()}@127.0.0.1:55432/ourspace`,
  );
  const a = randomUUID(),
    b = randomUUID(),
    resource = randomUUID(),
    binary = randomUUID();
  const invitation = randomUUID(),
    space = randomUUID(),
    grant = randomUUID();
  const tokens = [
    randomBytes(32).toString("base64url"),
    randomBytes(32).toString("base64url"),
  ];
  const bucket = "acl-" + randomUUID(),
    key = randomUUID(),
    bytes = randomBytes(1001);
  const headers = {
    Authorization: `Bearer ${credential()}`,
    "Content-Type": "application/json",
  };
  let bucketCreated = false;
  let http: Server | undefined;
  try {
    await owner.query(
      "INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",
      [a, b],
    );
    for (let i = 0; i < 2; i++)
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [
          randomUUID(),
          [a, b][i],
          createHash("sha256").update(tokens[i]).digest("hex"),
        ],
      );
    await owner.query("BEGIN");
    await owner.query(
      "INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ($1,$2,$3)",
      [invitation, a, createHash("sha256").update(randomUUID()).digest("hex")],
    );
    await owner.query(
      "UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by=$2,accepted_at=clock_timestamp() WHERE id=$1",
      [invitation, b],
    );
    await owner.query(
      "UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id=$1",
      [invitation],
    );
    await owner.query(
      "INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ($1,$2)",
      [space, invitation],
    );
    await owner.query(
      "INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ($1,$2,1),($1,$3,2)",
      [space, a, b],
    );
    await owner.query("COMMIT");
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M02','storage_poc',$2)",
      [resource, a],
    );
    await owner.query(
      "INSERT INTO app_internal.binary_objects(id,resource_id,purpose,bucket,object_key,byte_size,sha256) VALUES ($1,$2,'original',$3,$4,$5,$6)",
      [
        binary,
        resource,
        bucket,
        key,
        bytes.length,
        createHash("sha256").update(bytes).digest("hex"),
      ],
    );
    expect(
      (
        await fetch(base + "/bucket", {
          method: "POST",
          headers,
          body: JSON.stringify({ id: bucket, name: bucket, public: false }),
        })
      ).status,
    ).toBe(200);
    bucketCreated = true;
    expect(
      (
        await fetch(`${base}/object/${bucket}/${key}`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/octet-stream" },
          body: bytes,
        })
      ).status,
    ).toBe(200);
    let reads = 0;
    const storage = new PrivateStorage(
      base,
      async () => {
        reads++;
        return credential();
      },
      4096,
    );
    // Explicit POC domain adapter, not a production canDownload implementation.
    const domain = async (_session: string, id: string, purpose: string) =>
      id === resource && purpose === "original";
    const service = new BinaryDownloadService(db, storage, domain);
    expect(await service.read(tokens[0], binary)).toEqual(bytes);
    expect(await service.read(tokens[1], binary)).toBeNull();
    expect(await service.read(tokens[1], randomUUID())).toBeNull();
    expect(await service.read("invalid", binary)).toBeNull();
    expect(reads).toBe(1);
    const denied = new BinaryDownloadService(db, storage, async () => false);
    expect(await denied.read(tokens[0], binary)).toBeNull();
    expect(reads).toBe(1);
    const handler = binaryDownloadHandler({origin:"http://127.0.0.1",
      sessions:new SessionService(db,new AuthProvider("http://127.0.0.1:55433")),
      budgets:new PairingService(db),downloads:service});
    http=createServer(async (incoming,outgoing)=>{
      try {
        const url=new URL(incoming.url!,"http://127.0.0.1");
        const requestHeaders=new Headers();
        for (const [key,value] of Object.entries(incoming.headers))
          if (value !== undefined) requestHeaders.set(key,Array.isArray(value)?value.join(","):value);
        const result=await handler(new Request(url,{method:incoming.method,headers:requestHeaders}),url.pathname.slice(1));
        outgoing.writeHead(result.status,Object.fromEntries(result.headers.entries()));
        outgoing.end(Buffer.from(await result.arrayBuffer()));
      } catch { outgoing.writeHead(500); outgoing.end(); }
    });
    http.listen(0,"127.0.0.1"); await once(http,"listening");
    const address=http.address();
    if (!address || typeof address === "string") throw new Error("Missing local server");
    const endpoint=`http://127.0.0.1:${address.port}/`;
    const cookie=(i:number)=>`ourspace_session=${randomUUID()}:${tokens[i]}`;
    const get=(id:string=binary, extra:Record<string,string>={}, account=0)=>fetch(endpoint+id,{headers:{Cookie:cookie(account),...extra}});
    expect((await fetch(endpoint+binary)).status).toBe(401);
    expect((await get(binary,{"Sec-Fetch-Site":"cross-site"})).status).toBe(403);
    expect((await get(binary,{Origin:"https://untrusted.test"})).status).toBe(403);
    expect((await get(binary+"?bucket=forged")).status).toBe(400);
    expect((await get(binary,{Range:"bytes=0-1"})).status).toBe(416);
    const privateResult=await get(binary,{},1), unknown=await get(randomUUID(),{},1);
    expect(privateResult.status).toBe(404); expect(unknown.status).toBe(404);
    expect(await privateResult.text()).toBe(await unknown.text());
    const download=await get(binary,{"If-None-Match":"*"});
    expect(download.status).toBe(200);
    expect(Buffer.from(await download.arrayBuffer())).toEqual(bytes);
    expect(download.headers.get("cache-control")).toContain("no-store");
    expect(download.headers.get("content-disposition")).toBe('attachment; filename="download.bin"');
    expect(download.headers.get("content-type")).toBe("application/octet-stream");
    for (const name of ["etag","location","authorization","access-control-allow-origin"])
      expect(download.headers.get(name)).toBeNull();
    await owner.query(
      "INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ($1,$2,$3,$4,$5,'viewer')",
      [grant, resource, a, b, space],
    );
    expect(await service.read(tokens[1], binary)).toEqual(bytes);
    expect((await get(binary,{},1)).status).toBe(200);
    // Revocation commits after the first ACL resolution, before the real fetch.
    const revoking = new PrivateStorage(
      base,
      async () => {
        await new PermissionService(db).revoke(tokens[0], {
          commandId: randomUUID(),
          resourceId: resource,
          grantId: grant,
          version: 1,
          confirmed: true,
        });
        return credential();
      },
      4096,
    );
    expect(
      await new BinaryDownloadService(db, revoking, domain).read(
        tokens[1],
        binary,
      ),
    ).toBeNull();
    expect(await service.read(tokens[1], binary)).toBeNull();
    expect((await get(binary,{},1)).status).toBe(404);
    expect(await service.read(tokens[0], binary)).toEqual(bytes);
    await owner.query("UPDATE app_internal.pairing_request_budgets SET requests=10000,window_started_at=clock_timestamp() WHERE account_id=$1 AND action='binary_download'",[a]);
    const limited=await get(); expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    const endingSession = new PrivateStorage(
      base,
      async () => {
        await owner.query(
          "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=$1 AND revoked_at IS NULL",
          [a],
        );
        return credential();
      },
      4096,
    );
    expect(
      await new BinaryDownloadService(db, endingSession, domain).read(
        tokens[0],
        binary,
      ),
    ).toBeNull();
    expect(await service.read(tokens[0], binary)).toBeNull();
    expect((await get()).status).toBe(401);
    await expect(
      db.query("SELECT * FROM app_internal.binary_objects"),
    ).rejects.toMatchObject({ reason: "denied" });
  } finally {
    if (http) { http.closeAllConnections(); await new Promise<void>((resolve,reject)=>http!.close(error=>error?reject(error):resolve())); }
    await owner.query("ROLLBACK");
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL",
      [[a, b]],
    );
    if (bucketCreated) {
      expect(
        (
          await fetch(base + "/bucket/" + bucket + "/empty", {
            method: "POST",
            headers,
            body: "{}",
          })
        ).status,
      ).toBe(200);
      expect(
        (await fetch(base + "/bucket/" + bucket, { method: "DELETE", headers }))
          .status,
      ).toBe(200);
    }
    await db.close();
    await owner.end();
  }
});
