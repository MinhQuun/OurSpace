import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterAll, expect, test } from 'vitest';
import { AuthProvider } from '../src/modules/m10/auth/provider.server';
import { createDatabase } from '../src/server/database.server';

const auth = new AuthProvider('http://127.0.0.1:55433');
const db = createDatabase(`postgresql://ourspace_runtime:${readFileSync('.local/runtime-db-password', 'utf8').trim()}@127.0.0.1:55432/ourspace`);
afterAll(() => db.close());

async function confirmationLink(email: string): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const listing = await (await fetch('http://127.0.0.1:55434/api/v1/messages')).json();
    const message = listing.messages.find((item: { To: { Address: string }[] }) => item.To.some(to => to.Address === email));
    if (message) {
      const detail = await (await fetch(`http://127.0.0.1:55434/api/v1/message/${encodeURIComponent(message.ID)}`)).json();
      const link = String(detail.HTML).match(/http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/);
      if (link) return link[0].replaceAll('&amp;', '&');
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Local confirmation message was not received');
}

test('real provider requires email confirmation and isolates two identities', async () => {
  const identities: string[] = [];
  for (const label of ['a', 'b']) {
    const email = `provider-${label}-${randomUUID()}@ourspace.test`;
    const password = randomUUID() + '!Aa9';
    await auth.signUp(email, password);
    await expect(auth.signIn(email, password)).rejects.toMatchObject({ kind: 'denied' });
    const link = await confirmationLink(email);
    const verification = await fetch(link, { redirect: 'manual' });
    expect(verification.status).toBe(303);
    const session = await auth.signIn(email, password);
    expect(typeof session.accessToken).toBe('string');
    const identity = await auth.identity(session.accessToken);
    expect(identity.email === email).toBe(true);
    identities.push(identity.id);
    const hash = createHash('sha256').update(randomBytes(32)).digest('hex');
    const appSessionId = randomUUID();
    await db.query('SELECT app_internal.issue_verified_session($1,$2,$3,$4)',
      [session.accessToken, `Synthetic ${label}`, appSessionId, hash]);
    expect((await db.query('SELECT app_internal.session_actor($1) AS actor', [hash])).rows[0].actor).toBe(identity.id);
    await expect(db.query('SELECT * FROM app_internal.auth_verifier')).rejects.toThrow('Database operation unavailable');
    const parts = session.accessToken.split('.');
    const forgedClaims = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    forgedClaims.sub = randomUUID();
    const forged = parts[0] + '.' + Buffer.from(JSON.stringify(forgedClaims)).toString('base64url') + '.' + parts[2];
    await expect(db.query('SELECT app_internal.issue_verified_session($1,$2,$3,$4)',
      [forged, 'Forged', randomUUID(), hash])).rejects.toThrow('Database operation unavailable');
    await expect(auth.signIn(email, randomUUID() + '!Aa9')).rejects.toMatchObject({ kind: 'denied' });
  }
  expect(new Set(identities).size).toBe(2);
  await expect(auth.identity('invalid-test-token')).rejects.toMatchObject({ kind: 'denied' });
}, 30_000);
