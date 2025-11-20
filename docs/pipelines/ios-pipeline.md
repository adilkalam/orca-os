# iOS Domain Pipeline

**Status:** OS 2.0 Core Pipeline (Native iOS Lane)  
**Last Updated:** 2025-11-19

## Overview

The iOS pipeline handles **native iOS app development** using Swift 6.x and modern Apple frameworks (SwiftUI, UIKit, Swift Concurrency). It combines:

- OS 2.0 primitives (ProjectContextServer, phase_state.json, vibe.db, constraint framework)
- Swift/iOS specialist agents (Swift architect/developer/SwiftUI specialists)
- Your own OS 2.0 lane agents (ios-architect-agent, ios-standards-enforcer, ios-ui-reviewer-agent, ios-verification-agent)

Goal: implement and evolve native iOS features with **architecture-aware plans**, **safety and concurrency guarantees**, and **structured gates** for quality and verification.

---

## Pipeline Architecture

```text
Request (iOS feature/bug/refactor)
    ↓
[Phase 1: Context Query] ← MANDATORY (ProjectContextServer)
    ↓
[Phase 2: Requirements & Impact (iOS Architect)]
    ↓
[Phase 3: Architecture & Plan (iOS Architect + Swift/SwiftUI patterns)]
    ↓
[Phase 4: Implementation – Pass 1 (SwiftUI/Swift developers)]
    ↓
[Phase 5: Standards & Safety Gate (iOS Standards Enforcer)]
    ↓
[Phase 6: UI/Interaction QA Gate (iOS UI Reviewer)]
    ↓
Decision Point:
├─ All gates ≥ thresholds → [Phase 7: Build & Test Verification]
└─ Any gate fails → [Phase 4b: Implementation – Pass 2] (ONE corrective pass)
    ↓
[Phase 7: Build & Test Verification (iOS Verification Agent)]
    ↓
[Phase 8: Completion & Learning (vibe.db)]
```

---

## Phase Definitions

### Phase 1: Context Query (MANDATORY)

**Agent:** ProjectContextServer (MCP tool)  
**Invoker:** `/orca`

**Input:**
```json
{
  "domain": "ios",
  "task": "<user request>",
  "projectPath": "<cwd>",
  "maxFiles": 15,
  "includeHistory": true
}
```

**Output:** ContextBundle containing:
- `relevantFiles` – Swift/SwiftUI/UIKit files for the feature/bug.
- `projectState` – targets, schemes, modules, architecture hints (SwiftUI vs UIKit, MVVM/TCA/MVC).
- `pastDecisions` – prior iOS decisions, refactors, gotchas.
- `relatedStandards` – iOS standards from `vibe.db` (architecture, concurrency, safety).
- `similarTasks` – previous iOS tasks and outcomes.

**Artifacts:**
- ContextBundle stored in `phase_state.json`.
- Context event logged in `vibe.db.events`.

---

### Phase 2: Requirements & Impact Analysis

**Agent:** `ios-architect-agent`

**Tasks:**
1. Restate the request clearly (what feature/bug/refactor is needed).
2. Identify:
   - Affected screens/views (SwiftUI views, view controllers, navigation flows).
   - Affected state/business logic (stores, reducers, view models, services).
   - External dependencies (APIs, persistence, feature flags).
3. Classify change type:
   - `bugfix`, `small_feature`, `multi_screen_feature`, `structural`.
4. Estimate impact and risk:
   - Modules and targets touched.
   - Sensitive areas (auth, payments, offline, critical flows).

**Artifacts:**
- Impact summary in `phase_state.json`.
- Optional decision note saved via ProjectContextServer.

---

### Phase 3: Architecture & Plan

**Agents:**
- `ios-architect-agent` (primary planner)
- Swift specialists (e.g. `swift-architect`, `swift-expert`, `swiftui-architect` indirectly)

**Tasks:**
1. Choose architecture path:
   - **Modern SwiftUI path** (Swift 6, SwiftUI 18/26, `@Observable` + `@Environment(Object.self)`):
     - For SwiftUI-first features/projects without entrenched MVVM/TCA.
   - **Existing architecture path** (MVVM, TCA, UIKit/MVC):
     - Follow existing patterns; do not forcibly rewrite architecture.
2. Define:
   - Which types/modules will be extended or created.
   - How state and data flow should be wired (reducers/view models/stores).
   - How UI and navigation will change.
   - Testing strategy (what tests should exist).
