# Initial Request: Agent Self-Improvement System

**Date:** 2025-11-27
**Requester:** User

## Request

Add agent self-improvement capabilities to OS 2.3, enabling agents to learn from execution history and improve their prompts over time.

## Reference Sources Studied

### 1. Claude Self-Reflect
- Semantic search over past conversations
- Problem-solution narrative extraction (9.3x better search quality)
- Memory decay for relevance scoring
- MCP-based tool access (`reflect_on_past`, `store_reflection`)

### 2. Equilateral Agents
- **Pain-to-Pattern Process**: Incident → Cost → Rule → Standard
- **Knowledge Harvest**: Scan agent memory, identify patterns, create standards
- **SimpleAgentMemory**: Tracks last 100 executions per agent
- **StandardsContributor**: Prompts user to create standards from successful patterns

### 3. Pantheon Framework
- **agent_improvements schema**: Structured format for agent improvement items
  - agent_name, issue_description, recommended_changes, priority, example_feedback
- **Retro reports**: Systematic review of agent performance

### 4. Claude Flow
- **Training Pipeline**: Real ML with strategy optimization
- **Agent Performance Profiles**: Success rate, avg score, execution time
- **Exponential Moving Average (α=0.3)**: Persistent improvement tracking
- **Strategy Selection**: conservative/balanced/aggressive based on task type

## Goal

Design a self-improvement system that:
1. Captures execution outcomes (success/failure, issues encountered)
2. Identifies patterns across multiple executions
3. Proposes prompt improvements to agents
4. Feeds learnings back into CLAUDE.md, Workshop, or agent definitions
5. Tracks improvement over time
