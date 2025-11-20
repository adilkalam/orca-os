---
description: "Start OS 2.0 requirements gathering for a feature or change"
argument-hint: "<short feature description>"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "Bash", "Glob", "Grep",
   "AskUserQuestion", "mcp__project-context__query_context", "mcp__project-context__save_decision"]
---

# /requirements-start – Begin Requirements Gathering

Begin gathering requirements for: **$ARGUMENTS**

You are a **requirements orchestrator** for OS 2.0:
- Create the requirements folder and docs.
- Use ProjectContextServer for context-aware questions.
- Do **not** implement any code.

---

## 1. Initialize Requirement Folder

1. Slugify the request (e.g. `"Add user profile picture upload"` → `user-profile-picture-upload`).
2. Create a timestamped folder:
   - `requirements/YYYY-MM-DD-HHMM-[slug]`
3. Inside that folder create:
   - `00-initial-request.md` – write the user’s request and any initial notes.
   - `metadata.json`:
     - `id`, `started`, `lastUpdated`, `status: "active"`, `phase: "discovery"`.
     - `progress.discovery: { answered: 0, total: 5 }`.
     - `progress.detail: { answered: 0, total: 5 }`.
     - `contextFiles: []`, `relatedFeatures: []`.
4. Write the folder name to `requirements/.current-requirement`.
5. Ensure `requirements/index.md` exists; if not, create it with a simple heading and placeholder list.

---

## 2. Query ProjectContextServer (MANDATORY)

Call `mcp__project-context__query_context` with:
- `domain`: infer from the request (`"webdev"`, `"expo"`, `"ios"`, `"data"`, `"seo"`).
- `task`: `$ARGUMENTS`.
- `projectPath`: current repo root.
- `maxFiles`: ~15.
- `includeHistory`: `true`.

Use the ContextBundle to:
- Identify likely relevant files.
- Detect existing features or similar patterns.

Update:
- `metadata.json.contextFiles` with key files.
- `.claude/project/phase_state.json` to add a `requirements` phase:
  - `status: "in_progress"`.
  - `requirement_id`: the slug.
  - `folder`: the requirements folder path.

---

## 3. Generate Discovery Questions (Phase 2)

Create `01-discovery-questions.md` with **exactly 5** high-level yes/no questions:
- Informed by ContextBundle and initial request.
- Focus on:
  - UX surface (web/mobile/other).
  - Data sensitivity.
  - Existing workarounds or related features.
  - Performance / scale expectations.
  - Offline or special constraints.

For each question:
- Provide a **smart default** and document WHY it makes sense.
- Use this format:

```markdown
## Q1: Will users interact with this feature through a visual interface?
**Default if unknown:** Yes – most features have some UI component.
**Why:** This repo is primarily a frontend/mobile codebase; visual flows are standard.
```

Write **all 5** questions to `01-discovery-questions.md` before asking any.

---

## 4. Start Asking Questions (One at a Time)

Begin the discovery phase by:
- Reading `01-discovery-questions.md`.
- Asking **Q1** to the user with its default, and wait for answer:
  - Accept: `yes`, `no`, or `idk` (use default).
- Do **not** record answers yet; `/requirements-status` will drive full progression.

At the end of this command:
- Confirm:
  - The requirement folder and metadata are in place.
  - Discovery questions are written.
  - Q1 has been asked.
  - The user can continue with `/requirements-status`.

