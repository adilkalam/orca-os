---
title: "AI Native Project Management for CLI Agents"
source: "https://agiflow.io/blog/claude-code-internals-reverse-engineering-prompt-augmentation/"
author:
  - "[[Agiflow]]"
published: 2025-10-18
created: 2025-10-28
description: "Agiflow makes it simple to plan, run and manage parallel autonomous AI agents across different projects. Supercharged by shared AI profiles, automatic MCP provisioning with real-time tracking."
tags:
  - "clippings"
---
## Why I Did This

Claude Code recently added support for skills. I was already familiar with output styles, slash commands, and sub-agents, but skills were new and the automatic invocation mechanism seemed interesting. The documentation explains what these features do, but not how they actually work under the hood. I wanted to understand the implementation—particularly how skills get invoked automatically versus slash commands that require explicit triggers, and why sub-agents seem to operate differently than the main conversation. The only way to understand the actual mechanics was to instrument the network traffic and look at what's being sent to the API.

I modified Claude Code to log all API requests and responses, then ran five separate conversation sessions to isolate each mechanism. For each session I captured the full JSON payloads and traced how content flows through the API. **All network logs and analysis data are publicly available at [github.com/AgiFlow/claude-code-prompt-analysis](https://github.com/AgiFlow/claude-code-prompt-analysis)** if you want to verify the analysis or conduct your own experiments. The network logs are in `data/` if you want to verify the analysis. The architecture turned out to be cleaner than I expected—five distinct injection points in the API request structure, each handling a different concern with minimal overlap.

## The Five Mechanisms at a Glance

| Mechanism | Injection Point | Activation | Scope | Primary Use Case |
| --- | --- | --- | --- | --- |
| \*\*CLAUDE.md\*\* | User messages () | Automatic if file exists | Project-wide, all users | Project standards, architecture context |
| \*\*Output Styles\*\* | System prompt | Manual (`/output-style`) | Session-wide, single user | Response format, tone, verbosity |
| \*\*Slash Commands\*\* | User messages () | User-explicit | Single turn | Repeatable workflows, checklists |
| \*\*Skills\*\* | User messages (via `tool_result`) | Model-decided | Single turn | Domain expertise, automated capabilities |
| \*\*Sub-Agents\*\* | Separate conversation | Model-decided (via Task tool) | Isolated conversation | Multi-step autonomous tasks |

**Key architectural layers:**
- **System-level**: Output Styles (modifies Claude's identity)
- **Message-level**: CLAUDE.md, Slash Commands, Skills (adds context/instructions)
- **Conversation-level**: Sub-Agents (delegates to isolated conversations)

Claude Code operates on three layers: system-level behavior modification (output styles and CLAUDE.md), message-level content injection (slash commands and skills), and conversation-level delegation (sub-agents). Output styles mutate the system prompt and persist for the entire session. CLAUDE.md content is injected as contextual reminders in user messages. Slash commands and skills both inject into user messages, but slash commands are user-triggered while skills are model-triggered based on semantic matching. Sub-agents spawn entirely separate conversations with their own context and system prompts. Understanding these distinctions matters because they have different performance characteristics, security implications, and failure modes.

\---

## The Five Mechanisms

### 1\. CLAUDE.md: Project-Level Context Injection

CLAUDE.md is the most subtle mechanism because it doesn't require explicit activation—if the file exists in your project root, Claude Code automatically reads it and injects the content into every user message as a . Unlike output styles which modify the system prompt, CLAUDE.md content appears in the user message array wrapped in system-reminder tags. This is automatic, persistent, and completely transparent to the user.

**Network trace:**

```json
{
  "messages": [{
    "role": "user",
    "content": [{
      "type": "text",
      "text": "<system-reminder>\nAs you answer the user's questions, you can use the following context:\n# claudeMd\nCodebase and user instructions are shown below...\n\nContents of /path/to/CLAUDE.md (project instructions, checked into the codebase):\n\n[your CLAUDE.md content]\n</system-reminder>"
    }]
  }]
}
```

The key difference from system prompts is placement and emphasis. System prompts define Claude's identity and capabilities, while CLAUDE.md provides project-specific context and constraints. The "IMPORTANT: These instructions OVERRIDE any default behavior" preamble signals high priority, but it's still part of user context, not system identity. This makes CLAUDE.md perfect for project-specific coding standards, architecture decisions, and domain knowledge that should influence every response without changing Claude's fundamental behavior.

The performance cost is negligible—CLAUDE.md gets sent with every request, but it's typically small (1-5KB). The real issue is that developers often forget CLAUDE.md exists because it's invisible. I've debugged several cases where Claude was behaving unexpectedly, only to discover someone had committed a CLAUDE.md with conflicting instructions weeks earlier. Always check your CLAUDE.md when debugging strange behavior.

**Use CLAUDE.md for:**

- Project-specific coding standards and conventions
- Architecture decisions and patterns to follow
- Domain knowledge and business logic context
- References to other project documentation files (via @file.md syntax)

**Don't use CLAUDE.md for:**

- Temporary instructions (use user messages instead)
- User-specific preferences (use output styles)
- Workflow automation (use slash commands)

\---

### 2\. Output Styles: System Prompt Mutation

When you run `/output-style software-architect`, Claude Code appends a text block to the `system` array in the API request. This isn't a one-time injection—it persists and gets included in every subsequent API request until you explicitly change it or end the session. The network trace shows it clearly: the system array contains the base Claude Code prompt plus an additional text block with the output style instructions. This is session-scoped mutation, not per-message modification.

**Network trace:**

```json
{
  "system": [
    {"type": "text", "text": "You are Claude Code..."},
    {"type": "text", "text": "# Output Style: software-architect\n[instructions...]"}
  ],
  "messages": [...]
}
```

The performance implications are minimal—adding ~2KB per request is negligible. The real cost is cognitive overhead when you forget which style is active. I've debugged several issues where I couldn't figure out why Claude was responding strangely, only to realize I had set an output style hours earlier and forgotten about it. Use output styles for session-wide behavior changes like response format, technical depth, or verbosity. Don't use them for single-turn modifications—that's what slash commands are for.

\---

### 3\. Slash Commands: Deterministic Prompt Injection

Slash commands are the simplest mechanism—pure string substitution with no intelligence involved. When you run `/review @file.js`, Claude Code reads `.claude/commands/review.md`, replaces any `{arg1}` placeholders with your arguments, and injects the result into the current user message. The network trace shows the injected content wrapped in command markers, but the important part is that this is a single-turn injection that doesn't persist to the next message.

**Network trace:**

```json
{
  "messages": [{
    "role": "user",
    "content": [{
      "type": "text",
      "text": "<command-message>review is running…</command-message>\n[file contents]\nARGUMENTS: @file.js"
    }]
  }]
}
```

This makes slash commands good for repeatable workflows where you want explicit control over when they trigger. I use them for code review checklists, deployment workflows, and bug triage protocols. If you find yourself running the same slash command in every message, you're using the wrong mechanism—switch to an output style. Don't waste time creating slash commands for one-off tasks either, just type the prompt directly.

\---

### 4\. Skills: Model-Invoked Capability Extension

Skills are where things get interesting because Claude autonomously decides when to invoke them. The mechanism works by matching your request against the description in the SKILL.md frontmatter—if there's a semantic match, Claude calls the Skill tool which injects the markdown content into the conversation. The network trace shows this as a two-step process: first the assistant decides to use the skill (tool\_use), then the skill content comes back as a tool\_result. This is different from slash commands where you explicitly trigger the injection.

**Network trace:**

```json
// Assistant decides to use skill
{
  "role": "assistant",
  "content": [{
    "type": "tool_use",
    "name": "Skill",
    "input": {"command": "slack-gif-creator"}
  }]
}

// Skill content returned
{
  "role": "user",
  "content": [{
    "type": "tool_result",
    "content": "[SKILL.md injected]"
  }]
}
```

Here's the critical issue with skills: they execute code directly, which is a security problem. Skills can run arbitrary bash commands, so the sandbox requirement isn't optional—you need process isolation or you're exposing yourself to code execution vulnerabilities. Compare this to MCP (Model Context Protocol) which uses structured JSON I/O with schema validation and proper access control, versus skills which use unstructured I/O and direct code execution. I use skills for prototyping my own tools where I control the environment, but I always switch to MCP for production deployments. If you're building anything that touches sensitive data or runs in a multi-user environment, don't use skills at all.

\---

### 5\. Sub-Agents: Conversation Delegation

Sub-agents are the most interesting architecturally because they spawn an entirely separate conversation. When Claude decides to delegate a task, it calls the Task tool with a subagent\_type parameter and a prompt describing what the sub-agent should do. The sub-agent then runs in a completely isolated conversation with its own system prompt based on the agent type (Explore, software-architect, etc.), executes autonomously through multiple steps, and returns the results back to the main conversation. The network trace shows three distinct parts: the delegation request, the isolated sub-agent conversation, and the results being returned.

**Network trace:**

```json
// Main conversation delegates
{"role": "assistant", "content": [{
  "type": "tool_use",
  "name": "Task",
  "input": {
    "subagent_type": "Explore",
    "prompt": "Analyze auth flows..."
  }
}]}

// Sub-agent runs in isolated conversation
{
  "system": "[Explore agent system prompt]",
  "messages": [{"role": "user", "content": "Analyze auth flows..."}]
}

// Results returned
{"role": "user", "content": [{
  "type": "tool_result",
  "content": "[findings]"
}]}
```

The critical architectural choice here is context isolation—sub-agents don't see your main conversation history at all. This isolation is useful for clean delegation (the sub-agent isn't confused by unrelated context), but it's limiting when you need to reference prior discussion. If the sub-agent needs context from your main conversation, you have to explicitly pass it in the delegation prompt. I use sub-agents for multi-step autonomous tasks where I don't know the exact steps ahead of time: codebase analysis, security audits, documentation research. Don't use them for simple queries though—the overhead of spawning a separate conversation and the double API call isn't worth it for straightforward questions.

\---

## Decision Matrix: Choosing the Right Mechanism

### CLAUDE.md vs Output Styles

| Dimension | CLAUDE.md | Output Styles |
| --- | --- | --- |
| \*\*Scope\*\* | Project-wide, all users | Session-wide, single user |
| \*\*Activation\*\* | Automatic if file exists | Manual via /output-style |
| \*\*Injection Point\*\* | User messages (system-reminder) | System prompt |
| \*\*Use Case\*\* | Project standards, architecture | Response format, tone |

**Rule of thumb:**
- Team-wide standards? CLAUDE.md (committed to repo)
- Personal preferences? Output styles (session-only)
- Project context? CLAUDE.md
- Temporary behavior change? Output styles

### Skills vs Slash Commands vs MCP

| Dimension | Skills | Slash Commands | MCP |
| --- | --- | --- | --- |
| \*\*Invocation\*\* | Model-decided | User-explicit | Model-decided |
| \*\*I/O\*\* | Unstructured | Unstructured | Structured (JSON) |
| \*\*Security\*\* | Direct exec (sandbox required) | Prompt only | Access-controlled |
| \*\*Use Case\*\* | Domain expertise | Workflows | External integrations |

**Rule of thumb:**
- Need automation? Skills or MCP
- Need control? Slash commands
- Need security? MCP only

### Output Styles vs Sub-Agents

| Dimension | Output Styles | Sub-Agents |
| --- | --- | --- |
| \*\*Scope\*\* | Session-wide | Single task |
| \*\*Mechanism\*\* | System prompt mutation | Conversation delegation |

**Rule of thumb:**
- Changing **how** Claude responds? Output style
- Delegating **what** Claude should do? Sub-agent

\---

## Technical Observations from Network Analysis

### 1\. Tool Call Overhead

Skills and sub-agents both use the tool calling mechanism, which adds significant roundtrip latency compared to direct prompts. The flow is: user message → model decides → tool call → tool result → final response. That's basically 2x the latency of a direct prompt because you're doing two LLM invocations instead of one. I measured this in my logs and saw tool-based responses taking 3-5 seconds versus 1-2 seconds for direct prompts. Use skills and sub-agents when the value justifies the latency cost, but don't default to them for everything.

### 2\. Skill Discovery is Naive

Skill matching happens via substring and semantic matching on the description field in the SKILL.md frontmatter, and it's not particularly sophisticated. If your description is vague or doesn't contain keywords that match the user's request, the skill won't activate at all. I've had skills fail to activate even when they seemed relevant, and the only way to debug it is to make the description more explicit. Include specific keywords, use cases, and trigger phrases in your description. There's no matching score or debug mode to see why a skill didn't activate.

### 3\. CLAUDE.md is Automatically Included Everywhere

CLAUDE.md content gets injected into every single user message as a system-reminder, which means it's included in sub-agent conversations too. The network trace shows CLAUDE.md appearing in both the main conversation and in the delegated sub-agent's messages. This is useful for ensuring sub-agents follow the same project standards, but it also means CLAUDE.md bloat affects every API call including sub-agent calls. I measured a 3KB CLAUDE.md adding ~15KB per conversation (5 turns × 3KB). For sub-agents, the cost is doubled since you're running two separate conversations. Keep CLAUDE.md concise and use the @file.md reference syntax to pull in additional docs only when needed.

### 4\. Sub-Agent Context Isolation

Sub-agents run in completely isolated conversations and can't reference your main conversation history at all. The architecture has no support for context bridging or selective sharing—if the sub-agent needs information from your main thread, you have to explicitly include it in the delegation prompt. I've hit this limitation several times when delegating analysis tasks that needed to reference prior discussion. The workaround is to be very explicit in your delegation prompts and include all necessary context upfront. Note that sub-agents DO get the CLAUDE.md context automatically, so project-level standards are preserved.

\---

### For Individual Developers

1. **Start with slash commands** for repeatable tasks. They're deterministic and debuggable.
2. **Use output styles sparingly**. Session-wide behavior changes have cognitive overhead.
3. **Prototype with skills**, production with MCP. The security model matters.

### For Teams

1. **Use CLAUDE.md for team-wide standards**. Commit it to git along with `.claude/commands/`.
2. **Standardize workflows with slash commands**. Keep them in version control.
3. **Avoid skills in shared environments**. The sandbox requirement makes them unsuitable for multi-user setups.
4. **Build MCP servers for shared integrations**. They're reusable across applications.
5. **Document your CLAUDE.md clearly**. Invisible context causes debugging nightmares.

### For Production Systems

1. **Never use skills for anything sensitive**. Direct code execution is unacceptable in production.
2. **MCP servers should be the default** for external integrations.
3. **Monitor sub-agent usage**. The double API call has cost implications at scale.

\---

## Conclusion

Claude Code's architecture is cleaner than I expected. The separation between system-level (output styles), message-level (CLAUDE.md, commands, skills), and conversation-level (sub-agents) injection is elegant.

The critical insight: **these are orthogonal mechanisms, not competing alternatives**. CLAUDE.md provides project context, output styles control format, slash commands control workflows, skills add capabilities, sub-agents delegate tasks. Use them together.

The gotchas:

1. **CLAUDE.md is invisible**. Always check it when debugging unexpected behavior.
2. **Security model matters**. Skills execute code directly. If you're building anything beyond personal tooling, use MCP.

\---

## References

- **Network logs and analysis data**: [AgiFlow/claude-code-prompt-analysis](https://github.com/AgiFlow/claude-code-prompt-analysis) - Complete network traces: `data/claude-md.log`, `data/output-style.log`, `data/skills.log`, `data/slash-command.log`, `data/sub-agents.log`
- Claude Code docs: https://docs.claude.com/en/docs/claude-code/overview
- Anthropic skills repo: https://github.com/anthropics/skills
- MCP specification: https://modelcontextprotocol.io

\---

**Author's note**: This analysis is based on network traffic instrumentation and reverse engineering. Implementation details may change. The insights about prompt structure, tool calling patterns, and security models are derived from observed behavior, not official documentation.