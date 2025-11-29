# MCP Servers Reference (OS 2.4.1)

**Version:** OS 2.4.1
**Last Updated:** 2025-11-29

**Model Context Protocol (MCP) integrations for OS 2.4**

---

## Overview

MCP servers provide structured tool interfaces for agents. All I/O goes through declared tools — this acts as a hard permission boundary.

### OS 2.4 Integration

**What's New:**
- **ProjectContextServer** (MCP) is now MANDATORY - all `/plan` and `/orca` commands query it first
- **SharedContext** (MCP) provides cross-session context with versioning and differential updates
- **Automatic Context Loading** - orchestrators query ProjectContextServer in Phase 1
- **Role Boundaries** - orchestrators only use ProjectContext, agents use domain-specific MCPs
- **State Preservation** - MCP results stored in phase_state.json for resumption

**Key MCPs for OS 2.4.1:**
1. **ProjectContextServer** - Mandatory context provider (Phase 1)
2. **SharedContext** - Cross-session context (optional token optimization)
3. **Sequential-thinking** - Deep reasoning (via `/ultra-think`)
4. **Clear-thought** - 38 reasoning operations (via `/clear-thought`)
5. **Stochastic-thinking** - Probabilistic algorithms (MDPs, MCTS, Bandits)
6. **Context7** - Library documentation
7. **Playwright** - Browser automation (design QA)
8. **XcodeBuildMCP** - iOS development (ios-verification)

MCP servers provide structured tool interfaces for agents. All I/O goes through declared tools — this acts as a hard permission boundary.

**Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ Claude Code                                             │
│   ↓                                                     │
│ MCP Client (stdio JSON-RPC 2.0)                         │
│   ↓                                                     │
│ MCP Server (exposes tools)                              │
│   ↓                                                     │
│ System Resources (browser, DB, filesystem, etc.)        │
└─────────────────────────────────────────────────────────┘
```

**Key Principle:** Agents can only use MCPs specified in their `allowed-tools` configuration.

---

## Custom MCP Servers

### vibe-memory

**Purpose:** Per-project memory and knowledge graph

**Location:** `~/.claude/mcp/vibe-memory/`

**Configuration:** Per-project in `~/.claude.json`:

```json
{
  "projects": {
    "/absolute/path/to/project": {
      "mcpServers": {
        "vibe-memory": {
          "command": "python3",
          "args": ["/Users/username/.claude/mcp/vibe-memory/memory_server.py"],
          "env": { "PYTHONUNBUFFERED": "1" }
        }
      }
    }
  }
}
```

**Tools Provided:**
- `memory.search(query, limit)` — Semantic + FTS5 search over project knowledge

**Data Source:** `.claude/memory/workshop.db` (SQLite FTS5 database)

**Search Methods:**
1. **Vector search** (semantic, if sentence-transformers installed)
   - Uses e5-small embeddings
   - Cosine similarity ranking
2. **FTS5 fallback** (keyword, always available)
   - BM25 ranking
   - Snippet extraction

**Path Resolution Priority:**
1. `$WORKSHOP_DB` env var
2. `$WORKSHOP_ROOT/.claude/memory/workshop.db`
3. Walk up from CWD: `.claude/memory/workshop.db`
4. Walk up from CWD: `.claude-work/memory/workshop.db` (legacy)
5. Walk up from CWD: `.workshop/workshop.db` (legacy)
6. Fallback: `CWD/.claude/memory/workshop.db`

**Usage by Agents:**
- All orchestrators (orca, response-aware, workflow-orchestrator)
- All planning agents (system-architect, requirement-analyst)
- All specialists (load prior decisions, gotchas, antipatterns)

**CLI Interface:** Workshop CLI (`workshop` command)
- `workshop decision "Use Supabase for auth"`
- `workshop gotcha "iOS Simulator needs Xcode 15.4+"`
- `workshop goal "Add dark mode" -p high`
- `workshop antipattern "No inline styles"`
- `workshop search "CSS patterns"`

**See:** `quick-reference/memory-explainer.md` for full details

---

## External MCP Servers

### clear-thought

**Purpose:** 38 structured reasoning operations for enhanced problem-solving

**Package:** `@waldzellai/clear-thought-onepointfive`

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "clear-thought": {
      "command": "node",
      "args": ["/path/to/clearthought-onepointfive/dist/cli/stdio-server.js"]
    }
  }
}
```

