---
id: OS-VTP7H7
title: Stage03 — Account section export HTTP create/download
status: done
priority: medium
labels: []
createdAt: '2026-10-29T12:24:31.503Z'
updatedAt: '2026-10-29T12:26:30.186Z'
completedAt: '2026-10-29T12:26:30.186Z'
timeSpent: 68
assignee: codex
---
# Stage03 — Account section export HTTP create/download

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose actual account profile/preferences artifact via explicit section actions; full My/Shared export stays unavailable. Live session, strict input, digest check, download attachment and independent budgets.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Typed runtime and HTTP create/download return actual own section bytes with no-store attachment.
- [x] #2 Real HTTP proves account isolation, invalid inputs, replay, expiry/revocation and independent limits.
- [x] #3 Lint/typecheck/build pass, commit/push verified.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Extend ExportService and route, grant two functions and forward budgets, run production HTTP acceptance, commit/push/report.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
49d5d251a3a081b8b7efef1efa6cdaab16292fc9 pushed master, SHA verified. Production HTTP1/1 PASS2.7s; lint/typecheck/build/migration/provision/scan pass. Explicit profile/preferences section only. Next UI desktop/mobile actual download, cleanup, full adapters/assembly. Report03.4p.
<!-- SECTION:NOTES:END -->

