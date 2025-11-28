---
name: load-skill
description: Load a skill from the semantic skill catalog into context
arguments:
  - name: skill_name
    description: Name or ID of the skill to load
    required: true
---

# Load Skill

Load a skill from the skill catalog into the current context.

## Process

1. **Find the skill** by name or ID in the index
2. **Read the full skill content** from the file
3. **Present it to the user** formatted for immediate use

## Implementation

```bash
# If numeric ID provided
python3 ~/.claude/skill-catalog/skill-index.py show $ARGUMENTS

# If name provided, search first
python3 ~/.claude/skill-catalog/skill-index.py search $ARGUMENTS
```

## After Loading

Once the skill is loaded:
- Summarize the key points from the skill
- Ask if the user wants to apply any specific patterns
- Note any project-specific adaptations that might be needed

## Example Usage

```
/load-skill react-patterns
/load-skill git-workflow  
/load-skill 3
```

## Notes

- Skills are markdown files with YAML frontmatter
- The first paragraph is the searchable description
- Full content includes examples, code snippets, and checklists
