# Initial Request: OS 2.4 Agent Enrichment

**Date:** 2025-11-28
**User Request:** "See? Now you're getting somewhere. okay, lets use all your research and analysis and build a proper plan."

## Context

This plan follows an extensive research session that identified **10 gaps** in OS 2.4's agent architecture compared to industry best practices. The research analyzed:

1. **Claude Code Workflows (Patrick Ellis)** — Visual validation with Playwright, file-by-file PR review
2. **System Prompts Collection** — V0 (1,267 lines), Cursor (230), Bolt (284), Lovable (1,551), Perplexity (121), Codex (184), Devin (64), Replit (103)
3. **Equilateral Agents** — Self-learning STANDARDS methodology
4. **Agentwise** — Token optimization via SharedContextServer
5. **swift-agents-plugin** — 1,285-line iOS specialist agents

## Key Findings

### The Problem
- OS 2.4 agents are **too thin** (88-228 lines vs V0's 1,267)
- Skills exist but **aren't wired to agents** (70+ skills, only 7 agents reference them)
- Skills are **essays not rules** (no DO/DON'T lists, no thresholds)
- No **"search before edit"** mandate
- No **visual validation** outside Next.js lane
- No **self-improving agents**

### The Solution
Enrich agents with specific patterns extracted from competitor system prompts:
- Cursor's code_style + linter limits → ALL builder agents
- Lovable's Common Pitfalls + design system rules → ALL agents + frontend builders
- V0's specific thresholds (3-5 colors, 2 fonts, WCAG 4.5:1) → CSS/design agents
- Perplexity's report format → research agents
- Devin's planning mode + conventions mirroring → orchestrators + builders
- Codex's citation format → data/research agents

## Research Artifacts

- **Research Catalog:** `.claude/research/reports/local-research-catalog-2025-11-28.md`
- **YouTube Evidence:** `.claude/research/evidence/youtube-transcript-patrick-ellis-*.md`
- **Workshop Notes:** Multiple entries from today's session

## Scope

This plan covers the **enrichment of OS 2.4 agents** by:
1. Baking extracted patterns into agent prompts
2. Converting skill essays to DO/DON'T rule format
3. Adding specific thresholds to frontend agents
4. Mandating search-before-edit in all builders
