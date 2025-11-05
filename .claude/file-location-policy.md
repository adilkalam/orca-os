# File Location Policy

**STATUS: ENFORCED**
**Last Updated: 2025-11-04**

## CRITICAL RULE: NO AUTOMATIC FILE PLACEMENT

### The Problem
- Agents automatically place files in nested directories
- /orca creates files without asking where
- Files end up scattered across .orchestration/, reports/, analytics/, etc.
- User wastes time searching for and cleaning up misplaced files

### The Solution: ALWAYS ASK FIRST

## Enforcement Rules

### 1. Before ANY File Creation

**REQUIRED PROMPT:**
```
📍 FILE LOCATION REQUIRED

File to create: [filename]
Default location: [proposed path]

Where should this file be saved?
1. Keep proposed location
2. Save to project root
3. Save to /tmp/ for review
4. Custom location (specify)
5. Don't create file

Your choice:
```

### 2. Agent File Creation

**When agents try to create files:**
- BLOCK automatic creation
- Show ALL files the agent wants to create
- Get explicit approval for EACH location
- Offer batch relocation option

### 3. /orca Specific Rules

**When /orca runs:**
```bash
# Instead of automatic placement:
# ❌ .orchestration/reports/analysis.md
# ❌ analytics/bf-sales/report.md

# Always prompt:
# ✅ "Where should analysis.md be saved?"
# ✅ "Where should report.md be saved?"
```

### 4. Protected Directories

**These directories trigger MANDATORY location review:**
- `.orchestration/` - Often cluttered with auto-generated files
- `reports/` - Analytics reports that may not belong there
- `analytics/` - Data files that clutter the project
- `evidence/` - Screenshots and logs
- `docs/` - Documentation that may be misplaced
- `.claude/` - System files that shouldn't be touched
- `agents/` - Agent definitions
- `commands/` - Command definitions

### 5. Temporary Review Pattern

**For uncertain file placement:**
1. Create in `/tmp/` first
2. User reviews content
3. User specifies final location
4. Move from `/tmp/` to chosen location

## Implementation

### Hooks Active

1. **file-location-guard.sh** - Intercepts all Write operations
2. **orca-location-prompt.sh** - Specific /orca file placement control
3. **agent-file-guard.sh** - Blocks agent automatic file creation

### User Preferences

**Default choices:**
- Reports → Ask every time
- Analytics → Ask every time
- Evidence → /tmp/ first for review
- Documentation → Ask for location
- Code files → Confirm location

## Escape Hatch

If you need to temporarily disable for a specific operation:
```bash
export SKIP_LOCATION_PROMPT=true
# Run operation
unset SKIP_LOCATION_PROMPT
```

## The Promise

**NO MORE:**
- Hunting through .orchestration/ for files
- Cleaning up misplaced analytics reports
- Finding files in random agent directories
- Wasting time on file organization

**INSTEAD:**
- You choose where EVERY file goes
- Clear visibility of what's being created
- Control over your project structure
- No surprises, no cleanup needed

---

**This policy is ACTIVE and ENFORCED.**