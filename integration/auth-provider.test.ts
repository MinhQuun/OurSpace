import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterAll, expect, test } from 'vitest';
import { AuthProvider } from '../src/modules/m10/auth/provider.server';
import { createDatabase } from '../src/server/database.server';
import { SessionService } from '../src/modules/m10/auth/session.server';
import { localTotp } from './local-totp';

const auth = new AuthProvider('http://127.0.0.1:55433');
const db = createDatabase(`postgresql://ourspace_runtime:${readFileSync('.local/runtime-db-password', 'utf8').trim()}@127.0.0.1:55432/ourspace`);
afterAll(() => db.close());
const sessions = new SessionService(db, auth);

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
  let foreignRecoveryCode = '';
  const issued: Awaited<ReturnType<SessionService['login']>>[] = [];
  for (const label of ['a', 'b']) {
    const email = `provider-${label}-${randomUUID()}@ourspace.test`;
    const password = randomUUID() + '!Aa9';
    await auth.signUp(email, password);
    await expect(auth.signIn(email, password)).rejects.toMatchObject({ kind: 'denied' });
    await expect(sessions.login(email, password, 'Synthetic')).rejects.toMatchObject({ kind: 'denied' });
    const link = await confirmationLink(email);
    const verification = await fetch(link, { redirect: 'manual' });
    expect(verification.status).toBe(303);
    const session = await auth.signIn(email, password);
    expect(typeof session.accessToken).toBe('string');
    const identity = await auth.identity(session.accessToken);
    expect(identity.email === email).toBe(true);
    identities.push(identity.id);
    const current = await sessions.login(email, password, `Synthetic ${label}`);
    issued.push(current);
    expect(await sessions.actor(current.token)).toBe(identity.id);
    const other = await sessions.login(email, password);
    expect(other.token === current.token).toBe(false);
    expect(await sessions.revoke(current.token, other.id)).toBe(true);
    expect(await sessions.actor(other.token)).toBeNull();
    const additional = await sessions.login(email, password);
    const ownList = await sessions.list(current.token);
    expect(ownList.some(item => item.id === current.id && item.is_current)).toBe(true);
    expect(ownList.some(item => item.id === additional.id && !item.is_current)).toBe(true);
    expect(await sessions.revokeOthers(current.token)).toBe(1);
    expect(await sessions.actor(additional.token)).toBeNull();
    expect(await sessions.actor(current.token)).toBe(identity.id);
    expect(await sessions.revokeOthers(current.token)).toBe(0);
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
    if (label === 'a') {
      const factor = await auth.enrollTotp(session.accessToken);
      const challenge = await auth.challengeTotp(session.accessToken, factor.id);
      const wrongCode = String((Number(localTotp(factor.secret)) + 1) % 1000000).padStart(6, '0');
      await expect(auth.verifyTotp(session.accessToken, factor.id, challenge, wrongCode)).rejects.toMatchObject({ kind: 'denied' });
      const verified = await auth.verifyTotp(session.accessToken, factor.id, challenge, localTotp(factor.secret));
      expect((await auth.identity(verified.accessToken)).id).toBe(identity.id);
      await expect(auth.verifyTotp(session.accessToken, factor.id, challenge, localTotp(factor.secret))).rejects.toMatchObject({ kind: 'denied' });
      expect((await auth.identity(session.accessToken)).mfaRequired).toBe(true);
      await expect(sessions.login(email, password)).rejects.toMatchObject({ kind: 'mfa_required' });
      const recoveryProbe = await fetch('http://127.0.0.1:55433/factors/recovery-codes', {
        headers: { Authorization: `Bearer ${verified.accessToken}` },
      });
      expect(recoveryProbe.status).toBe(404);
      expect((await recoveryProbe.json()).error_code).toBe('mfa_factor_not_found');
      const low = await auth.signIn(email, password);
      await expect(auth.generateRecoveryCodes(low.accessToken)).rejects.toMatchObject({ kind: 'denied' });
      const codes = await auth.generateRecoveryCodes(verified.accessToken);
      const status = await auth.recoveryStatus(verified.accessToken);
      expect(status.remaining).toBe(codes.length);
      const redeemed = await auth.verifyRecoveryCode(low.accessToken, codes[0]);
      expect((await auth.identity(redeemed.accessToken)).id).toBe(identity.id);
      await expect(auth.verifyRecoveryCode(low.accessToken, codes[0])).rejects.toMatchObject({ kind: 'denied' });
      expect((await auth.recoveryStatus(verified.accessToken)).remaining).toBe(codes.length - 1);
      const concurrent = await Promise.allSettled([
        auth.verifyRecoveryCode(low.accessToken, codes[1]), auth.verifyRecoveryCode(low.accessToken, codes[1]),
      ]);
      expect(concurrent.filter(result => result.status === 'fulfilled').length).toBe(1);
      expect(concurrent.filter(result => result.status === 'rejected').length).toBe(1);
      const rotated = await auth.generateRecoveryCodes(verified.accessToken, true);
      foreignRecoveryCode = rotated[1];
      await expect(auth.verifyRecoveryCode(low.accessToken, codes[2])).rejects.toMatchObject({ kind: 'denied' });
      expect((await auth.recoveryStatus(verified.accessToken)).remaining).toBe(rotated.length);
      const recovered = await auth.verifyRecoveryCode(low.accessToken, rotated[0]);
      expect((await auth.identity(recovered.accessToken)).id).toBe(identity.id);
      const recoveryLogin = await sessions.login(email, password, undefined, { method: 'recovery', code: rotated[2] });
      expect(await sessions.actor(recoveryLogin.token)).toBe(identity.id);
      await expect(sessions.login(email, password, undefined, { method: 'recovery', code: rotated[2] })).rejects.toMatchObject({ kind: 'denied' });
      await expect(sessions.login(email, password, undefined, { method: 'totp', code: '123456', factorId: randomUUID() })).rejects.toMatchObject({ kind: 'denied' });
      const totpLogin = await sessions.login(email, password, undefined, { method: 'totp', code: localTotp(factor.secret) });
      expect(await sessions.actor(totpLogin.token)).toBe(identity.id);
    } else {
      await expect(auth.verifyRecoveryCode(session.accessToken, foreignRecoveryCode)).rejects.toMatchObject({ kind: 'denied' });
    }
  }
  expect(new Set(identities).size).toBe(2);
  expect(await sessions.revoke(issued[0].token, issued[1].id)).toBe(false);
  expect((await sessions.list(issued[0].token)).some(item => item.id === issued[1].id)).toBe(false);
  expect(await sessions.revoke(issued[0].token, issued[0].id)).toBe(true);
  expect(await sessions.actor(issued[0].token)).toBeNull();
  expect(await sessions.actor(issued[1].token)).toBe(identities[1]);
  expect(await sessions.actor('malformed')).toBeNull();
  await expect(auth.identity('invalid-test-token')).rejects.toMatchObject({ kind: 'denied' });
}, 30_000);

