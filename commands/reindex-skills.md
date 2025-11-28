---
name: reindex-skills
description: Reindex all skills in the catalog
arguments: []
---

# Reindex Skills

Rebuild the skill catalog index from all skill sources.

## Process

1. **Scan skill directories** for markdown files
2. **Parse YAML frontmatter** and extract metadata
3. **Generate embeddings** for semantic search
4. **Update the SQLite index** with new/changed skills

## Implementation

```bash
python3 ~/.claude/skill-catalog/skill-index.py index
```

## When to Reindex

- After adding new skill files
- After modifying existing skills
- After changing skill sources in config
- If search results seem stale or incomplete

## Output

```
Indexing skills...
Found 15 skill files in 2 directories
Done: 5 indexed, 2 updated, 0 errors
```

## After Reindexing

- Run `/list-skills` to verify all skills are indexed
- Run `/skill-health` if there were errors
- Test search with `/load-skill <query>`

## Example Usage

```
/reindex-skills
```

## Notes

- Indexing requires sentence-transformers package
- First run downloads the embedding model (~90MB)
- Subsequent runs are faster (model cached)
