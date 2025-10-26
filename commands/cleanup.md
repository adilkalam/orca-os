---
name: cleanup
description: Clean up orphaned logs and files created in wrong locations by agents
---

# /cleanup - Remove Orphaned Logs and Files

**Purpose:** Delete logs and generated files that agents mistakenly created outside `.orchestration/`

**When to use:**
- After running agents and noticing logs in main directory
- Before committing to clean up project
- When starting fresh on a project

---

## What This Command Does

Searches your project for orphaned files created by agents in WRONG locations and removes them.

**Files it removes:**
- `implementation-log.md` (main directory) → Should be in `.orchestration/`
- `verification-report.md` (main directory) → Should be in `.orchestration/verification/`
- `docs/completion_drive_plans/` → Should be in `.orchestration/plans/`
- `design-dna-context.md` (anywhere except `.orchestration/`) → Context file
- Any `.log` files in main directory → Should be in `.orchestration/`

**What it NEVER touches:**
- `.orchestration/` directory (this is CORRECT location)
- `.claude/design-dna/` (this is CORRECT location)
- `design-system.md` (this is YOUR file)
- `design-system.html` (this is generated HTML for you)
- Your actual project code

---

## How It Works

```bash
# 1. Scan for orphaned files
# 2. Show what will be deleted
# 3. Ask for confirmation
# 4. Delete confirmed files
# 5. Report what was cleaned
```

---

## Execution

**Step 1: Detect orphaned files**

```bash
# Find implementation logs outside .orchestration
find . -maxdepth 1 -name "implementation-log.md" -not -path "./.orchestration/*"

# Find verification reports outside .orchestration
find . -maxdepth 1 -name "verification-report.md" -not -path "./.orchestration/*"

# Find completion_drive_plans in docs
find ./docs -name "completion_drive_plans" -type d 2>/dev/null

# Find .log files in main directory
find . -maxdepth 1 -name "*.log"

# Find orphaned context files
find . -maxdepth 2 -name "*-context.md" -not -path "./.orchestration/*"
```

**Step 2: List files to delete**

```markdown
# Cleanup Report

## Files to be deleted:

### Orphaned implementation logs:
- ./implementation-log.md → Should be in .orchestration/

### Orphaned verification reports:
- ./verification-report.md → Should be in .orchestration/verification/

### Misplaced plan directories:
- ./docs/completion_drive_plans/ → Should be in .orchestration/plans/

### Orphaned log files:
- ./build.log → Should be in .orchestration/verification/
- ./test.log → Should be in .orchestration/verification/

### Total files to delete: 5
```

**Step 3: Ask for confirmation**

Use AskUserQuestion tool:

```
Question: "Clean up 5 orphaned files?"

Options:
- "Yes, delete all" → Proceed with cleanup
- "Show details first" → Print file paths with cat/head
- "Cancel" → Exit without deleting
```

**Step 4: Delete files**

```bash
# If user confirms "Yes, delete all"

# Remove implementation logs
rm -f ./implementation-log.md

# Remove verification reports  
rm -f ./verification-report.md

# Remove completion_drive_plans
rm -rf ./docs/completion_drive_plans/

# Remove orphaned logs
rm -f ./*.log

# Remove orphaned context files
find . -maxdepth 2 -name "*-context.md" -not -path "./.orchestration/*" -delete

echo "✅ Cleanup complete"
```

**Step 5: Report results**

```markdown
# Cleanup Complete

## Deleted:
✅ ./implementation-log.md (243 bytes)
✅ ./verification-report.md (1.2 KB)
✅ ./docs/completion_drive_plans/ (3 files, 4.5 KB)
✅ ./build.log (892 bytes)
✅ ./test.log (1.1 KB)

## Total freed: 7.9 KB

## Correct locations reminder:
- Logs → .orchestration/verification/
- Plans → .orchestration/plans/
- Implementation logs → .orchestration/implementation-log.md
- Playbooks → .orchestration/playbooks/
- Design DNA → .claude/design-dna/

Run verification to ensure nothing broken:
  ls .orchestration/
  ls .claude/design-dna/
```

---

## Safety Features

**Never deletes:**
- Files in `.orchestration/` (correct location)
- Files in `.claude/design-dna/` (correct location)
- `design-system.md` (your master reference)
- `design-system.html` (generated HTML for you)
- Source code files (`.swift`, `.ts`, `.js`, etc.)
- Configuration files (`package.json`, `*.xcodeproj`, etc.)

**Always asks confirmation before deleting.**

**Shows file contents before deleting if user requests.**

---

## When to Run

**After these scenarios:**

1. **After workflow-orchestrator finishes** - Agents may have created logs in wrong places
2. **Before git commit** - Clean project before committing
3. **Starting fresh** - Remove old logs from previous runs
4. **After finding orphaned files** - User notices `implementation-log.md` in main directory

---

## Example Usage

```markdown
User: "Clean up the project"

Agent: "Running /cleanup to scan for orphaned files..."

[Scans project]

Agent: "Found 5 orphaned files:
- ./implementation-log.md (main directory)
- ./verification-report.md (main directory)  
- ./docs/completion_drive_plans/ (3 files)
- ./build.log (main directory)

Delete all?"

User: "Yes"

Agent: [Deletes files]
"✅ Cleanup complete. 5 files deleted, 7.9 KB freed.

All logs should now be in .orchestration/
Run ls .orchestration/ to verify."
```

---

## After Cleanup

**Verify correct structure:**

```bash
# Should exist (correct locations)
ls .orchestration/
ls .orchestration/verification/
ls .orchestration/playbooks/
ls .orchestration/plans/
ls .claude/design-dna/

# Should NOT exist (orphaned locations)
ls implementation-log.md 2>/dev/null && echo "⚠️ Still exists"
ls verification-report.md 2>/dev/null && echo "⚠️ Still exists"
ls docs/completion_drive_plans/ 2>/dev/null && echo "⚠️ Still exists"
```

---

**Created:** 2025-10-25  
**Purpose:** Clean up orphaned logs from agents creating files in wrong locations  
**Safety:** Always confirms before deleting, never touches .orchestration/ or project code
