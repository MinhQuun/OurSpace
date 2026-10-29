import { randomUUID, randomBytes, createHash } from "node:crypto";
import { Pool } from "pg";
import { PermissionService } from "../src/modules/m10/permissions/service.server";
import { ProfileService } from "../src/modules/m10/profile/service.server";
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
    resource = randomUUID();
  const token = randomBytes(32).toString("base64url"),
    otherToken = randomBytes(32).toString("base64url");
  const service = new PermissionService(db);
  try {
    await owner.query(
      "INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",
      [actor, outsider],
    );
    for (const [id, value] of [
      [actor, token],
      [outsider, otherToken],
    ]) {
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [randomUUID(), id, createHash("sha256").update(value).digest("hex")],
      );
    }
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2)",
      [resource, actor],
    );
    expect(await service.inspect(token, resource)).toEqual({
      resource_id: resource,
      resource_version: "1",
      role: "owner",
      base_read_allowed: true,
      read_reason: "base_acl_allowed",
    });
    expect(await service.inspect(otherToken, resource)).toBeNull();
    expect(await service.inspect(otherToken, randomUUID())).toBeNull();
    expect(
      await service.inspect(randomBytes(32).toString("base64url"), resource),
    ).toBeNull();
    await expect(service.inspect(token, "' OR true --")).rejects.toThrow();
    await expect(service.inspect("invalid", resource)).rejects.toThrow();
    await owner.query(
      "UPDATE m10.resources SET access_mode='conditional' WHERE id=$1",
      [resource],
    );
    expect(await service.inspect(token, resource)).toMatchObject({
      base_read_allowed: false,
      read_reason: "domain_conditions_required",
      resource_version: "2",
    });
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=$1",
      [actor],
    );
    expect(await service.inspect(token, resource)).toBeNull();
    for (const statement of [
      "SELECT * FROM m10.resources",
      "SELECT * FROM m10.resource_grants",
      "SELECT app_internal.can_read_resource('invalid',NULL)",
      "SELECT app_internal.lock_shared_resource_edit('invalid',NULL,NULL)",
    ]) {
      await expect(db.query(statement)).rejects.toMatchObject({
        reason: "denied",
      });
    }
  } finally {
    await owner.query("DELETE FROM m10.resources WHERE id=$1", [resource]);
    await owner.query(
      "DELETE FROM m10.sessions WHERE account_id=ANY($1::uuid[])",
      [[actor, outsider]],
    );
    await owner.query("DELETE FROM m10.accounts WHERE id=ANY($1::uuid[])", [
      [actor, outsider],
    ]);
    await owner.end();
  }
});