test('provider cancellation and MFA removal enforce ownership and step-up', async () => {
  const email = `lifecycle-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + '!Aa9';
  await auth.signUp(email, password);
  expect((await fetch(await confirmationLink(email), { redirect: 'manual' })).status).toBe(303);
  const initial = await auth.signIn(email, password);
  const pending = await auth.enrollTotp(initial.accessToken);
  expect((await auth.identity(initial.accessToken)).mfaRequired).toBe(false);
  await auth.unenrollFactor(initial.accessToken, pending.id);
  await expect(auth.challengeTotp(initial.accessToken, pending.id)).rejects.toMatchObject({ kind: 'denied' });
  await expect(auth.unenrollFactor(initial.accessToken, pending.id)).rejects.toMatchObject({ kind: 'denied' });
  const factor = await auth.enrollTotp(initial.accessToken);
  const challenge = await auth.challengeTotp(initial.accessToken, factor.id);
  const elevated = await auth.verifyTotp(initial.accessToken, factor.id, challenge, localTotp(factor.secret));
  const codes = await auth.generateRecoveryCodes(elevated.accessToken);
  const low = await auth.signIn(email, password);
  await expect(auth.unenrollFactor(low.accessToken, factor.id)).rejects.toMatchObject({ kind: 'denied' });
  await expect(auth.deleteRecoveryCodes(low.accessToken)).rejects.toMatchObject({ kind: 'denied' });
  expect((await auth.recoveryStatus(elevated.accessToken)).remaining).toBe(codes.length);
  const otherEmail = `lifecycle-other-${randomUUID()}@ourspace.test`;
  await auth.signUp(otherEmail, password);
  expect((await fetch(await confirmationLink(otherEmail), { redirect: 'manual' })).status).toBe(303);
  const other = await auth.signIn(otherEmail, password);
  await expect(auth.unenrollFactor(other.accessToken, factor.id)).rejects.toMatchObject({ kind: 'denied' });
  expect((await auth.identity(elevated.accessToken)).mfaRequired).toBe(true);
  await auth.deleteRecoveryCodes(elevated.accessToken);
  await expect(auth.recoveryStatus(elevated.accessToken)).rejects.toMatchObject({ kind: 'denied' });
  await expect(auth.verifyRecoveryCode(low.accessToken, codes[0])).rejects.toMatchObject({ kind: 'denied' });
  await auth.unenrollFactor(elevated.accessToken, factor.id);
  const fresh = await auth.signIn(email, password);
  expect((await auth.identity(fresh.accessToken)).mfaRequired).toBe(false);
  await expect(auth.challengeTotp(fresh.accessToken, factor.id)).rejects.toMatchObject({ kind: 'denied' });
}, 30_000);
