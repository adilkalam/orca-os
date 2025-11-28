# Evidence Note: Claude Code Community Practices & Advanced Usage Patterns

**Research Date:** 2025-11-28
**Query:** Claude Code community practices, memory systems, orchestration patterns, and advanced usage
**Researcher:** Research Lead Agent

---

## 1. Memory & Persistence Solutions

### Official Approaches
- **CLAUDE.md files** - Hierarchical markdown files auto-loaded into context
  - Locations: `~/.claude/CLAUDE.md` (global), `.claude/CLAUDE.md` (project), child directories
  - Best practice: 100-200 lines max, iterate like prompts
  - Source: [Anthropic - Using CLAUDE.md Files](https://www.claude.com/blog/using-claude-md-files)

- **Session continuation** - `claude -c` (continue) or `claude --resume <id>`
  - Machine-local, don't survive reboots
  - Source: [Claude Code Docs - Memory](https://docs.claude.com/en/docs/claude-code/memory)

### Community Solutions
- **MCP Memory Keeper** - Persistent context MCP server storing in `~/mcp-data/memory-keeper/`
  - Source: [GitHub - mkreyman/mcp-memory-keeper](https://github.com/mkreyman/mcp-memory-keeper)

- **Claude Code Memory Bank** - Adapted from Cline, hierarchical markdown system
  - Files: `projectbrief.md` → `productContext.md`, `systemPatterns.md`, `techContext.md` → `activeContext.md` → `progress.md`
  - Workflow commands: `/workflow:understand`, `/workflow:plan`, `/workflow:execute`, `/workflow:update-memory`
  - Source: [GitHub - hudrazine/claude-code-memory-bank](https://github.com/hudrazine/claude-code-memory-bank)

- **Workshop** (this project) - Persistent context tool with SQLite + embeddings
  - Commands: `workshop decision`, `workshop gotcha`, `workshop why`, `workshop context`

---

## 2. Context Management Strategies

### Key Commands
- `/clear` - Reset context window between tasks
- `/compact` - Summarize conversation, preserve key decisions
- `/context` - View what's consuming context space

### Strategic Approaches
- **Subagent isolation** - Farm out (X + Y) * N work to subagents, only return Z token answers
- **.claudeignore** - Exclude `node_modules/`, `vendor/`, `dist/`, large data files
- **Project maps** - High-level structure rather than full codebase
- **Avoid last 20% of context window** for memory-intensive tasks

### Source
- [ClaudeLog - Context Window](https://claudelog.com/faqs/what-is-context-window-in-claude-code/)
- [Tribe AI - Legacy Code Modernization](https://www.tribe.ai/applied-ai/legacy-code-modernization-with-claude-code-breaking-through-context-window-barriers)

---

## 3. Response Awareness & Self-Tracking

### Response Awareness Methodology
- **Problem:** Context rot - older instructions degrade in impact as context grows
- **Solution:** Orchestrator-worker pattern with metacognitive tags
- **Tags:** `#PATH_DECISION`, `#PLAN_UNCERTAINTY`, `#EXPORT_CRITICAL`, `#COMPLETION_DRIVE`, `#CARGO_CULT`
- **Principle:** "Orchestrator must remain pure coordinator, forbidden from doing actual work"
- Source: [Response Awareness Substack](https://responseawareness.substack.com/p/sub-agents-in-claude-code-the-subagent)

### Implementation Pattern
- Planning Layer: `system-architect`, `data-architect`, `ui-planner`
- Synthesis Layer: `plan-synthesis-agent`
- Implementation Layer: `backend-engineer`, `frontend-engineer`, `database-engineer`
- Verification Layer: `code-reviewer`, `test-engineer`

---

## 4. Prompt Engineering Techniques

### Thinking Modes (Claude Code specific)
- `think` → 4,000 tokens
- `megathink` / `think hard` → 10,000 tokens
- `ultrathink` → 31,999 tokens
- **Note:** Only works in Claude Code CLI, not API or web
- Source: [ClaudeLog - UltraThink](https://claudelog.com/faqs/what-is-ultrathink/)

### Best Practices
- Use XML tags (`<example>`, `<document>`) for structure
- Add emphasis: "IMPORTANT", "YOU MUST", "CRITICAL"
- Be specific: "Use 2-space indentation" > "Format code properly"
- Ask for plans before coding: dramatically improves results
- Use `#` key to quick-add instructions to CLAUDE.md

### Four Modes Approach
1. **Learn Mode** - "Explain as if I'm an infra engineer preparing for a debate"
2. **Build Mode** - Implementation
3. **Critique Mode** - Review
4. **AMA Mode** - Force clarifying questions before output

Source: [Medium - Four Modes](https://sderosiaux.medium.com/how-i-learned-to-prompt-ai-better-my-four-modes-177bddcfa6bd)

---

## 5. Orchestration Patterns

### Anthropic's Multi-Agent Research System
- **Architecture:** Orchestrator-worker pattern
- **Performance:** Multi-agent (Opus lead + Sonnet workers) outperformed single Opus by 90.2%
- **Key insight:** Token usage explains 80% of performance variance
- **Parallelization:** 3-5 subagents + 3+ parallel tool calls reduced research time by 90%
- Source: [Anthropic - Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)

### Community Frameworks
1. **claude-flow** (ruvnet) - 64-agent system with Hive-Mind Intelligence
   - Queen-led coordination with worker agents
   - 100 MCP tools for swarm orchestration
   - Commands: `claude-flow swarm init --topology hierarchical`
   - Source: [GitHub - ruvnet/claude-flow](https://github.com/ruvnet/claude-flow)

2. **claude-orchestration** (mbruhler) - Workflow syntax
   - Parallel: `[task1 || task2 || task3]`
   - Sequential: `step1 -> step2 -> step3`
   - Conditional: `test -> (if passed)~> deploy`

3. **wshobson/agents** - 15 Workflow Orchestrators for multi-agent coordination

### RIPER Workflow
- **Phases:** Research → Innovate → Plan → Execute → Review
- **Permissions:** Research (read-only) → Plan (read + memory write) → Execute (full access) → Review (read + test)
- **Subagents:** `research-innovate`, `plan-execute`, `review`
- Source: [GitHub - tony/claude-code-riper-5](https://github.com/tony/claude-code-riper-5)

---

## 6. Parallel Multi-Agent Flows

### Git Worktrees Pattern
- Create isolated working directories for each Claude instance
- Prevents agents from overwriting each other's edits
- Command: `git worktree add ../project-feature-a feature-a`
- Source: [Incident.io - Shipping Faster with Worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)

### Tools
- **ccswitch** - Manages worktree creation, switching, cleanup
- **GitButler** - Auto-sorts AI coding into separate branches via hooks

### Multi-Claude Review Pattern
1. Claude A writes code
2. Claude B reviews/tests
3. Claude C reads code + feedback
4. Claude A implements changes

### Trade-offs
- Setup overhead (npm install, build artifacts)
- Potential merge conflicts with yourself
- Worth it for tasks > 10 minutes

---

## 7. Skills & Plugins

### Skills System
- **Location:** `~/.claude/skills/` (personal) or `.claude/skills/` (project)
- **Structure:** SKILL.md with YAML frontmatter
- **Discovery:** Automatic based on description matching
- **Loading:** Progressive disclosure - only full content loaded when relevant
- Source: [Anthropic - Agent Skills](https://www.anthropic.com/news/skills)

### Plugins System (Beta)
- **Bundle:** Commands, subagents, MCP servers, hooks
- **Install:** `/plugin` command
- **Marketplaces:** GitHub repos or custom URLs with `marketplace.json`
- Source: [Anthropic - Claude Code Plugins](https://claude.com/blog/claude-code-plugins)

### Custom Slash Commands
- **Location:** `.claude/commands/` (project) or `~/.claude/commands/` (personal)
- **Format:** Markdown files, filename = command name
- **Arguments:** Use `$ARGUMENTS` or `$1`, `$2` placeholders
- Source: [Claude Code Docs - Slash Commands](https://code.claude.com/docs/en/slash-commands)

### Notable Command Repositories
- **wshobson/commands** - Production-ready commands in `tools/` and `workflows/`
- **qdhenry/Claude-Command-Suite** - Code review, security audit, architecture analysis
- **iannuttall/claude-sessions** - Session tracking and knowledge transfer

---

## 8. Custom MCP Servers

### Configuration Methods
1. CLI wizard: `claude mcp add github --scope user`
2. Direct config: `.mcp.json` at project root (team sharing)
3. Global config: Personal MCP servers

### Environment Variables
- `MCP_TIMEOUT=10000` - 10 second startup timeout
- `MAX_MCP_OUTPUT_TOKENS=50000` - Increase output limit

### Desktop Extensions (.mcpb)
- Bundles entire MCP server with dependencies
- One-click installation
- Open-source specification by Anthropic

Source: [Claude Code Docs - MCP](https://docs.claude.com/en/docs/claude-code/mcp)

---

## 9. Hooks for Automation

### Hook Lifecycle Points
- Pre/post tool execution
- Session start/end
- Conversation events

### Use Cases
- Security scanning before commits
- Automatic code formatting after edits
- Custom notifications
- Input validation before allowing edits

### Phased Adoption
1. **Observer Hooks** - Logging, monitoring (no behavior change)
2. **Enhancement Hooks** - Formatting, notifications
3. **Enforcement Hooks** - File protection, security scanning, build validation

Source: [LiquidMetal AI - Claude Code Hooks Guide](https://liquidmetal.ai/casesAndBlogs/claude-code-hooks-guide/)

---

## 10. CI/CD & GitHub Actions

### Claude Code Action
- Trigger: `@claude` mention in PR or issue
- Modes: Code review, implementation, bug fixing
- Setup: `/install-github-app` command

### Use Cases
- Automated security reviews
- Documentation generation
- PR analysis and suggestions
- Release notes generation

Source: [GitHub - anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)

---

## 11. Pain Points & Limitations

### Reliability
- 99.56% uptime vs OpenAI's 99.96%
- 529 "overloaded" errors common even on Max plans
- Infrastructure issues Aug-Sep 2025

### Rate Limiting
- "You don't control it. You rent it, and it's rationed."
- Need to track token-per-minute budgets

### Context Window
- Degradation near limits
- Context bloat from low-signal text
- Large codebases require chunking

### Subagent Limitations
- Cannot spawn nested subagents
- No stepwise plan mode
- No transparent intermediate output

### Cost
- Some users spent $70K+/year before switching
- Token budgets can balloon without discipline

Sources:
- [Medium - Claude Code Good Bad Ugly](https://medium.com/@averageguymedianow/claude-code-in-your-workflow-the-good-the-bad-and-the-ugly-304e4f5a9dc9)
- [Northflank - Claude Rate Limits](https://northflank.com/blog/claude-rate-limits-claude-code-pricing-cost)

---

## 12. Key Community Resources

### Documentation & Tutorials
- [ClaudeLog](https://claudelog.com/) - Docs, guides, tutorials
- [DeepLearning.AI Course](https://www.deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant/)
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Curated list

### Community Projects
- [claude-flow](https://github.com/ruvnet/claude-flow) - Agent orchestration platform
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) - 100+ subagents
- [claude-code-templates](https://github.com/claude-code-templates) - Dashboard, hooks, agents

### Discord
- Claude Developers Discord - Official community

---

## Research Metadata

**Sources Consulted:** 40+
**Tool Status:** WebSearch/WebFetch used (Firecrawl MCP not available)
**Rate Limit Events:** None observed
**Coverage Gaps:**
- Twitter/X threads (search limitations)
- YouTube tutorial transcripts (not extracted)
- Discord archives (not publicly accessible)