**Single Tool:** `clear_thought` with `operation` parameter

**Operations by Category:**
- **Core:** `sequential_thinking`, `mental_model`, `debugging_approach`, `creative_thinking`, `visual_reasoning`, `metacognitive_monitoring`, `scientific_method`
- **Collaborative:** `collaborative_reasoning`, `decision_framework`, `socratic_method`, `structured_argumentation`
- **Analysis:** `systems_thinking`, `analogical_reasoning`, `causal_analysis`, `statistical_reasoning`, `simulation`, `optimization`, `ethical_analysis`
- **Patterns:** `tree_of_thought`, `beam_search`, `mcts`, `graph_of_thought`
- **Strategic:** `ooda_loop`, `ulysses_protocol`
- **Session:** `session_info`, `session_export`, `session_import`

**Usage:**
- Via `/clear-thought` command with flags (`--seq`, `--model`, `--debug`, etc.)
- Via `/think` command for strategy recommendations
- Direct MCP call: `mcp__clear-thought__clear_thought`

**See:** `quick-reference/readme-clear-thought.md` for full flag reference

---

### stochastic-thinking

**Purpose:** Probabilistic algorithms for decision-making under uncertainty

**Package:** `@waldzellai/stochasticthinking`

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "stochastic-thinking": {
      "command": "npx",
      "args": ["-y", "@waldzellai/stochasticthinking"]
    }
  }
}
```

**Tool:** `stochasticalgorithm` with `algorithm` parameter

**Algorithms:**
| Algorithm | Use Case |
|-----------|----------|
| `mdp` | Sequential decisions with rewards (Markov Decision Process) |
| `mcts` | Game trees, strategic planning (Monte Carlo Tree Search) |
| `bandit` | A/B testing, exploration vs exploitation |
| `bayesian` | Optimization under uncertainty |
| `hmm` | Pattern inference, time series (Hidden Markov Model) |

**When to Use:**
- `bandit` - A/B testing, ad placement, resource allocation
- `mdp` - Robot navigation, long-term policy optimization
- `mcts` - Game playing, strategic planning
- `bayesian` - Hyperparameter tuning, expensive experiments
- `hmm` - Weather patterns, state inference from sequences

---

### playwright

**Purpose:** End-to-end browser automation and visual testing

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

**Tools Provided:**
- `browser_navigate(url)` — Navigate to URL
- `browser_click(element, ref)` — Click element
- `browser_type(element, ref, text)` — Type text
- `browser_fill_form(fields)` — Fill multiple form fields
- `browser_take_screenshot(filePath)` — Capture screenshot
- `browser_snapshot()` — Accessibility tree snapshot
- `browser_evaluate(function)` — Run JavaScript
- `browser_console_messages()` — Get console logs
- `browser_network_requests()` — Get network activity
- `browser_tabs(action)` — Manage tabs
- `browser_wait_for(text)` — Wait for content

**Usage by Agents:**
- design-reviewer (visual verification)
- verification-agent (functional testing)
- ui-testing-expert (E2E flows)

**Evidence Capture:**
- Screenshots → `.claude/orchestration/evidence/`
- Console logs → verification reports
- Network logs → performance analysis

---

### chrome-devtools

**Purpose:** Live page inspection and debugging

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-chrome-devtools"]
    }
  }
}
```

**Tools Provided:**
- `take_snapshot(verbose)` — DOM accessibility tree
- `click(uid)` — Click element by UID
- `fill(uid, value)` — Fill form element
- `evaluate_script(function, args)` — Execute JS
- `take_screenshot(filePath, fullPage)` — Capture screenshot
- `list_pages()` — Show open tabs
- `navigate_page(url)` — Navigate to URL
- `list_console_messages(types)` — Get console logs
- `list_network_requests(resourceTypes)` — Get network requests
- `performance_start_trace()` — Start performance recording
- `performance_stop_trace()` — Stop and analyze performance

**Usage by Agents:**
- design-reviewer (inspect live styles)
- verification-agent (DOM validation)

**Performance Analysis:**
- Core Web Vitals (LCP, FID, CLS)
- Performance insights
- Network waterfall

---

### XcodeBuildMCP

