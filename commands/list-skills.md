---
name: list-skills
description: List all available skills in the catalog
arguments:
  - name: category
    description: Filter by category (optional)
    required: false
---

# List Skills

Display all skills available in the skill catalog.

## Process

1. **Query the skill index** for all indexed skills
2. **Group by category** for easy browsing
3. **Show skill count and basic info** for each

## Implementation

```bash
python3 ~/.claude/skill-catalog/skill-index.py list
```

## Output Format

Skills are displayed grouped by category:

```
[react]
  1. React Patterns (global)
  2. React Testing (project)

[git]
  3. Git Workflow (global)

[security]
  4. Security Basics (global)
```

## After Listing

- Suggest relevant skills based on current project context
- Offer to load any skill that might be useful
- Note if index needs updating (many skills not indexed)

## Example Usage

```
/list-skills
/list-skills react
/list-skills security
```

## Notes

- Run `/reindex-skills` if new skills were added
- Project-specific skills override global ones with same name
