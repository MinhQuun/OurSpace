import { randomUUID } from 'node:crypto';
import { expect, test } from 'vitest';
import { AuthProvider } from '../src/modules/m10/auth/provider.server';

const auth = new AuthProvider('http://127.0.0.1:55433');

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
    await expect(auth.signIn(email, randomUUID() + '!Aa9')).rejects.toMatchObject({ kind: 'denied' });
  }
  expect(new Set(identities).size).toBe(2);
  await expect(auth.identity('invalid-test-token')).rejects.toMatchObject({ kind: 'denied' });
}, 30_000);
