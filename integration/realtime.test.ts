import { createServer } from "node:http";
import { once } from "node:events";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { WebSocket } from "ws";
import { test, expect } from "vitest";
import { createDatabase } from "../src/server/database.server";
import { PermissionService } from "../src/modules/m10/permissions/service.server";
import { AuthorizedChannel } from "../src/server/authorized-channel.server";

test("open WebSocket stops private delivery after grant or session revocation", async () => {
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
  const permissions = new PermissionService(db);
  const a = randomUUID(),
    b = randomUUID(),
    resource = randomUUID(),
    child = randomUUID(),
    space = randomUUID(),
    invitation = randomUUID(),
    grant = randomUUID();
  const tokens = [
    randomBytes(32).toString("base64url"),
    randomBytes(32).toString("base64url"),
  ];
  const server = createServer((_req, res) => {
    res.writeHead(404);
    res.end();
  });
  // Base-ACL security POC only; production domain adapter must also enforce its rules.
  const channel = new AuthorizedChannel(
    server,
    "http://127.0.0.1",
    async (session, id) =>
      (await permissions.inspect(session, id))?.base_read_allowed === true,
  );
  const sockets: WebSocket[] = [];
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
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','channel_poc',$3),($2,'M02','channel_child_poc',$3)",
      [resource, child, a],
    );
    await owner.query(
      "INSERT INTO m10.resource_links(source_id,target_id,relation) VALUES ($1,$2,'embedded')",
      [resource, child],
    );
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error("Missing server");
    const connect = (
      id: string,
      index: number,
      origin = "http://127.0.0.1",
    ) => {
      const ws = new WebSocket(
        `ws://127.0.0.1:${address.port}/channels/${id}`,
        {
          headers: {
            Origin: origin,
            Cookie: `ourspace_session=${randomUUID()}:${tokens[index]}`,
          },
        },
      );
      ws.on("error", () => {});
      sockets.push(ws);
      return ws;
    };
    const rejected = async (id: string, index: number, origin?: string) => {
      const ws = connect(id, index, origin);
      const [, _response] = await once(ws, "unexpected-response");
      const response = _response as import("node:http").IncomingMessage;
      expect(response.statusCode).toBe(403);
      response.resume();
      ws.terminate();
    };
    await rejected(resource, 1);
    await rejected(randomUUID(), 1);
    await rejected(resource, 0, "https://untrusted.test");
    const first = connect(resource, 0);
    await once(first, "open");
    const ownerMessages: Buffer[] = [];
    first.on("message", (data) =>
      ownerMessages.push(Buffer.from(data as Buffer)),
    );
    await owner.query(
      "INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ($1,$2,$3,$4,$5,'viewer')",
      [grant, resource, a, b, space],
    );
    await rejected(child, 1); // Parent Viewer does not authorize linked Private child.
    const second = connect(resource, 1);
    await once(second, "open");
    const partnerMessages: Buffer[] = [];
    second.on("message", (data) =>
      partnerMessages.push(Buffer.from(data as Buffer)),
    );
    const payload = randomBytes(64),
      delivered = once(second, "message");
    await channel.publish(resource, payload);
    await delivered;
    expect(partnerMessages).toEqual([payload]);
    await permissions.revoke(tokens[0], {
      commandId: randomUUID(),
      resourceId: resource,
      grantId: grant,
      version: 1,
      confirmed: true,
    });
    const closed = once(second, "close"),
      ownerDelivery = once(first, "message");
    const privateUpdate = randomBytes(64);
    await channel.publish(resource, privateUpdate);
    await ownerDelivery;
    expect((await closed)[0]).toBe(4403);
    expect(partnerMessages).toEqual([payload]);
    expect(ownerMessages).toContainEqual(privateUpdate);
    await rejected(resource, 1);
    const writer = connect(resource, 0);
    await once(writer, "open");
    const writerClosed = once(writer, "close");
    writer.send("untrusted write");
    expect((await writerClosed)[0]).toBe(1008);
    const ownerClosed = once(first, "close");
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=$1 AND revoked_at IS NULL",
      [a],
    );
    await channel.revalidate();
    expect((await ownerClosed)[0]).toBe(4403);
    await channel.publish(resource, randomBytes(64));
    expect(ownerMessages).toHaveLength(2);
  } finally {
    for (const socket of sockets) socket.terminate();
    await channel.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await owner.query("ROLLBACK");
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL",
      [[a, b]],
    );
    await db.close();
    await owner.end();
  }
}, 15000);
