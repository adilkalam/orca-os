---
description: "Temporarily disable playbook system for debugging or testing"
allowed-tools: ["Bash", "Read", "Write"]
---

# Playbook Pause - Disable ACE System

Temporarily disable the playbook system to run /orca without pattern influence.

## Your Role

You are the **Playbook Control Manager** - you enable/disable the playbook system.

## Task

Pause or resume the ACE Playbook System.

---

## Usage

### Pause Playbook System

```
/playbook-pause
```

**What happens:**
1. Creates `.orchestration/.playbook-paused` marker file
2. SessionStart hook checks for this file
3. If present, playbook loading is skipped
4. /orca runs without playbook patterns

**Output:**
```
✅ Playbook system paused.

Next /orca session will run WITHOUT playbook patterns.

To resume: /playbook-resume
```

### Resume Playbook System

```
/playbook-resume
```

(or just run `/playbook-pause` again to toggle)

**What happens:**
1. Removes `.orchestration/.playbook-paused` marker file
2. SessionStart hook loads playbooks normally
3. /orca uses patterns again

**Output:**
```
✅ Playbook system resumed.

Next /orca session will load playbook patterns.
```

---

## Implementation

### Pause

```bash
# Create marker file
touch .orchestration/.playbook-paused

# Verify
if [ -f ".orchestration/.playbook-paused" ]; then
  echo "✅ Playbook system paused"
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
  echo "✅ Playbook system resumed"
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

**Solution:** Pause playbooks to see baseline behavior

```
/playbook-pause
/orca
[Observe team composition without playbook influence]
/playbook-resume
```

### Testing New Features

**Problem:** Want to test /orca changes without pattern interference

**Solution:** Pause during testing

```
/playbook-pause
[Test new /orca behavior]
/playbook-resume
```

### Corrupted Playbooks

**Problem:** Playbooks have bad data causing issues

**Solution:** Pause while fixing

```
/playbook-pause
[Manually fix .orchestration/playbooks/*.json]
[Test with /orca]
/playbook-resume
```

### Baseline Comparison

**Problem:** Want to measure playbook effectiveness

**Solution:** Compare paused vs active

```
# Run 1: Without playbooks
/playbook-pause
/orca "Build iOS app"
[Record: Time, specialists used, outcome]

# Run 2: With playbooks
/playbook-resume
/orca "Build iOS app"
[Record: Time, specialists used, outcome]

# Compare: Did playbooks improve efficiency?
```

---

## SessionStart Hook Integration

The `load-playbooks.sh` hook checks for pause marker:

```bash
#!/bin/bash
# load-playbooks.sh

# Check if paused
if [ -f ".orchestration/.playbook-paused" ]; then
  echo "# ACE Playbook System: PAUSED"
  echo ""
  echo "Playbooks are not loaded. /orca will run without pattern guidance."
  echo "To resume: /playbook-resume"
  exit 0
fi

# Normal playbook loading...
```

---

## Effect on /orca

### With Playbooks (Active)

```
User: "Build iOS app with local data"

/orca detects iOS project
Loads ios-development.json (25 patterns)
Pattern match: ios-pattern-001 (SwiftUI + SwiftData)
Strategy: Dispatch swiftui-developer + swiftdata-specialist + state-architect

Team proposed: 8 specialists (guided by patterns)
```

### Without Playbooks (Paused)

```
User: "Build iOS app with local data"

/orca detects iOS project
Playbooks PAUSED - using default behavior
No pattern matching
Default iOS team composition

Team proposed: system-architect + ios-engineer + quality-validator
(Note: May use deprecated agents or suboptimal choices)
```

**Observation:** Without playbooks, /orca falls back to basic defaults.

---

## Does NOT Affect

Pausing playbooks does NOT disable:

✅ SessionStart hook (still runs, just skips playbook loading)
✅ /orca command (still works, just without patterns)
✅ Specialist agents (all still available)
✅ Quality gates (verification-agent, quality-validator still run)
✅ Signal logging (still logs to signal-log.jsonl)
✅ Cost tracking (still tracks in costs.json)

Only playbook pattern matching is disabled.

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

If playbook system is already paused:

```
/playbook-pause

Output:
ℹ️ Playbook system is already paused.

To resume: /playbook-resume
```

### Already Active

If playbook system is already active:

```
/playbook-resume

Output:
ℹ️ Playbook system is already active.

To pause: /playbook-pause
```

### Playbook System Not Initialized

If `.orchestration/` directory doesn't exist:

```
/playbook-pause

Output:
❌ Playbook system not initialized.

Run Phase 1 implementation first.
```

---

## Examples

### Example 1: Debug Bad Pattern

```
User: "/orca keeps including design-reviewer even though I said skip it"