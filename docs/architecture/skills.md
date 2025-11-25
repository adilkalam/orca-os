# OS 2.2 Skills Architecture (Draft)

**Status:** Draft – Skills integration for OS 2.2  
**Last Updated:** 2025-11-20

This document defines how **Agent Skills** fit into the OS 2.2 system alongside
agents, pipelines, and MCP tools.

It builds directly on Anthropic’s Skills spec:
- `_explore/_SKILLS/agent_skills_spec.md`
- `_explore/claude-cookbooks/skills`
- `_explore/orchestration_repositories/claude-flow-main/docs/skills/skills-tutorial.md`

and adapts them to OS 2.2 constraints and domain pipelines.

---

## 1. Roles: Agents vs Skills vs Tools

OS 2.2 distinguishes three layers:

- **Agents** (`agents/*.md`)
  - Personas with tools, constraints, and lane-specific responsibilities.
  - Orchestrated by `/orca` and domain pipelines (`docs/pipelines/*`).

- **Skills** (`skills/*/SKILL.md`, `<project>/.claude/skills/*/SKILL.md`)
  - Modular “expertise packages” that agents can discover and load on demand.
  - Provide additional instructions, examples, and sometimes scripts/resources.
  - Are **not** full orchestration entities; they don’t own phases or gates.

- **MCP Tools / External Services**
  - Deterministic capabilities exposed via Model Context Protocol.
  - Used by agents (and sometimes skills) when interacting with external systems.

Rough mental model:
- Pipelines + `/orca`: “What lane and phases should we run?”
- Agents: “Who is doing what in each phase?”
- Skills: “What extra expertise / playbook do I load for this exact task?”
- MCP tools: “What external systems do I talk to?”

---

## 2. Skill Locations & Layout

### 2.1 Global Skills (This Repo)

Global skills live under:

- `skills/*`

Example:
```text
skills/
  creative-strategist/
    SKILL.md
  ios-simulator-skill/
    SKILL.md
  ...
```

Each skill folder **must** contain:

- `SKILL.md` – the entrypoint file with YAML frontmatter + markdown body.

Optional:
- Additional markdown docs (`reference.md`, `examples.md`, etc.).
- Scripts or resources that agents may read or invoke via tools.

### 2.2 Project-Scoped Skills

Individual projects can define their own skills:

- `<project>/.claude/skills/*/SKILL.md`

For example, in `~/Desktop/peptidefox`:

```text
.claude/skills/
  fox-aesthetics/
    SKILL.md
  fox-research-peptides/
    SKILL.md
```

Project skills override or complement global skills. `/orca` and domain agents
should prefer project skills when both exist.

---

## 3. SKILL.md Format (OS 2.2)

OS 2.2 adopts the Anthropic Agent Skills spec:

- `_explore/_SKILLS/agent_skills_spec.md`

Minimal structure:

```yaml
---
name: my-skill            # required, hyphen-case; matches folder name
description: >
  Short description of what the skill does and when to use it.
license: MIT              # optional
allowed-tools:            # optional – pre-approved tools for this skill
  - Read
  - Bash
metadata:                 # optional – freeform, for clients/agents
  os2_domain: "expo"
---

# Skill Title

Body content...
```

**Key points:**
- `name` must match the directory name.
- `description` should be **concise and discriminative**:
  - Clear “when to use”.
  - Aids auto-selection.
- `allowed-tools` can further narrow tools for code-executing skills.
- `metadata` may include OS 2.2 hints:
  - `os2_domain` (`"webdev" | "expo" | "ios" | "seo" | "design" | "brand" | ...`)
  - `pipeline_phase` (if skill is tailored to a specific phase).
  - `project` (e.g. `"peptidefox"`).

The markdown body is unconstrained and should follow the **progressive disclosure**
pattern:

- Top: core instructions and mental model.
- Middle: step-by-step workflows and examples.
- Bottom: edge cases, anti-patterns, and advanced patterns.

---

## 4. How Agents Use Skills in OS 2.2

Agents should treat skills as **optional, task-specific amplifiers**:

1. **Discovery**
   - At startup, Claude preloads `name` + `description` for installed skills.
   - When an agent sees a task that matches a skill’s description, it can:
     - Load the full `SKILL.md` via `Read`.
     - Optionally follow linked references within the skill directory.

2. **When to Load a Skill**
   - The task clearly matches a known skill’s domain (e.g. creative strategy,
     iOS simulator workflows, uxscii component authoring).
   - The base agent prompt acknowledges a gap (e.g. “for deep brand-strategy
     analysis, load the `creative-strategist` skill”).
   - The pipeline spec for a phase explicitly recommends using a skill.

