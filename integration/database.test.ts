import { readFileSync } from 'node:fs';
import { afterAll, expect, test } from 'vitest';
import { createDatabase, DatabaseUnavailableError } from '../src/server/database.server';

const password = readFileSync('.local/runtime-db-password', 'utf8').trim();
const db = createDatabase(`postgresql://ourspace_runtime:${password}@127.0.0.1:55432/ourspace`);
afterAll(() => db.close());

test('configuration errors never disclose supplied credentials', () => {
  for (const url of ['invalid connection string',
    'postgresql://ourspace_owner:example@localhost/ourspace',
    'postgresql://ourspace_runtime:example@localhost/ourspace?sslmode=disable']) {
    expect(() => createDatabase(url)).toThrow('Database operation unavailable');
  }
});

test('runtime connection parameterizes data and keeps transactions on one connection', async () => {
  const input = "'; DROP SCHEMA m10 CASCADE; --";
  expect((await db.query('SELECT $1::text AS value', [input])).rows[0].value).toBe(input);
  await db.transaction(async (client) => {
    const first = await client.query('SELECT txid_current() AS id');
    const second = await client.query('SELECT txid_current() AS id');
    expect(first.rows[0].id).toBe(second.rows[0].id);
  });
});

test('failed transaction rolls back and pool remains usable', async () => {
  await expect(db.transaction(async (client) => {
    await client.query('CREATE TEMP TABLE rollback_probe (value integer)');
    await client.query('SELECT 1/0');
  })).rejects.toThrow(DatabaseUnavailableError);
  expect((await db.query("SELECT to_regclass('pg_temp.rollback_probe') AS relation")).rows[0].relation).toBeNull();
  expect((await db.query('SELECT 42 AS value')).rows[0].value).toBe(42);
});

test('runtime cannot read private tables or modify schema', async () => {
  for (const sql of ['SELECT * FROM m10.accounts', 'SELECT * FROM m10.sessions',
    'CREATE TABLE public.forbidden (id integer)', 'SET ROLE ourspace_owner']) {
    await expect(db.query(sql)).rejects.toThrow('Database operation unavailable');
  }
});
