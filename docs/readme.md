# OS 2.2 Documentation Index

**Version:** OS 2.2
**Last Updated:** 2025-11-24

This folder contains the documentation for the OS 2.2 orchestration system used by Claude Code. For the main overview, see the [project README](/README.md).

---

## What's New in OS 2.2

**Major Changes:**
- ✅ **Unified Planning** - `/plan` command replaces 8+ fragmented requirements commands
- ✅ **Meta-Audit System** - `/audit` command for behavior review with Response Awareness
- ✅ **Role Boundary Enforcement** - Orchestrators NEVER write code (explicit enforcement)
- ✅ **State Preservation** - `phase_state.json` survives interruptions
- ✅ **Team Confirmation** - Mandatory AskUserQuestion before pipeline execution
- ✅ **Grand Architect Pattern** - Opus for coordination, Sonnet for implementation (57 agents)

**Workflow Evolution:**
```
OS 2.2: requirements-start → requirements-status → response-awareness-plan → response-awareness-implement
OS 2.2: /plan → /orca-{domain} → /audit
```

---

## Quick Reference

Start here for fast lookups:
- [OS 2.2 Commands Reference](../quick-reference/os2-commands.md) - All commands with usage
- [OS 2.2 Agents Reference](../quick-reference/os2-agents.md) - All 57 agents across 6 domains
- [OS 2.2 Architecture Reference](../quick-reference/os2-architecture.md) - System architecture

---

## Core OS 2.2 Docs (Canonical)

### Architecture
- `architecture/vibe-code-os-v2-spec.md` – Main OS 2.2 spec (being updated to 2.1)
- `architecture/chaos-prevention.md` – File creation / chaos limits
- `architecture/agents.md` – Agent system overview

### Pipelines (Domain-Specific)
All pipelines now enforce:
- Role boundaries (orchestrators never code)
- State preservation (phase_state.json)
- Team confirmation (AskUserQuestion)
- Quality gates (≥90 scores)

**Active Pipelines:**
- `pipelines/nextjs-pipeline.md` – Next.js/React frontend (13 agents)
- `pipelines/ios-pipeline.md` – Native iOS (18 agents)
- `pipelines/expo-pipeline.md` – Expo/React Native (10 agents)
- `pipelines/data-pipeline.md` – Data analysis (4 agents)
- `pipelines/design-pipeline.md` – Design system (2 agents)
- `pipelines/seo-pipeline.md` – SEO content (4 agents)

**Deprecated:**
- `pipelines/webdev-pipeline.md` → Use nextjs-pipeline.md
- `pipelines/requirements-pipeline.md` → Use /plan command

### Design
- `design/design-dna-schema.md` – Machine schema for design-dna.json
- `design/design-system-guide.md` – Design system guidance
- `design/design-ocd-meta-rules.md` – Design precision rules

### Memory & Context
- `memory/vibe-memory-v2-architecture-2025-11-16.md` – Memory system v2
- `reference/constraint-framework.md` – Constraint framework spec
- `reference/phase-state-schema.md` – phase_state.json structure

### Reference & Quality Gates
- `reference/response-awareness.md` – Response Awareness framework (now integrated with /audit)
- `reference/quality-gates.md` – Quality gate specifications
- `reference/standards-gate.md` – Standards enforcement (≥90 threshold)
- `reference/design-qa-gate.md` – Design quality gate (≥90 threshold)
- `reference/customization-gate.md` – Customization checks
- `reference/hybrid-learning-system.md` – Learning and adaptation

### Phase Configurations
Location: `reference/phase-configs/`
- `nextjs-phase-config.yaml` – 6-phase pipeline with role boundaries
- `ios-phase-config.yaml` – 6-phase pipeline with role boundaries
- `expo-phase-config.yaml` – 6-phase pipeline with role boundaries
- `data-phases.yaml` – 4-phase pipeline
- `seo-phase-config.yaml` – 4-phase pipeline

---

## OS 2.2 Key Concepts

### 1. Role Boundary Enforcement (NEW)
**Problem in OS 2.0:** Orchestrators would abandon their role and start coding directly when users interrupted with questions.

**Solution in OS 2.2:** Explicit enforcement in all orca commands:
```markdown
🚨 CRITICAL ROLE BOUNDARY 🚨
YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE CODE.
```

