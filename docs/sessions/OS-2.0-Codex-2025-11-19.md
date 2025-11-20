# OS 2.0 – Codex Session Summary (2025-11-19)

This file summarizes the changes and decisions from a Codex CLI session
focused on OS 2.0 agents, pipelines, and docs. Future sessions can load this
first to regain context.

---
## 1. Agent Layer Changes

**Frontend / Webdev**
- Tightened `frontend-builder-agent` to:
  - Treat `design-dna.json` as the JSON mirror of project design docs
    (e.g. `design-system-vX.X.md`, `bento-system-vX.X.md`, `CSS-ARCHITECTURE.md`).
  - Enforce CSS architecture alignment: global tokens/utilities (`var(--font-*)`,
    `--color-*`, `var(--space-*)`) and route-local CSS Modules that do NOT
    redefine global systems.
  - Treat authored design rules (min font sizes, 4px grid, gold usage, bento
    patterns) as hard constraints.
- Rewrote `frontend-standards-enforcer` to:
  - Load `design-dna.json` plus design-system docs when present.
  - Explicitly check for inline styles, non-token spacing/typography/colors,
    design-system rule violations, and CSS architecture violations.

**Design / Visual**
- Added `agents/visual-layout-analyzer.md`:
  - Image-aware agent that consumes screenshots/mockups plus `design-dna.json`
    and emits:
    - `Visual Layout Tree`
    - `Detected Components` (including bento/prose patterns)
    - `Token Candidates` mapped into design-dna tokens.
  - Intended for use by the design pipeline and webdev design/QA.

**Expo / Mobile**
- Updated `expo-architect-agent` to include a **Scope & Triggering** section
  (when to use Expo vs webdev).
- Updated `expo-builder-agent` to:
  - Define allowed paths/file types (app/src/screens/navigation/ios/android).
  - Add React Native implementation patterns (functional components, idiomatic
    navigation, StyleSheet usage, perf-conscious patterns).

**iOS**
- Updated `ios-architect-agent` with **Scope & Triggering** for native iOS
  (Swift/SwiftUI/UIKit, Xcode projects).
- Updated `ios-standards-enforcer` with a **Scope & Triggering** section
  describing where it audits (Swift/Obj-C sources, view models, reducers,
  SwiftUI views, UIKit controllers).
- Updated `ios-verification-agent` with a **Scope & Constraints** section
  (allowed paths, read-only behavior, build/test responsibility).

---
## 2. New / Updated Pipelines

**Design Pipeline**
- Added `docs/pipelines/design-pipeline.md`:
  - Phases: Context & Brief → Design Exploration → System & Components →
    Exports & Handoff → Design QA Gate → Completion.
  - Output: updated `design-dna.json` + implementation spec for webdev, plus
    optional exports (Figma/HTML/etc.).

**Webdev Pipeline**
- Updated `docs/pipelines/webdev-pipeline.md`:
  - Phase 3 (Analysis) may optionally use `visual-layout-analyzer` when
    screenshots/mockups are available, producing layout tree + token mapping.
  - Phase 5 re-framed as a **parallel gate group**:
    - Standards Enforcement (frontend-standards-enforcer)
    - Design QA (frontend-design-reviewer-agent)
    - Optional: a11y/perf/security gates.

**Expo Pipeline**
- Updated `docs/pipelines/expo-pipeline.md`:
  - Added **Scope & Domain** section:
    - When to use Expo vs webdev vs iOS, based on keywords/files.
  - Left phase-state and phase definitions intact; they already align with
    Expo agents and `docs/reference/phase-configs/expo-phase-config.yaml`.

**iOS Pipeline**
- Updated `docs/pipelines/ios-pipeline.md`:
  - Added **Scope & Domain** section:
    - Native iOS/Apple work (Swift/SwiftUI/UIKit) vs Expo vs webdev.
  - Phases already aligned with iOS agents and `ios-phases.yaml`.

