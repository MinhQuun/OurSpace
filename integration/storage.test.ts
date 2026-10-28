import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { PrivateStorage, StorageUnavailableError } from "../src/server/private-storage.server";

const base = "http://127.0.0.1:55435";
function credential(role = "service_role") {
  const key = readFileSync(".local/storage-jwt-secret", "utf8").trim();
  const now = Math.floor(Date.now()/1000);
  const data = [{alg:"HS256",typ:"JWT"},{role,iat:now,exp:now+300}]
    .map(value => Buffer.from(JSON.stringify(value)).toString("base64url")).join(".");
  return data + "." + createHmac("sha256",key).update(data).digest("base64url");
}

test("private transport verifies real bytes and fails closed on integrity/access errors", async () => {
  const headers = { Authorization: `Bearer ${credential()}`, "Content-Type": "application/json" };
  const bucket = "adapter-" + randomUUID();
  const key = randomUUID();
  const bytes = randomBytes(8193);
  const location = {bucket, object_key:key, byte_size:bytes.length,
    sha256:createHash("sha256").update(bytes).digest("hex")};
  const storage = new PrivateStorage(base, async () => credential(), 16384);
  expect((await fetch(base+"/bucket", {method:"POST",headers,
    body:JSON.stringify({id:bucket,name:bucket,public:false})})).status).toBe(200);
  try {
    expect((await fetch(`${base}/object/${bucket}/${key}`, {method:"POST",
      headers:{...headers,"Content-Type":"application/octet-stream"},body:bytes})).status).toBe(200);
    expect(await storage.read(location)).toEqual(bytes);
    for (const invalid of [
      {...location,sha256:"0".repeat(64)}, {...location,byte_size:8192},
      {...location,byte_size:8194}, {...location,byte_size:20000},
      {...location,object_key:randomUUID()}, {...location,object_key:"../other"},
      {...location,bucket:"../other"},
    ]) await expect(storage.read(invalid)).rejects.toThrow(StorageUnavailableError);
    const unprivileged = new PrivateStorage(base, async () => credential("authenticated"),16384);
    await expect(unprivileged.read(location)).rejects.toThrow("Storage operation unavailable");
    const controller = new AbortController(); controller.abort();
    await expect(storage.read(location,controller.signal)).rejects.toThrow(StorageUnavailableError);
  } finally {
    expect((await fetch(base+"/bucket/"+bucket+"/empty",{method:"POST",headers,body:"{}"})).status).toBe(200);
    expect((await fetch(base+"/bucket/"+bucket,{method:"DELETE",headers})).status).toBe(200);
  }
});

test("transport rejects unsafe configuration without exposing credentials", () => {
  for (const url of ["http://example.test", "https://user:secret@example.test",
    "https://example.test?key=secret", "https://example.test/other", "invalid"]) {
    expect(() => new PrivateStorage(url, async () => "unused", 1024))
      .toThrow("Storage operation unavailable");
  }
});
