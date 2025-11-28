# Context Findings: OS 2.4 Agent Enrichment

Based on research catalog at `.claude/research/reports/local-research-catalog-2025-11-28.md`

---

## 1. Current State Analysis

### Agent Distribution (82 total)

| Domain | Agent Count | Current Avg Lines | Target Lines |
|--------|-------------|-------------------|--------------|
| Next.js | 14 | 150-228 | 400-600 |
| iOS | 19 | 88-200 | 400-600 |
| Expo | 11 | 100-180 | 400-600 |
| Shopify | 7 | 100-160 | 300-500 |
| Research | 8 | 120-200 | 300-400 |
| Data | 4 | 100-150 | 300-400 |
| SEO | 4 | 100-150 | 300-400 |
| Design | 2 | 150-200 | 400-500 |
| OS-Dev | 5 | 100-180 | 300-400 |
| Cross-cutting | 6 | 100-200 | 300-400 |

### Key Files to Modify

**Builder Agents (highest priority):**
- `agents/dev/nextjs-builder.md` (228 lines → 600)
- `agents/iOS/ios-builder.md` (88 lines → 500)
- `agents/expo/expo-builder-agent.md`
- `agents/shopify/shopify-liquid-specialist.md`

**Reviewer Agents:**
- `agents/dev/nextjs-design-reviewer.md` (already has Playwright)
- `agents/iOS/ios-ui-reviewer.md`
- `agents/expo/expo-verification-agent.md`

**Research Agents:**
- `agents/research/research-lead-agent.md`
- `agents/research/research-deep-writer.md`
- `agents/data/data-researcher.md`

---

## 2. Source Material Mapping

### Universal Skills to Create

| Skill Name | Source | Applies To |
|------------|--------|------------|
| `cursor-code-style` | Cursor Agent Prompt | ALL builder agents |
| `lovable-pitfalls` | Lovable Prompt.md | ALL agents |
| `search-before-edit` | V0 examples, Devin | ALL builders |
| `linter-loop-limits` | Cursor Agent | ALL builders |
| `debugging-first` | Lovable, Replit | ALL reviewers |

### Lane-Specific Patterns (Inline)

| Lane | Pattern Source | Key Patterns |
|------|----------------|--------------|
| **Next.js/React** | V0, Lovable | Design system tokens, <50 line components, semantic colors |
| **iOS** | swift-agents-plugin | 60fps targets, @MainActor, WCAG AA, navigation patterns |
| **Shopify** | Bolt, Cursor | Holistic thinking, Liquid best practices |
| **Research** | Perplexity | 10K words, never-use-lists, 5+ sections, citations |
| **Data** | Codex, Replit | Line citations【F:file†L1-L10】, data integrity |

---

## 3. New Directory Structure

```
.claude/
├── agent-knowledge/           # NEW - Agent learning persistence
│   ├── nextjs-builder/
│   │   ├── patterns.json      # Successful patterns (>85% success)
│   │   ├── failures.json      # Failed approaches to avoid
│   │   └── metrics.json       # Performance tracking
│   ├── ios-builder/
│   └── ... (per-agent subdirectories)
│
├── skills/                    # Existing, add new universal skills
│   ├── cursor-code-style/     # NEW
│   │   └── SKILL.md
│   ├── lovable-pitfalls/      # NEW
│   │   └── SKILL.md
│   ├── search-before-edit/    # NEW
│   │   └── SKILL.md
│   └── ...
```

---

## 4. Pattern Extraction Summary

### From Cursor (→ All Builders)

```markdown
## Code Style Rules
- Never use 1-2 character variable names
- Functions = verbs, variables = nouns
- Guard clauses/early returns mandatory
- Max nesting: 2-3 levels
- Comments explain "why" not "how"

## Linter Rules
- Do NOT loop more than 3 times fixing linter errors
- On third failure, ask user for help

## Search Rules
- Semantic search is MAIN exploration tool
- Run multiple searches with different wording
- Broad queries first, then specific
```

### From Lovable (→ All Agents)

```markdown
## Common Pitfalls to AVOID
- READING CONTEXT FILES: Never read files already in context
- WRITING WITHOUT CONTEXT: Must read file before writing
- SEQUENTIAL TOOLS: Batch independent operations
- PREMATURE CODING: Don't code until explicitly asked
- OVERENGINEERING: No "nice-to-have" features
- SCOPE CREEP: Stay within explicit request
- MONOLITHIC FILES: <50 lines per component
```

