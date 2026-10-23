import { expect, test } from 'vitest';
import { AuthProvider, AuthProviderError } from './provider.server';

test.each(['http://example.com', 'https://user:password@example.com', 'file:///tmp/auth', 'https://example.com?redirect=evil'])('rejects unsafe provider URL %s', (url) => {
  expect(() => new AuthProvider(url)).toThrow(AuthProviderError);
});

test('rejects invalid credentials before any network request', async () => {
  const provider = new AuthProvider('http://127.0.0.1:1');
  await expect(provider.signIn('bad-email', 'short')).rejects.toMatchObject({ kind: 'invalid_input' });
  await expect(provider.identity('')).rejects.toMatchObject({ kind: 'denied' });
});
