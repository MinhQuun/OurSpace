/** Pure base policy. All inputs must be loaded server-side for this request.
 * Domain guards are mandatory: ownership never implies approval, reveal or seal.
 */
export type ContentAction = 'read' | 'edit' | 'comment' | 'react' | 'export' | 'share' | 'trash';
export type AccessActor = Readonly<{
  id: string;
  accountActive: boolean;
  sessionActive: boolean;
  sessionExpiresAt: number;
}>;
export type ObjectGrant = Readonly<{
  actorId: string;
  actions: readonly ContentAction[];
  revoked: boolean;
  expiresAt: number | null;
}>;
export type ObjectAccess = Readonly<{
  ownerId: string;
  grants: readonly ObjectGrant[];
  trashed: boolean;
}>;
export type AccessDecision = Readonly<{ allowed: boolean; reason: string }>;

const actions: readonly string[] = ['read', 'edit', 'comment', 'react', 'export', 'share', 'trash'];

export function decideObjectAccess(input: {
  actor: AccessActor | null;
  resource: ObjectAccess;
  action: ContentAction;
  now: number;
  domainAllows: boolean;
  relationshipAllows: boolean;
}): AccessDecision {
  const { actor, resource, action, now } = input;
  const deny = (reason: string) => ({ allowed: false, reason });
  if (!Number.isFinite(now) || !actions.includes(action)) return deny('invalid_context');
  if (!actor?.accountActive || !actor.sessionActive || !Number.isFinite(actor.sessionExpiresAt) || actor.sessionExpiresAt <= now) {
    return deny('inactive_identity');
  }
  if (resource.trashed) return deny('trashed'); // Restore uses a distinct domain command.
  if (!input.domainAllows) return deny('domain_guard');
  if (actor.id === resource.ownerId) return { allowed: true, reason: 'owner' };
  if (!input.relationshipAllows) return deny('relationship_guard');
  // Delegation and trash remain owner-only here. Module-specific exceptions need
  // explicit domain contracts; no blanket Editor => share/delete implication.
  if (action === 'share' || action === 'trash') return deny('owner_required');
  const grant = resource.grants.find((candidate) =>
    candidate.actorId === actor.id && !candidate.revoked &&
    (candidate.expiresAt === null || (Number.isFinite(candidate.expiresAt) && candidate.expiresAt > now)) &&
    candidate.actions.includes(action));
  return grant ? { allowed: true, reason: 'explicit_grant' } : deny('private');
}
