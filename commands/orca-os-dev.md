---
description: "OS 2.4 orchestrator entrypoint for OS / Claude Code configuration tasks (LOCAL to this repo)"
argument-hint: "[-tweak] <task description or requirement ID>"
allowed-tools:
  - Task
  - AskUserQuestion
  - mcp__project-context__query_context
  - mcp__project-context__save_decision
  - mcp__project-context__save_task_history
  - Read
  - Bash
  - Grep
  - Glob
---

# /orca-os-dev – OS / Tooling Orchestrator (OS 2.4)

Use this command when the task is clearly OS / Claude Code / tooling
configuration work for **Vibe OS 2.x**, not application code.

**IMPORTANT: This command is LOCAL to claude-vibe-config repo only.**
It is NOT deployed to `~/.claude` global config. Use `/orca-os-dev` only
when working in this repository to modify the OS itself.

## Usage

```bash
/orca-os-dev "update nextjs pipeline config"            # Default: light path + design gates
/orca-os-dev -tweak "fix command description"           # Fast: light path, no gates
/orca-os-dev --complex "overhaul memory architecture"   # Full: grand-architect + all gates
```

Examples:

- Adjust lane/phase config behavior (Next.js, iOS, etc.)
- Add or update commands/agents/skills used by OS 2.2
- Configure MCP servers and integrate them into OS 2.2 lanes
- Change how memory and context are used by `/plan` / `/orca` / `/audit`

The OS-Dev lane is described in:
- `docs/pipelines/os-dev-pipeline.md`
- `docs/reference/phase-configs/os-dev-phase-config.yaml`

## 🚨 CRITICAL ROLE BOUNDARY 🚨

**YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE CONFIG OR CODE.**

If the user interrupts with questions, clarifications, or test results:

- **REMAIN IN ORCHESTRATOR MODE**
- **DO NOT start editing files yourself**
- **DO NOT bypass the agent system**
- Process the input and **DELEGATE to the appropriate agent via Task tool**
- Update phase_state.json to reflect new information
- Resume orchestration where you left off

If you find yourself about to use Edit/Write tools directly: **STOP.**
Your only job is to coordinate agents via `Task`.

---

## 0. Parse Arguments & Detect Mode

**Check for flags:**
```
$ARGUMENTS contains "-tweak" → Fast path (light, no gates)
$ARGUMENTS contains "--complex" → Full path (grand-architect, all gates)
No flag → Default path (light + design gates)
```

---

## 1. Flag Routing

### Default (no flag) - Light Path WITH Standards Gate

Delegate to `os-dev-builder` with standards check:

```
Task({
  subagent_type: 'os-dev-builder',
  description: 'OS-Dev task with standards verification',
  prompt: `
Handle this OS-Dev configuration task via the light path WITH standards gate.

REQUEST: $ARGUMENTS

ROUTING MODE: default (light + standards gate)
- Plan and implement changes
- Run os-dev-standards-enforcer gate
- Ephemeral phase_state only (scores for this run, no ceremony)
- NO grand-architect, NO spec requirement
  `
})
```

After builder completes, run `os-dev-standards-enforcer` to validate.

---

### -tweak Flag - Light Path WITHOUT Gates (Pure Speed)

1. Memory-first context only
2. Delegate directly to `os-dev-builder`
3. Basic verification only
4. NO standards gate

```
Task({
  subagent_type: 'os-dev-builder',
  description: 'Fast OS-Dev tweak (no gates)',
  prompt: `
Quick OS-Dev fix without standards verification.

REQUEST: $ARGUMENTS

ROUTING MODE: tweak (pure speed)
- Make the change
- Basic verification only
- NO gates, NO standards check
  `
})
```

---

### --complex Flag - Full Pipeline (Grand-Architect + All Gates)

Continue with full orchestration below.

**0) Team Confirmation (MANDATORY - BLOCKING)**

**DO NOT PROCEED TO STEP 1 WITHOUT USER CONFIRMATION**

Use `AskUserQuestion` to confirm. **WAIT FOR RESPONSE.**

