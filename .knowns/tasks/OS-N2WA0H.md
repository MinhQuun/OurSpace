---
id: OS-N2WA0H
title: Stage03 — Own account export data projection
status: done
priority: medium
labels: []
createdAt: '2026-10-29T12:18:45.027Z'
updatedAt: '2026-10-29T12:20:39.162Z'
completedAt: '2026-10-29T12:20:39.162Z'
timeSpent: 98
assignee: codex
---
# Stage03 — Own account export data projection

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
M10 D30/BR73/75: build explicit own-only profile and preference projection for real export assembly. This is one module section, not a complete My Data export/job. No credentials or partner data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Live actor alone selects explicit exportable account profile and preference fields.
- [x] #2 Real DB tests verify A/B isolation, session revocation and no credentials or job completion.
- [x] #3 Lint/typecheck pass, commit/push verified and report scope accurate.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add forward SQL section reader, reuse live-session boundary and explicit allowlists; test execute-only consumer against real PostgreSQL. Full artifact assembly/download and other module adapters follow.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
e3aaf29250c13a001fa996cadcb33044e28733e5 pushed origin/master with exact remote SHA. DB test1/1 PASS5.557s; lint/typecheck/migration/checksums/secret scan PASS. Internal section only; artifact assembly/download, full account/domain coverage and shared export pending. Build Report03.4n.
<!-- SECTION:NOTES:END -->

