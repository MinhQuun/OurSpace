---
id: OS-TZFCTR
title: Stage03 — Durable own-account export artifact lifecycle
status: done
priority: medium
labels: []
createdAt: '2026-10-29T12:21:26.217Z'
updatedAt: '2026-10-29T12:23:26.359Z'
completedAt: '2026-10-29T12:23:26.359Z'
timeSpent: 66
assignee: codex
---
# Stage03 — Durable own-account export artifact lifecycle

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build on0080: actual UTF8 JSON artifact for explicitly named profile/preferences section, immutable bytes/digest, actor-derived ownership, expiry, idempotent creation and live-session download. Full personal/shared exports remain separate incomplete workflows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Artifact contains actual own-account section bytes with immutable digest and explicit section coverage.
- [x] #2 Create is atomic/idempotent; download checks current owner session and expiry; no public table access.
- [x] #3 Real PostgreSQL tests, lint/typecheck pass; commit pushed and report updated.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Forward migration0081 defines private artifact table and create/read commands; test exact bytes/digest, A/B denial, revoked/expired sessions, expiry, concurrent retry and rollback. Then runtime/HTTP integration follows.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
92221bd50bec2fd8a9a2c1d10946c8d1fdb31a54 pushed master; remote SHA verified. DB regression1/1 PASS7.476s; lint/typecheck/migration/checksum/secret scan PASS. Actual section bytes persisted; not full export. Next runtime/HTTP section create/download, cleanup, full adapters/assembly. Report03.4o.
<!-- SECTION:NOTES:END -->

