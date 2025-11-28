---
description: "Unified OS 2.4 planner – requirements + RA blueprint (no implementation)"
argument-hint: "[-tweak] [-complex] <high-level task description>"
allowed-tools:
  ["Task", "Read", "Write", "Edit", "Glob", "Grep",
   "AskUserQuestion", "mcp__project-context__query_context", "mcp__project-context__save_decision"]
---

# /plan – Requirements + Response-Aware Blueprint

Use this command to produce a **blueprint-quality requirements spec** for a task
before running any domain lane (`/orca-nextjs`, `/orca-ios`, `/orca-expo`, etc.).
It combines:
- The OS 2.4 **requirements pipeline** (requirements folder + docs),
- **Response Awareness** tagging (RA tags as per `docs/reference/response-awareness.md`),
- ProjectContextServer for context-aware analysis.

You never implement code from `/plan`; you only plan.

---
## 0. Three-Tier Planning Depth

`/plan` supports three planning depths that match `/orca-*` execution tiers:

| Flag | Planning Depth | Use Case |
|------|----------------|----------|
| (default) | **Standard** – Full discovery + detail questions, complete spec | Most features |
| `-tweak` | **Quick** – 2-3 scope questions, minimal spec | Small changes, config updates |
| `-complex` | **Deep** – Extended analysis, risk assessment, multi-phase breakdown | Architecture changes, refactors |

### Behavior by Tier

**Default (no flag):**
- 5 discovery questions → context findings → 5 detail questions → spec
- Standard `06-requirements-spec.md` output
- Recommended for most feature work

**`-tweak`:**
- Skip discovery phase entirely
- 2-3 quick scope confirmation questions only
- Minimal spec focused on: what changes, where, acceptance criteria
- Fast path: ~2 minutes to spec
- Output: `06-requirements-spec.md` with `tier: tweak` in metadata

**`-complex`:**
- Full discovery + detail phases (10 questions total)
- Extended context analysis with risk assessment
- Multi-phase breakdown in spec (Phase 1, Phase 2, etc.)
- Dependency mapping between phases
- Output: `06-requirements-spec.md` with `tier: complex` in metadata
- May recommend splitting into multiple requirements

### Tier Detection

If no flag is provided, `/plan` will analyze the task and **recommend** a tier:

```
Analyzing: "Add dark mode toggle to settings"
→ Recommended tier: default (standard feature, clear scope)
→ Proceeding with standard planning...
```

```
Analyzing: "Refactor CSS architecture to use design tokens"
→ Recommended tier: -complex (architectural change, multi-file impact)
→ Suggest running: /plan -complex "Refactor CSS architecture..."
→ Proceed with standard planning anyway? [y/n]
```

The user can override the recommendation.

---
## 1. Initialize or Reuse a Requirement

1. If there is NO active requirement:
   - Behave like the old `/requirements-start $ARGUMENTS`:
     - Slugify the request (e.g. `"New onboarding flow"` → `new-onboarding-flow`).
     - Create a timestamped folder:
       - `.claude/requirements/YYYY-MM-DD-HHMM-[slug]`
     - Inside that folder create:
       - `00-initial-request.md` – write the user’s request and any initial notes.
       - `metadata.json` with:
         - `id`, `started`, `lastUpdated`, `status: "active"`, `phase: "discovery"`.
         - `progress.discovery: { answered: 0, total: 5 }`.
         - `progress.detail: { answered: 0, total: 5 }`.
         - `contextFiles: []`, `relatedFeatures: []`.
     - Write the folder name to `.claude/requirements/.current-requirement`.
   - Call `mcp__project-context__query_context` with:
     - `domain`: inferred from the request (e.g. `"nextjs"`, `"ios"`, `"expo"`, `"data"`, `"seo"`, `"shopify"`),
     - `task`: `$ARGUMENTS`,
     - `projectPath`: repo root,
     - `maxFiles`: ~15,
     - `includeHistory`: `true`.
   - Use the ContextBundle to:
     - Identify key files and existing features,
     - Populate `metadata.json.contextFiles`,
     - Initialize `.claude/orchestration/phase_state.json.requirements` with:
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
   - Path: `.claude/requirements/<id>/06-requirements-spec.md`
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

3. Update `.claude/requirements/index.md` with an entry for this requirement.

4. Update `.claude/orchestration/phase_state.json.requirements`:
   - `status: "completed"`,
   - `spec_path`: path to `06-requirements-spec.md`.

5. Call `mcp__project-context__save_decision` with a concise summary:
   - Domain, task description,
   - Key architecture/requirements decisions,
   - Pointer to the spec path.

No production code should be written during `/plan`.

---
## 4. Next Steps – Execute with /orca

After `/plan` completes, suggest the matching `/orca-*` command with the **same tier**:

| Plan Tier | Suggested Next Command |
|-----------|------------------------|
| `-tweak` | `/orca-{domain} -tweak Implement requirement <id>` |
| (default) | `/orca-{domain} Implement requirement <id>` |
| `-complex` | `/orca-{domain} -complex Implement requirement <id>` |

Example output:
```
✓ Spec complete: .claude/requirements/2025-11-27-1430-dark-mode/06-requirements-spec.md
  Tier: default
  Domain detected: nextjs

Suggested next step:
  /orca-nextjs Implement requirement dark-mode
```

The domain `/orca-*` command will:
1. Detect the spec at `.claude/requirements/<id>/06-requirements-spec.md`
2. Read the `tier` from spec metadata and match execution depth
3. Pass the spec + RA tags to the grand architect
4. Treat the spec as **source of truth** for requirements and planning

**Important:** The spec contains RA tags that inform implementation:
- `#PATH_DECISION` - Architectural choices already made
- `#COMPLETION_DRIVE` - Assumptions that need verification
- `#POISON_PATH` - Patterns to avoid
- `#CONTEXT_DEGRADED` - Areas needing extra context gathering

Grand architects should respect these tags and not re-decide settled `#PATH_DECISION` items.

