---
id: OS-XW4AB9
title: Stage03.4f — Couple Theme accent shared by the Space
status: done
priority: medium
labels:
  - stage03
  - m10
createdAt: '2026-10-29T07:18:04.028Z'
updatedAt: '2026-10-29T07:18:31.107Z'
completedAt: '2026-10-29T07:18:04.028Z'
timeSpent: 1500
assignee: opencode
fulfills:
  - AC-M10-48
  - D20
---
# Stage03.4f — Couple Theme accent shared by the Space

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement M10 D20 / AC-M10-48: Couple Space title and accent colour shared by both members, versioned with history, without writing any member's personal preferences or appearance.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Accent is stored on the Couple Space profile with validation (#rrggbb), copied into revision history, and readable by both members only through the existing membership check.
- [ ] #2 Saving title plus accent uses the same expected-version conflict, command receipt replay and no-success-before-acceptance semantics as the existing Couple Profile update.
- [ ] #3 Changing the Couple accent never writes or alters m10.personal_preferences, so each account's own theme/appearance stays independent.
- [ ] #4 Real desktop Chrome and Pixel7/PostgreSQL tests pass, plus full authenticated regression, database suite, lint, typecheck and build.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Migration 0070_couple_theme_accent.sql adds m10.couple_profiles.accent plus revision accent, replaces read/read_history/update functions and normalises lower(btrim()) with a '#rrggbb' CHECK. UI adds checkbox 'Dùng màu nhấn chung', colour picker, preview band and revision swatch; save button renamed 'Lưu hồ sơ chung' because it now saves both fields. Verified: python scripts/integration_db.py 34/34 PASS; Playwright desktop+mobile 34/34 PASS; http project 10/10 PASS; vitest database profile service PASS; lint/typecheck/build PASS.
<!-- SECTION:NOTES:END -->

