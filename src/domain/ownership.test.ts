import { describe, expect, it } from 'vitest';
import { assertCanonicalWriter, canonicalOwner, type ResourceRef } from './ownership';

describe('canonical domain boundaries', () => {
  it('routes linked finance and calendar writes to the source domain', () => {
    expect(() => assertCanonicalWriter('M04', { type: 'expense', id: 'expense-id' })).toThrow();
    expect(() => assertCanonicalWriter('M03', { type: 'calendar_event', id: 'event-id' })).toThrow();
    expect(() => assertCanonicalWriter('M07', { type: 'expense', id: 'expense-id' })).not.toThrow();
  });
  it('keeps interaction separate from source business commands', () => {
    expect(() => assertCanonicalWriter('M09', { type: 'settlement', id: 'id' })).toThrow();
    expect(() => assertCanonicalWriter('M09', { type: 'capsule', id: 'id' })).toThrow();
  });
  it('distinguishes place wishlist from bucket wish and rejects unknown types', () => {
    expect(canonicalOwner({ type: 'place_wishlist', id: 'id' })).toBe('M03');
    expect(canonicalOwner({ type: 'wish', id: 'id' })).toBe('M06');
    expect(() => canonicalOwner({ type: 'toString', id: 'id' } as unknown as ResourceRef)).toThrow();
  });
});
