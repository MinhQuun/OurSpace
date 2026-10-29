---
id: 4g4auf
title: Permission panel requests must clear loading while active
key: permission-panel-requests-must-clear-loading-while-active
layer: project
category: failure
status: active
confidence: high
lastVerified: '2026-10-29T12:12:54.118Z'
sources:
  - PermissionPanel
tags:
  - permissions
  - playwright
  - ui
createdAt: '2026-10-29T12:12:54.118Z'
updatedAt: '2026-10-29T12:12:54.118Z'
---

`PermissionPanel` uses an `active` flag to suppress state updates after its cleanup aborts request controllers. Its completion and error branches must update state when `active` is true (not `!active`), otherwise the panel remains busy and the refresh action stays disabled.
