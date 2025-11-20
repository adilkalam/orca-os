---
description: "Temporarily disable learning system for debugging or testing"
allowed-tools: ["Bash", "Read", "Write"]
---

# Learning Pause - Disable Learning System

Temporarily disable the learning system to run /orca without pattern influence.

## Your Role

You are the **Learning Control Manager** - you enable/disable the learning system.

## Task

Pause or resume the ACE Learning System.

---

## Usage

### Pause Learning System

```
/memory-pause
```

**What happens:**
1. Creates `.orchestration/.playbook-paused` marker file
2. SessionStart hook checks for this file
3. If present, playbook loading is skipped
4. /orca runs without learning patterns

**Output:**
```
✅ Learning system paused.

Next /orca session will run WITHOUT learned patterns.

To resume: /memory-resume
```

### Resume Learning System

```
/memory-resume
```

(or just run `/memory-pause` again to toggle)

**What happens:**
1. Removes `.orchestration/.playbook-paused` marker file
2. SessionStart hook loads playbooks normally
3. /orca uses learned patterns again

**Output:**
```
✅ Learning system resumed.

Next /orca session will load learned patterns.
```

---

## Implementation

### Pause

```bash
# Create marker file
touch .orchestration/.playbook-paused

# Verify
if [ -f ".orchestration/.playbook-paused" ]; then
  echo "✅ Learning system paused"
else
  echo "❌ Failed to pause"
fi
```

### Resume

```bash
# Remove marker file
rm -f .orchestration/.playbook-paused

# Verify
if [ ! -f ".orchestration/.playbook-paused" ]; then
  echo "✅ Learning system resumed"
else
  echo "❌ Failed to resume"
fi
```

### Check Status

```bash
# Check if paused
if [ -f ".orchestration/.playbook-paused" ]; then
  echo "Status: PAUSED"
else
  echo "Status: ACTIVE"
fi
```

---

## When to Use

### Debugging Orchestration Issues

**Problem:** /orca is making unexpected specialist choices

**Solution:** Pause learning to see baseline behavior

```
/memory-pause
/orca
[Observe team composition without learned pattern influence]
/memory-resume
```

### Testing New Features

**Problem:** Want to test /orca changes without pattern interference

**Solution:** Pause during testing

```
/memory-pause
[Test new /orca behavior]
/memory-resume
```

### Corrupted Learning

**Problem:** Playbooks have bad data causing issues

**Solution:** Pause while fixing

```
/memory-pause
[Manually fix .orchestration/playbooks/*.json]
[Test with /orca]
/memory-resume
```

### Baseline Comparison

**Problem:** Want to measure learning effectiveness

**Solution:** Compare paused vs active

```
# Run 1: Without learned patterns
/memory-pause
/orca "Build iOS app"
[Record: Time, specialists used, outcome]

# Run 2: With learned patterns
/memory-resume
/orca "Build iOS app"
[Record: Time, specialists used, outcome]

# Compare: Did learning improve efficiency?
```

---

## SessionStart Hook Integration

The `load-playbooks.sh` hook checks for pause marker:

```bash
#!/bin/bash
# load-playbooks.sh

# Check if paused
if [ -f ".orchestration/.playbook-paused" ]; then
  echo "# ACE Learning System: PAUSED"
  echo ""
  echo "Learned patterns are not loaded. /orca will run without pattern guidance."
  echo "To resume: /memory-resume"
  exit 0
fi

# Normal playbook loading...
```

---

## Effect on /orca

### With Learning (Active)

```
User: "Build iOS app with local data"

/orca detects iOS project
Loads ios-development.json (25 learned patterns)
Pattern match: ios-pattern-001 (SwiftUI + SwiftData)
Strategy: Dispatch swiftui-developer + swiftdata-specialist + state-architect

Team proposed: 8 specialists (guided by learned patterns)
```

### Without Learning (Paused)

```
User: "Build iOS app with local data"

/orca detects iOS project
Learning PAUSED - using default behavior
No pattern matching
Default iOS team composition

Team proposed: system-architect + ios-engineer + quality-validator
(Note: May use deprecated agents or suboptimal choices)
```

**Observation:** Without learning, /orca falls back to basic defaults.

---

## Does NOT Affect

Pausing learning does NOT disable:

✅ SessionStart hook (still runs, just skips pattern loading)
✅ /orca command (still works, just without learned patterns)
✅ Specialist agents (all still available)
✅ Quality gates (verification-agent, quality-validator still run)
✅ Signal logging (still logs to signal-log.jsonl)
✅ Cost tracking (still tracks in costs.json)

Only learned pattern matching is disabled.

---

## Verification

After pausing, verify it worked:

```bash
# Method 1: Check marker file
ls -la .orchestration/.playbook-paused

# Method 2: Start new session and check output
# SessionStart hook will show "PAUSED" message

# Method 3: Run /orca and observe
# Team composition should be different (no pattern guidance)
```

---

## Edge Cases

### Already Paused

If learning system is already paused:

```
/memory-pause

Output:
ℹ️ Learning system is already paused.

To resume: /memory-resume
```

### Already Active

If learning system is already active:

```
/memory-resume

Output:
ℹ️ Learning system is already active.

To pause: /memory-pause
```

### Learning System Not Initialized

If `.orchestration/` directory doesn't exist:

```
/memory-pause

Output:
❌ Learning system not initialized.

Run Phase 1 implementation first.
```

---

## Examples

### Example 1: Debug Bad Pattern

```
User: "/orca keeps including design-reviewer even though I said skip it"