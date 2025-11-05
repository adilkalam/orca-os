---
description: "Plan-only mode: produce and confirm a response-awareness blueprint"
allowed-tools: ["Task", "Read", "Grep", "Glob", "AskUserQuestion"]
---

# Response Awareness – Plan Only

Produce an implementation blueprint using parallel planning and synthesis, then pause for approval.

## Task

Feature/Request: $ARGUMENTS

## Steps

1) (Optional) Survey unfamiliar code to map domains and interfaces.
2) Run parallel domain planners; record `#PATH_DECISION` with rationale.
3) Synthesize into a single blueprint with explicit interfaces and risks.
4) AskUserQuestion with the blueprint; wait for confirmation before any code changes.

