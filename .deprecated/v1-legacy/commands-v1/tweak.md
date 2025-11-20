---
description: Quick Tweak Mode — run fast confirmation without heavy gates (no screenshots)
allowed-tools: [Bash, AskUserQuestion, exit_plan_mode]
argument-hint: "optional note about what you’re tweaking"
---

# /tweak — Quick Confirm Flow

Purpose: Switch to Tweak Mode and run quick confirm so you can iterate fast. This writes `.tweak_verified` and runs the Design UI Guard in warn-only mode.

## Steps

1) Set Tweak Mode (accepts `.tweak_verified`):
```bash
bash scripts/verification-mode.sh tweak
```

2) Run Quick Confirm (diffs + guard, no screenshots required):
```bash
bash scripts/design-tweak.sh run
```

3) Commit normally when ready.

Notes:
- Toggle guard warnings during exploration:
```bash
bash scripts/design-tweak.sh guard off
# Later
bash scripts/design-tweak.sh guard warn
```
- Switch back to strict later:
```bash
bash scripts/verification-mode.sh strict
```

