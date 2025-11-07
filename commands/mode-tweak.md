---
description: "DEPRECATED — Prefer /mode -on (strict) or -off. Tweak mode is unsupported."
allowed-tools: [Bash, exit_plan_mode]
argument-hint: "optional note"
---

# /mode-tweak (DEPRECATED)

Tweak mode is no longer recommended. Use `/mode -on` for strict verification or `/mode -off` to disable checks temporarily.

```bash
bash scripts/verification-mode.sh tweak
```

Tip: Run quick confirm next to refresh `.tweak_verified`.
```bash
bash scripts/design-tweak.sh run
```
