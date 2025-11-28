# Initial Request: /record Command

**Date:** 2025-11-27
**Requester:** User

## Request

Create a `/record` command that captures critical session learnings to Workshop and ProjectContext - essentially automating what the user just asked me to do manually after the v2.3.1 implementation.

## Context

After implementing v2.3.1 (self-improvement + Anthropic best practices), the user asked me to "record anything critical to project-memory or workshop context." I manually ran:

1. `workshop decision` - for the release decision with reasoning
2. `workshop gotcha` - for critical warnings (tools format, self-improvement safety)
3. `workshop note` - for file manifest
4. `mcp__project-context__save_decision` - for ProjectContext
5. `mcp__project-context__save_task_history` - for task history

The user wants this automated into a single command.

## Goal

A `/record` command that:
1. Analyzes the current session/task
2. Identifies critical learnings (decisions, gotchas, standards)
3. Records them to Workshop + ProjectContext
4. Provides a summary of what was recorded
