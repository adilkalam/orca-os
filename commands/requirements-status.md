---
description: "Check and continue OS 2.0 requirements gathering for the active requirement"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "Bash", "Glob", "Grep",
   "AskUserQuestion", "mcp__project-context__query_context"]
---

# /requirements-status – Check & Continue Requirements

Show current requirements progress and continue the next step.

---

## 1. Locate Active Requirement

1. Read `requirements/.current-requirement`.
2. If none:
   - Inform: `No active requirement gathering session.`
   - Suggest `/requirements-start` or `/requirements-list`.
   - Stop.
3. If present:
   - Load its `metadata.json`.

Display status summary:
- Name, started time, current phase (`discovery`, `context`, `detail`, `spec`, etc.).
- Progress (e.g. `Discovery: 3/5`, `Detail: 0/5`).

---

## 2. Discovery Phase (Phase 2)

If `metadata.phase === "discovery"`:

1. Read `01-discovery-questions.md` and `02-discovery-answers.md` (if exists).
2. Determine next unanswered question (1–5).
3. Ask that question to the user with its default, e.g.:

```text
Q3: Will this feature handle sensitive or private user data?
Default if unknown: Yes – better to assume sensitive by default.
Answer: [yes / no / idk]
```

4. When user answers:
   - Normalize `yes|no|idk`.
   - Write answer to `02-discovery-answers.md`.
   - Update `metadata.progress.discovery.answered`.
5. If all 5 questions answered:
   - Set `metadata.phase = "context"`.
   - Announce: `Discovery phase complete. Starting targeted context analysis...`.

---

## 3. Context Findings (Phase 3)

If `metadata.phase === "context"`:

1. Use ContextBundle (re-query if needed) plus discovery answers to:
   - Identify files likely to change.
   - Find similar features.
   - Note design/tokens/architecture constraints.
2. Write `03-context-findings.md` with sections:
   - `## Files to Touch`
   - `## Similar Features`
   - `## Patterns to Follow`
   - `## Constraints`
3. Update:
   - `metadata.contextFiles`.
   - `metadata.phase = "detail"`.
4. Optionally annotate with Response Awareness tags where helpful (e.g. `#PATH_DECISION`).

---

## 4. Detail Questions (Phase 4)

If `metadata.phase === "detail"`:

1. Ensure `04-detail-questions.md` exists; if not, generate **5** expert-level yes/no questions:
   - Refer to specific files and patterns from `03-context-findings.md`.
   - Speak as if to a non-technical PM.
   - Provide smart defaults and “why” notes.
2. Determine next unanswered question from `04-detail-questions.md` / `05-detail-answers.md`.
3. Ask question with default; accept `yes|no|idk`.
4. Record answer in `05-detail-answers.md`, update `metadata.progress.detail`.
5. Once all 5 answered:
   - Set `metadata.phase = "spec"`.
   - Announce: `Detail phase complete. Ready to generate requirements spec.`

---

## 5. Spec Phase Handoff

If `metadata.phase === "spec"`:
- Explain that `/requirements-end` will now:
  - Generate `06-requirements-spec.md`.
  - Update indexes and metadata.
  - Log decisions to `vibe.db`.
- Suggest the user run `/requirements-end` to finalize, or keep iterating on questions if they want to adjust answers.

