# Blueprint: OS 2.3 Agent Self-Improvement System

**Requirement ID:** agent-self-improvement
**Status:** Blueprint Complete
**Date:** 2025-11-27

---

## Problem Statement

OS 2.3 agents execute tasks but learnings don't propagate back. When an agent fails due to a pattern (e.g., "ios-builder generates code for wrong iOS version"), that knowledge dies with the session. There's no:
- Systematic outcome tracking
- Pattern recognition across executions
- Mechanism to improve agent prompts based on experience

The result: Same mistakes happen repeatedly, agents don't get smarter, users manually discover and fix issues.

## Solution Overview

Implement a **Self-Improvement Loop** that:
1. **Records** execution outcomes (success/failure, issues, files modified)
2. **Identifies** patterns when same issue occurs 3+ times
3. **Proposes** improvements in a structured format
4. **Applies** approved changes to agent definitions
5. **Measures** impact by tracking if issues recur

All storage uses Workshop (already integrated), with optional Claude Self-Reflect for semantic search.

---

## Functional Requirements

### FR1: Execution Outcome Recording

**What:** Grand-architects record task outcomes at pipeline completion.

**Schema:**
```json
{
  "task_id": "ios-build-auth-2025-11-27",
  "domain": "ios",
  "agents_used": ["ios-builder", "ios-verification-agent"],
  "outcome": "partial",  // success | failure | partial
  "issues": [
    {
      "agent": "ios-builder",
      "type": "compilation_error",
      "description": "Used NavigationStack which requires iOS 16+",
      "severity": "high"
    }
  ],
  "files_modified": ["Auth/AuthView.swift", "Auth/AuthViewModel.swift"],
  "duration_seconds": 312,
  "user_feedback": null
}
```

**Storage:** Workshop `task_history` entry with JSON payload.

**Trigger:** End of every `/orca-{domain}` pipeline.

### FR2: Pattern Recognition

**What:** Identify recurring issues across executions.

**Logic:**
1. Query Workshop for `task_history` entries in last 30 days
2. Group issues by `agent` + `type`
3. Flag patterns with 3+ occurrences
4. Calculate frequency, first/last occurrence, severity

**Output:**
```json
{
  "pattern_id": "ios-builder-ios-version-mismatch",
  "agent": "ios-builder",
  "issue_type": "compilation_error",
  "occurrences": 5,
  "first_seen": "2025-11-20",
  "last_seen": "2025-11-27",
  "severity": "high",
  "example_descriptions": [
    "Used NavigationStack which requires iOS 16+",
    "Used .scrollDismissesKeyboard which requires iOS 16+"
  ]
}
```

**Storage:** Workshop `gotcha` entry tagged `pattern`, `self-improvement`.

### FR3: Improvement Proposal Generation

**What:** Generate structured improvement proposals from patterns.

**Schema (Pantheon-inspired):**
```json
{
  "proposal_id": "improve-ios-builder-2025-11-27",
  "agent_name": "ios-builder",
  "issue_description": "Agent generates SwiftUI code using APIs that require iOS 16+ without checking deployment target",
  "recommended_changes": "Add instruction to agent prompt: 'Before using SwiftUI APIs, verify they are available for the project's minimum iOS deployment target. Check Info.plist or project.pbxproj for the deployment target.'",
  "priority": "high",
  "example_feedback": "Used NavigationStack (iOS 16+) in project targeting iOS 14",
  "pattern_id": "ios-builder-ios-version-mismatch",
  "occurrences": 5,
  "status": "pending"  // pending | approved | rejected | applied
}
```

**Storage:** `.claude/orchestration/temp/improvement-proposals.json`

### FR4: User Approval Flow

**What:** Present proposals for user approval via AskUserQuestion.

**Flow:**
1. `/audit` shows pending proposals
2. User reviews each proposal
3. Options: Approve, Reject, Modify
4. Approved proposals move to "approved" status
5. Rejected proposals recorded for learning

### FR5: Agent Update Application

**What:** Apply approved improvements to agent definitions.

**Targets:**
1. **Agent YAML** - Add to prompt instructions
2. **Workshop standard** - Create reusable rule
3. **CLAUDE.md** - Add to critical alerts (if severity=critical)

**Agent YAML Update Pattern:**
```yaml
# Before
---
name: ios-builder
tools: Task, Read, Edit, MultiEdit, Grep, Glob, Bash
---
# Instructions...

# After
---
name: ios-builder
tools: Task, Read, Edit, MultiEdit, Grep, Glob, Bash
---
## Learned Rules (Self-Improvement)
<!-- Auto-generated from improvement proposals -->
- **iOS Version Check**: Before using SwiftUI APIs, verify they are available for the project's minimum iOS deployment target.

# Instructions...
```

### FR6: Impact Measurement

**What:** Track if improvements reduce issue recurrence.

**Metrics:**
- Issue occurrences before improvement
- Issue occurrences after improvement
- Improvement effectiveness % = (before - after) / before

**Storage:** Workshop `note` entries tagged `metrics`, `self-improvement`.

---

## Technical Requirements

### TR1: Workshop Integration

All data flows through Workshop CLI:

