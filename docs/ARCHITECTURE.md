# Orchestration Architecture

## Overview

This system uses Claude Code's native agent pattern with a workflow orchestrator that coordinates specialized agents. The architecture addresses the core failures identified in our analysis:

- **Frame switching**: Orchestrator maintains user perspective throughout
- **Multi-agent gaps**: File-based coordination with clear handoffs
- **Context overload**: Agents stay under 200 lines, search for context
- **Verification gaps**: Evidence required for all claims

## How It Works

```
User Request
    ↓
/enhance command
    ↓
workflow-orchestrator (conductor)
    ↓
Dispatches specialized agents:
- ios-expert (Complete iOS development)
- swiftui-expert (SwiftUI UI/design)
- quality-gate (final verification)
    ↓
Evidence collection
    ↓
100% verification
    ↓
Present to user
```

## Directory Structure

```
.claude/
  agents/
    workflow-orchestrator.md    # Coordinates all work
    ios-expert.md              # Complete iOS development
    swiftui-expert.md          # SwiftUI UI/design
    quality-gate.md            # Final verification
  commands/
    enhance.md                 # Entry point
    ultra-think.md            # Deep analysis

.orchestration/
  user-request.md             # User's exact words
  work-plan.md               # Broken into pieces
  agent-log.md               # What each agent did
  evidence/                  # Screenshots, tests
```

## Key Patterns

### 1. Frame Maintenance

The orchestrator constantly returns to user perspective:

- **Before dispatch**: Write user's EXACT words to file
- **After each agent**: Re-read user request, verify it addresses actual problem
- **Before presenting**: Quote each requirement with evidence

### 2. Progressive Disclosure

Agents are small (200 lines max) with structure:
- Lines 1-30: CRITICAL rules (unmissable)
- Lines 31-100: Core capabilities
- Lines 101-200: Minimal examples

Agents search for context instead of loading everything:
```bash
grep -r "pattern" --include="*.swift"  # Find what you need
```

### 3. Evidence-Based Verification

Every claim requires proof:
- UI changes → Screenshots
- Functionality → Test output
- Design → Measurements
- Integration → Build logs

### 4. File-Based Coordination

Simple, debuggable coordination through files:
- `user-request.md`: Source of truth
- `agent-log.md`: What each agent did
- `evidence/`: Proof of completion

No complex shared state or message passing.

## Agent Responsibilities

### workflow-orchestrator
- **Role**: Conductor
- **Does**: Coordinate, verify, manage workflow
- **Doesn't**: Implement anything
- **Key feature**: Maintains user frame throughout

### ios-expert
- **Role**: Complete iOS developer
- **Does**: Swift 5.9+, networking, testing, App Store
- **Doesn't**: Design decisions without user input
- **Key feature**: Evidence for every change

### swiftui-expert
- **Role**: SwiftUI UI/design expert
- **Does**: Advanced animations, layouts, accessibility
- **Doesn't**: Skip evidence requirements
- **Key feature**: Beautiful UI with proof

### quality-gate
- **Role**: Final guardian
- **Does**: 100% verification before user sees
- **Doesn't**: Allow incomplete work through
- **Key feature**: Creates verification table

## Workflow Sequence

### Phase 1: Setup
1. User request → `.orchestration/user-request.md`
2. Create work plan → `.orchestration/work-plan.md`
3. Initialize logs and evidence directory

### Phase 2: Execution
For each piece in plan:
1. Dispatch appropriate agent
2. Agent searches for context (grep, not load all)
3. Agent makes changes
4. Agent provides evidence
5. Agent writes to log
6. Verify evidence addresses user need

### Phase 3: Quality Gate
1. quality-gate agent reviews everything
2. Creates verification table
3. Blocks if <100% verified

### Phase 4: Present
Only when:
- 100% requirements verified
- Evidence provided for each
- Orchestrator re-read original request

## Error Recovery

### Agent Failures
- Orchestrator investigates root cause
- Retries with different approach
- Escalates to user if blocked

### Conflicts Between Agents
- User intent is tiebreaker
- Document in agent-log.md
- Resolve before proceeding

### Missing Evidence
- Block progress
- Demand evidence from agent
- Cannot proceed without proof

## Success Metrics

### Quantitative
- Agent prompts: ≤200 lines (was 1,284)
- Context per agent: <5K tokens (was 20K)
- Evidence provided: 100% (was ~20%)
- Requirements verified: 100% (was ~40%)

### Qualitative
- User never sees broken work
- Agents maintain user perspective
- Clear audit trail in .orchestration/
- Easy to debug when issues occur

## Using the System

### Basic Usage
```
/enhance "Add a settings button to the navigation"
```

The orchestrator will:
1. Write request to file
2. Create work plan
3. Dispatch ios-expert
4. Collect evidence
5. Run quality gate
6. Present only if 100% complete

### Complex Tasks
```
/enhance "Redesign the calculator with better UX"
```

The orchestrator will:
1. Break into multiple pieces
2. Dispatch multiple agents
3. Coordinate between them
4. Synthesize results
5. Verify everything works together

### Deep Analysis
```
/ultra-think "Why is the calculator hard to use?"
```

Provides multi-dimensional analysis without implementation.

## Best Practices

### For Users
- Be specific in requests
- Review evidence provided
- Give feedback if not satisfied

### For Developers
- Keep agents under 200 lines
- Always provide evidence
- Search don't load context
- Maintain user perspective

### For System Maintenance
- Check .orchestration/ for debugging
- Review agent-log.md for what happened
- Evidence/ shows proof of work
- Clear between major tasks

## Common Issues and Solutions

### Issue: Agent can't find files
**Solution**: Agent should use grep/glob to search, not expect files to be provided

### Issue: Evidence missing
**Solution**: Orchestrator blocks until evidence provided

### Issue: Requirements not met
**Solution**: Quality gate blocks at <100%, returns to work

### Issue: Context overload
**Solution**: Agents search for specific context, don't load everything

## Future Enhancements

### Planned
- Parallel agent execution for independent work
- Iteration support with context refresh
- More specialized agents as needed

### Considering
- Visual verification with screenshots
- Automated testing integration
- Performance metrics tracking

## Conclusion

This architecture solves the core problems identified:
1. **Frame switching**: Forced re-reading of user request
2. **Multi-agent gaps**: File-based coordination
3. **Context overload**: Small agents, progressive disclosure
4. **Verification gaps**: Evidence required, quality gate blocks

The result is a system that reliably delivers what users actually want, not what agents think they want.