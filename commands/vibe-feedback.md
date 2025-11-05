# /vibe-feedback - Example Pattern Collector

## Purpose
Share example prompts, interactions, or chat logs that you want tools/skills to handle better. Claude Code extracts requirements WITHOUT trying to solve the actual problem.

## What This Command Does

When you type `/vibe-feedback [example]`, Claude Code will:
1. **Parse the example** for patterns and requirements
2. **Extract what capabilities are needed**
3. **Improve relevant tools/skills** to handle those patterns
4. **NOT attempt to solve the example problem**
5. **NOT ask for missing context**

## Usage Patterns

### Pattern 1: Example Prompt
```
/vibe-feedback Here's a prompt I want to solve for: "Analyze our BFCM data
looking at /raw-data for causality not correlation, no aggregates..."
```
→ Claude extracts: Need natural language parsing, path detection, causality focus

### Pattern 2: Chat Log from Another Project
```
/vibe-feedback [pastes entire ChatGPT conversation about building analytics workflow]
```
→ Claude extracts: Workflow patterns, user preferences, tool requirements

### Pattern 3: Interaction Without Context
```
/vibe-feedback
User: why did sale X outperform?
Assistant: Looking at the data...
User: No, think about causality
[rest of interaction]
```
→ Claude extracts: User wants causality-first analysis, not descriptive stats

## What Claude Code Should Do

### ✅ CORRECT Response
```
User: /vibe-feedback "We need granular BFCM analysis with product journeys..."

Claude: Extracted requirements from example:
- Natural language data path resolution needed
- Multi-phase analysis capability required
- Causality tracking features needed

I'll improve the iterative-analytics-lab skill to handle this pattern.
[Improves the skill based on example]
```

### ❌ WRONG Response
```
User: /vibe-feedback "We need granular BFCM analysis with product journeys..."

Claude: I'll help you analyze your BFCM data! Let me start by...
[Tries to do the actual analysis]
```

## Key Rules

1. **Examples are PATTERNS, not requests**
   - Extract the requirement pattern
   - Don't execute the example

2. **No context needed**
   - Work with what's provided
   - Don't ask "what project is this from?"
   - Don't ask "where is this data?"

3. **Focus on capability gaps**
   - What can't current tools handle?
   - What patterns need support?
   - What workflows are missing?

## Example Collection Structure

Examples are logged to:
```
.feedback/
  examples/
    prompts/        # Example prompts to handle
    interactions/   # Chat logs showing desired behavior
    patterns/       # Extracted patterns from examples
  improvements/
    queue.md        # Improvements needed based on examples
    completed.md    # Improvements made
```

## Common Patterns to Extract

From example prompts:
- Natural language styles
- File path references
- Analytical approaches
- Output preferences
- Workflow structures

From chat logs:
- Interaction patterns that worked
- Points of friction
- Successful approaches
- Tool usage patterns
- User preferences

## The Core Principle

**/vibe-feedback is for improving tools based on examples, not solving the examples themselves.**

When you share an example, you're saying: "Make the tools handle THIS KIND of thing better."

You're NOT saying: "Do this thing for me now."