```bash
# Record task outcome
workshop --workspace .claude/memory task_history add \
  --domain ios \
  --task "Build Auth UI" \
  --outcome partial \
  --json '{"issues": [...], "agents_used": [...]}'

# Record pattern
workshop --workspace .claude/memory gotcha "Pattern: ios-builder generates code for wrong iOS version" \
  -t pattern -t self-improvement -t ios-builder

# Record improvement decision
workshop --workspace .claude/memory decision "Add iOS version check to ios-builder prompt" \
  -r "Pattern occurred 5 times in 7 days"
```

### TR2: Grand-Architect Instrumentation

Add to grand-architect prompts:

```markdown
## Post-Execution Requirements

At the end of every pipeline:
1. Call `workshop task_history add` with outcome summary
2. Include: domain, agents_used, outcome, issues (if any), files_modified
3. If user provides feedback, record it

This data feeds the self-improvement loop.
```

### TR3: `/audit` Command Enhancement

Add self-improvement analysis to `/audit`:

```markdown
## Self-Improvement Analysis

When `/audit` runs:
1. Query Workshop for task_history entries (last 30 days)
2. Run pattern recognition
3. For patterns with 3+ occurrences:
   - Generate improvement proposal
   - Present to user for approval
4. Apply approved improvements
5. Record metrics
```

### TR4: Improvement Proposal File Format

File: `.claude/orchestration/temp/improvement-proposals.json`

```json
{
  "version": "1.0",
  "generated": "2025-11-27T15:30:00Z",
  "proposals": [
    {
      "proposal_id": "...",
      "agent_name": "...",
      "issue_description": "...",
      "recommended_changes": "...",
      "priority": "high|medium|low",
      "pattern_id": "...",
      "occurrences": 5,
      "status": "pending|approved|rejected|applied"
    }
  ]
}
```

### TR5: Agent YAML Update Script

Script: `scripts/apply-improvement.py`

```python
def apply_improvement(agent_path: str, improvement: dict) -> None:
    """
    Add learned rule to agent YAML.

    1. Read agent YAML
    2. Find or create '## Learned Rules' section
    3. Append new rule
    4. Write back
    5. Deploy to ~/.claude/agents/
    """
    pass
```

---

## Implementation Phases

### Phase 1: Foundation (P0)
1. Add outcome recording to grand-architects
2. Create improvement proposal schema
3. Store outcomes in Workshop

**Files to modify:**
- `agents/iOS/ios-grand-architect.md`
- `agents/Next.js/nextjs-grand-architect.md`
- `agents/Expo/expo-grand-orchestrator.md`

### Phase 2: Analysis (P1)
1. Enhance `/audit` with pattern recognition
2. Generate improvement proposals
3. User approval flow via AskUserQuestion

**Files to create:**
- `commands/audit.md` (enhance)
- `scripts/analyze-patterns.py`

### Phase 3: Application (P1)
1. Agent YAML update script
2. Workshop standard creation
3. Deployment to ~/.claude/agents/

**Files to create:**
- `scripts/apply-improvement.py`

### Phase 4: Metrics (P2)
1. Track improvement effectiveness
2. Generate self-improvement reports
3. Identify still-problematic agents

**Files to create:**
- `scripts/improvement-metrics.py`

### Phase 5: Semantic Search (P3 - Optional)
1. Integrate Claude Self-Reflect MCP
2. Use semantic search for pattern matching
3. 9.3x improvement in pattern detection

---

## RA-Tagged Decisions

### #PATH_DECISION: Confirmed
1. **Workshop as primary storage** - Uses existing infrastructure
2. **User approval required** - Never auto-modify agents
3. **Pattern threshold: 3 occurrences** - Balance signal vs noise
4. **Structured proposal format** - Pantheon-inspired schema

### #PATH_DECISION: Recommended
1. **Option C: Hybrid** - Workshop + analysis scripts
2. **Grand-architect instrumentation** - Record at pipeline end
3. **`/audit` as trigger** - Manual control over analysis

### #COMPLETION_DRIVE: Assumptions
1. Grand-architects can execute Workshop CLI commands
2. Users will run `/audit` periodically (weekly?)
3. 30-day lookback window is appropriate for pattern detection

### #POISON_PATH: Avoid
1. **Auto-applying improvements** - Risk of prompt degradation
2. **Real-time pattern detection** - Too much overhead per task
3. **Complex ML training** - Overkill for this use case

---

## Acceptance Criteria

### AC1: Outcome Recording
- [ ] Grand-architects record task outcomes
- [ ] Outcomes stored in Workshop task_history
- [ ] JSON schema validated

### AC2: Pattern Recognition
- [ ] `/audit` identifies patterns with 3+ occurrences
- [ ] Patterns include agent, issue type, examples
- [ ] Patterns stored as Workshop gotchas

### AC3: Improvement Proposals
- [ ] Proposals generated in Pantheon schema format
- [ ] User can approve/reject via AskUserQuestion
- [ ] Proposals tracked in JSON file

### AC4: Agent Updates
- [ ] Approved improvements applied to agent YAML
- [ ] "Learned Rules" section added to agents
- [ ] Changes deployed to ~/.claude/agents/

### AC5: Metrics
- [ ] Before/after occurrence tracking
- [ ] Improvement effectiveness calculated
- [ ] Metrics stored in Workshop notes

---

## Next Steps

```
/orca-os-dev Implement Phase 1: Add outcome recording to grand-architects
```

This will:
1. Update ios-grand-architect, nextjs-grand-architect, expo-grand-orchestrator
2. Add Workshop task_history calls at pipeline end
3. Create JSON schema for outcomes
4. Test with a real pipeline execution
