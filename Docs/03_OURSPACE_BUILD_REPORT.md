## Task 03.4g — Notification Center and preferences with Quiet Hours
- Acceptance: in-app Notification Center (view/filter/mark read/hidden), preferences per account with independent settings, Quiet Hours per account adjusting delivery only (no business-state deferral), essential security notifications policy separate, source-permission preview only, revoked access blocks old notification content, retry no duplicates, mark-read does not affect Letter/Capsule state, hide does not delete source objects.
- Migration 0071: m10.notifications, m10.notification_preferences, m10.notification_audit with RLS FORCE and no PUBLIC grants; dedup key, expiry, read/hidden timestamps; read/list/unread/mark/read-all/hide and preferences read/update functions. Idempotent command receipts for preference updates.
- Migration 0072: notification request budgets added.
- Runtime: NotificationService + auth-runtime wiring + provision_runtime grants and budgets.
- HTTP: /api/notifications/[action] for list/count/read/read_all/hide/preferences/preferences_update with session/origin/budget validation.
- UI: /account/notifications with Center and Preferences/Quiet Hours (in-app P0), account navigation link added.
- Lint/typecheck PASS. Migrations applied and runtime re-provisioned. Commit 37a0031 pushed to origin/master (verified).
- Remaining Stage03 M10: personalized home, Privacy Inspector, Trash Center, export jobs, backup/recovery center as applicable. Stage03 remains IN_PROGRESS.

Updated: 2026-10-29 (Asia/Saigon)
