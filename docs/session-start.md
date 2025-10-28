# SessionStart Hook

Purpose: Generate a small, fast session context file that Claude Code can import as native memory at launch.

Script: `hooks/session-start.sh`
Output: `.orchestration/session-context.md`

What it includes:
- Timestamp and native memory status (CLAUDE.md path and line count)
- Local memory DB info (size, files, chunks)
- Design Guard summary (violations, mode)
- Atlas presence
- Recent uncommitted changes (git status snippet)
- Recent implementation tags (#FILE_MODIFIED, #SCREENSHOT_CLAIMED, etc.)
- Suggested next commands and note about MCP `memory.search`

Run it manually:
```
make session-start
# or
bash hooks/session-start.sh
```

Import into native memory (recommended):
Add this line anywhere in your `CLAUDE.md` so Claude Code loads the context automatically:

```
@.orchestration/session-context.md
```

Automate in Claude Code (optional):
- If you’re using a plugin or external automation, invoke `bash hooks/session-start.sh` on session start (or equivalent Project Open event).
- Keep it fast; the script is I/O-light and completes in milliseconds when DB is present.

