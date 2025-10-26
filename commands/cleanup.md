---
name: cleanup
description: Review and clean up old evidence and log files with interactive options
---

# Evidence & Log Cleanup Command

Manually review and clean up old evidence and log files in .orchestration/

## Usage

```bash
/cleanup                    # Interactive cleanup with options
/cleanup --keep-for 30      # Extend retention to 30 days
/cleanup --dry-run          # Show what would be deleted without deleting
/cleanup --force            # Delete all files >7 days old without asking
```

---

## Interactive Cleanup Process

### Step 1: Analyze Current State

**Check for .orchestration directory:**
```bash
if [ ! -d ".orchestration" ]; then
  echo "✓ No .orchestration directory found - nothing to clean up"
  exit 0
fi
```

**Calculate current state:**
```bash
# Evidence files
evidence_count=$(find .orchestration/evidence -type f 2>/dev/null | wc -l | tr -d ' ')
evidence_size=$(du -sh .orchestration/evidence 2>/dev/null | cut -f1 || echo "0B")

# Log files
logs_count=$(find .orchestration/logs -type f 2>/dev/null | wc -l | tr -d ' ')
logs_size=$(du -sh .orchestration/logs 2>/dev/null | cut -f1 || echo "0B")

# Old files (>7 days)
old_evidence_count=$(find .orchestration/evidence -type f -mtime +7 2>/dev/null | wc -l | tr -d ' ')
old_logs_count=$(find .orchestration/logs -type f -mtime +7 2>/dev/null | wc -l | tr -d ' ')

echo "📊 Current State:"
echo ""
echo "  Evidence: $evidence_count files ($evidence_size)"
echo "    └─ >7 days old: $old_evidence_count files"
echo ""
echo "  Logs: $logs_count files ($logs_size)"
echo "    └─ >7 days old: $old_logs_count files"
echo ""
```

### Step 2: Present Options

**If no old files:**
```
✓ No files older than 7 days found

Current retention policy: 7 days (SessionEnd hook)
To extend retention: touch .orchestration/evidence/.keep
```

**If old files exist:**
```
Found $total_old_files old files (>7 days)

Options:
1. Delete files >7 days old (recommended)
2. Delete files >30 days old (conservative)
3. Delete files >90 days old (very conservative)
4. List old files for manual review
5. Keep all files (create .keep file to disable auto-cleanup)
6. Cancel
```

### Step 3: Execute Based on User Choice

**Option 1: Delete >7 days:**
```bash
find .orchestration/evidence -type f -mtime +7 ! -name ".keep" -delete
find .orchestration/logs -type f -mtime +7 -delete
find .orchestration/evidence -type d -empty -delete
find .orchestration/logs -type d -empty -delete

echo "🧹 Deleted $deleted_count files"
```

**Option 2: Delete >30 days:**
```bash
find .orchestration/evidence -type f -mtime +30 ! -name ".keep" -delete
find .orchestration/logs -type f -mtime +30 -delete
```

**Option 3: Delete >90 days:**
```bash
find .orchestration/evidence -type f -mtime +90 ! -name ".keep" -delete
find .orchestration/logs -type f -mtime +90 -delete
```

**Option 4: List old files:**
```bash
echo "📋 Files older than 7 days:"
echo ""
echo "Evidence:"
find .orchestration/evidence -type f -mtime +7 -exec ls -lh {} \; 2>/dev/null | \
  awk '{print "  " $9 " (" $5 ", " $(NF-2) " " $(NF-1) " " $NF ")"}'

echo ""
echo "Logs:"
find .orchestration/logs -type f -mtime +7 -exec ls -lh {} \; 2>/dev/null | \
  awk '{print "  " $9 " (" $5 ", " $(NF-2) " " $(NF-1) " " $NF ")"}'

echo ""
echo "Run /cleanup again to delete these files"
```

