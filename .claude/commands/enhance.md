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

### Step 2: Orchestrate

Invoke the workflow-orchestrator to handle this task:

"Please handle this user request: {{TASK}}

Break it into 2-hour pieces, dispatch appropriate agents, collect evidence, and verify everything works before presenting."

The orchestrator will coordinate all the work using specialized agents.

### Step 3: Monitor

The orchestrator will:
1. Set up the workflow
2. Dispatch specialized agents
3. Collect evidence
4. Run quality gates
5. Report back

If the orchestrator reports issues, help resolve them.

### Step 4: Final Check

Before presenting the orchestrator's results:
- Did it verify 100% of requirements?
- Is there evidence for each claim?
- Would YOU accept this if you were the user?

Only present when you can confidently say the user's actual problem is solved.

## Available Agents

The orchestrator can dispatch:
- **ios-implementation**: iOS/SwiftUI development
- **design-verification**: Visual design checking
- **quality-gate**: Final verification before presenting

## Evidence Requirements

All work must include evidence in .orchestration/evidence/:
- Screenshots for UI changes
- Test output for functionality
- Build logs for compilation
- Videos for complex interactions

## Success Criteria

Task is complete when:
- All user requirements addressed
- Evidence provided for each requirement
- Quality gate passes at 100%
- User's actual problem is solved (not just code written)