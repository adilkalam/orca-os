---
description: "View full OS 2.0 requirements context for the active requirement"
allowed-tools: ["Read", "Glob", "Grep"]
---

# /requirements-current – View Active Requirement

Display a detailed view of the current requirement without advancing phases.

---

## 1. Resolve Active Requirement

1. Read `requirements/.current-requirement`.
2. If none:
   - Show: `No active requirement.`
   - Optionally list last 3 completed requirements (from `requirements/index.md`).
   - Stop.

3. If present:
   - Load all files in that folder:
     - `00-initial-request.md`
     - `01-discovery-questions.md`
     - `02-discovery-answers.md`
     - `03-context-findings.md`
     - `04-detail-questions.md`
     - `05-detail-answers.md`
     - `06-requirements-spec.md` (if exists)
   - Load `metadata.json`.

---

## 2. Render Summary

Present a read-only overview including:

- Requirement name, age, and phase.
- Progress metrics from `metadata.json`.
- Initial request text.
- High-level codebase overview from `03-context-findings.md` (if present).
- Discovery and detail questions + answers so far.
- Current next step (e.g., “Continue with /requirements-status” or “Run /requirements-end to finalize spec”).

Do not ask new questions or modify any files in this command.