**Option 5: Keep all (create .keep):**
```bash
touch .orchestration/evidence/.keep
touch .orchestration/logs/.keep

echo "🔒 Auto-cleanup disabled"
echo "  Created .keep files in evidence/ and logs/"
echo "  SessionEnd hook will no longer delete old files"
echo "  To re-enable: rm .orchestration/evidence/.keep .orchestration/logs/.keep"
```

**Option 6: Cancel:**
```bash
echo "Cleanup cancelled - no changes made"
```

---

## Command-Line Flags

### --keep-for N

Extend retention to N days:
```bash
RETENTION_DAYS=30
find .orchestration/evidence -type f -mtime +$RETENTION_DAYS ! -name ".keep" -delete
find .orchestration/logs -type f -mtime +$RETENTION_DAYS -delete
```

### --dry-run

Show what would be deleted without deleting:
```bash
echo "📋 Dry Run - Would Delete:"
find .orchestration/evidence -type f -mtime +7 ! -name ".keep" | \
  while read file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  $file ($size)"
  done

find .orchestration/logs -type f -mtime +7 | \
  while read file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  $file ($size)"
  done
```

### --force

Delete immediately without confirmation:
```bash
deleted_count=$(find .orchestration/evidence -type f -mtime +7 ! -name ".keep" | wc -l | tr -d ' ')
deleted_count=$((deleted_count + $(find .orchestration/logs -type f -mtime +7 | wc -l | tr -d ' ')))

find .orchestration/evidence -type f -mtime +7 ! -name ".keep" -delete
find .orchestration/logs -type f -mtime +7 -delete
find .orchestration/evidence -type d -empty -delete
find .orchestration/logs -type d -empty -delete

echo "🧹 Force cleanup: Deleted $deleted_count files (>7 days old)"
```

---

## Safety Checks

**NEVER delete:**
- Source files (Sources/, src/, etc.)
- Documentation (docs/)
- Permanent evidence (docs/evidence/)
- Files in directories with .keep file
- Files less than 7 days old (unless user explicitly requests)

**ALWAYS ask for confirmation:**
- Unless --force flag used
- Show file count and total size before deleting
- Provide cancel option

**ALWAYS verify:**
- User is in a git repository
- .orchestration directory exists
- Not deleting from wrong directory

---

## Integration with File Organization System

**This command is part of the File Organization System:**
- Standards: ~/.claude/docs/FILE_ORGANIZATION.md
- Auto-cleanup: ~/.claude/hooks/cleanup-evidence.sh (SessionEnd)
- Verification: ~/.claude/scripts/verify-organization.sh

**Related commands:**
- /organize - Verify file organization compliance
- /orca - Includes Phase 8: Evidence Management

---

## Example Session

```bash
$ /cleanup

📊 Current State:

  Evidence: 47 files (2.3GB)
    └─ >7 days old: 32 files

  Logs: 18 files (145MB)
    └─ >7 days old: 12 files

Found 44 old files (>7 days)

Options:
1. Delete files >7 days old (recommended)
2. Delete files >30 days old (conservative)
3. Delete files >90 days old (very conservative)
4. List old files for manual review
5. Keep all files (create .keep file to disable auto-cleanup)
6. Cancel

User selects: 1

🧹 Deleted 44 files (2.1GB freed)

📊 New State:
  Evidence: 15 files (234MB)
  Logs: 6 files (23MB)

✓ Cleanup complete
```

---

## When to Use This Command

**Use /cleanup when:**
- .orchestration directory is >100MB
- Manually reviewing old evidence before auto-deletion
- Extending retention period for specific session
- Disabling auto-cleanup temporarily
- Freeing disk space

**Don't use /cleanup when:**
- Auto-cleanup is working fine (SessionEnd hook handles it)
- Files are <7 days old and still needed
- In the middle of active work (wait until session ends)

---

## Related Documentation

- FILE_ORGANIZATION.md - Platform-specific file structure rules
- DOCUMENTATION_PROTOCOL.md - When to update docs
- cleanup-evidence.sh - SessionEnd hook auto-cleanup script