**Purpose:** iOS/macOS development automation

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "XcodeBuildMCP": {
      "command": "npx",
      "args": ["-y", "@pixelmatters/xcode-build-mcp"]
    }
  }
}
```

**Tools Provided:**

**Project Management:**
- `discover_projs(workspaceRoot, scanPath, maxDepth)` — Find Xcode projects
- `list_schemes(projectPath|workspacePath)` — List schemes
- `show_build_settings(projectPath|workspacePath, scheme)` — Build settings

**Build & Run:**
- `build_sim(projectPath|workspacePath, scheme, simulatorName)` — Build for simulator
- `build_device(projectPath|workspacePath, scheme)` — Build for device
- `build_macos(projectPath|workspacePath, scheme, arch)` — Build macOS app
- `build_run_sim(...)` — Build and run in simulator
- `build_run_macos(...)` — Build and run macOS app

**Testing:**
- `test_sim(projectPath|workspacePath, scheme, simulatorName)` — Run tests on simulator
- `test_device(projectPath|workspacePath, scheme, deviceId)` — Run tests on device
- `test_macos(projectPath|workspacePath, scheme)` — Run macOS tests

**Simulator Management:**
- `list_sims()` — List available simulators
- `boot_sim(simulatorUuid)` — Boot simulator
- `open_sim()` — Open Simulator.app
- `install_app_sim(simulatorUuid, appPath)` — Install app
- `launch_app_sim(simulatorUuid, bundleId)` — Launch app
- `stop_app_sim(simulatorUuid, bundleId)` — Stop app
- `screenshot(simulatorUuid, filePath)` — Take screenshot
- `describe_ui(simulatorUuid)` — Get UI hierarchy with coordinates
- `tap(simulatorUuid, x, y)` — Tap at coordinates
- `swipe(simulatorUuid, x1, y1, x2, y2)` — Swipe gesture
- `type_text(simulatorUuid, text)` — Type text
- `set_sim_appearance(simulatorUuid, mode)` — Dark/light mode
- `erase_sims(simulatorUuid|all)` — Reset simulator

**Device Management:**
- `list_devices()` — List connected devices
- `install_app_device(deviceId, appPath)` — Install app on device
- `launch_app_device(deviceId, bundleId)` — Launch app on device
- `stop_app_device(deviceId, processId)` — Stop app on device

**Swift Package Management:**
- `swift_package_build(packagePath, configuration)` — Build package
- `swift_package_test(packagePath, configuration)` — Run tests
- `swift_package_run(packagePath, executableName)` — Run executable
- `swift_package_clean(packagePath)` — Clean build

**Usage by Agents:**
- ios-swiftui-specialist (iOS development)
- ios-fastlane-specialist (CI/CD)
- ios-accessibility-specialist (accessibility testing)
- ios-performance-specialist (performance profiling)
- ios-ui-testing-specialist (UI automation)

---

### context7

**Purpose:** Library documentation and code search

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp"]
    }
  }
}
```

**Tools Provided:**
- `resolve-library-id(libraryName)` — Find Context7 library ID
- `get-library-docs(context7CompatibleLibraryID, topic, tokens)` — Fetch docs

**Usage Pattern:**
1. `resolve-library-id("next.js")` → `/vercel/next.js`
2. `get-library-docs("/vercel/next.js", "routing", 5000)` → Documentation

**Usage by Agents:**
- All implementation agents (look up API docs)
- system-architect (research libraries)
- backend-engineer, frontend-engineer (implementation reference)

---

### bright-data-web

