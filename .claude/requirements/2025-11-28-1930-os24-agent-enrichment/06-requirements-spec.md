# Requirements Spec: OS 2.4 Agent Enrichment

**ID:** os24-agent-enrichment
**Tier:** complex
**Status:** complete
**Domain:** os-dev (cross-cutting)
**Created:** 2025-11-28

---

## 1. Problem Statement

OS 2.4 has 82 agents across 9 domains, but they are **too thin** compared to industry best practices. Research revealed:

- **V0's system prompt:** 1,267 lines with specific rules, thresholds, examples
- **OS 2.4 ios-builder:** 88 lines
- **OS 2.4 nextjs-builder:** 228 lines
- **Skills exist but aren't wired:** 70+ skills, only 7 agents reference them
- **Skills are essays, not rules:** No DO/DON'T lists, no thresholds

The result: agents lack specific guardrails that prevent generic output.

---

## 2. Solution Overview

Enrich all 82 agents with patterns extracted from competitor system prompts:

1. **Create 5 universal skills** that apply to all agents
2. **Inline lane-specific patterns** from V0, Perplexity, swift-agents-plugin
3. **Implement agent-level learning** via `.claude/agent-knowledge/`
4. **Add Playwright visual validation** to Shopify lane
5. **Use intelligent sizing** (200-800 lines based on agent complexity)

---

## 3. Functional Requirements

### FR-1: Universal Skills (Phase 1)

Create 5 new skill files that ALL agents will load:

| Skill | Source | Content |
|-------|--------|---------|
| `cursor-code-style` | Cursor Agent | Variable naming, guard clauses, nesting limits, comment rules |
| `lovable-pitfalls` | Lovable Prompt | 7 common pitfalls to avoid |
| `search-before-edit` | V0, Devin | Mandate grep/search before any file edit |
| `linter-loop-limits` | Cursor | Max 3 linter fix attempts, then ask user |
| `debugging-first` | Lovable, Replit | Use debugging tools before modifying code |

**Location:** `skills/{skill-name}/SKILL.md`

**Format:** Pure markdown (per detail answer)

**Skill Structure:**
```markdown
# Cursor Code Style

Rules extracted from Cursor Agent prompt for code quality.

## Variable Naming
- Never use 1-2 character variable names (EXCEPTION: loop counters i, j, k)
- Functions should be verbs/verb-phrases: `getUserById`, `calculateTotal`
- Variables should be nouns/noun-phrases: `userCount`, `totalPrice`
- Bad → Good: `genYmdStr` → `generateDateString`

## Control Flow
DO:
- Use guard clauses and early returns
- Handle error and edge cases first
- Keep nesting to 2-3 levels maximum

DON'T:
- Create deeply nested if/else chains
- Put happy path inside nested conditions

## Comments
DO:
- Add comments for complex code explaining "why" not "how"
- Document non-obvious business rules

DON'T:
- Add comments for trivial or obvious code
- Leave TODO comments (implement instead)
```

### FR-2: Agent Prompt Enrichment (Phase 2-3)

Update all 82 agents with:

1. **Knowledge loading section** (inline instruction):
```markdown
## Knowledge Loading
Before starting any task:
1. Check if `.claude/agent-knowledge/{agent-name}/patterns.json` exists
2. If exists, read and apply relevant patterns to your work
3. Track which patterns you apply during this task
```

2. **Skill references** (explicit loading):
```markdown
## Required Skills
You MUST apply these skills to all work:
- `cursor-code-style` — Variable naming, control flow, comments
- `lovable-pitfalls` — Common mistakes to avoid
- `search-before-edit` — Always grep before modifying files
- `linter-loop-limits` — Max 3 attempts on linter errors
- `debugging-first` — Debug tools before code changes
```

3. **Lane-specific patterns** (inline in relevant agents):

**Next.js/React agents:**
```markdown
## Design System Rules (V0/Lovable)
- Maximum 3-5 colors total. COUNT THEM EXPLICITLY before finalizing.
- Maximum 2 font families
- WCAG 4.5:1 contrast for normal text, 3:1 for large text
- Line-height 1.4-1.6 for body text
- No font sizes smaller than 14px for body content
- USE SEMANTIC TOKENS: never text-white, bg-black directly
- Components must be <50 lines. Refactor if larger.
```

**Research agents:**
```markdown
## Report Format (Perplexity)
- Minimum 5 main sections (## level) for comprehensive topics
- NEVER use bullet points or lists in final output
- Write flowing paragraphs that connect into narrative
- Citations inline: "statement[1][2]" not at end
- Do NOT create References section
- Break research into multiple steps, verbalize plan for user
```

