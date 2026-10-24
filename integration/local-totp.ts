import { createHmac } from 'node:crypto';

/** Test authenticator only. Secrets remain in memory and never enter assertions. */
export function localTotp(secret: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = secret.replace(/=+$/, '').toUpperCase().split('').map(char => {
    const value = alphabet.indexOf(char);
    if (value < 0) throw new Error('Invalid test authenticator secret');
    return value.toString(2).padStart(5, '0');
  }).join('');
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hash = createHmac('sha1', Buffer.from(bytes)).update(counter).digest();
  const offset = hash[hash.length - 1] & 15;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, '0');
}