**Purpose:** Web scraping and search engine results

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "bright-data-web": {
      "command": "npx",
      "args": ["-y", "@brightdata/mcp-server-bright-data-web"]
    }
  }
}
```

**Tools Provided:**
- `search_engine(query, engine, cursor)` — Google/Bing/Yandex search
- `search_engine_batch(queries)` — Batch search (max 10)
- `scrape_as_markdown(url)` — Scrape single webpage
- `scrape_batch(urls)` — Scrape multiple webpages (max 10)

**Features:**
- Bypasses bot detection and CAPTCHA
- Returns markdown for clean extraction
- Supports pagination cursors

**Usage by Agents:**
- mm-market-researcher (competitor research)
- creative-strategist (market analysis)
- requirement-analyst (research user needs)

---

### sequential-thinking

**Purpose:** Extended reasoning and deep analysis

**Configuration:** Global in `~/.claude.json`:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**Tools Provided:**
- `sequentialthinking(thought, thoughtNumber, totalThoughts, nextThoughtNeeded, isRevision, ...)`

**Usage Pattern:**
- Break down complex problems into steps
- Revise previous thoughts if needed
- Generate hypothesis → verify → repeat
- Provides single correct answer after verification

**Usage by Agents:**
- system-architect (complex design decisions)
- requirement-analyst (clarify ambiguous requirements)
- engineering-director (strategic planning)
- Used via `/ultra-think` command

---

## MCP Usage Patterns

### Permission Boundaries

**Agents specify allowed MCPs:**

```markdown
## Allowed Tools
- Read, Write, Edit, Bash
- Grep, Glob
- mcp:vibe-memory (memory.search)
- mcp:playwright (browser automation)
```

**Result:** Agent can only use these tools, no others.

---

### Evidence Capture Flow

```
Implementation Agent
    ↓ (tags work with #SCREENSHOT_CLAIMED)
Verification Agent
    ↓ (uses playwright MCP)
    browser_take_screenshot()
    ↓
    Evidence saved: .claude/orchestration/evidence/ui.png
    ↓
    Tag resolved: ✓
```

---

### Memory-First Pattern

```
Orchestrator receives request
    ↓
    Uses vibe-memory.search("CSS patterns")
    ↓
    Loads prior decisions from workshop.db
    ↓
    Dispatches specialist with context
```

**Result:** Specialists don't re-invent decisions, they follow learned patterns.

---

## Configuration Reference

### Global MCP Servers (All Projects)

**File:** `~/.claude.json`

```json
{
  "mcpServers": {
    "playwright": { /* browser automation */ },
    "chrome-devtools": { /* page inspection */ },
    "XcodeBuildMCP": { /* iOS/macOS dev */ },
    "context7": { /* library docs */ },
    "bright-data-web": { /* web scraping */ },
    "sequential-thinking": { /* deep reasoning */ }
  }
}
```

---

### Per-Project MCP Servers

**File:** `~/.claude.json`

```json
{
  "projects": {
    "/absolute/path/to/project": {
      "mcpServers": {
        "vibe-memory": {
          "command": "python3",
          "args": ["/path/to/.claude/mcp/vibe-memory/memory_server.py"],
          "env": { "PYTHONUNBUFFERED": "1" }
        }
      }
    }
  }
}
```

**Important:** Do NOT duplicate global MCPs in per-project config.

---

## Troubleshooting

### MCP Not Connecting

```bash
# Check configuration
cat ~/.claude.json | jq '.mcpServers'

# Test MCP server manually
npx -y @modelcontextprotocol/server-playwright

# Check per-project config
python3 - << 'EOF'
import json, os
from pathlib import Path
cfg = json.loads(Path(Path.home()/'.claude.json').read_text())
proj = str(Path.cwd().resolve())
print(json.dumps(cfg.get('projects',{}).get(proj,{}).get('mcpServers',{}), indent=2))
EOF
```

---

### vibe-memory Not Finding Database

```bash
# Check database exists
ls -lh .claude/memory/workshop.db

# Check MCP server location
ls -lh ~/.claude/mcp/vibe-memory/memory_server.py

# Initialize if missing
workshop init
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db
```

---

### playwright Browser Not Installed

```bash
# Install browsers
npx playwright install chromium

# Or use browser_install tool
# (Claude will call this automatically if browser missing)
```

---

## Best Practices

### 1. Use Semantic Search (vibe-memory)

```
✓ Load prior decisions before planning
✓ Query antipatterns before implementing
✓ Check gotchas before running commands
```

### 2. Capture Evidence (playwright/chrome-devtools)

```
✓ Screenshot after UI changes
✓ Console logs for debugging
✓ Network requests for API verification
```

### 3. Verify Builds (XcodeBuildMCP)

```
✓ Build before claiming "done"
✓ Run tests automatically
✓ Capture build logs
```

### 4. Research Before Implementing (context7, bright-data-web)

```
✓ Look up library docs first
✓ Research competitor patterns
✓ Don't hallucinate APIs
```

---

## Summary

**Custom MCPs:**
- vibe-memory (project memory + knowledge graph)

**External MCPs:**
- playwright (browser automation)
- chrome-devtools (page inspection)
- XcodeBuildMCP (iOS/macOS development)
- context7 (library documentation)
- bright-data-web (web scraping)
- sequential-thinking (deep reasoning)

**Key Principles:**
1. All I/O through declared tools
2. Permission boundaries via allowed-tools
3. Evidence capture automatic
4. Memory-first architecture

---

_Last updated: 2025-11-14_
_Update after: MCP additions/removals or configuration changes_