**Result:** Orchestration survives interruptions (questions, clarifications, pauses).

### 2. State Preservation (NEW)
**Mechanism:** `phase_state.json` tracks:
- Current phase
- Completed phases
- Agent assignments
- Gate results
- Interruption count

**Usage:** Orchestrators read this file after ANY user input to resume correctly.

### 3. Team Confirmation (NEW)
**Before execution:** Orchestrators present proposed agent team via AskUserQuestion tool and wait for user approval.

**Benefits:**
- No surprise teams
- Cost transparency (Opus vs Sonnet)
- User controls scope

### 4. Unified Planning (NEW)
**Old Way (OS 2.0):**
- /requirements-start
- /requirements-status
- /requirements-end
- /response-awareness-plan
- /response-awareness-implement

**New Way (OS 2.2):**
- `/plan "feature description"` → Creates blueprint at `requirements/<id>/06-requirements-spec.md`
- `/orca-{domain} "implement requirement <id>"` → Executes with full pipeline
- `/audit "last N tasks"` → Meta-review for continuous improvement

### 5. Grand Architect Pattern (NEW)
**Opus Agents (3):** High-level coordination
- ios-grand-architect
- nextjs-grand-architect
- expo-grand-orchestrator

**Sonnet Agents (54):** All implementation work
- Builders, specialists, gates, verification

**Benefit:** Optimal cost (expensive models for strategy, efficient models for work)

---

## Documentation Structure

```
docs/
├── readme.md                      # This file
├── architecture/                  # System architecture specs
├── pipelines/                     # Domain pipeline specifications
├── design/                        # Design system documentation
├── memory/                        # Memory system architecture
└── reference/                     # Reference specs
    ├── phase-configs/             # Phase configuration files
    ├── quality-gates.md           # Gate specifications
    ├── response-awareness.md      # RA framework
    └── standards-gate.md          # Standards enforcement

quick-reference/                   # Quick lookup docs
├── os2-commands.md                # All commands
├── os2-agents.md                  # All 57 agents
└── os2-architecture.md            # System architecture

.claude/                           # Project-level configs
├── orchestration/
│   ├── evidence/                  # Final artifacts
│   ├── temp/                      # Working files (clean up)
│   └── playbooks/                 # Pattern templates
└── requirements/                  # Planning outputs (NEW in 2.1)
    └── YYYY-MM-DD-HHMM-<slug>/
        └── 06-requirements-spec.md
```

---

## Research / Historical Docs

These are **older or exploratory** documents kept for context. They may still contain useful ideas but are not the canonical spec:

- `architecture/vibe-code-os-v2-brainstorm.md` – Early brainstorm (pre-2.1)
- `architecture/structure-audit.md` – Earlier structural analysis
- `architecture/configuration-record.md` – Background context
- `architecture/data-analyst-team-guide.md` – Superseded by data-pipeline.md
- `prompts-research/` – Prompt and quality research notes
- `sessions/` – OS 2.2 session logs and reflections

**When in doubt:**
- Use the **Core OS 2.2 Docs** for behavior and implementation
- Treat research/historical docs as inspiration, not contracts
- Check the [main README](/README.md) for the authoritative OS 2.2 overview

---

## Getting Started with OS 2.2

1. **Understand the workflow:**
   ```
   /plan "feature" → requirements/<id>/06-requirements-spec.md
   /orca-nextjs "implement requirement <id>" → full pipeline with gates
   /audit "last 5 tasks" → continuous improvement
   ```

2. **Learn the commands:** See [os2-commands.md](../quick-reference/os2-commands.md)

3. **Know the agents:** See [os2-agents.md](../quick-reference/os2-agents.md)

4. **Understand the architecture:** See [os2-architecture.md](../quick-reference/os2-architecture.md)

5. **Read pipeline specs:** See `pipelines/` for domain-specific details

---

## Version History

- **OS 2.2** (2025-11-24): Simplified memory architecture (Workshop + vibe.db), role boundaries, state preservation, unified planning, meta-audit, team confirmation
- **OS 2.0** (2025-11): Context-first orchestration, agent system, quality gates
- **OS 1.x** (archived): Reactive pattern system

---

_For the comprehensive OS 2.2 overview, see the [main README](/README.md)._
