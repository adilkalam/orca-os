# Context Findings: Anthropic Best Practices vs OS 2.3

## Summary of Anthropic's Key Recommendations

### From "Best Practices for Agentic Coding"

1. **CLAUDE.md files** - Document commands, style, workflow, warnings
2. **Tool allowlists** - Curate permitted tools carefully
3. **Explore, plan, code, commit** workflow
4. **Subagents for context preservation** - "Consider strong use of subagents, especially for complex problems"
5. **Extended thinking triggers** - "think" < "think hard" < "think harder" < "ultrathink"
6. **Course correct early** - Plan before coding, interrupt, redirect
7. **Checklists and scratchpads** for complex workflows
8. **Multi-Claude workflows** - One writes, another reviews; git worktrees for parallel work

### From "Agent Skills"

1. **Progressive disclosure** - Name/description loaded first, full SKILL.md on demand, linked files as needed
2. **Skills = folders with SKILL.md** - Organized instructions, scripts, resources
3. **Code execution within skills** - Scripts Claude can run without loading into context
4. **Iteration with Claude** - Ask Claude to capture successful approaches into skills

### From "Subagents Documentation" (Official)

1. **File format**: Markdown with YAML frontmatter
2. **Tools field**: Comma-separated strings (NOT YAML arrays)
3. **Model field**: `sonnet`, `opus`, `haiku`, or `inherit`
4. **Built-in subagents**: general-purpose, Plan, Explore
5. **Resumable subagents** - Can continue previous conversations
6. **Best practice**: "Start with Claude-generated agents, then iterate"

### From "Writing Tools for AI Agents"

1. **Choose right tools** - Don't just wrap APIs; design for agent affordances
2. **Namespace tools** - Group by service/resource (e.g., `asana_projects_search`)
3. **Return meaningful context** - Prioritize relevance over flexibility
4. **Token efficiency** - Pagination, filtering, truncation with defaults
5. **response_format parameter** - Let agents choose `concise` vs `detailed`
6. **Prompt-engineer tool descriptions** - They steer agent behavior

### From "Multi-Agent Research System"

1. **Orchestrator-worker pattern** - Lead agent coordinates, subagents work in parallel
2. **Memory for state** - Save plan to memory before context truncation
3. **Teach orchestrator to delegate** - Each subagent needs objective, output format, tool guidance, task boundaries
4. **Scale effort to complexity** - Simple = 1 agent, complex = 10+ agents
5. **Tool design is critical** - Bad descriptions derail agents
6. **Let agents improve themselves** - Claude can diagnose failures and improve prompts
7. **Start wide, then narrow** - Broad queries first, then specific
8. **Guide thinking process** - Extended thinking for planning
9. **Parallel tool calling** - 3-5 subagents in parallel, each using 3+ tools in parallel

---

## Gap Analysis: OS 2.3 vs Anthropic Best Practices

### ALIGNED (What We Do Well)

| Practice | OS 2.3 Implementation |
|----------|----------------------|
| Orchestrator-worker pattern | Grand-architects (Opus) delegate to specialists (Sonnet) |
| Role boundaries | Orchestrators don't write code, builders build |
| CLAUDE.md documentation | Comprehensive project instructions |
| Context bundling | ProjectContext MCP provides context bundles |
| Memory/persistence | Workshop + vibe.db for decisions, gotchas |
| Parallel subagent spawning | Task tool supports parallel agent launches |

### GAPS (What We Should Fix)

#### 1. **Tool Format** (CRITICAL - FIXED TODAY)
- **Anthropic**: `tools: Task, Read, Edit` (comma-separated)
- **OS 2.3 before fix**: YAML arrays causing 0 tool uses
- **Status**: Fixed 68 agents today

#### 2. **Progressive Disclosure Missing**
- **Anthropic**: Skills use 3 levels - metadata → SKILL.md → linked files
- **OS 2.3**: Agent prompts are monolithic; all context loaded upfront
- **Recommendation**: Restructure agents to reference external docs when needed

#### 3. **No `response_format` in Context Bundles**
- **Anthropic**: Tools should offer `concise` vs `detailed` output modes
- **OS 2.3**: ProjectContext returns fixed format
- **Recommendation**: Add `response_format` parameter to `query_context`

#### 4. **Effort Scaling Heuristics Missing**
- **Anthropic**: Explicit rules - simple = 1 agent, medium = 2-4, complex = 10+
- **OS 2.3**: No explicit complexity tier → agent count mapping
- **Recommendation**: Add complexity_tier heuristics to /orca commands

#### 5. **Extended Thinking Not Leveraged**
- **Anthropic**: "think" < "think hard" < "think harder" < "ultrathink"
- **OS 2.3**: No systematic use of thinking triggers
- **Recommendation**: Add thinking triggers to grand-architect prompts

#### 6. **Agent Self-Improvement Loop Missing**
- **Anthropic**: "Let agents improve themselves" - diagnose failures, rewrite prompts
- **OS 2.3**: Manual agent updates only
- **Recommendation**: Add `/audit` post-task to capture learnings back to agents

#### 7. **Tool Namespacing Inconsistent**
- **Anthropic**: `service_resource_action` pattern
- **OS 2.3**: Mixed patterns (some `domain-role`, some flat)
- **Recommendation**: Standardize agent naming to `domain_role_action`

#### 8. **No Resumable Agent Support**
- **Anthropic**: Agents can be resumed with `resume` parameter
- **OS 2.3**: Each agent invocation starts fresh
- **Recommendation**: For long tasks, use `resume` to continue agent context

### ANTI-PATTERNS DETECTED

#### 1. **Monolithic Agent Prompts**
- Some agents have 100+ lines of instructions
- Should split into SKILL.md + reference files

#### 2. **No Tool Response Truncation**
- Agents can receive unbounded tool responses
- Should add truncation + helpful messages

#### 3. **Subagents Can't Coordinate**
- Our subagents work in isolation
- No mechanism for them to share findings in real-time

---

## RA Tags Applied

### #PATH_DECISION
- Grand-architect model choice (Opus) is correct per Anthropic's "smarter model for orchestration"
- Comma-separated tools format is confirmed correct

### #COMPLETION_DRIVE
- Assuming our `query_context` token limits are appropriate (need verification)
- Assuming current agent count (68) is not excessive

### #CONTEXT_DEGRADED
- No visibility into actual agent execution transcripts
- Can't verify if agents are using extended thinking effectively

---

## Priority Recommendations

1. **P0**: Tools format fix (DONE)
2. **P1**: Add `response_format` to ProjectContext
3. **P1**: Add complexity heuristics to /orca commands
4. **P2**: Add extended thinking triggers to grand-architects
5. **P2**: Restructure largest agents for progressive disclosure
6. **P3**: Implement agent self-improvement loop
7. **P3**: Standardize tool/agent namespacing
