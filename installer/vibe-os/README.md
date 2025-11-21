# Vibe OS 2.0 Installer

**One-command installation for context-aware, memory-persistent orchestration in Claude Code.**

---

## Quick Start

```bash
npx create-vibe-os
```

That's it! The installer will:
- ✅ Check prerequisites
- ✅ Install MCP servers (ProjectContext, SharedContext, vibe-memory)
- ✅ Install commands (/orca, /response-aware, etc.)
- ✅ Install agents (orchestrators + specialists)
- ✅ Configure Claude Code automatically
- ✅ Initialize your project

---

## What You Get

### MCP Servers (3)
- **project-context** — Intelligent context bundles (files, decisions, standards)
- **shared-context** — Cross-session state (40-50% token reduction)
- **vibe-memory** — Persistent knowledge graph (Workshop integration)

### Commands (18+)
- `/orca` — Multi-agent orchestration with stack detection
- `/response-aware` — 6-phase implementation with verification
- `/design-director` — Blueprint-first UI design
- `/creative-strategist` — Performance-driven ad analysis
- And many more...

### Agents (120+)
- **Orchestrators** — orca, response-aware coordinators
- **Specialists** — domain-specific agents (frontend, iOS, data, SEO)
- **Quality** — verification, design review, standards enforcement

### Hooks
- **session-start.sh** — Auto-load context at session start
- **session-end.sh** — Save session learnings
- **orchestrator-firewall.sh** — Prevent orchestrator conflicts
- **load-design-dna.sh** — Auto-load design systems

---

## Prerequisites

Before installation, ensure you have:

- **Claude Code** installed and configured
- **Python 3.8+** (for MCP servers)
- **Node.js 18+** (for installer)
- **Workshop CLI** (optional, for memory) - can be installed during setup

---

## Installation

### Interactive Installation

```bash
npx create-vibe-os
```

You'll be prompted for:
- Install Workshop CLI? (recommended: yes)
- Configure global settings? (recommended: yes)
- Initialize current project? (recommended: yes if in project directory)

### Silent Installation

```bash
npx create-vibe-os --yes
```

Accepts all defaults and installs everything.

---

## Post-Installation

### Verify Installation

```bash
vibe-os doctor
```

Expected output:
```
✓ Claude Code (~/.claude.json found)
✓ MCP: project-context (installed)
✓ MCP: shared-context (installed)
✓ MCP: vibe-memory (installed)
✓ Commands (18 slash commands available)
✓ Agents (120+ agent definitions loaded)
✓ Workshop CLI (installed)
✓ Configuration (MCP servers configured)

📊 Results: 8 passed, 0 failed
```

### Initialize a Project

```bash
cd your-project
vibe-os init
```

Creates:
```
your-project/
├── .claude/
│   ├── memory/
│   │   └── workshop.db
│   └── orchestration/
│       ├── evidence/
│       ├── temp/
│       ├── playbooks/
│       └── reference/
└── CLAUDE.md
```

### Test It Out

```bash
# In Claude Code
/orca "add dark mode to dashboard"
```

This will:
1. Query ProjectContext for relevant files
2. Detect your stack (Next.js, iOS, etc.)
3. Propose specialist team
4. Execute in parallel
5. Run quality gates
6. Return verified implementation

---

## CLI Commands

### `vibe-os doctor`
Verify Vibe OS installation and configuration.

### `vibe-os init`
Initialize current directory as Vibe OS project.

### `vibe-os info`
Show current configuration (MCP servers, commands, agents).

### `vibe-os update`
Update to latest version.

---

## What Gets Installed

### Global Installation (`~/.claude/`)

```
~/.claude/
├── mcp/
│   ├── project-context/     # Context bundling MCP
│   ├── shared-context/      # Cross-session state MCP
│   └── vibe-memory/         # Memory/Workshop MCP
├── commands/
│   ├── orca.md              # Multi-agent orchestration
│   ├── response-aware.md    # 6-phase implementation
│   └── [16 more commands]
├── agents/
│   ├── orchestrators/       # High-level coordinators
│   └── specialists/         # Domain-specific agents
└── hooks/
    ├── session-start.sh     # Context auto-loading
    └── session-end.sh       # Learning capture
```

