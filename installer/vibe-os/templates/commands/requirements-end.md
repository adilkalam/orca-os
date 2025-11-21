---
description: "End OS 2.0 requirements gathering for the current requirement"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "AskUserQuestion",
   "mcp__project-context__save_decision"]
---

# /requirements-end – Finalize Requirements

End the current requirements session and decide how to handle the spec.

---

## 1. Resolve Active Requirement

1. Read `requirements/.current-requirement`.
2. If none:
   - Show: `No active requirement to end.`
   - Stop.
3. Load its `metadata.json` and current phase.

Show a brief status and ask:

```text
⚠️ Ending requirement: [name]
Current phase: [phase] ([discovery/detail progress])

What would you like to do?
1. Generate spec with current information
2. Mark as incomplete for later
3. Cancel and delete
```

Accept the user’s choice before proceeding.

---

## 2. Option 1 – Generate Spec

If user chooses **1**:

1. Create or overwrite `06-requirements-spec.md` with:
   - Overview (problem + solution summary).
   - Functional requirements (from all answered questions).
   - Technical requirements with specific file paths (from findings).
   - Assumptions for any unanswered questions (prefixed `ASSUMED:`).
   - Implementation notes.
   - Acceptance criteria.
2. Update `metadata.json`:
   - `status: "complete"`.
   - `phase: "complete"`.
   - `lastUpdated`.
3. Append/update entry in `requirements/index.md`.
4. Clear `requirements/.current-requirement`.
5. Update `.claude/project/phase_state.json` `requirements` phase:
   - `status: "completed"`.
   - `spec_path`: path to `06-requirements-spec.md`.
6. Call `mcp__project-context__save_decision` with a concise decision summary:
   - Domain, task description, key requirements, and links to spec.

---

## 3. Option 2 – Mark Incomplete

If user chooses **2**:

1. Update `metadata.json`:
   - `status: "incomplete"`.
   - `lastUpdated`.
2. Keep `requirements/.current-requirement` or clear it based on user preference.
3. Update `requirements/index.md` with an “incomplete” entry.

---

## 4. Option 3 – Cancel and Delete

If user chooses **3**:

1. Confirm deletion explicitly.
2. If confirmed:
   - Delete the requirement folder.
   - Clear `requirements/.current-requirement`.
   - Remove any entry from `requirements/index.md`.

---

## 5. Next Steps

After completion:
- Suggest using `/orca` with the new spec, e.g.:
  - `/orca "Implement [id] using requirements/spec at requirements/YYYY-MM-DD-HHMM-[slug]/06-requirements-spec.md"`

