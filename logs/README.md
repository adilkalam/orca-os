# Logs Directory

This folder stores session logs and notes.

## File Naming

Use the following naming convention:

`Codex/Claude-Topic-Date.md`

Examples:
- `Codex-NextjsCSSRefactor-2025-11-27.md`
- `Claude-RA-Audit-2025-12-01.md`

## Frontmatter

Each log file should start with frontmatter containing:

- `Agent`: `Codex` or `Claude`
- `Topic`: Short title for the session
- `Description`: 1–2 sentence summary
- `Files Edited`: List of files touched (if any)
- `Date`: Date in `YYYY-MM-DD` format
- `Time`: Time with timezone

Example:

```markdown
---
Agent: Codex
Topic: Next.js CSS Refactor – PeptideFox
Description: Deep dive on CSS architecture issues and refactor plan for desktop/peptidefox.
Files Edited:
  - docs/pipelines/nextjs-pipeline.md
  - agents/dev/nextjs-builder.md
Date: 2025-11-27
Time: 14:32 PST
---
```

