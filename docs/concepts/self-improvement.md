# Self-Improvement System

OS 2.4.0 introduces an agent self-improvement loop that enables agents to learn from execution history and improve their prompts over time.

## The Problem

Before self-improvement:
- Agent failures didn't propagate learnings back to prompts
- Same mistakes recurred across sessions
- Manual discovery and fixing of agent issues
- No systematic outcome tracking

## The Solution

A structured loop that:
1. **Records** execution outcomes at pipeline end
2. **Identifies** patterns when same issue occurs 3+ times
3. **Proposes** improvements in structured format
4. **Applies** approved changes to agent definitions
5. **Measures** impact by tracking recurrence

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Execute Pipeline (via /orca-{domain})                         │
│       ↓                                                         │
│  Grand-Architect Records Outcome                                │
│       ↓                                                         │
│  Workshop task_history Entry                                    │
│       ↓                                                         │
│  /audit Triggers Pattern Analysis                               │
│       ↓                                                         │
│  Identify Patterns (3+ occurrences)                             │
│       ↓                                                         │
│  Generate Improvement Proposal                                  │
│       ↓                                                         │
│  User Approves/Rejects                                          │
│       ↓                                                         │
│  Apply to Agent Definition                                      │
│       ↓                                                         │
│  Measure Impact (track if issue recurs)                         │
│       └────────────────────────────────────────────────────────┘
```

## Outcome Recording

Grand-architects record task outcomes at the end of every pipeline:

```bash
workshop --workspace .claude/memory task_history add \
  --domain "ios" \
  --task "Build Auth UI" \
  --outcome "partial" \
  --json '{"agents_used": ["ios-builder", "ios-verification"], "issues": [...]}'
```

### Outcome Schema

```json
{
  "task_id": "ios-build-auth-2025-11-27",
  "domain": "ios",
  "agents_used": ["ios-builder", "ios-verification-agent"],
  "outcome": "success | failure | partial",
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
  "gate_scores": {"design": 8, "standards": 9}
}
```

## Pattern Recognition

Patterns are identified when the same issue type occurs 3+ times from the same agent:

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

### Analysis Script

```bash
python3 scripts/analyze-patterns.py --workspace .claude/memory --days 30
```

Output: `.claude/orchestration/temp/improvement-proposals.json`

## Improvement Proposals

Proposals follow a Pantheon-inspired schema:

```json
{
  "proposal_id": "improve-ios-builder-2025-11-27",
  "agent_name": "ios-builder",
  "issue_description": "Agent generates SwiftUI code using APIs that require iOS 16+ without checking deployment target",
  "recommended_changes": "Add instruction: 'Before using SwiftUI APIs, verify they are available for the project's minimum iOS deployment target.'",
  "priority": "high",
  "pattern_id": "ios-builder-ios-version-mismatch",
  "occurrences": 5,
  "status": "pending | approved | rejected | applied"
}
```

## User Approval Flow

1. Run `/audit` to see pending proposals
2. Review each proposal
3. Approve, Reject, or Modify
4. Approved proposals move to "approved" status

**User approval is always required** - agents are never auto-modified.

## Applying Improvements

Approved improvements are applied via:

```bash
python3 scripts/apply-improvement.py \
  --proposals .claude/orchestration/temp/improvement-proposals.json \
  --deploy
```

This adds a "Learned Rules" section to agent definitions:

```markdown
## Learned Rules (Self-Improvement)
<!-- Auto-generated from improvement proposals -->
- **iOS Version Check**: Before using SwiftUI APIs, verify they are available for the project's minimum iOS deployment target.
```

## Measuring Impact

After improvements are applied:
- Track if the same issue type recurs
- Calculate effectiveness: `(before - after) / before`
- Store metrics in Workshop notes

## Commands and Scripts

| Component | Purpose |
|-----------|---------|
| `/audit` | Triggers pattern analysis, shows proposals |
| `scripts/analyze-patterns.py` | Query Workshop, identify patterns |
| `scripts/apply-improvement.py` | Apply approved improvements |

## Storage Locations

| Data | Storage |
|------|---------|
| Execution outcomes | Workshop `task_history` entries |
| Identified patterns | Workshop `gotcha` entries (tagged `pattern`) |
| Improvement proposals | `.claude/orchestration/temp/improvement-proposals.json` |
| Applied changes | Agent YAML + Workshop `decision` entries |
| Impact metrics | Workshop `note` entries (tagged `metrics`) |

## Design Principles

### Pain-to-Pattern Process
Inspired by Equilateral Agents:
```
Incident → Cost Analysis → Root Cause → Standard → Enforcement → Measurement
```

Formula: "What Happened + The Cost + The Rule = Standard"

### User Control
- Never auto-modify agents
- User reviews and approves all changes
- Rejected proposals are recorded for learning

### Threshold-Based Detection
- 3+ occurrences trigger a proposal
- Balances signal vs noise
- Prevents one-off issues from polluting prompts

---

# /reflect - Claude Code Self-Improvement

While the agent self-improvement system learns from pipeline executions, `/reflect` provides a complementary system for learning from **standard Claude Code interactions**.

## The Problem

Claude Code interactions generate implicit learnings:
- Corrections: "No, use strict mode instead"
- Instructions: "Always run lint before committing"
- Feedback: "That broke the build"

But these don't persist. Each session starts fresh, leading to:
- Same corrections given repeatedly
- Same preferences re-explained
- Same mistakes recurring
- No systematic improvement over time

## The Solution

`/reflect` extracts learning signals from JSONL conversation transcripts:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  JSONL Transcripts (~/.claude/projects/<hash>/)                │
│       ↓                                                         │
│  /reflect Analyzes Transcripts                                  │
│       ↓                                                         │
│  Extract Signals (corrections, instructions, feedback)          │
│       ↓                                                         │
│  Learning Journal (.claude/orchestration/temp/reflect-journal.json)
│       ↓                                                         │
│  Pattern Meets Threshold?                                       │
│       ↓                                                         │
│  User Reviews & Approves                                        │
│       ↓                                                         │
│  CLAUDE.md (hard rules) or Workshop (soft preferences)          │
│       └────────────────────────────────────────────────────────┘
```

