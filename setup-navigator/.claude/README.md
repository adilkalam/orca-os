# Agent Orchestration Failure Prevention System

**Created:** 2025-10-20
**Purpose:** Prevent "session continuation without context → direct coding → garbage output" failures

---

## What Happened

Two concurrent projects with drastically different outcomes:

**iOS Project (SUCCESS):**
- 9 agents in 90 minutes → production-quality app
- User: "worked beautifully well", "incredibly efficient"

**Injury Protocol UI Rebuild (CATASTROPHIC FAILURE):**
- 0 agents used → complete garbage
- User: "complete shit show", "unacceptable levels of garbage"

**Root Cause:** Session continued from previous conversation. I saw todo marked "in_progress", jumped straight into coding CSS without re-reading project rules or launching agents. Never used design-master or code-reviewer-pro. Output violated design rules I never loaded.

---

## The Prevention System

### Three Documents Created

1. **SESSION_START.md** - Mandatory checklist for continuation sessions
2. **PROJECT_RULES_TEMPLATE.md** - Template for project-level agent requirements
3. **FAILURE_ANALYSIS.md** - Complete failure documentation

---

## How to Use This System

### For Active Projects

1. **Copy the template to your project:**
   ```bash
   cp .claude/PROJECT_RULES_TEMPLATE.md /path/to/your/project/claude_instructions.md
   ```

2. **Customize it:**
   - Update `[PROJECT NAME]` placeholder
   - Fill in design system location and rules
   - Add tech stack details
   - Specify testing requirements

3. **Update your todos:**
   ```
   ❌ OLD: "Style all new components"
   ✅ NEW: "Use design-master agent to style all new components"
   ```

### For New Projects

**Start every project with:**
1. `/enhance` command to structure requirements
2. Create master todo list with agent assignments
3. Copy `PROJECT_RULES_TEMPLATE.md` as `claude_instructions.md`
4. Read design system docs first

### For Continuation Sessions

**Claude must:**
1. Read `SESSION_START.md` FIRST
2. Read project's `claude_instructions.md`
3. Check if todos specify agent usage
4. Re-establish context before ANY work

**Never:**
- Jump straight into coding because todo is "in_progress"
- Assume design rules from memory
- Skip agent orchestration for "quick" work

---

## The Documents Explained

### SESSION_START.md

**Purpose:** Mandatory checklist that forces context re-establishment

**Key Sections:**
- The Failure Pattern (what happened and why)
- Step 1: Load Project Context (which files to read)
- Step 2: Check Current Todos (verify agent assignments)
- Step 3: Verify Agent Orchestration Requirements
- Step 4: Re-read Original User Instructions
- Red Flags (thoughts that should trigger STOP)

**When to use:** Start of EVERY continuation session

### PROJECT_RULES_TEMPLATE.md

**Purpose:** Project-level instructions that specify mandatory agent usage

**Key Sections:**
- Mandatory Agent Usage matrix
- Session Start Protocol
- Project-Specific Rules (design system, architecture, testing)
- Workflow Examples (correct vs incorrect)
- Emergency Recovery (if you catch yourself skipping agents)

**When to use:** Copy to each project as `claude_instructions.md`

### FAILURE_ANALYSIS.md

**Purpose:** Complete documentation of what went wrong and how to prevent it

**Key Sections:**
- What iOS Project Did RIGHT (9-agent orchestration)
- What Injury Protocol Did WRONG (0 agents)
- The Exact Breakpoint (session continuation without context)
- Prevention Strategy (the three documents)
- Lessons Learned
- Commitment

**When to use:** Reference when setting up new projects or if similar failures occur

---

## The Core Rules

### MANDATORY Agent Usage

**UI/Frontend:**
- CSS/styling → `design-master` agent
- React/Next.js → `frontend-developer` agent
- iOS/SwiftUI → `swiftui-specialist` agent

**Quality Gates:**
- After ANY code → `code-reviewer-pro` agent
- Security code → `security-auditor` agent
- Debugging → `debugger` agent + `systematic-debugging` skill

**Planning:**
- New features → `brainstorming` skill FIRST
- Architecture → domain-specific architect agent

### NEVER Do These

❌ Write CSS without design-master agent
❌ Implement UI without frontend-developer agent
❌ Skip code-reviewer-pro after code changes
❌ Assume you remember design rules from previous session

### ALWAYS Do These

✅ Re-read project context at session start
✅ Use specialized agents for their domains
✅ Run code review before presenting work
✅ Launch agents even for "quick" work

---

## Quick Start for Your Next Project

```bash
# 1. Copy template to your project
cp ~/claude-vibe-code/setup-navigator/.claude/PROJECT_RULES_TEMPLATE.md \
   ~/your-project/claude_instructions.md

# 2. Edit it
code ~/your-project/claude_instructions.md
# - Add your project name
# - Add design system rules
# - Add tech stack details

# 3. Start working with Claude
# - Use /enhance for complex work
# - Claude will read claude_instructions.md
# - Agents will be orchestrated automatically
```

---

## Success Metrics

**You'll know it's working when:**
- ✅ Claude reads SESSION_START.md in continuation sessions
- ✅ Agents are launched for implementation work
- ✅ code-reviewer-pro runs before code is presented
- ✅ Output is "production-quality" not "garbage"

**You'll know it failed when:**
- ❌ Claude jumps straight into coding
- ❌ Design rules are violated
- ❌ No agents were used
- ❌ User says "this is unacceptable"

---

## File Locations

```
.claude/
├── README.md (this file)
├── SESSION_START.md (mandatory checklist)
├── PROJECT_RULES_TEMPLATE.md (copy to projects)
└── FAILURE_ANALYSIS.md (complete documentation)
```

---

## Next Steps

1. **Review the three documents:**
   - Read SESSION_START.md to understand the checklist
   - Read PROJECT_RULES_TEMPLATE.md to see what goes in project instructions
   - Skim FAILURE_ANALYSIS.md for the full story

2. **Apply to active projects:**
   - Copy PROJECT_RULES_TEMPLATE.md to your projects as claude_instructions.md
   - Customize with your design system rules
   - Update todos to specify agent usage

3. **Test in next session:**
   - Start a continuation session
   - Watch Claude read SESSION_START.md first
   - Verify agents are launched appropriately

4. **Iterate:**
   - Add project-specific rules as you discover them
   - Update templates based on what works
   - Share successful patterns across projects

---

## The Bottom Line

**Agent orchestration isn't optional.**

iOS project: 9 agents, 90 min → production quality
Injury protocol: 0 agents → complete failure

The difference is:
1. Reading project context at session start
2. Using specialized agents for their domains
3. Running quality gates (code-reviewer-pro)

This system ensures that happens every time.

---

**Questions?** Read FAILURE_ANALYSIS.md for the complete story.
**Ready to use?** Copy PROJECT_RULES_TEMPLATE.md to your next project.
**In a continuation session?** Read SESSION_START.md first.
