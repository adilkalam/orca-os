---
description: "Unified OS 2.2 planner – requirements + RA blueprint (no implementation)"
argument-hint: "<high-level task description>"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "Glob", "Grep",
   "AskUserQuestion", "mcp__project-context__query_context", "mcp__project-context__save_decision"]
---

# /plan – Requirements + Response-Aware Blueprint

Use this command to produce a **blueprint-quality requirements spec** for a task
before running any domain lane (`/orca-nextjs`, `/orca-ios`, `/orca-expo`, etc.).
It combines:
- The OS 2.2 **requirements pipeline** (requirements folder + docs),
- **Response Awareness** tagging (RA tags as per `docs/reference/response-awareness.md`),
- ProjectContextServer for context-aware analysis.

You never implement code from `/plan`; you only plan.

---
## 1. Initialize or Reuse a Requirement

1. If there is NO active requirement:
   - Behave like the old `/requirements-start $ARGUMENTS`:
     - Slugify the request (e.g. `"New onboarding flow"` → `new-onboarding-flow`).
     - Create a timestamped folder:
       - `requirements/YYYY-MM-DD-HHMM-[slug]`
     - Inside that folder create:
       - `00-initial-request.md` – write the user’s request and any initial notes.
       - `metadata.json` with:
         - `id`, `started`, `lastUpdated`, `status: "active"`, `phase: "discovery"`.
         - `progress.discovery: { answered: 0, total: 5 }`.
         - `progress.detail: { answered: 0, total: 5 }`.
         - `contextFiles: []`, `relatedFeatures: []`.
     - Write the folder name to `requirements/.current-requirement`.
   - Call `mcp__project-context__query_context` with:
     - `domain`: inferred from the request (e.g. `"nextjs"`, `"ios"`, `"expo"`, `"data"`, `"seo"`),
     - `task`: `$ARGUMENTS`,
     - `projectPath`: repo root,
     - `maxFiles`: ~15,
     - `includeHistory`: `true`.
   - Use the ContextBundle to:
     - Identify key files and existing features,
     - Populate `metadata.json.contextFiles`,
     - Initialize `.claude/project/phase_state.json.requirements` with:
       - `status: "in_progress"`,
       - `requirement_id`: the slug,
       - `folder`: the requirements folder path.

2. If there IS an active requirement for the same task:
   - Reuse it and continue from its current phase.

---
## 2. Discovery & Detail with RA Awareness

Operate like the legacy `/requirements-status`, but with **Response Awareness** tags:

- Use RA tags from `docs/reference/response-awareness.md`:
  - `#PATH_DECISION` for important architectural choices,
  - `#COMPLETION_DRIVE` where you must guess due to limited context,
  - `#POISON_PATH` if you notice framing or terminology that leads toward a known-bad pattern,
  - `#CONTEXT_DEGRADED` when context is clearly insufficient.

Phases:

1. **Discovery (5 yes/no questions)**:
   - Generate 5 high-level yes/no questions in `01-discovery-questions.md`:
     - Focus on UX surface, data sensitivity, related features, perf/scale, offline needs.
     - Each question MUST include:
       - A smart default,
       - A short “Why this default makes sense” note.
   - Ask questions using `AskUserQuestion` (never free-form text questions):
     - Normalize answers to yes/no/default,
     - Record them in `02-discovery-answers.md`,
     - Update `metadata.progress.discovery.answered`.
   - When all 5 answered, set `metadata.phase = "context"`.

2. **Context Findings**:
   - Using ContextBundle + code/doc inspection, fill `03-context-findings.md`:
     - Note relevant files, patterns, standards, and risks.
     - Tag key decisions and risks with RA tags where helpful.
   - Set `metadata.phase = "detail"` when context findings are in a good state.

3. **Detail Questions (5 yes/no questions)**:
   - Create `04-detail-questions.md` with 5 PM/architect-level yes/no questions tied to concrete code paths/files.
   - Ask them with `AskUserQuestion` (same pattern as discovery).
   - Record answers in `05-detail-answers.md`, update `metadata.progress.detail.answered`.
   - Use RA tags where:
     - There are hard tradeoffs (`#PATH_DECISION`),
     - Context is thin (`#CONTEXT_DEGRADED` / `#COMPLETION_DRIVE`).

At the end of this phase, the requirements folder should contain:
- Initial request, questions/answers,
- Context findings with RA tags,
- Updated `metadata.json` tracking progress.

---
## 3. Generate Blueprint `spec.md`

When enough questions are answered (or the user explicitly asks for a blueprint):

1. Generate a blueprint-style spec file:
   - Path: `requirements/<id>/06-requirements-spec.md`
   - Contents:
     - Problem statement and solution overview,
     - Functional requirements,
     - Technical requirements with specific file paths/patterns,
     - Explicit list of RA-tagged decisions:
       - All `#PATH_DECISION` points and chosen paths,
       - Assumptions with `#COMPLETION_DRIVE`,
       - Any `#POISON_PATH` warnings or mitigations.
     - Acceptance criteria.

2. Update `metadata.json`:
   - `status: "complete"` (or `"blueprint"`),
   - `phase: "complete"`,
   - `lastUpdated`.

3. Update `requirements/index.md` with an entry for this requirement.

4. Update `.claude/project/phase_state.json.requirements`:
   - `status: "completed"`,
   - `spec_path`: path to `06-requirements-spec.md`.

5. Call `mcp__project-context__save_decision` with a concise summary:
   - Domain, task description,
   - Key architecture/requirements decisions,
   - Pointer to the spec path.

No production code should be written during `/plan`.

---
## 4. Next Steps – Domain Lanes

After `/plan` completes, suggest:

- For Next.js:
  - `/orca-nextjs "Implement requirement <id> using spec at requirements/<id>/06-requirements-spec.md"`
- For iOS:
  - `/orca-ios "Implement requirement <id> using spec at requirements/<id>/06-requirements-spec.md"`
- For Expo/mobile:
  - `/orca-expo "Implement requirement <id> using spec at requirements/<id>/06-requirements-spec.md"`

Domain lanes should:
- Treat `06-requirements-spec.md` as the **source of truth** for `requirements_impact` + `planning`,
- Use RA tags inside the spec to understand decisions, assumptions, and risks.