3. Produce a concise, stepwise plan:
   - UI changes.
   - Logic changes.
   - Tests.
   - Verification.

**Artifacts:**
- Plan stored in `phase_state.json`.
- Optional plan spec: `.claude/orchestration/specs/ios-feature-YYYY-MM-DD.md`.

---

### Phase 4: Implementation – Pass 1

**Agents:** iOS implementation specialists (from Swift agent packs), guided by `/orca` and the plan:
- SwiftUI work: `swiftui-developer` (or equivalent).
- UIKit-heavy work: `uikit-specialist` (or equivalent).

**Constraints (HARD):**
- Use Swift 6.x semantics and modern concurrency by default.
- Respect architecture plan from Phase 3:
  - If SwiftUI-native: prefer `@Observable` + `@Environment` over new view models.
  - If MVVM/TCA/UIKit: follow the dominant pattern.
- Keep edits cohesive and scoped to the modules/features identified.
- Add/update tests where new logic is introduced.

**Tasks:**
1. Apply the architecture plan:
   - Implement or update views/controllers and logic.
2. Add tests:
   - Unit tests for business logic.
   - Reducer/view model tests if applicable.
3. Run local checks (via Xcode tools when available):
   - Build the affected module/target.
   - Run relevant tests.

**Artifacts:**
- Modified files recorded in `phase_state.json`.
- Implementation summary in an implementation log (optional).

---

### Phase 5: Standards & Safety Gate

**Agent:** `ios-standards-enforcer`

**Inputs:**
- Modified Swift/SwiftUI/UIKit files.
- ContextBundle (architecture, standards, past decisions).

**Checks:**
- Architecture:
  - No unexpected patterns contrary to the chosen path.
- Concurrency:
  - Proper use of `async/await`, actors, `@MainActor`.
  - Avoid unnecessary GCD where Swift Concurrency is available.
- Safety:
  - Force unwraps and unsafe casts only where justified.
  - Reasonable error handling paths (no silent failures).
- Testing:
  - New logic has tests where appropriate.

**Output:**
- Standards Score (0–100).
- Gate label: PASS / CAUTION / FAIL.

---

### Phase 6: UI / Interaction QA Gate

**Agent:** `ios-ui-reviewer-agent`

**Inputs:**
- Feature/flow under review.
- Target/scheme and navigation steps (how to reach the feature).
- Any design/UX notes.

**Checks:**
- Layout & visuals on relevant devices.
- Navigation and flow correctness.
- Interaction behavior (taps, gestures, loading/error states).
- Basic accessibility concerns.

**Output:**
- Design/Interaction Score (0–100).
- Gate label: PASS / CAUTION / FAIL.

---

### Gates and Corrective Pass

Gate thresholds (suggested):
- **Standards Gate:** PASS if Standards Score ≥ 90 and no critical issues.
- **UI/Interaction Gate:** PASS if Score ≥ 90 and no blockers.

If any critical gate FAILS:
- Allow exactly **one** corrective **Implementation Pass 2**:
  - Scope only to gate-surfaced issues.
  - Re-run Phase 5 and Phase 6 afterwards.
- If still failing:
  - Mark outcome as “partial / standards not met” and require human decision.

---

### Phase 4b: Implementation – Pass 2 (Corrective)

Same implementation agents as Phase 4, but:
- Scope strictly to issues from Standards and UI gates.
- No new features or expansions.

---

### Phase 7: Build & Test Verification

**Agent:** `ios-verification-agent`

**Tasks:**
1. Build the iOS app for the appropriate scheme/target using Xcode tools:
   - `xcodebuild` or XcodeBuildMCP.
2. Run tests:
   - Relevant unit/integration/UI tests.
3. Capture:
   - Build status.
   - Test results and failures.

**Gate:**
- PASS only if the build succeeds and relevant tests pass.

---

### Phase 8: Completion & Learning

**Agents:** `/orca` + ProjectContextServer integrations

**Tasks:**
1. Confirm gate outcomes and artifacts:
   - Standards, UI, Build/Test gates passed or explicitly waived.
   - Evidence (logs, screenshots) stored where appropriate.
2. Save task history:
   - Domain: `ios`.
   - Task description.
   - Outcome (`success` | `partial` | `failure`).
   - Files/modules modified.
   - Gate scores and decisions.
3. Update memory:
   - Insert new events/standards into `vibe.db`.
   - Save architecture decisions via ProjectContextServer.

**Artifacts:**
- Task history record in `vibe.db`.
- Updated iOS standards where applicable.

