---
description: "Toggle verification mode: /mode -on (strict) or /mode -off (disable checks)"
allowed-tools: [Bash, exit_plan_mode]
argument-hint: "-on | -off [optional note]"
---

# /mode — Toggle Verification

Simple toggle for verification behavior.

## Usage

```bash
# Enable strict mode (requires .verified from finalize before commit/push)
/mode -on

# Disable verification hooks (no .verified required)
/mode -off
```

Under the hood:
- `-on` runs `bash scripts/verification-mode.sh strict`
- `-off` runs `bash scripts/verification-mode.sh off`

Tip: To finalize quickly for prototypes, you can lower the bar per run:
```bash
FINALIZE_PROFILE=prototype bash scripts/finalize.sh
```

