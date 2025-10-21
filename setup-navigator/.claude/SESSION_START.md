# MANDATORY SESSION START CHECKLIST

**READ THIS FIRST - BEFORE ANY WORK IN CONTINUATION SESSIONS**

This checklist exists because of a critical failure: In a UI rebuild project, I continued from a previous session, saw a todo marked "in_progress", and jumped straight into coding WITHOUT re-establishing project context. The result was complete garbage that violated design rules I never loaded.

## The Failure Pattern

**What Happened:**
1. Session continued from previous conversation
2. System reminder said "continue from where we left off"
3. I saw todo #7 "in_progress"
4. I coded UI directly without reading project rules
5. I never invoked agents that were explicitly requested
6. Output was unacceptable garbage

**Root Cause:**
- No session start checklist to re-establish context
- Todos didn't specify which agents to use
- I didn't re-read user's original instructions about agent orchestration

## BEFORE ANY WORK - MANDATORY STEPS

### Step 1: Load Project Context

**ALWAYS read these files FIRST in continuation sessions:**

```bash
[ ] Read claude_instructions.md (if exists)
[ ] Read CLAUDE.md (if exists)
[ ] Read docs/*design-system*.md (if exists)
[ ] Read README.md for project rules
[ ] Check for .claude/rules.md or .claude/project-context.md
```

**Why:** Your original instructions are in these files. Without reading them, you're flying blind.

### Step 2: Check Current Todos

```bash
[ ] Review current todo list
[ ] Check if todos specify which agents to use
[ ] If agent not specified → STOP and determine which agent is needed
```

**Why:** Todos that say "Style components" without specifying "use design-master agent" led to direct coding disaster.

### Step 3: Verify Agent Orchestration Requirements

```bash
[ ] Is this UI/CSS/styling work? → MUST use design-master or frontend-developer agent
[ ] Is this frontend component work? → MUST use frontend-developer agent
[ ] Is this complex multi-step work? → Check for relevant skills/agents
[ ] Will I write ANY code? → MUST use code-reviewer-pro after
```

**Why:** The successful iOS project used 9 agents in parallel. The failed UI project used zero agents.

### Step 4: Re-read Original User Instructions

```bash
[ ] Scroll to START of conversation (or read session summary)
[ ] Check if user requested specific agents
[ ] Check if user requested specific workflows
[ ] Verify I'm following the requested approach
```

**Why:** User said "let's invoke brainstorm first" and "use agents" - I lost that context in continuation.

## MANDATORY AGENT USAGE RULES

### NEVER Code UI Directly

**If implementing:**
- Any UI/CSS/styling → design-master agent
- Frontend components → frontend-developer agent
- iOS views → swiftui-specialist agent
- Design systems → design-master agent

**If reviewing:**
- After ANY code changes → code-reviewer-pro agent
- Security-sensitive code → security-auditor agent

### Decision Tree

```
Am I about to write code?
├─ YES, it's UI/frontend
│  └─ Launch design-master or frontend-developer agent
│     └─ After completion, launch code-reviewer-pro
├─ YES, it's backend/logic
│  └─ Consider if agent would be better
│     └─ After completion, launch code-reviewer-pro
└─ NO, it's research/planning
   └─ Consider if brainstorming skill needed
```

## Red Flags - STOP Immediately If You Think:

- ❌ "This todo is in_progress, I'll just finish it"
- ❌ "I can quickly code this CSS"
- ❌ "The user said continue, so I won't ask questions"
- ❌ "I remember the design rules from before"
- ❌ "This is simple, agents are overkill"

**Correct Response:** STOP. Read project context files. Determine which agent to use. Launch agent.

## Success Pattern - What Worked

**iOS Project (90 minutes, production-quality output):**
1. Started with /enhance command
2. Created master todo list with agent assignments
3. Read project files FIRST (CLAUDE.md, globals.css, source)
4. Launched 9 specialized agents in 3 parallel waves
5. Each agent delivered production code + docs
6. Clear dependency management

**Why it worked:**
- Agent orchestration baked into plan from Step 0
- Every implementation step used specialized agent
- code-reviewer-pro checked everything
- Clear file-based handoffs between agents

## Summary

**The Rule:**
In continuation sessions, ALWAYS re-establish project context BEFORE any work.

**The Test:**
If you can't name which project rules apply and which agent should do this work, you haven't re-established context yet.

**The Commitment:**
I will read this checklist at the start of EVERY continuation session.
I will NEVER code UI/frontend directly without using design-master or frontend-developer agent.
I will ALWAYS use code-reviewer-pro before presenting any code.

---

**Last Updated:** 2025-10-20
**Created After:** Injury protocol UI rebuild failure
**Prevents:** Session continuation without context → direct coding → garbage output
