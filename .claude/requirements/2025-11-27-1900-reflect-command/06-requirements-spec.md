# Blueprint: /reflect Command

**Requirement ID:** reflect-command
**Status:** Blueprint Complete
**Date:** 2025-11-27

---

## Problem Statement

Claude Code interactions generate implicit learnings - corrections, repeated instructions, explicit feedback - but these don't persist. Each session starts fresh, leading to:
- Same corrections given repeatedly
- Same preferences re-explained
- Same mistakes recurring
- No systematic improvement over time

The agent self-improvement system (v2.3.1) solves this for pipeline executions, but standard Claude Code interactions lack a similar learning mechanism.

## Solution Overview

A `/reflect` command that:
1. **Extracts** signals from JSONL transcripts (corrections, instructions, feedback)
2. **Accumulates** signals in a learning journal until patterns emerge
3. **Proposes** improvements to CLAUDE.md or Workshop preferences
4. **Applies** approved changes (add, update, or remove rules)
5. **Manages** the full lifecycle of learned rules (including unlearning)

---

## Functional Requirements

### FR1: Signal Extraction from JSONL Transcripts

**What:** Parse conversation transcripts to identify learning signals.

**Signal Types:**

| Type | Detection Pattern | Example |
|------|-------------------|---------|
| Correction | "no", "instead", "wrong", "actually", "don't" | "No, use strict mode" |
| Repeated Instruction | Same instruction 2+ times | "Always run lint first" |
| Explicit Feedback | "good", "perfect", "remember this" | "Great approach, remember this" |
| Negative Feedback | "broke", "failed", "wrong" | "This broke the build" |

**Input:** JSONL files from `~/.claude/projects/<project>/`

**Processing:**
1. Parse messages from transcripts
2. Identify user messages with signal keywords
3. Extract the core instruction/correction
4. Normalize to canonical form
5. Store in learning journal

**Schema (extracted signal):**
```json
{
  "id": "sig-20251127-001",
  "type": "correction | instruction | feedback",
  "content": "Use strict TypeScript mode",
  "context": "User corrected after seeing loose typing",
  "severity": "high | medium | low",
  "timestamp": "2025-11-27T19:30:00Z",
  "source_file": "session-abc123.jsonl"
}
```

### FR2: Learning Journal

**What:** Accumulate signals before promotion to CLAUDE.md/preferences.

**Location:** `.claude/orchestration/temp/reflect-journal.json`

**Schema:**
```json
{
  "version": "1.0",
  "project": "my-project",
  "signals": [
    {
      "id": "sig-001",
      "type": "correction",
      "content": "Use strict TypeScript",
      "occurrences": 3,
      "first_seen": "2025-11-20",
      "last_seen": "2025-11-27",
      "severity": "high",
      "status": "pending | promoted | dismissed"
    }
  ],
  "learned_rules": [
    {
      "id": "rule-001",
      "content": "Always use TypeScript strict mode",
      "source_signals": ["sig-001", "sig-002"],
      "promoted_at": "2025-11-27",
      "target": "claude_md | workshop_preference",
      "active": true
    }
  ]
}
```