**Data/Analytics agents:**
```markdown
## Citation Format (Codex)
- File citations: 【F:src/main.rs†L21-L31】
- Terminal citations: 【chunk_id†L1-L24】
- Test results prefixed: ✅ pass, ⚠️ warning, ❌ fail
- Use ripgrep (`rg`), never `grep -R` or `ls -R`
- Run ALL programmatic checks mentioned in project docs
```

**iOS agents:**
```markdown
## iOS Best Practices (swift-agents-plugin)
- Performance targets: 60fps scrolling, <100ms interaction response
- Accessibility compliance: WCAG 2.1 Level AA minimum
- @MainActor for ALL view models
- Use LazyStacks for long lists (>20 items)
- Structured Concurrency: prefer async/await over callbacks
- Never assume a library is available; check Package.swift first
```

### FR-3: Agent Learning System (Phase 4)

Implement persistent learning via file-based knowledge store.

**Directory structure:**
```
.claude/agent-knowledge/
├── nextjs-builder/
│   ├── patterns.json
│   ├── failures.json
│   └── metrics.json
├── ios-builder/
├── research-lead-agent/
└── ... (one per agent that executes tasks)
```

**patterns.json schema:**
```json
{
  "patterns": [
    {
      "id": "pattern-001",
      "description": "Use Tailwind @apply for repeated utility combinations",
      "category": "css",
      "successCount": 47,
      "failureCount": 4,
      "successRate": 0.92,
      "status": "promoted",
      "lastUsed": "2025-11-28",
      "examples": [
        ".btn-primary { @apply bg-blue-500 text-white px-4 py-2 rounded; }"
      ]
    }
  ],
  "metadata": {
    "agentName": "nextjs-builder",
    "created": "2025-11-28",
    "lastUpdated": "2025-11-28",
    "totalPatterns": 15,
    "promotedPatterns": 8
  }
}
```

**Lifecycle:**
1. **Start of task:** Agent reads patterns.json (inline instruction)
2. **During task:** Agent applies relevant patterns
3. **End of task:** Agent logs which patterns were used
4. **User feedback:** Success/failure signal captured
5. **Promotion:** Patterns with >85% success over 10+ uses get `status: "promoted"`

**Knowledge writing (add to agent prompt footer):**
```markdown
## Knowledge Persistence
After completing your task:
1. If you discovered a new effective pattern, add it to `.claude/agent-knowledge/{your-name}/patterns.json`
2. If a pattern failed, update its failureCount
3. If a previously promoted pattern consistently fails, flag for review
```

### FR-4: Shopify Visual Validation

Add Playwright MCP integration to Shopify agents:

**shopify-grand-architect.md:**
```markdown
## Visual Validation
The Shopify lane has access to Playwright MCP for visual validation.
When implementing UI changes:
1. Delegate to builder agent
2. After build completes, invoke shopify-ui-reviewer with Playwright
3. Reviewer takes screenshots and compares to spec
4. Iterate until visual match confirmed
```

