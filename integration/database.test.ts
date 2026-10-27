import { randomUUID, randomBytes, createHash } from "node:crypto";
import { Pool } from "pg";
import { PermissionService } from "../src/modules/m10/permissions/service.server";
import { readFileSync } from "node:fs";
import { afterAll, expect, test } from "vitest";
import {
  createDatabase,
  DatabaseUnavailableError,
} from "../src/server/database.server";

const password = readFileSync(".local/runtime-db-password", "utf8").trim();
const db = createDatabase(
  `postgresql://ourspace_runtime:${password}@127.0.0.1:55432/ourspace`,
);
afterAll(() => db.close());

test("configuration errors never disclose supplied credentials", () => {
  for (const url of [
    "invalid connection string",
    "postgresql://ourspace_owner:example@localhost/ourspace",
    "postgresql://ourspace_runtime:example@localhost/ourspace?sslmode=disable",
  ]) {
    expect(() => createDatabase(url)).toThrow("Database operation unavailable");
  }
});

test("runtime connection parameterizes data and keeps transactions on one connection", async () => {
  const input = "'; DROP SCHEMA m10 CASCADE; --";
  expect(
    (await db.query("SELECT $1::text AS value", [input])).rows[0].value,
  ).toBe(input);
  await db.transaction(async (client) => {
    const first = await client.query("SELECT txid_current() AS id");
    const second = await client.query("SELECT txid_current() AS id");
    expect(first.rows[0].id).toBe(second.rows[0].id);
  });
});

test("failed transaction rolls back and pool remains usable", async () => {
  await expect(
    db.transaction(async (client) => {
      await client.query("CREATE TEMP TABLE rollback_probe (value integer)");
      await client.query("SELECT 1/0");
    }),
  ).rejects.toThrow(DatabaseUnavailableError);
  expect(
    (await db.query("SELECT to_regclass('pg_temp.rollback_probe') AS relation"))
      .rows[0].relation,
  ).toBeNull();
  expect((await db.query("SELECT 42 AS value")).rows[0].value).toBe(42);
});

test("runtime cannot read private tables or modify schema", async () => {
  for (const sql of [
    "SELECT * FROM m10.accounts",
    "SELECT * FROM m10.sessions",
    "CREATE TABLE public.forbidden (id integer)",
    "SET ROLE ourspace_owner",
  ]) {
    await expect(db.query(sql)).rejects.toThrow(
      "Database operation unavailable",
    );
  }
});

test("database errors expose only allowlisted categories without SQL details", async () => {
  await expect(db.query("SELECT * FROM m10.accounts")).rejects.toMatchObject({
    reason: "denied",
    message: "Database operation unavailable",
  });
  await expect(
    db.query("SELECT app_internal.create_pairing_invitation($1,$2,$3)", [
      "invalid",
      null,
      "invalid",
    ]),
  ).rejects.toMatchObject({
    reason: "invalid_input",
    message: "Database operation unavailable",
  });
  await expect(
    db.transaction(async (client) => {
      await client.query(
        "CREATE TEMP TABLE duplicate_probe (id integer PRIMARY KEY)",
      );
      await client.query("INSERT INTO duplicate_probe VALUES (1),(1)");
    }),
  ).rejects.toMatchObject({
    reason: "conflict",
    message: "Database operation unavailable",
  });
  await expect(db.query("SELECT 1/0")).rejects.toMatchObject({
    reason: "unavailable",
    message: "Database operation unavailable",
  });
});

 test("permission service inspects current owner access without private enumeration", async () => {
  const owner = new Pool({host:"127.0.0.1",port:55432,database:"ourspace",user:"ourspace_owner",password:readFileSync(".local/db-password","utf8").trim(),max:1});
  const actor=randomUUID(), outsider=randomUUID(), resource=randomUUID();
  const token=randomBytes(32).toString("base64url"), otherToken=randomBytes(32).toString("base64url");
  const service=new PermissionService(db);
  try {
    await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",[actor,outsider]);
    for (const [id,value] of [[actor,token],[outsider,otherToken]]) {
      await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",[randomUUID(),id,createHash('sha256').update(value).digest('hex')]);
    }
    await owner.query("INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2)",[resource,actor]);
    expect(await service.inspect(token,resource)).toEqual({resource_id:resource,resource_version:'1',role:'owner',base_read_allowed:true,read_reason:'base_acl_allowed'});
    expect(await service.inspect(otherToken,resource)).toBeNull();
    expect(await service.inspect(otherToken,randomUUID())).toBeNull();
    expect(await service.inspect(randomBytes(32).toString('base64url'),resource)).toBeNull();
    await expect(service.inspect(token,"' OR true --")).rejects.toThrow();
    await expect(service.inspect('invalid',resource)).rejects.toThrow();
    await owner.query("UPDATE m10.resources SET access_mode='conditional' WHERE id=$1",[resource]);
    expect(await service.inspect(token,resource)).toMatchObject({base_read_allowed:false,read_reason:'domain_conditions_required',resource_version:'2'});
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=$1",[actor]);
    expect(await service.inspect(token,resource)).toBeNull();
    for (const statement of ["SELECT * FROM m10.resources","SELECT * FROM m10.resource_grants","SELECT app_internal.can_read_resource('invalid',NULL)","SELECT app_internal.lock_shared_resource_edit('invalid',NULL,NULL)"]) {
      await expect(db.query(statement)).rejects.toMatchObject({reason:'denied'});
    }
  } finally {
    await owner.query("DELETE FROM m10.resources WHERE id=$1",[resource]);
    await owner.query("DELETE FROM m10.sessions WHERE account_id=ANY($1::uuid[])",[[actor,outsider]]);
    await owner.query("DELETE FROM m10.accounts WHERE id=ANY($1::uuid[])",[[actor,outsider]]);
    await owner.end();
  }
});
