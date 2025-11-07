---
description: "RespAwR Build — Implement + verify from an approved blueprint. Alias of /response-awareness-implement."
allowed-tools: ["Task", "Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "Bash", "TodoWrite"]
---

# /respawr -build — Implement & Verify

Implement strictly from an approved blueprint and resolve all tags with real proof.

## Input

Blueprint path (markdown): $ARGUMENTS

## Steps

1) Load the blueprint and allocate focused work packages to implementers.
2) Implement without mutating the plan; tag assumptions with `#COMPLETION_DRIVE`, `#FILE_CREATED`, `#FILE_MODIFIED`, `#SCREENSHOT_CLAIMED`.
3) Capture evidence with helpers: `scripts/capture-build.sh`, `scripts/capture-tests.sh`, `scripts/capture-screenshot.sh`.
4) Run `bash scripts/finalize.sh` to produce `.verified`.