**New agent: shopify-ui-reviewer.md** (if doesn't exist):
```markdown
---
name: shopify-ui-reviewer
description: Visual validation for Shopify themes using Playwright
tools: Read, Grep, Glob, Bash, mcp__playwright__browser_navigate, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_snapshot
---

# Shopify UI Reviewer

You review Shopify theme implementations by taking screenshots and comparing to design specs.

## Workflow
1. Start local Shopify development server (or use preview URL)
2. Navigate to page under review
3. Take screenshots at multiple breakpoints (mobile, tablet, desktop)
4. Compare against design spec or reference images
5. Report discrepancies with specific element references

## Breakpoints
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

## Tools
- Playwright MCP for browser control and screenshots
- Compare screenshots against `.claude/orchestration/evidence/` reference images
```

---

## 4. Technical Requirements

### TR-1: File Changes Summary

| Phase | Files Created | Files Modified | Estimated Lines |
|-------|--------------|----------------|-----------------|
| Phase 1 | 5 skill files | 0 | ~500 lines |
| Phase 2 | 0 | 30 builder agents | ~6,000 lines added |
| Phase 3 | 0 | 52 other agents | ~8,000 lines added |
| Phase 4 | 82 knowledge dirs | 82 agents (footer) | ~2,000 lines |
| Shopify | 1 new agent | 7 shopify agents | ~500 lines |

**Total:** ~17,000 lines of changes across ~90 files

### TR-2: Intelligent Agent Sizing

| Agent Type | Target Lines | Agents |
|------------|--------------|--------|
| Grand architects | 600-800 | 8 |
| Builders | 400-600 | 15 |
| Specialists | 300-500 | 35 |
| Reviewers/Gates | 200-400 | 18 |
| Light orchestrators | 200-300 | 6 |

### TR-3: Skill Reference Format

Agents reference skills via explicit section:
```markdown
## Required Skills
Load and apply these skills:
- `skills/cursor-code-style/SKILL.md`
- `skills/lovable-pitfalls/SKILL.md`
- `skills/search-before-edit/SKILL.md`
```

### TR-4: Backward Compatibility

- No breaking changes to existing agent behavior
- New sections are additive
- Knowledge loading is optional (checks if file exists)
- Skill references are recommendations until skills created

---

## 5. Response Awareness Tags

### `#PATH_DECISION` — Architecture Choices Locked

1. **Hybrid pattern delivery** — Universal patterns as skills, lane-specific inline
   - Rationale: Avoids duplication while preserving context-specificity

2. **Inline knowledge loading** — No hooks or MCP
   - Rationale: Simplest implementation, explicit in prompt

3. **File-based learning** — JSON in `.claude/agent-knowledge/`
   - Rationale: No database dependency, git-trackable

4. **User feedback for learning** — Not self-report
   - Rationale: Most reliable signal, avoids bias

5. **Pure markdown skills** — No YAML frontmatter
   - Rationale: Consistency with current format

### `#COMPLETION_DRIVE` — Assumptions Made

1. Agents can read/write to `.claude/agent-knowledge/` without special permissions
2. 85% success rate is appropriate promotion threshold
3. 10 occurrences is sufficient sample size for pattern promotion
4. Intelligent sizing ranges are appropriate

### `#POISON_PATH` — Patterns to Avoid

1. **Don't create 1,000+ line agents** — V0's length is exceptional, not target
2. **Don't duplicate universal patterns** — Use skills instead
3. **Don't add learning without metrics** — Must track success/failure
4. **Don't inline lane-specific patterns in universal skills**

### `#CONTEXT_DEGRADED` — Questions for Implementation

1. How will agents handle knowledge file corruption?
2. What happens if pattern promotion creates conflicts?
3. Should knowledge be per-project or global?

---

## 6. Acceptance Criteria

### AC-1: Universal Skills
- [ ] 5 skill files created in `skills/` directory
- [ ] Each skill has DO/DON'T lists with specific thresholds
- [ ] Skills are pure markdown format

### AC-2: Agent Enrichment
- [ ] All 82 agents have knowledge loading section
- [ ] All 82 agents reference universal skills
- [ ] Builder agents have lane-specific patterns inline
- [ ] Agent sizes match intelligent sizing guidelines

### AC-3: Learning System
- [ ] `.claude/agent-knowledge/` directory structure created
- [ ] Sample patterns.json for at least 3 agents
- [ ] Knowledge persistence instructions in agent footers
- [ ] Promotion threshold documented (85%, 10 occurrences)

### AC-4: Shopify Visual Validation
- [ ] shopify-ui-reviewer agent created (if new)
- [ ] Playwright MCP references in Shopify agents
- [ ] Screenshot breakpoints defined (375, 768, 1280)

### AC-5: Documentation
- [ ] Research catalog updated with implementation status
- [ ] Workshop entry documenting the enrichment
- [ ] ProjectContext decision logged

---

## 7. Implementation Phases

### Phase 1: Universal Skills (4-6 hours)
Create 5 skill files with extracted patterns:
1. `cursor-code-style/SKILL.md`
2. `lovable-pitfalls/SKILL.md`
3. `search-before-edit/SKILL.md`
4. `linter-loop-limits/SKILL.md`
5. `debugging-first/SKILL.md`

### Phase 2: Builder Agent Enrichment (12-16 hours)
Update 30 builder agents with:
- Knowledge loading section
- Skill references
- Lane-specific patterns

Priority order:
1. nextjs-builder, ios-builder, expo-builder-agent
2. shopify-liquid-specialist, shopify-js-specialist
3. Remaining builders

### Phase 3: Other Agent Enrichment (16-20 hours)
Update 52 remaining agents:
- Orchestrators (8)
- Specialists (35)
- Reviewers (9)

### Phase 4: Learning System (8-10 hours)
1. Create `.claude/agent-knowledge/` structure
2. Add knowledge persistence to agent footers
3. Create sample patterns for 5 key agents
4. Document promotion criteria

### Phase 5: Shopify Visual Validation (4-6 hours)
1. Create/update shopify-ui-reviewer
2. Add Playwright references to Shopify agents
3. Define review workflow

**Total estimated effort:** 44-58 hours

---

## 8. Suggested Next Step

```
✓ Spec complete: .claude/requirements/2025-11-28-1930-os24-agent-enrichment/06-requirements-spec.md
  Tier: complex
  Domain detected: os-dev

Suggested next step:
  /orca-os-dev -complex Implement requirement os24-agent-enrichment
```

The `/orca-os-dev` command will:
1. Read this spec from `.claude/requirements/`
2. Pass to os-dev-grand-architect
3. Respect `#PATH_DECISION` tags (don't re-decide architecture)
4. Execute in phases per Section 7

---

*Spec generated: 2025-11-28*
*Research source: .claude/research/reports/local-research-catalog-2025-11-28.md*
