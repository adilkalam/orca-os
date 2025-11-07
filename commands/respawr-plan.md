---
description: "RespAwR Plan — Plan-only mode. Alias of /response-awareness-plan."
allowed-tools: ["Task", "Read", "Grep", "Glob", "AskUserQuestion"]
---

# /respawr -plan — Plan Only

Produce an implementation blueprint using parallel planning and synthesis, then pause for approval.

## Task

Feature/Request: $ARGUMENTS

## Steps

1) (Optional) Survey unfamiliar code to map domains and interfaces.
2) Run parallel domain planners; record `#PATH_DECISION` with rationale.
3) Synthesize into a single blueprint with explicit interfaces + risks.
4) AskUserQuestion with the blueprint; wait for approval before any code changes.

Tip: After approval, run `/respawr -build <path-to-blueprint.md>`.

