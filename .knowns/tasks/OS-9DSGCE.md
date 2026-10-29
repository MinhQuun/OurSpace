---
id: OS-9DSGCE
title: Stage03.4e — Preference settings UI and rendered appearance/accessibility
status: done
priority: medium
labels:
  - stage03
  - m10
createdAt: '2026-10-29T06:40:41.660Z'
updatedAt: '2026-10-29T06:57:47.004Z'
completedAt: '2026-10-29T06:57:47.004Z'
timeSpent: 1018
assignee: opencode
---
# Stage03.4e — Preference settings UI and rendered appearance/accessibility

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Continue 22bc228. Build authenticated settings UI for theme, locale/timezone/date/hour cycle, reduced motion and font scale, and actually render them across pages without changing source data. Verify independent accounts, cross-session persistence, conflict/expiry and desktop/mobile.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Settings form saves theme/locale/timezone/format/hour cycle/reduced motion/font scale with version conflict and retry semantics and no success claim before backend acceptance.
- [x] #2 Light/Dark/System, vi-VN display, reduced motion and font scaling render through the app and do not alter canonical stored dates or partner data.
- [x] #3 Real desktop Chrome and Pixel7 acceptance passes with independent accounts and session expiry; lint/typecheck/build pass.
- [x] #4 Commit pushed with verified remote SHA and Build Report updated.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add settings route/panel following existing couple/profile-sharing patterns; add client preference runtime applying data-theme/data-motion/font-scale and locale formatters; cover real DB/browser tests, then commit/push and report.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Checkpoint slice committed for review: /account/settings form + root preference runtime + vi-VN formatting rewire. Lint/typecheck/build PASS. Browser/PostgreSQL acceptance (theme/system, font scale, reduced motion, account isolation, conflict, expiry, mobile overflow) NOT YET RUN - task stays in-progress. Next: e2e/preferences-ui.spec.ts in desktop+mobile projects, fix findings, verify, then report.

Verification complete. Desktop Chrome + Pixel7 real PostgreSQL tests 2/2 PASS; full authenticated UI regression 34/34 PASS (1.9m); lint/typecheck/build PASS. Commit 8cb17c63ded4e4ecbc87ce97dc360a01f806c8f7 PUSHED to origin/master with remote SHA verified equal (UI slice 7827751). Stage03 remains IN_PROGRESS; next remaining M10 journeys (Couple Theme, personalized home, Privacy Inspector, notification center/preferences/Quiet Hours, Trash Center, exports) then Stage04.
<!-- SECTION:NOTES:END -->

