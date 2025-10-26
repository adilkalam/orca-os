# Superpowers Plugin Configuration

**Date**: 2025-10-24
**Status**: Partially disabled - using only brainstorming skill

---

## What We Disabled and Why

### Disabled Agents (0 tokens saved)

**superpowers:code-reviewer** (247 tokens)
- **Why**: We have better alternatives built into /orca
- **Replacement**: quality-validator + verification-agent + design-reviewer
- **Advantages**:
  - Evidence-based validation (not just code review)
  - Domain-specific (45 specialized agents vs 1 generic reviewer)
  - Integration with Response Awareness, Reference Parity Gate, /visual-review

**Location**: `/Users/adilkalam/.claude/plugins/cache/superpowers/agents/code-reviewer.md.disabled`

### Disabled Commands

**1. /brainstorm** → Use /concept instead
- **Why**: /concept integrates design system learning + brainstorming
- **Our version**: /concept uses superpowers:brainstorming skill internally but adds design context

**2. /write-plan** → Use /orca instead
- **Why**: /orca does automated planning with project detection
- **Advantages**:
  - Auto-detects project type (iOS/web/backend)
  - Selects appropriate specialist team (21 iOS, 5 frontend, 12 design)
  - Reference capture before implementation (prevents rework)

**3. /execute-plan** → Use /orca instead
- **Why**: /orca executes automatically with quality gates
- **Advantages**:
  - Built-in verification-agent (Response Awareness)
  - Built-in quality-validator (Reference Parity Gate)
  - Built-in /visual-review integration
  - Domain-specific agents execute the plan

**Locations**:
- `/Users/adilkalam/.claude/plugins/cache/superpowers/commands/brainstorm.md.disabled`
- `/Users/adilkalam/.claude/plugins/cache/superpowers/commands/write-plan.md.disabled`
- `/Users/adilkalam/.claude/plugins/cache/superpowers/commands/execute-plan.md.disabled`

---

## What We Keep Using

### Skills (Brainstorming Only)

**superpowers:brainstorming** - Used by /concept
- **Why**: Excellent Socratic method for refining design ideas
- **Integration**: /concept calls this skill during design exploration
- **Location**: `/Users/adilkalam/.claude/plugins/cache/superpowers/skills/brainstorming/`

**Other superpowers skills** (available but not actively used):
- condition-based-waiting
- defense-in-depth
- dispatching-parallel-agents
- receiving-code-review
- requesting-code-review
- root-cause-tracing
- systematic-debugging
- test-driven-development
- testing-anti-patterns
- verification-before-completion
- writing-skills
- etc.

These are passive knowledge - Claude Code can reference them if needed, but we don't actively invoke them.

---

## Context Savings

**Before**:
- superpowers:code-reviewer agent: 247 tokens loaded into every context
- /brainstorm, /write-plan, /execute-plan commands: Available but redundant

**After**:
- **247 tokens saved** (code-reviewer agent disabled)
- **Cleaner command space** (3 redundant commands removed)
- **Skills still available** (brainstorming and others)

---

## Our Complete Replacement System

### /orca System (Replaces superpowers orchestration)

```
Superpowers:                    Our /orca System:
---------------------------     ---------------------------
/write-plan                  →  Phase 0: Reference Capture
/execute-plan                →  Phase 1-7: Automated workflow
code-reviewer agent          →  quality-validator + verification-agent
                                + design-reviewer + /visual-review

Generic planning             →  Domain-specific orchestration:
                                - iOS Team (21 specialists)
                                - Frontend Team (5 specialists)
                                - Design Team (12 specialists)
                                - Auto-detection + team selection
```

### Quality System (Superior to code-reviewer)

```
Superpowers code-reviewer:      Our Quality Stack:
---------------------------     ---------------------------
Code review after work       →  Response Awareness (during work)
Generic feedback             →  Meta-cognitive tags + verification

                                verification-agent:
                                - Searches for PLAN_UNCERTAINTY
                                - Verifies with grep/bash
                                - Evidence-based validation

                                quality-validator:
                                - Reference Parity Gate (70% threshold)
                                - Zero-Tag Gate (no unresolved tags)
                                - Requirements coverage (100%)

                                design-reviewer:
                                - Design system compliance
                                - HIG compliance (iOS)
                                - Aesthetic sophistication

                                /visual-review:
                                - Vision-based UI analysis
                                - Screenshot verification
                                - Design standards checklist
```

---

## Comparison: Superpowers vs Our System

| Feature | Superpowers | Our System | Winner |
|---------|-------------|------------|--------|
| **Agents** | 1 (code-reviewer) | 45 (domain specialists) | ✅ Ours |
| **Planning** | Generic /write-plan | Reference capture + auto-detect | ✅ Ours |
| **Execution** | Generic /execute-plan | Domain-specific orchestration | ✅ Ours |
| **Quality** | Code review skill | 4-layer validation stack | ✅ Ours |
| **Design** | Not design-focused | /concept, /visual-review, design specialists | ✅ Ours |
| **Brainstorming** | Excellent skill | Uses their skill! | ✅ Theirs |

---

## Plugin Configuration

**Enabled Plugins** (in `~/.claude/settings.json`):
```json
"enabledPlugins": {
  "elements-of-style@superpowers-marketplace": true,
  "superpowers@superpowers-marketplace": true,        // Enabled for skills
  "claude-mem@thedotmack": true,
  "git@claude-code-plugins": true,
  "commit-commands@claude-code-plugins": true
}
```

**Plugin kept enabled** because:
- ✅ Provides brainstorming skill (used by /concept)
- ✅ Skills are passive (no context cost unless invoked)
- ✅ Agent and commands disabled manually (*.md.disabled)

---

## Maintenance

**If superpowers updates**, the disabled files will need to be re-disabled:
```bash
# After plugin update, re-disable:
mv ~/.claude/plugins/cache/superpowers/agents/code-reviewer.md \
   ~/.claude/plugins/cache/superpowers/agents/code-reviewer.md.disabled

mv ~/.claude/plugins/cache/superpowers/commands/brainstorm.md \
   ~/.claude/plugins/cache/superpowers/commands/brainstorm.md.disabled

mv ~/.claude/plugins/cache/superpowers/commands/write-plan.md \
   ~/.claude/plugins/cache/superpowers/commands/write-plan.md.disabled

mv ~/.claude/plugins/cache/superpowers/commands/execute-plan.md \
   ~/.claude/plugins/cache/superpowers/commands/execute-plan.md.disabled
```

**Check if re-disabling is needed:**
```bash
ls ~/.claude/plugins/cache/superpowers/agents/*.md 2>/dev/null && echo "⚠️  Need to re-disable agents"
ls ~/.claude/plugins/cache/superpowers/commands/*.md 2>/dev/null && echo "⚠️  Need to re-disable commands"
```

---

## Summary

**We use 1 thing from superpowers**: brainstorming skill

**We don't use**: code-reviewer agent, /brainstorm, /write-plan, /execute-plan

**Why**: Our /orca system provides superior domain-specific orchestration with 45 specialized agents, built-in quality gates, and design system integration.

**Result**: 247 tokens saved, cleaner command space, better quality system.
