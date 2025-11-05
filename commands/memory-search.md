---
description: "Search project memory using Workshop CLI (MCP-free)"
allowed-tools: ["Bash", "Read"]
---

# /memory-search — Project Memory Search (No MCP Required)

Search the project’s Workshop memory using the `workshop` CLI. This works in every project without relying on MCP.

## Usage

```
/memory-search "<query>" [-k 8]
```

- query: Text to search for (file names, decisions, gotchas, etc.)
- -k: Number of results to return (default: 8)

## What I Do

1. Verify Workshop CLI is installed and project is initialized
2. Run a search using Workshop’s FTS index
3. Return top-k results with file path and snippet context

## Step 1 — Pre-flight

```bash
# Ensure Workshop is available
workshop --version

# Ensure project has memory (new or legacy layout)
[ -f .claude-work/memory/workshop.db ] || [ -f .workshop/workshop.db ] || workshop init
```

## Step 2 — Run the search

```bash
# Basic
workshop search "<query>" | head -50

# With a rough cap on results (if supported)
workshop search "<query>" | sed -n '1,100p'
```

If the CLI supports a `-k` style flag, I’ll pass it; otherwise I’ll cap output in the assistant for readability.

## Step 3 — Present results

I’ll show a concise list:
- path
- matched snippet
- a hint of where to look (start line if provided)

## Troubleshooting

- “workshop: command not found”
  - Install: `pipx install claude-workshop` or `pip install claude-workshop`
- “No Workshop DB found”
  - Initialize: `workshop init`
  - If you had past sessions: `workshop import --execute`
- Stale results
  - Run: `workshop import --execute` (one-time catch-up)

## Notes

- This command intentionally avoids MCP — it works everywhere via the Bash tool.
- When MCP reliability improves, you can still use `memory.search`; both read the same database.

