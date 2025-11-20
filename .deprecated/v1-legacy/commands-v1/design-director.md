---
description: Generic design concept director - uses frontend-concept-agent with quiet-luxury defaults
allowed-tools: [Read, AskUserQuestion, WebFetch, exit_plan_mode, Task]
argument-hint: [--project mm|fox|obdn] <screen / flow / artifact to design, critique, or refactor>
---

# /design-director — Generic Design Concept Director

Purpose: Invoke design concept creation for any project, using the frontend-concept-agent methodology with optional project-specific overrides.

This command:
- Routes to the appropriate concept agent based on project
- Defaults to quiet-luxury aesthetic if no project specified
- Produces implementation-ready specs with handoff sections
- Focuses on design-first thinking before code

/design-director is a **concept and spec generator**, not an implementation tool. For implementation, use project-specific build commands (e.g., `/mm --build`, `/fox --build`).

---

## 1. Project Detection & Routing

Parse `$ARGUMENTS`:
- If contains `--project mm`: Route to `mm-concept-agent.md`
- If contains `--project fox`: Route to `fox-concept-agent.md`
- If contains `--project obdn`: Route to `obdn-concept-agent.md`
- Otherwise: Use `frontend-concept-agent.md` with quiet-luxury defaults

Extract the actual design request after the flag.

---

## 2. Agent Delegation

### For Project-Specific Requests

Use Task tool with the appropriate project agent:

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Design concept for [project]",
  prompt: `
    Follow the methodology in agents/project-specific/[project]-concept-agent.md.

    REQUEST: ${extracted_request}

    Produce a complete design spec with:
    - Design system application
    - 2-3 concept explorations (if appropriate)
    - Selected concept with rationale
    - IMPLEMENTATION HANDOFF section
  `
})
```

### For Generic Requests (No Project Flag)

Use Task tool with generic concept agent + quiet-luxury defaults:

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Design concept",
  prompt: `
    Follow the methodology in agents/frontend-concept-agent.md.

    REQUEST: ${extracted_request}

    DESIGN DEFAULTS (Quiet Luxury):
    - Calm, high-end interfaces
    - Swiss-structured layouts
    - Editorial clarity
    - Mostly neutrals, minimal accents
    - 8px grid, 4px baseline
    - Hairline dividers
    - No decoration, only structure

    Produce implementation-ready spec with IMPLEMENTATION HANDOFF section.
  `
})
```

---

## 3. Key Design Principles (Applied by All Agents)

The following principles are passed to whichever agent handles the request:

### Core Heuristics
- **Anti-Bullet Hell**: No long bullet lists; use micro-headlines, fact grids, insight rows
- **Alignment Discipline**: Text left, numbers right, fixed card zones
- **Lines as Architecture**: Hairline rules for structure, not decoration
- **Color Discipline**: Near-grayscale base, ≤20% accent usage
- **Spacing System**: 8px grid, 4px baseline, no random gaps
- **Hierarchy Ceiling**: Max 4 levels of visual hierarchy

### Thinking Scaffold
The agent will follow: FRAME → STRUCTURE → SURFACE → IMPLEMENTATION HANDOFF

---

## 4. Output Format

The agent will produce a design spec with:

```markdown
✨ DESIGN CONCEPT SPECIFICATION

PROJECT: [If specified]
REQUEST: [What was asked]

DESIGN SYSTEM CONTEXT
- [Key tokens and rules being applied]

CONCEPT EXPLORATION
- [2-3 concepts if appropriate]
- [Selected concept with rationale]

STRUCTURE
- [Information architecture]
- [Section breakdown]
- [Component hierarchy]

VISUAL DESIGN
- [Typography application]
- [Color usage]
- [Spacing and layout]

> IMPLEMENTATION HANDOFF FOR FRONTEND BUILDER

Tasks:
1. [Specific implementation steps]
2. [Component creation order]
3. [Token applications]
4. [Responsive considerations]
```

---

## 5. Usage Examples

```bash
# Generic quiet-luxury design
/design-director Dashboard for analytics

# Project-specific design
/design-director --project mm Product listing page
/design-director --project fox Data visualization dashboard
/design-director --project obdn Landing page with hero

# The output can be used with:
/mm --build [Using spec from design-director]
/fox --build [Using spec from design-director]
```

---

## 6. How It Works

This command acts as a router:
1. Detects if a project is specified (--project flag)
2. Routes to the appropriate concept agent
3. Passes design constraints and methodology
4. Returns implementation-ready spec

The concept agents handle:
- Design system application
- Concept exploration (when appropriate)
- Implementation handoff format
- Project-specific patterns and precedents