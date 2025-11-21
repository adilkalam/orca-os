---
description: "Implement from a blueprint requirements spec using /orca and RA-aware pipelines"
argument-hint: "<path to 06-requirements-spec.md>"
allowed-tools:
  ["Task", "Read", "Grep", "Glob", "Bash",
   "AskUserQuestion", "mcp__project-context__query_context", "mcp__project-context__save_task_history"]
---

# /response-awareness-implement – Execute Blueprint via Orca

Use this when you already have a requirements blueprint (06-requirements-spec.md)
and want to implement it using OS 2.0 pipelines with Response Awareness in mind.

**Argument:** path to an existing `06-requirements-spec.md` file.

---

## 1. Validate Blueprint

1. Verify the provided path exists and is a `06-requirements-spec.md` file under `requirements/`.
2. Read the spec and note:
   - Functional + technical requirements.
   - Explicit file paths.
   - Any RA tags (e.g. `#PATH_DECISION`, `#COMPLETION_DRIVE`, `#POISON_PATH`).

If the spec is missing or clearly incomplete:
- Explain this to the user.
- Suggest rerunning `/response-awareness-plan` or `/requirements-status` first.

---

## 2. Determine Domain & Pipeline

Using:
- The spec content.
- Project structure (e.g. presence of Next.js, Expo, iOS, data stack).

Determine the primary domain:
- `webdev` for frontend/Next-style work.
- `expo` for Expo/React Native mobile.
- `ios` for native Swift/SwiftUI.
- etc.

Confirm domain with the user if ambiguous.

---

## 3. Query ProjectContextServer

Call `mcp__project-context__query_context` with:
- `domain`: chosen domain.
- `task`: a concise description like:
  - `"Implement blueprint: [id] from 06-requirements-spec.md"`.
- `projectPath`: repo root.
- `includeHistory: true`.

Use ContextBundle together with the spec to:
- Identify impacted files/components/modules.
- Load relevant standards and past decisions.

Update `phase_state.json`:
- Set `domain` to the chosen domain.
- Attach the blueprint `spec_path` under an appropriate phase (e.g. planning/spec).

---

## 4. Delegate to /orca and Domain Pipeline

Use OS 2.0’s orchestrator instead of implementing directly:

1. Summarize to the user:
   - Which domain pipeline will be used.
   - That implementation will go through `/orca` with the blueprint as input.

2. In your internal reasoning and instructions, treat the next step as:

```text
Run /orca with a task like:

  "Implement blueprint [id] using requirements spec at [spec_path].
   Respect all RA-tagged decisions and assumptions in the spec.
   Use the [webdev|expo|ios] pipeline with full context from ProjectContextServer."
```

3. While coordinating, ensure:
   - RA tags from the spec are surfaced to domain agents (architect, builders, gates).
   - Implementation summaries and verification steps call out any RA-tagged risk areas explicitly.

You yourself should **not** write production code here; your role is to:
- Validate the blueprint.
- Route to the correct domain pipeline via `/orca`.
- Emphasize RA-tagged concerns for implementation and verification phases.

---

## 5. Completion & Memory

After implementation is complete (once `/orca`/pipelines have run and summarized):

- Encourage logging:
  - `save_task_history` with:
    - `domain`, `task`, `outcome`, `learnings`, `files_modified`.
  - Any new standards that emerged (via `save_standard`) if recurring issues were found.
- If RA tags proved particularly helpful (or misleading), suggest updating
  standards or future requirements prompts to capture that learning.