### Project Installation (`.claude/`)

```
your-project/.claude/
├── memory/
│   └── workshop.db          # Per-project knowledge graph
└── orchestration/
    ├── evidence/            # Screenshots, final reports
    ├── temp/                # Working files (ephemeral)
    ├── playbooks/           # Reference patterns
    └── reference/           # Key docs
```

---

## Configuration

The installer automatically updates `~/.claude.json`:

```json
{
  "mcpServers": {
    "project-context": {
      "command": "python3",
      "args": ["~/.claude/mcp/project-context/server.py"],
      "env": { "PYTHONUNBUFFERED": "1" }
    },
    "shared-context": {
      "command": "python3",
      "args": ["~/.claude/mcp/shared-context/server.py"],
      "env": { "PYTHONUNBUFFERED": "1" }
    },
    "vibe-memory": {
      "command": "python3",
      "args": ["~/.claude/mcp/vibe-memory/memory_server.py"],
      "env": { "PYTHONUNBUFFERED": "1" }
    }
  }
}
```

---

## Usage Examples

### Full Implementation with Verification

```bash
/response-aware "implement user authentication"
```

What happens:
1. **Context Loading** — Query memory, load design DNA
2. **Orchestration** — Detect stack, propose team
3. **Planning** — Parallel planning agents
4. **Implementation** — Build with meta-tags
5. **Verification** — Resolve tags, capture evidence
6. **Quality Gates** — Design review, tests, build

### Multi-Agent Orchestration

```bash
/orca "add search functionality across 4 pages"
```

What happens:
1. Detect domain (frontend/iOS/etc.)
2. Propose specialist team
3. Deploy agents in parallel
4. Synthesis and verification
5. Quality gates and learning capture

### Design Blueprint

```bash
/design-director "product detail page layout"
```

What happens:
1. Load design DNA (spacing, typography, tokens)
2. Apply thinking scaffold (FRAME → STRUCTURE → SURFACE)
3. Produce blueprint with calculations
4. No code (blueprint-first approach)

---

## Troubleshooting

### MCP Servers Not Loading

```bash
# Check MCP server paths
vibe-os info

# Verify Python
python3 --version  # Should be 3.8+

# Check logs
tail -f ~/.claude/logs/mcp-*.log
```

### Workshop Database Not Initializing

```bash
# Install Workshop CLI
cargo install workshop-cli

# Or download binary
# https://github.com/zachswift615/workshop

# Initialize manually
cd your-project
workshop init
mv .workshop/workshop.db .claude/memory/workshop.db
```

### Commands Not Showing Up

```bash
# Restart Claude Code
# Commands are loaded at startup

# Verify installation
ls ~/.claude/commands/

# Check for syntax errors in command files
cat ~/.claude/commands/orca.md
```

---

## Uninstallation

```bash
# Remove global installation
rm -rf ~/.claude/mcp/project-context
rm -rf ~/.claude/mcp/shared-context
rm -rf ~/.claude/mcp/vibe-memory
rm ~/.claude/commands/*.md
rm -rf ~/.claude/agents
rm ~/.claude/hooks/*.sh

# Remove from configuration
# Edit ~/.claude.json and remove MCP server entries

# Remove per-project
rm -rf .claude/
```

---

## Architecture

### Context Flow

```
Request → ProjectContext → Context Bundle → Agent → Implementation
          (files, decisions, standards)    (with context)
```

### Memory Flow

```
Decision/Outcome → Workshop DB → vibe-memory MCP → Future Queries
                   (persistent)  (semantic search)  (instant recall)
```

### Orchestration Flow

```
/orca → Stack Detection → Team Proposal → Parallel Execution → Verification
        (Next.js/iOS)      (specialists)   (bounded concurrency)
```

---

## Support

- **Issues:** https://github.com/adilkalam/vibe-os/issues
- **Documentation:** https://github.com/adilkalam/vibe-os
- **Discussions:** https://github.com/adilkalam/vibe-os/discussions

---

## License

MIT

---

**Built with 🤖 by the Vibe OS community**

_Making Claude Code remember everything._
