---
description: "Manually trigger reflection and learning update after a session"
allowed-tools: ["Task", "Read", "Write", "Bash", "Grep", "Glob"]
---

# Learning Review - Manual Reflection & Learning

Manually trigger the ACE Reflector-Curator workflow to update system learning based on the last session's outcomes.

## Your Role

You are the **Learning Review Coordinator** - you orchestrate the two-phase reflection and learning process.

## Task

Review the last orchestration session and update playbooks with learned patterns.

---

## Process

### Phase 1: Reflection

Deploy **orchestration-reflector** to analyze the last session:

**Task for orchestration-reflector:**
```
Analyze the most recent orchestration session and create a reflection report.

Review:
1. Signal log (.orchestration/signals/signal-log.jsonl) - last session events
2. Cost tracking (.orchestration/costs.json) - specialist performance
3. Git history - what was committed
4. Evidence files (.orchestration/evidence/) - screenshots, test results

Generate: .orchestration/sessions/[session-id]-reflection.md

Include:
- Which patterns from playbooks were used?
- Did they succeed or fail?
- What new patterns were discovered?
- Specialist performance analysis
- Recommendations for playbook-curator
```

**Wait for orchestration-reflector to complete.**

---

### Phase 2: Curation

After reflection completes, deploy **playbook-curator** to update playbooks:

**Task for playbook-curator:**
```
Read the reflection report and apply delta updates to playbooks.

Input: .orchestration/sessions/[session-id]-reflection.md

Actions:
1. Create backups (.orchestration/.backup/playbooks/)
2. Apply delta updates (increment counts, append new patterns)
3. Check for apoptosis (delete failing patterns after grace period)
4. Regenerate Markdown from JSON
5. Log all changes to signal log

Output:
- Updated .orchestration/playbooks/*.json
- Updated .orchestration/playbooks/*.md
- Signal log entries
```

**Wait for playbook-curator to complete.**

---

### Phase 3: Summary

After both agents complete, present summary to user:

```markdown
## Playbook Review Complete

**Session Analyzed:** [session-id]
**Date:** [timestamp]

### Changes Applied

**Patterns Updated:**
- ios-pattern-001: helpful_count 5 → 6
- universal-pattern-003: helpful_count 12 → 13

**Patterns Added:**
- ios-pattern-026: URLSession + State-Architect for Weather APIs

**Apoptosis:**
- ios-pattern-042: Scheduled for deletion (2025-10-31)

**Files Updated:**
- .orchestration/playbooks/ios-development.json
- .orchestration/playbooks/ios-development.md

### Next Session

Playbooks are now updated. Next /orca session will use these improved patterns.
```

---

## Verification

After curation, verify changes with grep:

```bash
# Check signal log for curation events
grep "CURATION_COMPLETE" .orchestration/signals/signal-log.jsonl

# Check that JSON was updated
ls -la .orchestration/playbooks/*.json

# Check that backup was created
ls -la .orchestration/.backup/playbooks/
```

---

## Edge Cases

### No Recent Session

If no orchestration session found:

```
❌ Cannot review - no recent /orca session found in signal log.

Please run /orca first, then use /memory-learn to reflect on it.
```

### Reflection Has No Recommendations

If orchestration-reflector finds nothing to update:

```
✅ Reflection complete - no pattern updates needed.

The session used existing patterns correctly but discovered no new patterns.
```

### JSON Corruption

If playbook JSON is corrupted:

```
⚠️ Playbook corruption detected.

Restored from backup: .orchestration/.backup/playbooks/ios-development-[timestamp].json
```

---

## Manual Triggering Scenarios

### Scenario 1: After Major Feature Completion

```
User: "I just completed the checkout flow. Can you review and update learning?"
```

**Response:**
```
I'll reflect on the checkout implementation and update system learning.

[Deploy orchestration-reflector → playbook-curator]

Learning Review Complete:
- Added: nextjs-pattern-019 (Server Actions for Checkout)
- Updated: universal-pattern-003 (helpful_count 15 → 16)
```

### Scenario 2: After Failed Session

```
User: "That session failed. Let's review what went wrong."
```

**Response:**
```
I'll analyze the failed session to identify anti-patterns.

[Deploy orchestration-reflector → playbook-curator]

Learning Review Complete:
- Anti-pattern detected: Skipped requirement-analyst
- Updated: universal-antipattern-003 (harmful_count 2 → 3)
- Recommendation: Always include requirement-analyst for ambiguous requests
```

### Scenario 3: Periodic Review

```
User: "Let's review the last 5 sessions and update learning."
```

**Response:**
```
I'll analyze the last 5 sessions from signal log.

[Deploy orchestration-reflector for each session → aggregate → playbook-curator]

Learning Review Complete (5 sessions):
- 12 patterns updated
- 3 new patterns added
- 1 pattern approaching apoptosis
```

---

## Integration with /orca

After learning review completes, next `/orca` session will:

1. Load updated playbooks via SessionStart hook
2. See new patterns with higher confidence (helpful_count increased)
3. Avoid anti-patterns with higher harmful_count
4. Apply newly discovered strategies

**Example:**

Session 1:
- Uses ios-pattern-001 (helpful_count: 0)
- Works well
- /memory-learn → helpful_count: 0 → 1

Session 2:
- Loads playbook (ios-pattern-001 now has helpful_count: 1)
- /orca sees higher confidence → more likely to use this pattern
- Works well again
- /memory-learn → helpful_count: 1 → 2

Session 3:
- Pattern now has helpful_count: 2 (proven)
- /orca confidently uses this strategy
- Pattern becomes "core principle"

---

## Arguments

### --dedupe

Force semantic de-duplication even if playbook < 10K tokens:

```
/memory-learn --dedupe
```

**Use when:**
- Suspect duplicate patterns exist
- Want to merge similar strategies
- Playbook feels redundant

### --session [session-id]

Review specific session (not just last):

```
/memory-learn --session weather-app-2025-10-24
```

### --dry-run

Run reflection but don't apply curation:

```
/memory-learn --dry-run
```

**Output:**
```
Reflection complete. Preview of changes:

Would update:
- ios-pattern-001: helpful_count 5 → 6
- ios-pattern-026: [new pattern]

Run without --dry-run to apply changes.
```

---

## Success Criteria

A successful /memory-learn completes when:

✅ orchestration-reflector created reflection report
✅ playbook-curator applied delta updates
✅ Backups created before changes
✅ JSON and Markdown updated
✅ Signal log shows CURATION_COMPLETE
✅ Summary presented to user

---

## Related Commands

- **/orca** - Multi-agent orchestration (generates sessions to review)
- **/memory-pause** - Temporarily disable learning system
- **/ultra-think** - Deep analysis of patterns

---

**Version:** 1.0.0
**Created:** 2025-10-24
**Part of:** ACE Playbook System