**Operations:**
- Add new signal
- Increment occurrence count for similar signals
- Promote signal to learned rule
- Dismiss signal (won't be suggested again)
- Archive/remove learned rule

### FR3: Pattern Analysis

**What:** Identify patterns in accumulated signals.

**Threshold Logic:**
- **High severity:** 1 occurrence → suggest promotion
- **Medium severity:** 2 occurrences → suggest promotion
- **Low severity:** 3+ occurrences → suggest promotion

**Pattern Detection:**
1. Group signals by semantic similarity (same core instruction)
2. Count occurrences across sessions
3. Calculate severity based on keywords and context
4. Generate promotion suggestions

### FR4: Interactive Review

**What:** Present patterns to user for review and decision.

**Flow:**
```
/reflect
    │
    ├─ Scan JSONL transcripts for new signals
    │
    ├─ Update learning journal
    │
    ├─ Identify patterns meeting threshold
    │
    ├─ For each pattern:
    │   ├─ Present: "Found pattern: X (N occurrences)"
    │   ├─ Show examples from transcripts
    │   └─ AskUserQuestion:
    │       ├─ "Add to CLAUDE.md" (rule)
    │       ├─ "Add to Workshop" (preference)
    │       ├─ "Dismiss" (don't suggest again)
    │       └─ "Skip for now"
    │
    └─ Summary of decisions
```

### FR5: CLAUDE.md Integration

**What:** Add/update/remove learned rules in CLAUDE.md.

**Section Format:**
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

**Operations:**
- Append new rule to Active Rules
- Move rule from Active to Archived (unlearn)
- Update rule text (re-learn with different wording)
- Remove rule entirely (user request)

### FR6: Workshop Preference Integration

**What:** Add softer learnings to Workshop preferences.

**Command:**
```bash
workshop --workspace .claude/memory preference "Prefer concise responses" --category reflect
```

**Distinction:**
- **CLAUDE.md rules:** Hard requirements, always enforced
- **Workshop preferences:** Soft preferences, context-dependent

### FR7: Conflict Detection

**What:** Detect when new rule conflicts with existing rule.

**Example:**
- Existing: "Use npm for package management"
- New: "Use bun for package management"

**Flow:**
```
⚠️ CONFLICT DETECTED

New rule: "Use bun for package management"
Conflicts with: "Use npm for package management" [rule-003]

Options:
  - Replace existing rule
  - Keep existing, dismiss new
  - Keep both (different contexts)
```

### FR8: Unlearning / Rule Removal

**What:** Remove or archive rules that no longer apply.

**Triggers:**
- User explicitly requests: `/reflect unlearn "rule about npm"`
- User contradicts rule multiple times
- Rule staleness (optional future feature)

**Process:**
1. Identify rule to remove
2. Confirm with user
3. Move to Archived section (or delete entirely)
4. Update learning journal

### FR9: Explicit Learning

**What:** Allow user to explicitly add a learning without transcript analysis.

**Syntax:**
```
/reflect learn "Always run tests before pushing"
/reflect learn "Prefer functional components" --soft
```

**Flags:**
- (no flag): Add to CLAUDE.md as rule
- `--soft`: Add to Workshop as preference

---

## Technical Requirements

### TR1: Command Definition

**File:** `commands/reflect.md`

**Frontmatter:**
```yaml
---
description: "Self-improvement for Claude Code - learn from interactions"
argument-hint: "[learn <rule>] [unlearn <rule>] [status] [--soft]"
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---
```

### TR2: JSONL Transcript Parsing

**Location:** `~/.claude/projects/<project-hash>/`

**File Format:** JSONL with message objects

**Parsing Logic:**
```python
def extract_signals(jsonl_path: str) -> list[Signal]:
    signals = []
    for line in open(jsonl_path):
        msg = json.loads(line)
        if msg.get("role") == "user":
            text = msg.get("content", "")
            if is_correction(text):
                signals.append(Signal(type="correction", content=extract_instruction(text)))
            elif is_repeated_instruction(text):
                signals.append(Signal(type="instruction", content=text))
    return signals
```

### TR3: Signal Detection Keywords

**Corrections:**
- "no,", "don't", "stop", "instead", "actually", "wrong", "not that"

**Instructions:**
- "always", "never", "make sure", "remember to", "from now on"

**Positive Feedback:**
- "perfect", "great", "exactly", "good", "yes"

**Negative Feedback:**
- "broke", "failed", "error", "wrong", "bad"

### TR4: Learning Journal Location

**Path:** `.claude/orchestration/temp/reflect-journal.json`

**Initialization:**
```json
{
  "version": "1.0",
  "project": "<project-name>",
  "created": "<timestamp>",
  "signals": [],
  "learned_rules": []
}
```

### TR5: CLAUDE.md Section Management

**Find/Create Section:**
```bash
grep -n "## Learned Rules" CLAUDE.md || echo "## Learned Rules (via /reflect)" >> CLAUDE.md
```

**Append Rule:**
```bash
# Insert after "### Active Rules" line
sed -i '/### Active Rules/a - **[rule-XXX]** <rule text> (learned: <date>)' CLAUDE.md
```

### TR6: Subcommand Routing

| Subcommand | Behavior |
|------------|----------|
| `/reflect` | Analyze transcripts, show patterns, interactive review |
| `/reflect status` | Show learning journal summary |
| `/reflect learn <text>` | Explicitly add a rule |
| `/reflect learn <text> --soft` | Add as Workshop preference |
| `/reflect unlearn <text>` | Remove/archive a rule |
| `/reflect history` | Show all learned rules (active + archived) |

---

## Implementation Flow

```
/reflect [subcommand] [args]
    │
    ├─ If "learn <text>":
    │   ├─ Create rule from text
    │   ├─ Check for conflicts
    │   ├─ Add to CLAUDE.md (or Workshop if --soft)
    │   └─ Update journal
    │
    ├─ If "unlearn <text>":
    │   ├─ Find matching rule
    │   ├─ Confirm with user
    │   ├─ Archive/remove from CLAUDE.md
    │   └─ Update journal
    │
    ├─ If "status":
    │   ├─ Read journal
    │   └─ Display summary (signals pending, rules active/archived)
    │
    ├─ If "history":
    │   ├─ Read journal + CLAUDE.md
    │   └─ Display all rules with dates
    │
    ├─ Otherwise (default analyze mode):
    │   ├─ Find JSONL transcripts
    │   ├─ Parse for signals
    │   ├─ Update journal with new signals
    │   ├─ Identify patterns meeting threshold
    │   ├─ For each pattern:
    │   │   ├─ Present to user
    │   │   └─ AskUserQuestion for decision
    │   ├─ Apply approved rules
    │   ├─ Update journal
    │   └─ Display summary
```

---

## RA-Tagged Decisions

### #PATH_DECISION: Confirmed

1. **Separate from agent self-improvement** - Different inputs, outputs, patterns
2. **JSONL transcripts as primary source** - Rich signal source, already exists
3. **JSON learning journal** - Clean separation from Workshop, easy analysis
4. **Project-only scope** - No global ~/.claude/CLAUDE.md modifications
5. **Full lifecycle management** - Add, update, archive, remove rules

### #COMPLETION_DRIVE: Assumptions

1. JSONL transcripts are accessible and parseable
2. Signal detection keywords are sufficient for most cases
3. Semantic similarity for grouping can be approximate (keyword-based)
4. Users will run /reflect periodically (not automated)

### #POISON_PATH: Avoid

1. **Auto-applying rules** - User must approve all promotions
2. **Modifying global CLAUDE.md** - Scope creep, user explicitly declined
3. **Complex ML for pattern detection** - Overkill; keyword-based is sufficient
4. **Real-time signal capture** - Manual invocation only

---

## Acceptance Criteria

- [ ] `/reflect` parses JSONL transcripts for signals
- [ ] Signals accumulated in learning journal with occurrence counts
- [ ] Patterns identified based on severity-threshold logic
- [ ] Interactive review presents patterns with examples
- [ ] User can add to CLAUDE.md (rule) or Workshop (preference)
- [ ] `/reflect learn <text>` explicitly adds a rule
- [ ] `/reflect unlearn <text>` archives/removes a rule
- [ ] Conflicts detected and user prompted to resolve
- [ ] CLAUDE.md "Learned Rules" section properly managed
- [ ] `/reflect status` shows journal summary
- [ ] `/reflect history` shows all rules

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `commands/reflect.md` | CREATE | Command definition |
| `scripts/reflect-analyze.py` | CREATE | JSONL parsing and signal extraction |
| `scripts/reflect-apply.py` | CREATE | Apply rules to CLAUDE.md |
| `docs/concepts/self-improvement.md` | UPDATE | Add /reflect documentation |

---

## Next Steps

```
/orca-os-dev implement requirement reflect-command
```
