# Expo / React Native Domain Pipeline

**Status:** OS 2.0 Core Pipeline (Expo Lane)  
**Last Updated:** 2025-11-19

## Overview

The Expo pipeline handles React Native mobile development for projects using Expo SDK 50+ / React Native 0.74+ with TypeScript. It combines:

- OS 2.0 primitives (ProjectContextServer, phase_state.json, vibe.db, constraint framework)
- SenaiVerse’s Expo agent system (Grand Architect + design/a11y/perf/security agents)
- React Native best practices (from Agent Farm’s REACT_NATIVE_BEST_PRACTICES)

Goal: build and maintain high-quality Expo apps with structural guarantees around design tokens, accessibility, performance, and security.

---

## Phase State Contract (`phase_state.json`)

All Expo lane work shares a common phase state file:

```text
.claude/project/phase_state.json
```

For Expo, the contract is:

- Top-level:
  - `domain`: must be `"expo"` for this lane.
  - `current_phase`: one of:
    - `"context_query"`, `"requirements_impact"`, `"architecture_plan"`,
      `"implementation_pass1"`, `"standards_budgets"`, `"power_checks"`,
      `"implementation_pass2"`, `"verification"`, `"completion"`.
  - `phases`: object keyed by phase name (see below).
  - `gates_passed` / `gates_failed`: arrays of gate identifiers:
    - e.g. `"design_tokens"`, `"a11y"`, `"performance"`, `"security"`, `"verification"`.
  - `artifacts`: list of repo-relative paths to important artifacts
    (reports, logs, spec/plan docs).

Each phase SHOULD write a structured entry under `phases.<phase_name>`:

- `context_query`
  - `status`: `"pending" | "in_progress" | "completed" | "blocked"`.
  - `timestamp`: ISO string when completed.
  - `summary`: short text summary (e.g. key files, stack).
- `requirements_impact`
  - `status`.
  - `change_type`: `"bugfix" | "feature" | "multi_feature" | "architecture_change"`.
  - `impacted_screens`: list of route/screen identifiers.
  - `impacted_modules`: list of store/hooks/api modules.
- `architecture_plan`
  - `status`.
  - `architecture_path`: short label for chosen approach (e.g. `"expo-router + react-query + zustand"`).
  - `plan_summary`: 3–7 bullet-style sentences (stored as text).
  - `assigned_agents`: list of agent ids expected for downstream phases
    (e.g. `["expo-builder-agent","design-token-guardian","a11y-enforcer",...]`).
- `implementation_pass1`
  - `status`.
  - `files_modified`: list of repo-relative paths touched in Pass 1.
  - `notes`: optional short freeform description.
- `standards_budgets`
  - `status`.
  - `design_tokens_score`: number 0–100 (from `design-token-guardian`).
  - `a11y_score`: number 0–100 (from `a11y-enforcer`).
  - `performance_score`: number 0–100 (from `performance-enforcer`).
- `power_checks`
  - `status`.
  - `perf_findings_ref`: optional path to perf report artifact.
  - `security_findings_ref`: optional path to security report artifact.
- `implementation_pass2`
  - `status`.
  - `files_modified`: list of repo-relative paths touched in corrective pass.
  - `notes`: what was fixed vs Phase 5/6 findings.
- `verification`
  - `status`.
  - `verification_status`: `"pass" | "fail" | "partial"`.
  - `commands_run`: list of verification commands executed.
- `completion`
  - `status`.
  - `outcome`: `"success" | "partial" | "failure"`.
  - `learnings`: short text (what worked, what didn’t).

Agents in this lane (`expo-architect-agent`, `expo-builder-agent`,
Expo gate agents, and `expo-verification-agent`) MUST update the
appropriate phase entries when they complete their work.

---

## Pipeline Architecture

