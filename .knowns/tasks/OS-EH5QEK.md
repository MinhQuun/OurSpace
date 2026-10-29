---
id: OS-EH5QEK
title: Stage03 — Bounded expired export artifact cleanup
status: done
priority: medium
labels: []
createdAt: '2026-10-29T12:30:33.025Z'
updatedAt: '2026-10-29T12:34:41.806Z'
completedAt: '2026-10-29T12:34:41.806Z'
timeSpent: 123
assignee: codex
---
# Stage03 — Bounded expired export artifact cleanup

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Delete only expired temporary account export artifacts using database clock, preserve original account data and command/audit history. Operator-only maintenance; no browser execution grant.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bounded cleanup removes expired artifacts only, supports concurrent workers and preserves source/history.
- [x] #2 Real PostgreSQL validates rollback, permissions, repeated/concurrent cleanup and batch validation.
- [x] #3 Local maintenance command and checks pass; commit/push verified.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Migration0083 adds expiry index and restricted SKIP LOCKED cleanup, local bounded runner, real DB test, checks and commit/push/report.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
33b1e321161fabd3b4f69cacf0614b698ef1bd8e pushed master, remote SHA verified. DB1/1 PASS5.479s; lint/typecheck/compile/migrate/scan pass. Local batch removed1 expired artifact. Operator-only, production scheduling not implemented. Knowns LSP timed out; filesystem fallback used, no code work lost. Report03.4r.
<!-- SECTION:NOTES:END -->