## Signal Types

| Type | Detection Pattern | Severity | Threshold |
|------|-------------------|----------|-----------|
| Correction | "no", "don't", "instead", "wrong" | High | 1 |
| Instruction | "always", "never", "make sure", "remember" | Medium | 2 |
| Positive Feedback | "perfect", "great", "exactly" | Low | 3+ |
| Negative Feedback | "broke", "failed", "error" | High | 1 |

## Commands

```bash
/reflect                     # Analyze transcripts, review patterns
/reflect status              # Show learning journal summary
/reflect learn <rule>        # Explicitly add rule to CLAUDE.md
/reflect learn <rule> --soft # Add as Workshop preference
/reflect unlearn <rule>      # Archive or remove a rule
/reflect history             # Show all rules (active + archived)
```

## Learning Journal

Pre-promotion signals accumulate in `.claude/orchestration/temp/reflect-journal.json`:

```json
{
  "version": "1.0",
  "project": "my-project",
  "signals": [
    {
      "id": "sig-abc123",
      "type": "correction",
      "content": "Use strict TypeScript",
      "occurrences": 3,
      "first_seen": "2025-11-20",
      "last_seen": "2025-11-27",
      "severity": "high",
      "status": "pending"
    }
  ],
  "learned_rules": []
}
```

## CLAUDE.md Integration

Promoted rules go to a "Learned Rules" section:

```markdown
## Learned Rules (via /reflect)
<!-- Auto-managed by /reflect - manual edits may be overwritten -->

### Active Rules
- **[rule-001]** Always use TypeScript strict mode (learned: 2025-11-27)
- **[rule-002]** Run lint before committing (learned: 2025-11-25)

### Archived Rules
<!-- Rules no longer active but kept for history -->
- **[rule-003]** Use npm not yarn (archived: 2025-11-26, reason: switched to bun)
```

## Workshop Integration

Soft learnings go to Workshop preferences:

```bash
workshop --workspace .claude/memory preference "[/reflect] Prefer concise responses" --category code_style
```

## Key Differences from Agent Self-Improvement

| Aspect | Agent Self-Improvement | /reflect |
|--------|----------------------|----------|
| **Input** | Pipeline execution outcomes | JSONL transcripts |
| **Learns from** | Agent-specific failures | General interactions |
| **Output** | Agent prompt modifications | CLAUDE.md rules + Workshop preferences |
| **Trigger** | `/audit` after pipelines | `/reflect` manual invocation |
| **Scope** | Domain-specific agents | Project-wide Claude Code behavior |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/reflect-analyze.py` | Parse JSONL, extract signals, update journal |
| `scripts/reflect-apply.py` | Add/archive/remove rules in CLAUDE.md |

## Design Principles

### User Approval Required
- All promotions require explicit user approval
- No auto-applying rules

### Project Scope
- Rules go to project CLAUDE.md only
- No global `~/.claude/CLAUDE.md` modifications

### Full Lifecycle
- Learn (add rules)
- Update (modify rules)
- Unlearn (archive/remove obsolete rules)

### Conflict Detection
- Warns when new rules conflict with existing
- User decides: replace, keep existing, or keep both

## See Also

- [Response Awareness](response-awareness.md) - RA tags in audit
- [Memory Systems](memory-systems.md) - Workshop integration
- [Complexity Routing](complexity-routing.md) - Team scaling
