# PROJECT RULES TEMPLATE

**Copy this to claude_instructions.md or CLAUDE.md in your project root**

This template ensures agent orchestration is mandatory and prevents the "session continuation → direct coding → garbage" failure pattern.

---

# Claude Instructions for [PROJECT NAME]

## CRITICAL: Agent Orchestration Requirements

### MANDATORY Agent Usage

**UI/Frontend Work:**
- Any CSS/styling → `design-master` agent
- React/Next.js components → `frontend-developer` agent
- Design systems → `design-master` agent
- iOS/SwiftUI views → `swiftui-specialist` agent

**Quality Gates:**
- After ANY code changes → `code-reviewer-pro` agent
- Security-sensitive code → `security-auditor` agent
- Complex debugging → `debugger` agent + `systematic-debugging` skill

**Planning:**
- New features → `brainstorming` skill FIRST
- Complex architecture → domain-specific architect agent
- Multi-agent workflows → `agent-organizer`

### NEVER Do These Things Directly

❌ **DO NOT** write CSS without design-master agent
❌ **DO NOT** implement UI components without frontend-developer agent
❌ **DO NOT** skip code-reviewer-pro after code changes
❌ **DO NOT** assume you remember design rules from previous session

✅ **DO** re-read this file at session start
✅ **DO** use specialized agents for their domains
✅ **DO** run code review before presenting work

## Session Start Protocol

**In continuation sessions, BEFORE any work:**

1. Read `.claude/SESSION_START.md`
2. Read this file (claude_instructions.md)
3. Read design system docs (if applicable)
4. Verify current todos specify which agents to use
5. If implementing code, determine which agent should do it

**Red Flag Test:**
If you're about to write code and you haven't launched an agent, you're doing it wrong.

## Project-Specific Rules

### Design System

**Location:** [e.g., docs/OBDN-Design-System-v3.0.md]

**Key Rules:**
- [e.g., "10 Cardinal Sins" - never break these]
- [e.g., Typography: Domaine Sans Display for headers]
- [e.g., Spacing: 8px base unit, mathematical scale]
- [e.g., Colors: Gold accent #D4AF37]

**Enforcement:**
- design-master agent knows these rules
- code-reviewer-pro validates adherence
- You do NOT implement design without reading these docs

### Architecture Patterns

**Tech Stack:** [e.g., Next.js 14, React 18, TypeScript, Tailwind]

**Patterns to Follow:**
- [e.g., Server components by default]
- [e.g., Client components only when needed]
- [e.g., API routes in app/api]

**Agents for Architecture:**
- Planning → [e.g., nextjs-pro, react-pro]
- Implementation → [e.g., frontend-developer]
- Review → code-reviewer-pro

### Testing Requirements

**What Must Be Tested:**
- [e.g., Business logic calculations]
- [e.g., User input validation]
- [e.g., Medical data integrity]

**Testing Agents:**
- Use `test-driven-development` skill
- Agent should write tests FIRST
- Verify with code-reviewer-pro

## Workflow Examples

### Example 1: Adding a New UI Component

**CORRECT Workflow:**
```
1. Read design system docs
2. Use brainstorming skill to refine requirements
3. Launch design-master agent with:
   - Component requirements
   - Design system constraints
   - File location
4. Agent delivers component + styles
5. Launch code-reviewer-pro to validate
6. Present to user
```

**INCORRECT Workflow:**
```
1. See todo "Create new component"
2. Code it yourself directly
3. Break design rules you forgot
4. Present garbage
```

### Example 2: Bug Fix

**CORRECT Workflow:**
```
1. Use systematic-debugging skill
2. Launch debugger agent to find root cause
3. Write failing test first
4. Fix the bug
5. Launch code-reviewer-pro
6. Verify tests pass
```

**INCORRECT Workflow:**
```
1. Guess at the fix
2. Make changes without tests
3. Hope it works
```

## Success Metrics

**How to Know You're Doing It Right:**
- ✅ You launched at least one agent for implementation work
- ✅ You ran code-reviewer-pro before presenting code
- ✅ You followed the design system rules
- ✅ User says output is "production-quality"

**How to Know You Failed:**
- ❌ User says "this is unacceptable garbage"
- ❌ You broke design rules
- ❌ You coded directly without agents
- ❌ You skipped session start protocol

## Emergency Recovery

**If you realize mid-session you skipped agents:**

1. STOP immediately
2. Don't present current work
3. Read this file and design system docs
4. Launch appropriate agent to redo the work
5. Launch code-reviewer-pro
6. Then present

**Don't try to fix it yourself - let the agent start fresh.**

---

## Quick Reference

**Before starting work:** Read SESSION_START.md + this file
**UI work:** design-master or frontend-developer agent
**After code:** code-reviewer-pro agent
**Complex work:** brainstorming skill first
**When stuck:** Launch debugger agent + systematic-debugging skill

---

**Last Updated:** [DATE]
**Template Version:** 1.0
**Based On:** Injury protocol failure analysis (2025-10-20)
