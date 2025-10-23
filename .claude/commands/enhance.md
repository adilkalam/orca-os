---
name: enhance
description: Transform request into well-structured implementation
---

# Task Execution with Automatic Orchestration

You've been asked to: {{TASK}}

## Execution Protocol

### Step 1: Understand
- What is the user ACTUALLY asking for? (not your interpretation)
- What problem are they trying to solve?
- What would success look like to THEM?

### Step 2: Execute

Handle the task using appropriate specialized agents:

1. Break complex work into manageable pieces
2. Use Task tool to dispatch specialized agents when needed
3. Collect evidence for significant changes
4. Verify everything works before presenting

Available built-in agents: frontend-engineer, backend-engineer, ios-engineer, android-engineer, cross-platform-mobile, design-engineer, test-engineer, quality-validator, system-architect, requirement-analyst

### Step 3: Verify

Before presenting results:
1. Test the implementation
2. Build verification for code changes
3. Screenshots for UI changes
4. Quality validation when needed

### Step 4: Final Check

Before presenting the orchestrator's results:
- Did it verify 100% of requirements?
- Is there evidence for each claim?
- Would YOU accept this if you were the user?

Only present when you can confidently say the user's actual problem is solved.

## Available Built-in Agents

Use Task tool with these subagent_type values:
- **frontend-engineer**: React, Vue, Next.js development
- **backend-engineer**: Node.js, Python, Go server development
- **ios-engineer**: iOS/Swift development with Xcode
- **android-engineer**: Android/Kotlin development
- **design-engineer**: UI/UX design and implementation
- **test-engineer**: Comprehensive testing
- **quality-validator**: Final verification and validation
- **system-architect**: Architecture and design decisions

## Evidence Requirements

For significant changes, provide:
- Screenshots for UI changes
- Test output for functionality changes
- Build verification for code changes
- Clear explanation of what was done

## Success Criteria

Task is complete when:
- All user requirements addressed
- Implementation verified (tests pass, builds succeed)
- Quality validated when needed
- User's actual problem is solved (not just code written)