3. **Who Uses Skills**
   - Implementation agents (builder agents) and specialized reviewers are the
     primary consumers.
   - Orchestrators (`/orca`, `/orca-expo`) might **mention** relevant skills in
     their planning/Q&A, but they do not directly “become” skills.

4. **How This Differs from Agents**
   - Skills do **not**:
     - Show up in `agents/*.md`.
     - Own pipeline phases or gates.
   - Skills **do**:
     - Provide reusable, domain-specific guidance that multiple agents can load.

---

## 5. Example: Creative Strategist Skill (Existing)

The `skills/creative-strategist/SKILL.md` is a good exemplar:

- `name: creative-strategist`
- `description:` clearly states:
  - Senior brand strategist / advertising analyst.
  - When to use it (ad copy, visuals, performance data, funnels, competitors).
- Body:
  - Defines mindset, operating sequence, rules, domains, output structure,
    tone, and example use cases.

In OS 2.2, appropriate agents might:
- Load this skill in **webdev** or **brand** pipelines when asked to:
  - Analyze campaign creative.
  - Propose creative strategy for a landing page or campaign.
  - Review brand voice/positioning at a strategic level.

The skill does not replace `frontend-design-reviewer-agent`; instead, it gives
that agent (or a domain orchestrator) deeper context when doing creative/brand
work.

---

## 6. Skills vs Pipelines vs CLAUDE.md

OS 2.2 already uses:

- **Pipelines** (`docs/pipelines/*`):
  - Domain-specific, multi-phase workflows with phase configs.
- **CLAUDE.md** (per repo or per project):
  - High-level project instructions and constraints.

Skills complement these:

- Pipelines define **phases and gates**.
- CLAUDE.md defines **project-wide rules and habits**.
- Skills define **task-specific expertise** that can be plugged into any
  relevant phase or agent.

Example:
- For Expo/React Native:
  - Pipeline: `docs/pipelines/expo-pipeline.md`.
  - Agents: `expo-architect-agent`, `expo-builder-agent`, `expo-aesthetics-specialist`, etc.
  - Skills: future `skills/expo-ux-microcopy/`, `skills/expo-gesture-patterns/`
    that builder or aesthetics agents can load when needed.

---

## 7. OS 2.2 Guidance for Writing Skills

When authoring skills for OS 2.2:

1. **Start from concrete gaps**
   - Identify recurring tasks where agents repeat explanations or struggle
     without dedicated context (e.g. PeptideFox aesthetic rules, iOS simulator
     workflows, uxscii patterns).

2. **Keep `SKILL.md` focused**
   - Frontmatter description should be:
     - Short.
     - Actionable.
     - Clear about “when to use”.
   - Body should:
     - Provide a mental model, step-by-step workflows, examples, anti-patterns.

3. **Design for progressive disclosure**
   - Put the 80% case in `SKILL.md`.
   - Push specialized material into linked docs the agent can optionally read.

4. **Be explicit about tools, if needed**
   - If the skill expects running scripts or MCP tools, list them in
     `allowed-tools` and in the body with examples.

5. **Align with OS 2.2 domains**
   - Use `metadata` to tag:
     - `os2_domain` (webdev/expo/ios/seo/design/brand/etc.).
     - `pipeline_phase` (if strongly tied to one phase).
     - `project` where relevant (e.g. `peptidefox`).

---

## 8. Next Steps for This Repo

Short-term:
- Treat `skills/creative-strategist` as the canonical example of a Skill in
  this repo.
- Gradually normalize other existing skill-like directories under `skills/`
  (e.g. `ios-simulator-skill`, uxscii skills) to the `SKILL.md` spec where
  appropriate.

Medium-term:
- Update domain pipelines and agents (especially webdev/design/brand/expo) to
  mention relevant skills in their instructions (“If a skill exists that matches
  this task, load it before proceeding”).
- Optionally add a light “skill discovery” helper to `/orca` and `/orca-expo`
  so they can reference candidate skills by `name`/`description` during the Q&A
  planning step.

Long-term:
- Allow agents to propose new skills when they discover recurring patterns
  (e.g. writing a draft `SKILL.md` under `skills/` or a project’s `.claude/skills/`).

Until then, Skills are available as an **opt-in capability**: agents and pipelines
can start using them where they clearly add value, without changing the core
OS 2.2 architecture.