**SEO Pipeline**
- Added `docs/pipelines/seo-pipeline.md` (new):
  - Phases: Context & Intent → Research (seo-research-specialist) →
    Brief Refinement (seo-brief-strategist) → Content Drafting
    (seo-draft-writer) → Quality Assurance (seo-quality-guardian) →
    Completion & Handoff.
  - Summarizes gates defined in
    `docs/reference/phase-configs/seo-phases.yaml` (clarity, keyword
    density, word count, citations, compliance, standards).

---
## 3. Orchestrator Updates

**/orca Command**
- Updated `commands/orca.md` to:
  - Include `design` in the domain list and context query.
  - Add a **design** domain detection rule (keywords + design-system files).
  - Add a **Design Pipeline** section that points to
    `docs/pipelines/design-pipeline.md` and describes its phases/artifacts.

**Design Review from Screenshot**
- Revived and upgraded `commands/design-review-from-screenshot.md`:
  - Uses Playwright MCP to capture live UI screenshots for a route.
  - Runs `visual-layout-analyzer` on the reference (and optionally live)
    screenshots to produce structured layout + token mapping.
  - Calls `frontend-design-reviewer-agent` with:
    - Reference + live screenshots.
    - Visual analysis outputs.
    - Asks for a Design QA Score (0–100), gate label, and concrete diffs vs
      both the reference and design-dna/CSS architecture rules.

---
## 4. Docs & Architecture Cleanups

**Agent Architecture**
- Rewrote `docs/architecture/agents.md` to describe:
  - Where agent specs live (`agents/*.md`, `~/.claude/agents`).
  - How they map to pipelines (webdev, expo, ios, design, seo).
  - Tool/constraint patterns (implementation vs gate agents).
  - Orchestration via `/orca`.

**SEO Orchestration**
- Updated `docs/architecture/seo-orca.md`:
  - Marked as an architecture overview, with pointers to:
    - `docs/pipelines/seo-pipeline.md`
    - `docs/reference/phase-configs/seo-phases.yaml`
    - `commands/seo-orca.md`
  - Clarified that CLI-only workflows (e.g., `seo_auto_pipeline.py`) are
    implementation details; OS 2.0 prefers `/seo-orca` + pipeline spec.

**Docs Index & Historical Labeling**
- Added `docs/README.md`:
  - Lists core OS 2.0 docs (architecture, pipelines, design, memory,
    reference) vs research/historical docs.
- Marked some older docs as historical (non-normative), e.g.:
  - `docs/architecture/vibe-code-os-v2-brainstorm.md`
  - `docs/architecture/structure-audit.md`
  - Some design docs moved to `_explore` or `docs/design/_archive/`.

**Design Folder**
- `docs/design/` was moved into `_explore` (done outside this session), which
  better reflects its role as a design research/patterns area.
  - Core design behavior now hinges on:
    - `docs/design/design-dna-schema.md` (wherever it lives)
    - `docs/pipelines/design-pipeline.md`
    - The frontend/design agents described above.

---
## 5. Memory Layer (Summary Only)

- Memory v2 architecture:
  - Main spec: `docs/memory/vibe-memory-v2-architecture-2025-11-19.md`.
  - MCP server: `docs/memory/mcp-memory.md` (exposes `memory.search` over
    `.claude/memory/vibe.db`).
  - Codex integration: `docs/memory/codex-cli-mcp-memory.md` (proposal to
    have Codex prefer `memory.search` and fall back to ripgrep).
- Older memory docs are archived under `docs/_archive/memory-2025-11/`.

---
## 6. How to Resume Work Later

When resuming work on OS 2.0 in future sessions:

1. Read this file:
   - `docs/sessions/OS-2.0-Codex-2025-11-19.md`
2. Then skim:
   - `docs/architecture/vibe-code-os-v2-spec.md`
   - `docs/architecture/agents.md`
   - `docs/pipelines/*` for the relevant domain (webdev, expo, ios, design, seo).
   - `docs/reference/phase-configs/*` for the phase/gate config.
3. For design/visual work:
   - `agents/visual-layout-analyzer.md`
   - Frontend agents under `agents/frontend-*.md`.

This should be enough to reload the mental model of the OS 2.0 agent/pipeline
layer without re-reading the entire repo history.

