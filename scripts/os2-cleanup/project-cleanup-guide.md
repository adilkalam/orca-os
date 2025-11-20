# Project Cleanup Guide for OS 2.0

## Quick Cleanup Script (Run in Each Project)

```bash
#!/bin/bash
# OS 2.0 Project Cleanup Script

echo "🧹 OS 2.0 Project Cleanup Starting..."

# 1. Create archive structure
mkdir -p .deprecated/pre-os2

# 2. Move old Claude folders
[ -d ".claude-work" ] && mv .claude-work .deprecated/pre-os2/claude-work 2>/dev/null
[ -d ".workshop" ] && mv .workshop .deprecated/pre-os2/workshop 2>/dev/null
[ -d ".claude.bak" ] && mv .claude.bak .deprecated/pre-os2/claude.bak 2>/dev/null

# 3. Clean .claude folder if it exists
if [ -d ".claude" ]; then
    # Archive old orchestration evidence
    [ -d ".claude/orchestration/evidence" ] && \
        mkdir -p .deprecated/pre-os2/claude-evidence && \
        mv .claude/orchestration/evidence/* .deprecated/pre-os2/claude-evidence/ 2>/dev/null

    # Clean temp files
    [ -d ".claude/orchestration/temp" ] && \
        rm -rf .claude/orchestration/temp/* 2>/dev/null

    # Archive old memory/playbooks
    [ -d ".claude/memory/playbooks" ] && \
        mkdir -p .deprecated/pre-os2/memory-playbooks && \
        mv .claude/memory/playbooks/* .deprecated/pre-os2/memory-playbooks/ 2>/dev/null
fi

# 4. Remove old session contexts
rm -f .claude-session-context.md.backup* 2>/dev/null
rm -f .session-context-*.md 2>/dev/null

# 5. Update .gitignore if needed
if [ -f ".gitignore" ]; then
    # Add deprecated folder to gitignore if not present
    grep -q "^.deprecated" .gitignore || echo -e "\n# OS 2.0 Cleanup\n.deprecated/" >> .gitignore
fi

echo "✅ Cleanup complete! Check git status to review changes."
```

## Manual Checklist (If Preferred)

### Phase 1: Archive Old Structures
```bash
# Create archive
mkdir -p .deprecated/pre-os2

# Move legacy folders
mv .claude-work .deprecated/pre-os2/  # If exists
mv .workshop .deprecated/pre-os2/     # If exists
mv .claude.bak .deprecated/pre-os2/   # If exists
```

### Phase 2: Clean .claude Folder
```bash
# Clean evidence (project-specific, not config)
mv .claude/orchestration/evidence/* .deprecated/pre-os2/evidence/

# Empty temp folder
rm -rf .claude/orchestration/temp/*

# Archive old memory
mv .claude/memory/playbooks/* .deprecated/pre-os2/playbooks/
```

### Phase 3: Remove Session Clutter
```bash
# Remove backup session files
rm -f .claude-session-context.md.backup*
rm -f .session-context-*.md
```

### Phase 4: Git Cleanup
```bash
# Add to .gitignore
echo ".deprecated/" >> .gitignore

# Review what changed
git status

# Stage cleanup (careful - review first!)
git add -A
git commit -m "Clean up for OS 2.0 - archive pre-OS2 structures"
```

---

## The Cleanup Haiku

```
Old contexts archived
OS Two demands clean structure
Fresh project, clear mind
```

---

## Example for peptidefox:

```bash
cd ~/Desktop/peptidefox

# Quick version - save as cleanup.sh and run
cat > cleanup.sh << 'EOF'
#!/bin/bash
mkdir -p .deprecated/pre-os2
[ -d ".claude-work" ] && mv .claude-work .deprecated/pre-os2/
[ -d ".workshop" ] && mv .workshop .deprecated/pre-os2/
[ -d ".claude/orchestration/evidence" ] && mv .claude/orchestration/evidence .deprecated/pre-os2/
[ -d ".claude/orchestration/temp" ] && rm -rf .claude/orchestration/temp/*
rm -f .claude-session-context.md.backup*
echo ".deprecated/" >> .gitignore
echo "✅ Cleaned up for OS 2.0"
git status
EOF

chmod +x cleanup.sh
./cleanup.sh
```

---

## What Gets Cleaned

### ❌ REMOVE/ARCHIVE:
- `.claude-work/` - Old working directory
- `.workshop/` - Old context system
- `.claude/orchestration/evidence/` - Project-specific artifacts
- `.claude/orchestration/temp/*` - Working files
- `.claude/memory/playbooks/` - Old memory system
- `*.backup*` files - Session backups

### ✅ KEEP:
- `.claude/CLAUDE.md` - Project instructions
- `.claude/settings.json` - Project settings
- Current code and documentation
- `.claude-session-context.md` - Current session

---

## Why This Cleanup?

OS 2.0 uses:
- **ProjectContextServer** instead of local `.workshop/`
- **Clean .claude structure** instead of scattered folders
- **Ephemeral temp/** that should be empty between sessions
- **No project-specific evidence** in config folders

Each project becomes lighter, cleaner, and ready for OS 2.0 orchestration.

---

_Save this guide or the script above to quickly clean each project as you work on it._