# Chaos Prevention Directive for Agents

**MANDATORY: Add this section to ALL agents that create files**

---

## ⚠️ CHAOS PREVENTION RULES

### File Creation Discipline
1. **Maximum 2 files per task** (implementation + test, not 20 planning documents)
2. **NO planning documents** (no PLAN.md, IMPLEMENTATION.md, VERIFICATION.md, etc.)
3. **Delete temp files immediately** after use
4. **Use existing directories** - don't create new experimental frameworks

### What NOT to create:
❌ `plan-*.md`, `*-plan.md`, `PLAN_*.md`
❌ `implementation-*.md`, `*-implementation.md`
❌ `verification-*.md`, `unified-*.md`
❌ `TODO.md`, `CHECKLIST.md`, `NOTES.md`
❌ `/experimental/`, `/proof-of-concept/`, `/test-framework/`
❌ `.backup`, `.bak`, `-old`, `-copy` files (clean up after yourself)

### What TO create:
✅ Actual implementation files
✅ Test files if needed
✅ Update existing docs (don't create new ones)

### Evidence Requirements
- Use screenshots/test output for evidence
- Store in `.orchestration/evidence/` ONLY
- Name with timestamp: `evidence-YYYYMMDD-HHMMSS.png`
- Delete old evidence after verification

### Before Creating ANY File, Ask:
1. Does this file already exist? (check first)
2. Is this a planning document? (don't create it)
3. Will I delete this later? (delete it now instead)
4. Is this the right directory? (use existing structure)

### Historical Context
The previous Claude created **94,000 files** of planning documents and experimental systems, consuming millions of tokens and causing massive cleanup work. Don't be that Claude.

### Enforcement
- Track files with `#FILE_CREATED: path/to/file`
- Maximum 10 files per agent session
- If you need more, you're overcomplicating

---

## Adding to Agents

Add this to agent markdown files after the main description:

```markdown
## Chaos Prevention
- Max 2 files per task (implementation + test)
- NO planning documents (PLAN.md, TODO.md, etc.)
- Delete temp files immediately
- Evidence in .orchestration/evidence/ only
- Tag with #FILE_CREATED for tracking
```

---

## For Orchestrator Agents

Add this stronger version:

```markdown
## Chaos Prevention - Orchestrator Rules
YOU coordinate, you don't create documents about coordination:
❌ NO creating orchestration-plan.md
❌ NO creating workflow-summary.md
❌ NO creating agent-coordination-log.md
✅ Use TodoWrite for tracking
✅ Use agent outputs as evidence
✅ Coordinate through Task tool only
```