### From V0 (→ Frontend Agents)

```markdown
## Design System Rules
- Maximum 3-5 colors total (count explicitly)
- Maximum 2 font families
- WCAG 4.5:1 contrast for normal text
- WCAG 3:1 contrast for large text
- Line-height 1.4-1.6 for body
- No font sizes <14px for body
- Mobile-first responsive design
- Semantic HTML with proper landmarks
```

### From Perplexity (→ Research Agents)

```markdown
## Report Format
- Minimum 10,000 words for comprehensive topics
- NEVER use bullet points or lists
- Flowing paragraphs only
- Minimum 5 main sections (## level)
- Citations inline: "statement[1][2]"
- No References section at end

## Planning Rules
- Break into multiple steps
- Assess sources for usefulness
- Verbalize plan for user to follow
- Review before writing
```

### From Codex (→ Data/Research Agents)

```markdown
## Citation Format
- File citations: 【F:src/main.rs†L21-L31】
- Terminal citations: 【chunk_id†L1-L24】
- Each test prefixed: ✅, ⚠️, or ❌

## Environment Rules
- Use ripgrep (`rg`), never `grep -R` or `ls -R`
- Run ALL programmatic checks from AGENTS.md
```

### From Devin (→ Orchestrators + Builders)

```markdown
## Planning Mode
- Always either "planning" or "standard" mode
- Planning: gather ALL info before acting
- Know ALL locations you will edit before starting

## Code Conventions
- Mimic existing code style exactly
- Use existing libraries and utilities
- NEVER assume a library is available
- Look at neighboring files for patterns
- Never modify tests unless explicitly asked
```

---

## 5. Agent Learning System Design

Based on Equilateral's STANDARDS methodology:

### Knowledge Structure

```json
// .claude/agent-knowledge/{agent}/patterns.json
{
  "patterns": [
    {
      "id": "pattern-001",
      "description": "Use Tailwind @apply for repeated utility patterns",
      "successRate": 0.92,
      "occurrences": 47,
      "lastUsed": "2025-11-28",
      "context": "CSS architecture",
      "status": "promoted"  // promoted (>85%), candidate, retired
    }
  ]
}
```

### Agent Lifecycle Hooks

1. **Before Task:** Read `.claude/agent-knowledge/{agent}/patterns.json`
2. **During Task:** Track pattern applications
3. **After Task:** Update patterns.json with outcome
4. **Promotion:** Patterns with >85% success over 10+ occurrences get promoted

### Integration Points

- Agents read knowledge at startup (add to prompt header)
- Agents write knowledge at completion (add to prompt footer)
- `/audit` reviews pattern effectiveness
- `/reflect` can manually promote/retire patterns

---

## 6. Risk Assessment

### `#PATH_DECISION` — Architecture Choices Made

1. **Hybrid pattern delivery** — Universal skills + inline lane-specific
2. **Learning persistence** — File-based JSON, not database
3. **No MDX format** — Keep existing Task tool syntax
4. **Playwright scope** — Next.js + Shopify, not Expo

### `#COMPLETION_DRIVE` — Assumptions Made

1. Assuming 400-600 lines is optimal agent size (based on V0 at 1,267 being overkill)
2. Assuming 85% success rate threshold for pattern promotion
3. Assuming agents can read/write to `.claude/agent-knowledge/` without MCP

### `#POISON_PATH` — Patterns to Avoid

1. **Don't create 1,000+ line agents** — V0's 1,267 is exceptional, not target
2. **Don't duplicate patterns across 82 agents** — Use skills for universal patterns
3. **Don't add learning without metrics** — Must track success/failure
4. **Don't inline lane-specific patterns in skills** — Keeps skills focused

### `#CONTEXT_DEGRADED` — Areas Needing More Info

1. How exactly will agents read `.claude/agent-knowledge/` at startup?
2. How will learning interact with ProjectContext MCP?
3. What's the storage overhead of per-agent knowledge files?

---

## 7. Dependencies

### Phase Dependencies

```
Phase 1: Universal Skills
    ↓
Phase 2: Builder Agent Enrichment (depends on Phase 1 skills)
    ↓
Phase 3: Reviewer/Research Agent Enrichment
    ↓
Phase 4: Learning System (can run parallel to Phase 3)
```

### External Dependencies

- Playwright MCP must be configured for Shopify validation
- XcodeBuildMCP already available for iOS
- Context7 MCP available for library docs

---

*Context findings complete. Ready for detail questions.*