```text
Request (Expo/React Native)
    ↓
[Phase 1: Context Query] ← MANDATORY (ProjectContextServer)
    ↓
[Phase 2: Requirements & Impact (Expo Grand Architect + OS)]
    ↓
[Phase 3: Architecture & Plan (Grand Architect + RN best practices)]
    ↓
[Phase 4: Implementation - Pass 1 (Expo/React Native builders)]
    ↓
[Phase 5: Standards & Budgets]
    ↓
  ┌─────────────────────────────────────────────┐
  │  Design Token Guardian (design tokens)     │
  │  A11y Enforcer (WCAG 2.2)                  │
  │  Performance Enforcer (runtime budgets)    │
  └─────────────────────────────────────────────┘
    ↓
[Phase 6: Power Checks (optional)]
  ├─ Performance Prophet (predictive perf)
  └─ Security Specialist (OWASP mobile)
    ↓
Decision Point:
├─ All gates ≥ thresholds → [Phase 7: Verification]
└─ Any gate fails → [Phase 4b: Implementation - Pass 2] (ONE corrective pass)
    ↓
[Phase 7: Verification] (build/test)
    ↓
[Phase 8: Completion & Learning]
```

---

## Phase Definitions

### Phase 1: Context Query (MANDATORY)

**Agent:** ProjectContextServer (MCP tool)  
**Invoker:** `/orca`

**Input:**
```json
{
  "domain": "expo",
  "task": "<user request>",
  "projectPath": "<cwd>",
  "maxFiles": 15,
  "includeHistory": true
}
```

**Output:** ContextBundle containing:
- `relevantFiles`: Expo/React Native files related to the task (screens, components, navigation, config).
- `projectState`: app entry points, navigation structure, state management approach.
- `pastDecisions`: prior Expo decisions (navigation choices, state patterns, perf fixes).
- `relatedStandards`: Expo/React Native standards from `vibe.db` and RN best-practices.
- `similarTasks`: historical Expo tasks and outcomes.

**Artifacts:**
- ContextBundle stored in `phase_state.json`.
- Event logged to `vibe.db.events`.

---

### Phase 2: Requirements & Impact

**Agents:**
- `expo-architect-agent` (Expo lane architect)
- `/orca` + OS 2.0 constraint framework

**Tasks:**
1. Restate the request in clear, concrete terms (feature, bugfix, refactor).
2. Identify:
   - Affected screens/routes (e.g. app router segments).
   - Affected feature modules (state, APIs, components).
   - Cross-cutting concerns (offline mode, push, auth, payments).
3. Classify change type:
   - `bugfix`, `feature`, `multi-feature`, `architecture_change`.
4. Estimate impact:
   - Files/modules likely to change.
   - Risk areas (navigation, auth, payment, sync).

**Artifacts:**
- Impact summary recorded to `phase_state.json` and optionally to `vibe.db`.

---

### Phase 3: Architecture & Plan

**Agents:**
- `expo-architect-agent` (primary planner)
- Optionally: future specialists such as `state-auditor`, `impact-analyzer`, `test-architect`

**Tasks:**
1. Choose or confirm architecture path:
   - Feature-based folder structure.
   - Navigation (Expo Router, React Navigation).
   - State management (React Query, Zustand, Redux, etc.).
2. Decompose the feature into phases and atomic tasks:
   - UI layout & navigation.
   - State and data flow.
   - Offline/perf/security considerations.
   - Testing strategy.
3. Map tasks to agents:
   - Builders (e.g. Expo/React Native implementation).
   - Design/a11y/perf/security enforcers.

**Artifacts:**
- Plan file (optional for complex work): `.claude/orchestration/specs/expo-feature-YYYY-MM-DD.md`.
- Plan summary stored in `phase_state.json`.

---

### Phase 4: Implementation – Pass 1

**Agents:** `expo-builder-agent` (Expo/React Native implementation)

**Constraints (HARD):**
- Respect Expo/React Native best practices:
  - React Native 0.74+, Expo SDK 50+.
  - TypeScript, Fabric architecture where applicable.
- Follow the architecture plan from Phase 3.
- Prefer localized edits (screen/module specific) over sweeping rewrites.
- Maintain platform conventions (iOS/Android UX parity).