```
Detected: OS-Dev task (complexity: complex)

Proposed Pipeline:
1. Intake & Complexity
2. Memory-First Context
3. ProjectContext Query
4. Requirements Spec (if complex)
5. Planning (os-dev-architect)
6. Implementation (os-dev-builder)
7. Standards Gate (os-dev-standards-enforcer)
8. Verification (os-dev-verification)

Proposed Agents:
- os-dev-grand-architect
- os-dev-architect (planning)
- os-dev-builder (implementation)
- os-dev-standards-enforcer (gates)
- os-dev-verification (verification)

Options:
- Proceed as planned
- Adjust team/phases
- Switch to light path (-tweak)
```

**After presenting this:**
1. STOP and wait for user response
2. If user says "proceed" → continue to Step 1
3. If user modifies team → update and re-confirm
4. If user rejects → STOP pipeline

**Anti-patterns (WRONG):**
- Showing the team then immediately delegating to grand-architect
- "I'll proceed with this team..." without waiting
- Any delegation before explicit user confirmation

---

### 1) Intake & Complexity

1. Set `complexity_tier`: `complex`
2. Write `phase_state.intake` in `.claude/orchestration/phase_state.json`:
   - `task_summary`: short description
   - `complexity_tier`: "complex"
   - `initial_risks`: brief notes on perceived risk

Then delegate to `os-dev-grand-architect` via `Task` with current `phase_state`.

---

### 2) Memory-First Context

Working with `os-dev-grand-architect`:

1. Use `Bash` to call the unified memory search script (if available) or equivalent:

   ```bash
   python3 ~/.claude/scripts/memory-search-unified.py "$TASK_SUMMARY" --mode all --top-k 10 || true
   ```

2. Summarize:
   - Relevant Workshop decisions/gotchas for OS-Dev (domain `"os-dev"`).
   - Relevant vibe.db matches for config/OS-Dev files.
3. Write `phase_state.context_query.memory_summary`.

If the script is unavailable, note this and continue with ProjectContext.

---

### 3) ProjectContext Query (Cached)

Call `mcp__project-context__query_context`:

- `domain: "os-dev"`
- `task`: short summary
- `projectPath`: repo root
- `maxFiles`: 10–15
- `includeHistory: true`

Assume SharedContext caching is configured at the MCP layer; do not call this
multiple times unnecessarily.

Write a brief `context_bundle_summary` into `phase_state.context_query`.

---

### 4) Requirements Spec (Complex Only)

For `complex` changes:

1. Resolve or ask for a requirements ID:
   - If the user passed an explicit requirement ID, use it.
   - Otherwise, ask via `AskUserQuestion` whether there is an existing requirement spec.
2. Look for:

   - `.claude/requirements/<id>/06-requirements-spec.md`

3. If not found:
   - Explain that complex OS-Dev work requires a spec.
   - Instruct the user to run:

     ```text
     /plan "Short description of the OS-Dev change"
     ```

   - Then stop the lane until a spec exists.
4. If found:
   - Set `phase_state.requirement_id` and `phase_state.requirements_spec_path`.

For `simple` and `medium` tasks, specs are optional but encouraged.

---

### 5) Planning – OS-Dev Architect

Delegate to `os-dev-architect` via `Task`:

- Inputs:
  - User request
  - `complexity_tier`
  - `phase_state.context_query` (memory + ContextBundle summary)
  - `requirements_spec_path` (if present)
  - OS-Dev knowledge skill (implicitly)

Expect `os-dev-architect` to populate `phase_state.planning`:

- `plan_summary`
- `files_targeted`
- `change_type`
- `risk_assessment`
- `complexity_tier`
- `ra_events`

---

### 6) Implementation – Pass 1 (OS-Dev Builder)

Delegate to `os-dev-builder`:

- Inputs:
  - Planning outputs.

Expect `phase_state.implementation_pass1` to be populated:

- `files_modified`
- `changes_manifest`
- `rollback_notes`
- `ra_events`

Ensure `files_modified` remain within allowed OS-Dev surfaces.

---

### 7) Standards & Safety Gate

Delegate to `os-dev-standards-enforcer`:

- Inputs:
  - `files_modified`
  - `changes_manifest`
  - ContextBundle (for `relatedStandards`)

Expect `phase_state.gates.os_dev_standards_gate` to be populated:

