---
description: "Plan a complex change using Response Awareness + OS 2.0 requirements (no implementation yet)"
argument-hint: "<high-level task description>"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "Glob", "Grep",
   "AskUserQuestion", "mcp__project-context__query_context", "mcp__project-context__save_decision"]
---

# /response-awareness-plan – RA-Mode Requirements & Blueprint

Use the Response Awareness mindset to produce a **blueprint-quality requirements spec**
for a complex task, without writing any implementation code.

You combine:
- The **Requirements Pipeline** (`requirements/00–06` docs).
- Response Awareness tags (see `docs/reference/response-awareness.md`).
- ProjectContextServer for context-aware analysis.

---

## 1. Start or Reuse a Requirement

1. If there is no active requirement:
   - Behave like `/requirements-start $ARGUMENTS`, creating:
     - A new `requirements/YYYY-MM-DD-HHMM-[slug]` folder.
     - `00-initial-request.md`, `metadata.json`, `.current-requirement`.
   - Call `ProjectContextServer.query_context` for initial context.
2. If there *is* an active requirement for the same task:
   - Reuse it and continue.

Update `.claude/project/phase_state.json` `requirements` phase to:
- `status: "in_progress"`.
- `requirement_id`, `folder`.

---

## 2. Discovery & Detail with RA Awareness

Operate like `/requirements-status`, but with extra emphasis on:

- Marking notable decisions and uncertainties with RA tags:
  - Use `#PATH_DECISION` when choosing between plausible approaches.
  - Use `#COMPLETION_DRIVE` for assumptions based on “best guess”.
  - Use `#POISON_PATH` if you notice terminology or framing that might bias you toward a known-bad pattern.

Phases:

1. **Discovery (5 yes/no questions)**:
   - Ask high-level yes/no questions with defaults (as in the requirements pipeline).
   - Keep them focused and short; use `idk` → default if needed.

2. **Context Findings**:
   - Use ContextBundle plus code inspection to fill `03-context-findings.md`.
   - Tag key decisions and risks with RA tags where helpful.

3. **Detail Questions (5 yes/no questions)**:
   - Ask PM-style expert questions tied to specific code paths/files.
   - Use RA tags for:
     - Hard tradeoffs (`#PATH_DECISION`).
     - Areas where context is thin (`#CONTEXT_DEGRADED`/`#COMPLETION_DRIVE`).

At the end of this command, you may not fully finish all phases; the user can
run `/requirements-status` to continue or `/response-awareness-plan` again to pick up.

---

## 3. Blueprint-Oriented Spec Generation

When the user indicates that planning is complete (or explicitly asks for a blueprint):

1. Generate a **blueprint-style** `06-requirements-spec.md` that:
   - Contains:
     - Problem statement and solution overview.
     - Functional + technical requirements.
     - Explicit file paths and patterns to follow.
     - Clear list of `#PATH_DECISION` points and chosen paths.
     - Assumptions flagged with `#COMPLETION_DRIVE` where applicable.
   - Is structured so `/orca` and domain pipelines can consume it directly.

2. Update `metadata.json`:
   - `status: "complete"` (or `"blueprint"` if you wish to distinguish).
   - `phase: "complete"`.

3. Update `requirements/index.md`.

4. Update `phase_state.json` requirements phase:
   - `status: "completed"`.
   - `spec_path`: blueprint file path.

5. Record a `save_decision` via `mcp__project-context__save_decision` summarizing:
   - The main architecture/requirements decisions.
   - Any notable RA-tagged choices.

No implementation code should be written in this command.

---

## 4. Next Step

After a blueprint is ready, suggest:
- `/response-awareness-implement requirements/.../06-requirements-spec.md`
  to drive implementation via `/orca` and the appropriate domain pipeline.

