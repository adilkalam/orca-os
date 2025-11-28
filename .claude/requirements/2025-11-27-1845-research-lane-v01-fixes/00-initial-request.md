# Initial Request: Research Lane v0.1 Fixes

**Date:** 2025-11-27
**Requested by:** User
**Domain:** OS-Dev (claude-vibe-config)

## Original Request

Fix the Research Lane v0.1 configuration based on deep review findings. The v0.1 setup has structural issues that will cause silent failures at runtime.

## Context

User created a research lane inspired by:
- Anthropic's multi-agent research system (from engineering blog)
- Perplexity's deep research prompts
- OpenAI's deep research tool

The v0.1 implementation includes:
- `docs/reference/phase-configs/research-phase-config.yaml`
- 7 agents in `agents/research/`
- `/research` command in `commands/research.md`
- Pipeline documentation
- RA tag extensions

## Critical Issues Identified

1. **Firecrawl MCP tools missing from agent frontmatter** - Subagents describe Firecrawl usage but lack the actual tools
2. **Agent name mismatches** - Phase config references non-existent agents
3. **research-lead-agent can't write phase_state.json** - Missing Write tool
4. **No parallel subagent guidance** - Anthropic pattern not encoded
5. **No extended thinking configuration** - Missing from lead agent
6. **Agent count discrepancy** - docs/agents.md says 69 but actual is 77

## Goal

Produce a spec that fixes all issues while maintaining alignment with Anthropic's multi-agent research architecture.
