# reflect-apply.py Usage Guide

Script for managing learned rules in CLAUDE.md and Workshop preferences.

## Location

```
~/.claude/scripts/reflect-apply.py
```

## Overview

The `/reflect` command learns patterns from work sessions and can apply them as:
- **Hard rules** in CLAUDE.md (enforced guidance)
- **Soft preferences** in Workshop (historical context)

## Commands

### Add a Rule

```bash
# Add to CLAUDE.md (hard rule)
python3 ~/.claude/scripts/reflect-apply.py add \
  --rule "Always use TypeScript strict mode" \
  --target claude_md

# Add to Workshop (soft preference)
python3 ~/.claude/scripts/reflect-apply.py add \
  --rule "Prefer composition over inheritance" \
  --target workshop

# Skip conflict checking
python3 ~/.claude/scripts/reflect-apply.py add \
  --rule "Some rule" \
  --target claude_md \
  --no-conflict-check
```

### List Rules

```bash
python3 ~/.claude/scripts/reflect-apply.py list
```

Output:
```
=== Active Rules ===
[rule-20251127-001] Always use TypeScript strict mode
  Learned: 2025-11-27

=== Archived Rules ===
[rule-20251126-001] Use npm not yarn
  Archived: 2025-11-27 - Switched to bun
```

### Archive a Rule

Move a rule from Active to Archived (keeps history):

```bash
python3 ~/.claude/scripts/reflect-apply.py archive \
  --rule-id rule-20251127-001 \
  --reason "Switched to different pattern"
```

### Remove a Rule

Delete a rule entirely (from both Active and Archived):

```bash
python3 ~/.claude/scripts/reflect-apply.py remove \
  --rule-id rule-20251127-001
```

## CLAUDE.md Format

The script manages this section in your project's CLAUDE.md:

```markdown
## Learned Rules (via /reflect)
<!-- Auto-managed by /reflect - manual edits may be overwritten -->

### Active Rules
- **[rule-20251127-001]** Always use TypeScript strict mode (learned: 2025-11-27)

### Archived Rules
<!-- Rules no longer active but kept for history -->
- **[rule-20251126-001]** Use npm not yarn (archived: 2025-11-27, reason: switched to bun)
```

## Rule ID Format

Rules are assigned unique IDs in the format: `rule-YYYYMMDD-NNN`

- `YYYYMMDD` - Date the rule was created
- `NNN` - Sequence number (001, 002, etc.)

Example: `rule-20251127-001` was the first rule created on 2025-11-27.

## Workshop Integration

When using `--target workshop`, the script runs:

```bash
workshop --workspace .claude/memory preference \
  "[/reflect] <rule text>" \
  --category code_style
```

This tags preferences with `[/reflect]` for easy filtering.

## Conflict Detection

By default, adding a new rule checks for exact text matches in existing rules.
If a conflict is found, the add operation fails with an error message.

Use `--no-conflict-check` to bypass this (useful for similar but distinct rules).

## Best Practices

1. **Use hard rules (CLAUDE.md) for:**
   - Project-specific patterns that must be followed
   - Architectural decisions
   - Failed approaches to avoid

2. **Use soft preferences (Workshop) for:**
   - Stylistic choices
   - Team preferences
   - Context that helps but isn't critical

3. **Archive rules when:**
   - Pattern is no longer relevant
   - Better approach has been found
   - Project has evolved past the pattern

4. **Remove rules when:**
   - Rule was added in error
   - Completely obsolete with no historical value
   - Consolidating duplicate rules

## Examples

### Hard Rule Example
```bash
# Add architectural decision
python3 ~/.claude/scripts/reflect-apply.py add \
  --rule "Use React Query for all API calls, not custom fetch hooks" \
  --target claude_md
```

### Soft Preference Example
```bash
# Add team style preference
python3 ~/.claude/scripts/reflect-apply.py add \
  --rule "Team prefers functional components over class components" \
  --target workshop
```

### Archiving Example
```bash
# Archive outdated pattern
python3 ~/.claude/scripts/reflect-apply.py archive \
  --rule-id rule-20251120-003 \
  --reason "Migrated from Redux to Zustand"
```