- `standards_score`
- `gate_decision` (`PASS | CAUTION | FAIL`)
- `violations`
- `ra_status`

If `gate_decision == "FAIL"` and a corrective pass is allowed, proceed to
Implementation Pass 2.

---

### 8) Corrective Implementation – Pass 2 (Optional)

If gates fail:

- Set `current_phase` to `implementation_pass2` in `phase_state`.
- Delegate again to `os-dev-builder` with violations to fix.
- Expect `phase_state.implementation_pass2`:
  - `files_modified`
  - `fixes_applied`

Re-run `os-dev-standards-enforcer` as needed until gates pass or user accepts
remaining risks.

---

### 9) Verification – OS-Dev Verification Agent

Delegate to `os-dev-verification`:

- Inputs:
  - Combined list of `files_modified` from implementation passes.
  - `complexity_tier` (for how aggressive to be with checks).

Expect `phase_state.verification`:

- `verification_status`
- `commands_run`
- `errors`

If verification fails:
- Present results to the user.
- Recommend either corrective work or rollback based on `rollback_notes`.

---

### 10) Completion & Learning

Once standards and verification gates have passed (or the user explicitly
accepts residual risk):

1. Summarize:
   - Files touched.
   - Gate scores (standards, verification).
   - RA status (any unresolved RA issues).
   - Rollback instructions.
2. Save task history via `mcp__project-context__save_task_history` with:
   - `domain: "os-dev"`
   - `task`: short description
   - `outcome`: e.g. `"success"`, `"partial"`, `"abandoned"`
   - `learnings`: 3–7 bullets
   - `files_modified`
3. For recurring issues resolved by this task:
   - Use `mcp__project-context__save_standard` to codify OS-Dev standards.

Return a concise report to the user emphasizing:
- What changed.
- Where to find evidence and rollback instructions.
- Any known risks or follow-up actions.

---

## 4. State Preservation & Session Continuity

When the user interrupts (questions, clarifications, test results, pauses):

1. Read `phase_state` from:

   ```bash
   cat .claude/orchestration/phase_state.json
   ```

2. Acknowledge the interruption and process the new information.

3. **RE-CONFIRM BEFORE RESUMING (MANDATORY):**
   - Present updated plan based on feedback
   - Use AskUserQuestion or orca-confirm skill
   - Get explicit "proceed" before delegating
   - **NEVER resume delegation without confirmation**

4. **Do NOT abandon the OS-Dev pipeline**:
   - You are STILL orchestrating the OS-Dev lane.
   - You are STILL using `os-dev-grand-architect`, `os-dev-architect`,
     `os-dev-builder`, and gates.
   - Resume from current phase AFTER confirmation

5. Resume from the appropriate phase (after confirmation):
   - If planning incomplete → continue with `os-dev-architect`.
   - If in implementation → continue with `os-dev-builder`.
   - If in gates → continue with `os-dev-standards-enforcer`.
   - If in verification → continue with `os-dev-verification`.
   - Update `phase_state` as new information arrives.

6. **Anti-Pattern Detection:**
   - "Let me edit this config" → WRONG. Delegate to os-dev-builder
   - "I'll fix this directly" → WRONG. Delegate to appropriate agent
   - Using Edit/Write tools → WRONG. You're an orchestrator
   - Resuming without confirmation → WRONG. Must re-confirm first
   - "Based on feedback, re-confirming plan..." → CORRECT
   - "Based on feedback, delegating to os-dev-builder..." → WRONG (skipped confirmation)

User questions **do not** reset your role or the pipeline.

---

## 📝 Session Logging

For significant OS-Dev sessions, create a log file in `logs/`:

**Location:** `logs/`
**Naming:** `Claude-Topic-YYYY-MM-DD.md`
**Frontmatter required:**

```markdown
---
Agent: Claude
Topic: Short title for the session
Description: 1-2 sentence summary
Files Edited:
  - path/to/file1.md
  - path/to/file2.yaml
Date: YYYY-MM-DD
Time: HH:MM TZ
---
```

**When to log:**
- Complex OS-Dev changes (--complex mode)
- Multi-file refactors
- Architecture decisions
- Any work that might need future reference

**Example:** `logs/Claude-ThreeTierRoutingSpec-2025-11-27.md`
