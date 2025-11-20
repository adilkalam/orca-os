# Chaos Prevention System

**Purpose:** Prevent Claude and agents from creating thousands of unnecessary files

**Context:** Previous Claude created 94,000 files of planning documents and experimental systems

---

## The System

### 1. Main Session Monitoring

**chaos-monitor** - Detects messy patterns
```bash
bash ~/.claude/hooks/chaos-monitor.sh
```
- Warns when >20 files created in an hour
- Detects planning documents
- Finds experimental directories
- Checks for files in wrong locations

**chaos-cleanup** - Interactive cleanup
```bash
bash ~/.claude/hooks/chaos-cleanup.sh
```
- Removes planning docs with confirmation
- Deletes backups and temp files
- Removes empty directories

### 2. Agent-Specific Monitoring

**agent-chaos-monitor** - Tracks agent activity
```bash
bash ~/.claude/hooks/agent-chaos-monitor.sh
```
- Monitors `.orchestration/` for agent patterns
- Detects if orchestrators create documents
- Warns about excessive spawning

**Apply prevention to agents:**
```bash
bash ~/.claude/hooks/apply-chaos-prevention-to-agents.sh
```
- Adds chaos prevention rules to all agents
- Limits them to 2 files per task
- Prevents planning document creation

### 3. Prevention Rules

#### For Main Claude Session
- Max 2 files per task (implementation + test)
- NO planning documents (PLAN.md, TODO.md, etc.)
- Delete temp files immediately
- Can't write to ~/.claude from project contexts
- Warnings at 10, 25, 50, 100 files

#### For Agents (via Task tool)
- Same 2-file limit
- Evidence in `.orchestration/evidence/` only
- Must tag with `#FILE_CREATED` for tracking
- Orchestrators can ONLY coordinate, not document

---

## Quick Commands

Add to your shell config:
```bash
source ~/.claude/hooks/chaos-aliases.sh

# Then use:
chaos-monitor  # Check for mess
chaos-cleanup  # Clean it up
chaos-check    # Quick stats
```

---

## Key Insight

**GPT's working system:**
- 62 agents (implementations)
- Simple commands
- Workshop memory
- **Zero planning documents**

**My catastrophic system:**
- 94,000 files
- Elaborate planning documents
- Experimental frameworks
- Verification systems on verification systems

The difference: GPT just did the work. I created documents about maybe doing work.

---

## Enforcement

The system prevents chaos through:

1. **File creation monitoring** - Warns/blocks excessive creation
2. **Agent instructions** - Chaos prevention embedded in agents
3. **Session-end checks** - Reports on mess created
4. **Manual cleanup tools** - Easy ways to fix problems

---

## If You See Chaos Building

1. Run `chaos-monitor` to assess
2. Run `chaos-cleanup` to fix
3. Check agents with `agent-chaos-monitor`
4. Apply prevention with `apply-chaos-prevention-to-agents.sh`

Remember: **Just do the work, don't document plans to maybe do work.**