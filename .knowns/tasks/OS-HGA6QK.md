---
id: OS-HGA6QK
title: Stage03 — Account section export desktop/mobile download UI
status: done
priority: medium
labels: []
createdAt: '2026-10-29T12:27:14.526Z'
updatedAt: '2026-10-29T12:29:39.851Z'
completedAt: '2026-10-29T12:29:39.851Z'
timeSpent: 103
assignee: codex
---
# Stage03 — Account section export desktop/mobile download UI

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose actual profile/preferences JSON download with explicit limited coverage, safe retry and session-error handling. Full export still incomplete.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 UI creates and downloads actual section with accurate scope and expiry guidance.
- [x] #2 Desktop/mobile browser tests inspect downloaded JSON and session-revocation behavior.
- [x] #3 Lint/typecheck/build pass; commit/push verified.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add focused export section panel, retain job history, make unsupported full export unavailable explicitly; real browser download tests and commit/push.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
e303d7af9a58a56a7a098fb1c9842cc1a24044c7 pushed master and remote SHA verified. Real desktop/mobile download2/2 PASS4.3s; lint/typecheck/build/scan pass. Accurate section coverage; full personal/shared export remains unavailable pending complete implementation. Report03.4q.
<!-- SECTION:NOTES:END -->

