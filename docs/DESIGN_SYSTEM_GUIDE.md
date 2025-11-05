# Design System Guide

**Project:** claude-vibe-code
**Last Updated:** 2025-11-01
**Status:** Active

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Architecture](#architecture)
3. [Typography System](#typography-system)
4. [ASCII Diagram System](#ascii-diagram-system)
5. [Workflows](#workflows)
6. [Commands](#commands)
7. [Agents](#agents)
8. [Hooks](#hooks)
9. [Quality Gates](#quality-gates)
10. [Project Files](#project-files)
11. [Tech Stack](#tech-stack)
12. [Enforcement](#enforcement)
13. [Brand Memory](#brand-memory)

---

## Design Philosophy

**Design-OCD is non-negotiable.**

### Mathematical Precision

**Every visual decision must be calculated:**
- **Spacing:** Mathematical progression (4px/8px/16px/24px/32px scale)
- **Alignment:** Formula-based, not eyeballed
- **Box sizes:** Standard widths, not random
- **Typography:** Harmonious scales, not arbitrary pt sizes

### Zero Tolerance

- ❌ No arbitrary values
- ❌ No eyeballed alignment
- ❌ No random spacing
- ❌ No abbreviating or cutting corners

### Core Principles

1. **Optical alignment over geometric alignment**
2. **Visual bugs = as critical as functional bugs**
3. **Design review is MANDATORY, not optional**
4. **Evidence-based verification** (screenshots, accessibility audits)

---

## Architecture

### Source of Truth Flow

```
design-system-vX.X.X.md          ← SINGLE SOURCE OF TRUTH
    ↓ (regenerate)
design-dna.json                   ← Auto-generated, consumed by code
    ↓ (regenerate)
design-system-vX.X.X.html         ← Visual reference
    ↓
All code/docs reference this      ← Everything stays in sync
```

### Rules

1. **NEVER use inline CSS** - All styling must use design system tokens/classes
2. **Design system .md file is source of truth** - All changes flow from here
3. **One change propagates everywhere** - Update .md → regenerate JSON → update HTML → everything syncs

### File Locations

```
design-system-vX.X.X.md    # Source (project root or design-dna/)
design-dna.json            # Generated tokens
design-system-vX.X.X.html  # Visual reference
```

### Workflow

```bash
1. Edit design-system-vX.X.X.md
2. Regenerate design-dna.json from .md
3. Regenerate .html from .md
4. All code references design-dna.json tokens
5. Single source → consistent everywhere
```

### Enforcement

- **Inline CSS** → Immediate violation
- **Manual JSON edits** → Violation (must regenerate from .md)
- **Documentation drift** → Violation (must reference design-system .md)

---

## Typography System

| Use Case | Typeface | When to Use |
|----------|----------|-------------|
| Text headings, taglines | **GT Pantheon** | Primary display typography |
| **CARD HEADINGS ONLY** | **Domaine Sans** | Component card titles |
| Body text | **Supreme LL** | All paragraph content |
| Monospace | **Unica77 Mono** | Code, technical content |

### Font File Locations

```
out/fonts/
├── GT Pantheon/
├── Domaine Sans Display 1.002/
├── Domaine Sans Text 1.002/
├── Supreme LL 3.0/
└── Unica77 Mono LL v3.0/
```

---

## ASCII Diagram System

### Strict Rules

**Box Widths (ONLY these values):**
- 20 characters
- 30 characters
- 40 characters
- 60 characters

**Grid System:**
- **4-space** alignment (no tabs, no 2-space)
- **Mathematical centering** (calculate, don't eyeball)

**Allowed Characters:**
```
┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ▼
```

### Example

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                      Component Title                       │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│    ┌──────────────────┐    ┌──────────────────────────┐   │
│    │   Element A      │    │     Element B            │   │
│    │   (20 chars)     │    │     (30 chars)           │   │
│    └──────────────────┘    └──────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Reference

See: `asciidiagrams/` directory for examples and tooling

---

## Workflows

### 1. Creating New Layouts

**Command:** `/concept-new <description with inspiration>`

**Flow:**
```
Study references → Brainstorm approach → Generate mockup → Build
```

**When to use:**
- Brand new screen/component
- Fresh design exploration
- Starting from inspiration/examples

---

### 2. Iterating Existing Layouts

**Command:** `/concept <page/component to redesign>`

**Flow:**
```
AI assesses current design → Suggests improvements →
Conversational iteration → Generate mockup → Build
```

**When to use:**
- Improving existing designs
- Refinement based on feedback
- Evolution of current components

---

### 3. ASCII Mockups

**Command:** `/ascii-mockup <screen/component to mock>`

**Flow:**
```
Generate Fluxwing-style ASCII on 4-space grid with fixed box widths
```

**When to use:**
- Planning screens/flows
- Documentation
- Quick structural mockups

---

### 4. Visual QA

**Command:** `/visual-review http://localhost:8080/path`

**Flow:**
```
Chrome DevTools → Screenshot → Vision analysis → Accessibility audit
```

**When to use:**
- Before deployment
- After significant UI changes
- Accessibility verification

---

## Commands

### Design-Specific Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/concept` | Iterate existing layout | Improved design + mockup |
| `/concept-new` | Brand new layout | New design + mockup |
| `/ascii-mockup` | Generate ASCII diagrams | ASCII art on 4-space grid |
| `/visual-review` | Visual QA with screenshots | Screenshot + analysis + a11y audit |

### Related Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/enhance` | Transform vague requests | Unclear design requirements |
| `/ultra-think` | Deep design analysis | Complex design decisions |
| `/orca` | Multi-agent orchestration | Large design system work |

---

## Agents

### Design Specialists (11 total)

#### Foundation (3)

**design-system-architect**
- Creates and maintains design systems
- Extracts principles from references
- Generates design tokens, component patterns, brand guidelines

**style-translator**
- Converts design DNA into code
- Maintains design-code consistency

**ux-strategist**
- Flow simplification
- User journey mapping
- Premium UI aesthetics
- Data visualization strategy

---

#### Implementation (4)

**css-specialist**
- Global CSS implementation expert (primary styling approach)
- Token-driven CSS variables, semantic class architecture
- CSS Grid/Flex layout, animations, container/media queries

**ui-engineer**
- UI component implementation
- React/Vue/Angular with TypeScript
- State management, performance, accessibility

**design-compiler**
- (If exists - verify deployment status)

---

#### Quality (2)

**accessibility-specialist**
- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigation
- Screen reader support

**design-reviewer**
- **MANDATORY for production UIs**
- 7-phase review process
- Playwright MCP integration
- Visual verification + interaction testing + accessibility auditing

---

#### Verification (1)

**design-dna-linter**
- Validates design system compliance
- **Status:** Documented but needs deployment verification

---

#### Visual (1)

**visual-designer**
- Visual design specialist
- Hierarchy, typography, color, composition
- Layout mastery

---

## Hooks

### Design-Related Hooks

**load-design-dna.sh**
- Loads design DNA at session start
- Location: `.claude/hooks/` or `.claude-global-hooks/`
- Auto-loads design system context

### Hook Locations

```
.claude/hooks/              # Project-specific
.claude-global-hooks/       # Global (all projects)
```

---

## Quality Gates

### MANDATORY for UI Changes

**1. design-reviewer Agent**
- 7-phase review process
- Playwright MCP integration for visual verification
- Interaction testing
- Accessibility auditing
- **Blocks deployment if fails**

**2. Evidence Requirements**
- Screenshots (before/after)
- Accessibility audit results
- Visual verification output
- **Evidence budget ≥5 points**

**3. quality-validator**
- Verifies design-reviewer ran
- Checks evidence budget
- Confirms screenshots captured
- Validates accessibility

---

### Quality Gate Flow

```
UI changes made
    ↓
design-reviewer (MANDATORY)
    ↓
Evidence collected (screenshots, a11y audit)
    ↓
quality-validator (verifies evidence)
    ↓
Pass → Deploy
Fail → Block + Report
```

---

## Project Files

### Directory Structure

```
claude-vibe-code/
├── design-system-vX.X.X.md       # Source of truth
├── design-dna.json               # Auto-generated tokens
├── design-system-vX.X.X.html     # Visual reference
│
├── docs/
│   ├── DESIGN_SYSTEM_GUIDE.md    # This file
│   ├── brand/
│   │   └── marina-moscone.md     # Brand strategy memory
│   └── design-atlas.md           # (If exists)
│
├── agents/specialists/design-specialists/
│   ├── foundation/
│   │   ├── design-system-architect.md
│   │   ├── style-translator.md
│   │   └── ux-strategist.md
│   ├── implementation/
│   │   ├── css-specialist.md
│   │   ├── design-compiler.md
│   │   ├── css-specialist.md
│   │   └── ui-engineer.md
│   ├── quality/
│   │   ├── accessibility-specialist.md
│   │   └── design-reviewer.md
│   ├── verification/
│   │   └── design-dna-linter.md
│   └── visual/
│       └── visual-designer.md
│
├── asciidiagrams/                # ASCII diagram tooling
│   ├── agg.json
│   ├── index.html
│   ├── main.js
│   └── style.css
│
└── .claude/hooks/
    └── load-design-dna.sh
```

---

## Tech Stack

### Design Layer

- **Styling:** Global CSS (CSS variables + semantic classes)
- **React:** Next.js 14 App Router
- **TypeScript:** Strict mode
- **Visual Testing:** Playwright (via chrome-devtools MCP)
- **Typography:** Custom fonts (GT Pantheon, Domaine Sans, Supreme LL, Unica77 Mono)

### Supporting Tools

- **Chrome DevTools MCP:** Visual verification, screenshots, accessibility audits
- **Design DNA System:** Token-based design system
- **ASCII Diagrams:** Mathematical grid system

---

## Enforcement

### Violations

| Violation | Severity | Consequence |
|-----------|----------|-------------|
| Inline CSS | 🔴 Critical | Immediate block |
| Manual JSON edits | 🔴 Critical | Must regenerate from .md |
| Documentation drift | 🟡 High | Must sync references |
| Eyeballed alignment | 🟡 High | Must use mathematical calculation |
| Arbitrary spacing values | 🟡 High | Must use scale (4/8/16/24/32px) |
| Skip design review | 🔴 Critical | Deployment blocked |

### Quality Standards

**From Global CLAUDE.md:**
- Design review is **MANDATORY, not optional**
- Visual bugs = as critical as functional bugs
- Zero tolerance for visual inconsistencies
- Mathematical, not arbitrary decisions

**quality-validator Checks:**
- design-reviewer ran for UI changes ✅
- Evidence budget ≥5 points ✅
- Screenshots captured ✅
- Accessibility verified ✅

---

## Brand Memory

### Marina Moscone

**File:** `docs/brand/marina-moscone.md`

**Status:** Stub (awaiting details)

**Purpose:**
- Brand promise
- Positioning
- Audience insights
- Tone & voice
- Visual system details
- Messaging pillars
- Competitive landscape

**Used by:**
- `creative-strategist` agent (recalls at start of every analysis)
- Grounds all design decisions in brand context

**Structure:**
```
Brand Promise → Positioning → Audience Insight →
Tone & Voice → Visual System → Messaging Pillars →
Competitive Landscape → Performance Learnings →
Creative Heuristics → Guardrails
```

---

## Complete Design Flow

### End-to-End Workflow

```
┌────────────────────────────────────────────────────────────┐
│                   User Requests Design Work                │
└────────────────────┬───────────────────────────────────────┘
                     ▼
          ┌──────────────────────┐
          │  /concept or         │
          │  /concept-new        │
          │  (ideation)          │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │  Brainstorm →        │
          │  Generate ASCII      │
          │  mockup              │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────────────────┐
          │  Implement                       │
          │  (ui-engineer +                  │
          │   css-specialist)           │
          │  Uses design-dna.json tokens     │
          └──────────┬───────────────────────┘
                     ▼
          ┌──────────────────────┐
          │  Build               │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────────────────┐
          │  /visual-review                  │
          │  (screenshot + accessibility)    │
          └──────────┬───────────────────────┘
                     ▼
          ┌──────────────────────────────────┐
          │  design-reviewer                 │
          │  (MANDATORY quality gate)        │
          └──────────┬───────────────────────┘
                     ▼
          ┌──────────────────────────────────┐
          │  Evidence Collection             │
          │  - Screenshots                   │
          │  - Accessibility audit           │
          │  - Visual verification           │
          └──────────┬───────────────────────┘
                     ▼
          ┌──────────────────────┐
          │  Ship                │
          │  (or iterate based   │
          │   on review)         │
          └──────────────────────┘
```

---

## Quick Reference

### Key Principles

1. **Mathematical precision** → No arbitrary values
2. **Design DNA as single source** → One change propagates everywhere
3. **Multi-layer quality gates** → design-reviewer + quality-validator
4. **Evidence-based verification** → Screenshots + accessibility + visual proof
5. **Zero inline CSS** → All styling from design system

### Commands Cheat Sheet

```bash
# New layout from scratch
/concept-new <description with inspiration>

# Iterate existing design
/concept <page/component>

# ASCII mockup
/ascii-mockup <component>

# Visual QA
/visual-review http://localhost:8080/path

# Deep design thinking
/ultra-think <design challenge>

# Multi-agent design work
/orca
```

### File Paths

```bash
# Source of truth
design-system-vX.X.X.md

# Generated tokens
design-dna.json

# Visual reference
design-system-vX.X.X.html

# Brand memory
docs/brand/marina-moscone.md

# Agent definitions
agents/specialists/design-specialists/
```

---

## Troubleshooting

### Common Issues

**Issue:** Changes not reflected in code
- **Solution:** Regenerate `design-dna.json` from `.md` source

**Issue:** Inline CSS used
- **Solution:** Extract to design system tokens, update `.md` source

**Issue:** Visual bugs in production
- **Solution:** Run `/visual-review` before deployment, ensure design-reviewer ran

**Issue:** Accessibility failures
- **Solution:** Use accessibility-specialist agent, check WCAG 2.1 AA compliance

**Issue:** Inconsistent spacing
- **Solution:** Verify using 4/8/16/24/32px scale, no arbitrary values

---

## Next Steps

### Pending Verification

- [ ] design-dna-linter deployment status
- [ ] design-compiler agent status
- [ ] Complete marina-moscone.md brand memory

### Future Enhancements

- [ ] Automated design token generation
- [ ] Visual regression testing
- [ ] Design system versioning strategy
- [ ] Component library documentation

---

**Last Updated:** 2025-11-01
**Maintained By:** Meta Orchestration System
**Questions/Issues:** Document in Workshop or create issue
