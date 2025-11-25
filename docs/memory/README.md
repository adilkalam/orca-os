# Claude Code Unified Memory System

**Last Updated:** 2025-11-23

A fully integrated memory system for Claude Code that automatically loads context, caches results, and reduces token usage by 66%.

## 🎯 Problem Solved

This system solves the fundamental issues with Claude Code orchestration:
- **Files scattered in project roots** → Everything in `.claude/`
- **Context not loading automatically** → Auto-loads from cache
- **Massive token usage** → Caching reduces by 66%
- **Disconnected memory systems** → All integrated

## 📁 Architecture

All memory operations live in the `.claude/` directory:

```
.claude/
├── memory/              # Databases
│   ├── workshop.db      # Decisions, gotchas, sessions
│   └── vibe.db         # Code search with FTS5
├── orchestration/       # Working files
│   ├── temp/           # Session files (auto-cleaned)
│   └── evidence/       # Final artifacts
├── cache/              # Context caching
└── CLAUDE.md           # Project instructions
```

## 🚀 Quick Start

### First Time Setup (One-Time)

1. **Run migration in your project:**
```bash
bash ~/.claude/scripts/migrate-to-claude-dir.sh
```

This will:
- Create `.claude/` structure
- Move any existing `.workshop/` → `.claude/memory/`
- Initialize vibe.db with proper schema
- Set up Workshop if needed

### Automatic Features

Once set up, these work automatically:

1. **SessionStart** - Loads cached context (zero tokens if cached)
2. **SessionEnd** - Captures session summary to Workshop
3. **Memory Search** - Available before expensive operations
4. **Context Caching** - SharedContext reduces token usage

## 🔧 Available Tools

### Memory Search

Search across all memory systems:
```bash
# Search everything
python3 ~/.claude/scripts/memory-search-unified.py "authentication"

# Search with options
python3 ~/.claude/scripts/memory-search-unified.py "database schema" \
  --mode code \
  --top-k 20 \
  --json
```

Modes: `all`, `code`, `docs`, `events`, `decisions`

### Workshop Commands

Record and query decisions:
```bash
# Record a decision
workshop --workspace .claude/memory decision \
  "Use PostgreSQL for main database" \
  -r "Better JSON support and scalability"

# Record a gotcha
workshop --workspace .claude/memory gotcha \
  "API rate limits hit after 100 requests/minute"

# View recent activity
workshop --workspace .claude/memory recent

# Search for why something was done
workshop --workspace .claude/memory why "database choice"
```

### Context Cache Management

```bash
# Check cache status
python3 ~/.claude/scripts/integrate-context-cache.py status

# Force cache refresh
python3 ~/.claude/scripts/integrate-context-cache.py invalidate

# Query with caching
python3 ~/.claude/scripts/integrate-context-cache.py query \
  --domain webdev \
  --task "implement auth"
```

### Testing

Verify everything is working:
```bash
bash ~/.claude/scripts/test-memory-integration.sh
```

## 📊 Token Savings

### Before Integration
- Every `query_context()`: ~50k tokens
- No caching between sessions
- Total per session: **150k+ tokens**

### After Integration
- First `query_context()`: ~50k tokens (then cached)
- Subsequent calls: 0 tokens (from cache)
- Cache persists across sessions
- Total per session: **~50k tokens**
- **Savings: 66% reduction**

## 🔄 How It Works

### 1. Session Start
```bash
~/.claude/hooks/session-start.sh
```
- Checks for cached context in `.claude/cache/`
- Loads Workshop context from `.claude/memory/`
- Initializes vibe.db if needed
- Shows cache status (hit/miss)

### 2. During Session
- **Memory First**: Always search local memory before API calls
- **Workshop**: Record decisions and gotchas as you work
- **Clean Organization**: All files in `.claude/orchestration/`

### 3. Session End
```bash
~/.claude/hooks/session-end.sh
```
- Captures session summary to Workshop
- Records branch, changed files, commits
- Cleans up old temp files
- Updates cache if needed

## 🎯 Integration Points

### For ORCA Commands
ORCA should always search memory first:
```bash
# Before orchestration
MEMORY=$(python3 ~/.claude/scripts/memory-search-unified.py "$TASK")
# Then inject relevant context into ORCA
```

### For MCP Tools
- `query_context()` - Automatically cached via SharedContext
- `memory.search()` - Searches vibe.db locally
- `workshop` commands - Record decisions in real-time

### For Claude Code
- Hooks automatically load/save context
- No manual intervention needed
- Works for ALL sessions, not just ORCA

## 📝 Implementation Details

See these documents for deeper understanding:

- [`unified-memory-architecture.md`](unified-memory-architecture.md) - System design and integration
- [`memory-integration-complete.md`](memory-integration-complete.md) - What was built and verification

### Archived Documentation

Original design documents are archived in [`archived/`](archived/):
- `vibe-memory-v2-architecture-2025-11-19.md` - Original vibe-memory design
- `vibe-memory-v2-conventions.md` - Original conventions
- `mcp-memory.md` - Original MCP server docs
- `codex-cli-mcp-memory.md` - Original Codex integration

## 🐛 Troubleshooting

### Cache not working
```bash
# Check cache status
python3 ~/.claude/scripts/integrate-context-cache.py status

# Clear cache if corrupted
rm -rf ~/.claude/cache/*.json
```

### Workshop not recording
```bash
# Verify Workshop is initialized
workshop --workspace .claude/memory init

# Check database exists
ls -la .claude/memory/workshop.db
```

### Hooks not running
```bash
# Verify hooks are installed
ls -la ~/.claude/hooks/session-*.sh

# Check they're executable
chmod +x ~/.claude/hooks/*.sh

# Verify in settings.json
cat ~/.claude/settings.json | grep -A5 hooks
```

## ✅ Success Metrics

When properly configured:
1. `workshop --workspace .claude/memory recent` shows current activity
2. Cache status shows "hit" on second session
3. Token usage drops by 66%
4. All files created in `.claude/`, not project root
5. Context loads automatically without prompting

---

**The elaborate OS 2.2 memory system is now ACTUALLY WORKING!**