# OS 2.0 Docs Index

This folder contains the documentation for the OS 2.0 orchestration system used
by Claude Code. It mixes current specs with older research notes; this index
is meant to highlight what is **canonical** now and what is **historical**.

---
## Core OS 2.0 Docs (Current)

- **Architecture**
  - `architecture/vibe-code-os-v2-spec.md` – main OS 2.0 spec.
  - `architecture/chaos-prevention.md` – file creation / chaos limits.
  - `architecture/agents.md` – agent system overview.
- **Pipelines**
  - `pipelines/webdev-pipeline.md` – web frontend lane.
  - `pipelines/expo-pipeline.md` – Expo / React Native lane.
  - `pipelines/ios-pipeline.md` – native iOS lane.
  - `pipelines/design-pipeline.md` – design lane (design-dna, specs).
  - `pipelines/seo-pipeline.md` – SEO/content lane.
  - `pipelines/requirements-pipeline.md` – requirements/briefing lane.
- **Design**
  - `design/design-dna-schema.md` – machine schema for design-dna.json.
  - `design/design-system-guide.md` – design-system guidance.
  - `design/design-ocd-meta-rules.md` – design precision rules.
- **Memory & Context**
  - `memory/vibe-memory-v2-architecture-2025-11-16.md` – memory system v2.
  - `reference/constraint-framework.md` – constraint framework spec.
  - `reference/phase-state-schema.md` – phase_state.json structure.
- **Gates & Reference**
  - `reference/standards-gate.md`
  - `reference/design-qa-gate.md`
  - `reference/customization-gate.md`
  - `reference/response-awareness.md`
  - `reference/hybrid-learning-system.md`

When working on OS 2.0 behavior, prefer these docs as the source of truth.

---
## Research / Historical Docs

These are **older or exploratory** documents kept for context. They may still
contain useful ideas but are not the canonical spec:

- `architecture/vibe-code-os-v2-brainstorm.md` – early brainstorm.
- `architecture/structure-audit.md` – earlier structural analysis.
- `architecture/configuration-record.md` & `architecture/data-analyst-team-guide.md` –
  useful background, but superseded by the current pipeline docs.
- Everything under:
  - `prompts-research/` – prompt and quality research notes.
  - `sessions/` – OS 2.0 session logs and reflections.

When in doubt:
- Use the **Core OS 2.0 Docs** for behavior and implementation.
- Treat research/historical docs as inspiration, not contracts.

