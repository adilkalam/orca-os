# Skill Catalog

Semantic skill discovery and loading for Claude Code.

## Overview

The Skill Catalog provides:
- **Semantic search** - Find skills by meaning, not just keywords
- **Automatic discovery** - Suggests relevant skills when reading code (optional hook)
- **De-duplication** - Shows each skill once per session unless relevance jumps
- **Project-first precedence** - Project skills override global skills

## Quick Start

```bash
# Run setup (installs dependencies, builds index)
bash ~/.claude/skill-catalog/setup-skill-catalog.sh

# List all skills
/list-skills

# Load a specific skill
/load-skill react-patterns

# Check health
/skill-health
```

## Architecture

```
~/.claude/skill-catalog/
├── config.json          # Configuration
├── index.db             # SQLite index with embeddings
├── skill-index.py       # Indexing and search CLI
├── skill-discovery.py   # PostToolUse hook (optional)
├── setup-skill-catalog.sh
├── README.md
└── logs/                # Debug logs

~/.claude/skills/        # Global skill files
├── react-patterns.md
├── git-workflow.md
└── ...

<project>/.claude/skills/  # Project-specific skills
```

## Skill File Format

```markdown
---
title: Skill Title
category: react|security|testing|git|api|general
tags: [tag1, tag2]
version: 1.0.0
---

Brief description paragraph that gets embedded for semantic search.
Keep this under 200 words and focused on when to use this skill.

## Full Content

Detailed guidance, examples, checklists, etc.
```

## Configuration

`config.json` options:

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable/disable the system |
| `relevance_threshold` | `0.25` | Minimum similarity for suggestions |
| `renotify_delta` | `0.20` | Relevance increase to re-suggest |
| `max_skills_per_notification` | `3` | Max skills per notification |
| `hook_timeout_ms` | `100` | Hard timeout for hook |
| `model_name` | `all-MiniLM-L6-v2` | Embedding model |
| `skill_sources` | See below | Skill directories |
| `precedence` | `project-first` | Which skills take priority |
| `log_level` | `info` | Logging level |

## Commands

### /list-skills
List all indexed skills, grouped by category.

### /load-skill NAME
Load a skill into context by name or ID.

### /reindex-skills
Rebuild the index after adding/modifying skills.

### /skill-health
Run diagnostic checks on the system.

## CLI Usage

```bash
# Index all skills
python3 ~/.claude/skill-catalog/skill-index.py index

# Search skills
python3 ~/.claude/skill-catalog/skill-index.py search "react hooks"

# List all skills
python3 ~/.claude/skill-catalog/skill-index.py list

# Show skill details
python3 ~/.claude/skill-catalog/skill-index.py show 1

# Health check
python3 ~/.claude/skill-catalog/skill-index.py health
```

## Discovery Hook (Optional)

The discovery hook automatically suggests skills when you read files.
To enable, add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/skill-catalog/skill-discovery.py"
          }
        ]
      }
    ]
  }
}
```

**Note:** The hook is designed to:
- Exit 0 always (never blocks Read operations)
- Hard timeout at `hook_timeout_ms`
- De-duplicate suggestions per session

## Creating Skills

1. Create a markdown file in `~/.claude/skills/` or `<project>/.claude/skills/`
2. Add YAML frontmatter with title, category, tags
3. Write a clear description paragraph (this is what gets searched)
4. Add detailed content below
5. Run `/reindex-skills`

## Dependencies

- Python 3.8+
- sentence-transformers (`pip install sentence-transformers`)

## Troubleshooting

### Skills not found
```bash
/reindex-skills
/skill-health
```

### Model download slow
The embedding model (~90MB) downloads on first use. Subsequent runs are fast.

### Hook not working
The discovery hook is **optional** and has a strict 100ms timeout to avoid blocking Read operations. Since model loading takes several seconds, the hook will typically timeout on cold starts. This is by design.

**Primary interface is the commands** (`/load-skill`, `/list-skills`), not the hook.

If you want to test the hook logic:
- Check `~/.claude/settings.json` hook configuration
- Check `~/.claude/skill-catalog/logs/discovery.log`
- Test directly (without timeout): `~/.claude/skill-catalog/skill-index.py search "react hooks"`
