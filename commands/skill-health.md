---
name: skill-health
description: Check health of the skill catalog system
arguments: []
---

# Skill Catalog Health Check

Run diagnostics on the skill catalog system.

## Process

1. **Check configuration** - verify config.json exists and is valid
2. **Check database** - verify index.db exists and has entries
3. **Check skill directories** - verify sources exist and have files
4. **Check dependencies** - verify sentence-transformers is installed

## Implementation

```bash
python3 ~/.claude/skill-catalog/skill-index.py health
```

## Expected Output

```
Skill Catalog Health Check
============================================================
[OK] config.json exists
     Model: all-MiniLM-L6-v2
     Threshold: 0.25
[OK] index.db exists (45.2 KB)
     23 skills indexed
[OK] 2 skill directories configured
     ~/.claude/skills: 15 files
     ./.claude/skills: 8 files
[OK] sentence-transformers installed

============================================================
Health check: PASSED
```

## Common Issues

### "No skills indexed"
Run `/reindex-skills` to build the index.

### "sentence-transformers not installed"
```bash
pip install sentence-transformers
```

### "No skill directories found"
Check `~/.claude/skill-catalog/config.json` skill_sources setting.

## Example Usage

```
/skill-health
```

## Notes

- Run health check after setup or if skills aren't being found
- Check logs at `~/.claude/skill-catalog/logs/` for detailed errors