test("profile service preserves own identity, date-only values and private optional fields", async () => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const users = [randomUUID(), randomUUID()],
    tokens = [
      randomBytes(32).toString("base64url"),
      randomBytes(32).toString("base64url"),
    ];
  const service = new ProfileService(db);
  try {
    for (let i = 0; i < 2; i++) {
      await owner.query(
        "INSERT INTO m10.accounts(id,state) VALUES ($1,'active')",
        [users[i]],
      );
      await owner.query(
        "INSERT INTO m10.profiles(user_id,display_name) VALUES ($1,'Synthetic profile')",
        [users[i]],
      );
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [
          randomUUID(),
          users[i],
          createHash("sha256").update(tokens[i]).digest("hex"),
        ],
      );
    }
    const preferences = {
      commandId: randomUUID(),
      version: 0,
      theme: "dark" as const,
      language: "vi-VN" as const,
      timezone: "UTC",
      dateFormat: "yyyy-MM-dd" as const,
      hourCycle: "h12" as const,
      reducedMotion: "reduce" as const,
      fontScale: 1.25,
    };
    expect(await service.preferences(tokens[0])).toMatchObject({
      theme: "system",
      version: "0",
    });
    for (const patch of [
      { userId: users[1] },
      { version: -1 },
      { theme: "invalid" },
      { language: "en-US" },
      { timezone: "EST" },
      { dateFormat: "invalid" },
      { hourCycle: "h25" },
      { reducedMotion: "force" },
      { fontScale: 1.555 },
      { fontScale: NaN },
    ]) {
      await expect(
        service.updatePreferences(tokens[0], {
          ...preferences,
          ...patch,
        } as typeof preferences),
      ).rejects.toMatchObject({ kind: "invalid_input" });
    }
    expect(await service.updatePreferences(tokens[0], preferences)).toEqual({
      userId: users[0],
    });
    expect(await service.updatePreferences(tokens[0], preferences)).toEqual({
      userId: users[0],
    });
    expect(await service.preferences(tokens[0])).toMatchObject({
      theme: "dark",
      font_scale: "1.25",
      version: "1",
    });
    expect(await service.preferences(tokens[1])).toMatchObject({
      theme: "system",
      version: "0",
    });
    await expect(
      service.updatePreferences(tokens[0], {
        ...preferences,
        commandId: randomUUID(),
      }),
    ).rejects.toMatchObject({ reason: "conflict" });
    await expect(
      service.updatePreferences(tokens[0], { ...preferences, theme: "light" }),
    ).rejects.toMatchObject({ reason: "invalid_input" });
    await expect(
      service.updatePreferences(tokens[0], {
        ...preferences,
        commandId: randomUUID(),
        version: 1,
        timezone: "Unknown/Zone",
      }),
    ).rejects.toMatchObject({ reason: "invalid_input" });
    await expect(
      db.query("SELECT * FROM m10.personal_preferences"),
    ).rejects.toMatchObject({ reason: "denied" });
    expect(await service.read(tokens[0])).toMatchObject({
      user_id: users[0],
      birthday: null,
      bio: null,
      version: "1",
    });
    const input = {
      commandId: randomUUID(),
      version: 1,
      displayName: "  Synthetic name  ",
      nickname: "Synthetic nickname",
      birthday: "2000-02-29",
      bio: "Synthetic private bio",
    };
    expect(await service.update(tokens[0], input)).toEqual({
      userId: users[0],
    });
    expect(await service.update(tokens[0], input)).toEqual({
      userId: users[0],
    });
    expect(await service.read(tokens[0])).toEqual({
      user_id: users[0],
      display_name: "Synthetic name",
      nickname: input.nickname,
      birthday: "2000-02-29",
      bio: input.bio,
      avatar_ref: null,
      version: "2",
    });
    expect(await service.read(tokens[1])).toMatchObject({
      user_id: users[1],
      bio: null,
      version: "1",
    });
    for (const patch of [
      { birthday: "2001-02-29" },
      { birthday: "2026-13-01" },
      { birthday: "0000-01-01" },
      { birthday: "2000-02-29T00:00:00Z" },
      { displayName: " \t " },
      { nickname: "x".repeat(121) },
      { bio: "x".repeat(4001) },
      { userId: users[1] },
    ]) {
      await expect(
        service.update(tokens[0], { ...input, ...patch }),
      ).rejects.toMatchObject({ kind: "invalid_input" });
    }
    await expect(
      service.update(tokens[0], { ...input, commandId: randomUUID() }),
    ).rejects.toMatchObject({ reason: "conflict" });
    await expect(
      service.update(tokens[0], { ...input, displayName: "Changed replay" }),
    ).rejects.toMatchObject({ reason: "invalid_input" });
    const emoji = "\u{1f331}".repeat(120);
    await service.update(tokens[0], {
      ...input,
      commandId: randomUUID(),
      version: 2,
      displayName: emoji,
      nickname: "",
      birthday: null,
      bio: "",
    });
    expect(await service.read(tokens[0])).toMatchObject({
      display_name: emoji,
      nickname: null,
      birthday: null,
      bio: null,
      version: "3",
    });
    expect(await service.update(tokens[0], input)).toEqual({
      userId: users[0],
    });
    expect((await service.read(tokens[0]))?.version).toBe("3");
    const media = Array.from({ length: 5 }, () => randomUUID());
    for (let i = 0; i < media.length; i++) {
      await owner.query(
        "INSERT INTO m10.resources(id,module,kind,owner_id,access_mode,deleted_at) VALUES ($1,$2,'media',$3,$4,$5)",
        [
          media[i],
          i === 2 ? "M01" : "M02",
          i === 1 ? users[1] : users[0],
          i === 3 ? "conditional" : "standard",
          i === 4 ? new Date(Date.now() + 1000) : null,
        ],
      );
    }
    const avatarInput = {
      ...input,
      commandId: randomUUID(),
      version: 3,
      avatarRef: media[0],
    };
    for (const avatarRef of [...media.slice(1), randomUUID()]) {
      await expect(
        service.update(tokens[0], {
          ...avatarInput,
          commandId: randomUUID(),
          avatarRef,
        }),
      ).rejects.toMatchObject({ reason: "denied" });
    }
    expect((await service.read(tokens[0]))?.version).toBe("3");
    await service.update(tokens[0], avatarInput);
    await service.update(tokens[0], avatarInput);
    expect(await service.read(tokens[0])).toMatchObject({
      avatar_ref: media[0],
      version: "4",
    });
    for (const table of ["command_receipts", "audit_events", "outbox"]) {
      const rows = await owner.query(
        `SELECT count(*)::int AS count FROM app_internal.${table} WHERE command_id=$1`,
        [avatarInput.commandId],
      );
      expect(rows.rows[0].count).toBe(1);
    }
    await service.update(tokens[0], {
      ...input,
      commandId: randomUUID(),
      version: 4,
    });
    expect(await service.read(tokens[0])).toMatchObject({
      avatar_ref: media[0],
      version: "5",
    });
    await owner.query(
      "UPDATE m10.resources SET deleted_at=clock_timestamp() WHERE id=$1",
      [media[0]],
    );
    expect((await service.read(tokens[0]))?.avatar_ref).toBeNull();
    await service.update(tokens[0], {
      ...input,
      commandId: randomUUID(),
      version: 5,
      avatarRef: null,
    });
    expect(await service.read(tokens[0])).toMatchObject({
      avatar_ref: null,
      version: "6",
    });
    const invitation = randomUUID(),
      space = randomUUID();
    await owner.query("BEGIN");
    try {
      await owner.query(
        "INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ($1,$2,$3)",
        [
          invitation,
          users[0],
          createHash("sha256").update(randomUUID()).digest("hex"),
        ],
      );
      await owner.query(
        "UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by=$2,accepted_at=clock_timestamp() WHERE id=$1",
        [invitation, users[1]],
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
        [space, users[0], users[1]],
      );
      await owner.query("COMMIT");
    } catch (error) {
      await owner.query("ROLLBACK");
      throw error;
    }
    expect(await service.couple(tokens[0], space)).toEqual({
      space_id: space,
      title: null,
      accent: null,
      version: "0",
      updated_by: null,
      updated_at: null,
    });
    expect(await service.coupleHistory(tokens[1], space)).toEqual([]);
    const coupleUpdate = {
      commandId: randomUUID(),
      spaceId: space,
      version: 0,
      title: "  Synthetic couple  ",
      accent: "#1A2b3C",
    };
    for (const patch of [
      { version: -1 },
      { version: 0.5 },
      { version: Number.MAX_SAFE_INTEGER + 1 },
      { title: " \t " },
      { title: "x".repeat(121) },
      { userId: users[1] },
      { spaceId: "invalid" },
      { accent: "purple" },
      { accent: "#12345" },
      { accent: "#1234567" },
    ]) {
      await expect(
        service.updateCouple(tokens[0], { ...coupleUpdate, ...patch }),
      ).rejects.toMatchObject({ kind: "invalid_input" });
    }
    expect(await service.updateCouple(tokens[0], coupleUpdate)).toEqual({
      spaceId: space,
    });
    expect(await service.updateCouple(tokens[0], coupleUpdate)).toEqual({
      spaceId: space,
    });
    await expect(
      service.updateCouple(tokens[1], {
        ...coupleUpdate,
        commandId: randomUUID(),
      }),
    ).rejects.toMatchObject({ reason: "conflict" });
    await expect(
      service.updateCouple(tokens[0], {
        ...coupleUpdate,
        title: "Changed retry",
      }),
    ).rejects.toMatchObject({ reason: "invalid_input" });
    expect(await service.couple(tokens[1], space)).toMatchObject({
      title: "Synthetic couple",
      accent: "#1a2b3c",
      version: "1",
      updated_by: users[0],
      updated_at: expect.any(Date),
    });
    await service.updateCouple(tokens[1], {
      ...coupleUpdate,
      commandId: randomUUID(),
      version: 1,
      title: null,
    });
    expect(await service.couple(tokens[0], space)).toMatchObject({
      title: null,
      accent: "#1a2b3c",
      version: "2",
      updated_by: users[1],
    });
    expect(await service.coupleHistory(tokens[0], space)).toMatchObject([
      {
        version: "2",
        title: null,
        accent: "#1a2b3c",
        actor_id: users[1],
        recorded_at: expect.any(Date),
      },
      {
        version: "1",
        title: "Synthetic couple",
        accent: "#1a2b3c",
        actor_id: users[0],
      },
    ]);
    expect(
      (await service.coupleHistory(tokens[1], space, 2)).map(
        (row) => row.version,
      ),
    ).toEqual(["1"]);
    for (const cursor of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(
        service.coupleHistory(tokens[0], space, cursor),
      ).rejects.toMatchObject({ kind: "invalid_input" });
    }
    expect(await service.couple(tokens[0], randomUUID())).toBeNull();
    expect(await service.coupleHistory(tokens[0], randomUUID())).toEqual([]);
    for (const table of ["couple_profiles", "couple_profile_revisions"]) {
      await expect(
        db.query(`SELECT * FROM m10.${table}`),
      ).rejects.toMatchObject({ reason: "denied" });
    }
    expect(await service.partner(tokens[1], space)).toEqual({});
    const sharing = {
      commandId: randomUUID(),
      spaceId: space,
      recipientId: users[1],
      field: "birthday" as const,
      version: 6,
      confirmed: true,
    };
    for (const patch of [
      { confirmed: false },
      { field: "email" },
      { version: 0 },
      { recipientId: "invalid" },
      { userId: users[1] },
    ]) {
      await expect(
        service.shareField(tokens[0], {
          ...sharing,
          ...patch,
        } as typeof sharing),
      ).rejects.toMatchObject({ kind: "invalid_input" });
    }
    const shared = await service.shareField(tokens[0], sharing);
    expect(await service.shareField(tokens[0], sharing)).toEqual(shared);
    expect(await service.partner(tokens[1], space)).toEqual({
      birthday: "2000-02-29",
    });
    expect(await service.partner(tokens[1], randomUUID())).toEqual({});
    expect(await service.grants(tokens[1])).toEqual([]);
    expect(await service.grants(tokens[0])).toMatchObject([
      { id: shared.grantId, field: "birthday", revoked_at: null },
    ]);
    await expect(
      service.revokeField(tokens[1], {
        commandId: randomUUID(),
        grantId: shared.grantId,
        version: 1,
        confirmed: true,
      }),
    ).rejects.toMatchObject({ reason: "denied" });
    const revocation = {
      commandId: randomUUID(),
      grantId: shared.grantId,
      version: 7,
      confirmed: true,
    };
    await expect(
      service.revokeField(tokens[0], { ...revocation, version: 6 }),
    ).rejects.toMatchObject({ reason: "conflict" });
    expect(await service.revokeField(tokens[0], revocation)).toEqual(shared);
    expect(await service.revokeField(tokens[0], revocation)).toEqual(shared);
    expect(await service.partner(tokens[1], space)).toEqual({});
    expect((await service.grants(tokens[0]))[0].revoked_at).toBeInstanceOf(
      Date,
    );
    await expect(
      db.query("SELECT * FROM m10.profile_field_grants"),
    ).rejects.toMatchObject({ reason: "denied" });
    await expect(db.query("SELECT * FROM m10.profiles")).rejects.toMatchObject({
      reason: "denied",
    });
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=$1 AND revoked_at IS NULL",
      [users[0]],
    );
    expect(await service.read(tokens[0])).toBeNull();
    expect(await service.preferences(tokens[0])).toBeNull();
    await expect(
      service.updatePreferences(tokens[0], preferences),
    ).rejects.toMatchObject({ reason: "denied" });
    expect(await service.couple(tokens[0], space)).toBeNull();
    expect(await service.coupleHistory(tokens[0], space)).toEqual([]);
    await expect(
      service.updateCouple(tokens[0], coupleUpdate),
    ).rejects.toMatchObject({ reason: "denied" });
    await expect(service.update(tokens[0], input)).rejects.toMatchObject({
      reason: "denied",
    });
    await expect(service.read("invalid")).rejects.toMatchObject({
      kind: "denied",
    });
    expect((await service.read(tokens[1]))?.user_id).toBe(users[1]);
  } finally {
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL",
      [users],
    );
    await owner.end();
  }
});