**Tasks:**
1. Implement UI and navigation changes for the requested feature.
2. Wire state and data flow according to the plan.
3. Maintain design-tokens usage (no arbitrary color/spacing).
4. Add or update tests for new logic (unit/integration/UI).
5. Run local checks:
   - `npm test` (or `bun test`/`yarn test` as configured).
   - `expo doctor` or other health checks.

**Artifacts:**
- Modified files (tracked in `phase_state.json`).
- Implementation log: `.claude/orchestration/temp/expo-implementation-TIMESTAMP.md`.

---

### Phase 5: Standards & Budgets

**Agents (Tier 1):**
- `design-token-guardian`
- `a11y-enforcer`
- `performance-enforcer`

**Inputs:**
- Modified files from Phase 4.
- ContextBundle (design system, standards, past decisions).

**Tasks:**
1. **Design Token Guardian**
   - Check design token usage:
     - No hard-coded colors/spacing where tokens exist.
     - Components and styles follow the design system.
2. **A11y Enforcer**
   - Validate accessibility (WCAG 2.2):
     - Proper labels, roles, focus handling, contrast, touch targets.
3. **Performance Enforcer**
   - Check performance budgets:
     - Bundle size, critical path, runtime warnings.

**Outputs:**
- Per-agent scores or pass/fail judgments.
- Combined **Standards/A11y/Perf status** in `phase_state.json`.

---

### Phase 6: Power Checks (Optional but Recommended)

**Agents (Tier 2):**
- `performance-prophet`
- `security-specialist`

**Tasks:**
1. **Performance Prophet**
   - Predictive and deeper performance analysis:
     - Identify emerging bottlenecks.
     - Propose optimizations before users feel them.
2. **Security Specialist**
   - Security audit focusing on OWASP Mobile Top 10:
     - Storage, network, auth flows, environment variables, etc.

**Outputs:**
- Perf/security reports.
- Recommendations logged as potential standards in `vibe.db`.

---

### Gates: Standards, A11y, Performance, Security

Gate thresholds (suggested):
- **Design Tokens / Standards:** PASS if ≥90, CAUTION 70–89, FAIL <70.
- **Accessibility:** PASS if no critical WCAG violations; FAIL if any blocking issues.
- **Performance:** PASS if within budgets; FAIL on meaningful regressions.
- **Security:** PASS if no critical OWASP issues; FAIL otherwise.

If any critical gate FAILS:
- Allow exactly **one corrective Implementation Pass 2**.
- After Pass 2 re-run Phase 5/6 checks.
- If still failing:
  - Mark as “partial / standards not met” and let user decide next steps.

---

### Phase 4b: Implementation – Pass 2 (Corrective)

Same agents and constraints as Phase 4, but:
- Scope **only** to issues reported by design/a11y/perf/security agents.
- No new features or expansions.

---

### Phase 7: Verification (Build/Test)

**Agent:** `expo-verification-agent` (Expo/React Native verification)

**Tasks:**
1. Run project build and tests:
   - `npm test` / `yarn test` / `bun test`.
   - `expo doctor`.
   - Any configured E2E tests (Detox, etc.) as appropriate.
2. Capture:
   - Build/test status.
   - Key logs/errors.

**Gate:**
- Verification PASS only if:
  - Build/tests succeed.
  - No new critical warnings introduced.

---

### Phase 8: Completion & Learning

**Agent:** `/orca` + ProjectContextServer integrations

**Tasks:**
1. Confirm:
   - All relevant gates passed or are explicitly waived by the user.
   - Artifacts (reports, logs) are stored in `.claude/orchestration/evidence/`.
2. Save task history:
   - Domain: `expo`.
   - Task description.
   - Outcome (`success` | `partial` | `failure`).
   - Files/modules modified.
   - Gate scores and results.
3. Update memory:
   - Record new standards in `vibe.db` where recurring issues were found.
   - Store any important decisions via ProjectContextServer `save_decision`.

**Artifacts:**
- Task history record in `vibe.db`.
- Final summary for the user and future context.
