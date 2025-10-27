# Opus Usage Guard System

**Status:** ✅ IMPLEMENTED (2025-10-27)
**Commit:** 8a0f32e

**Date:** 2025-10-27
**Purpose:** Prevent Opus overuse through mandatory confirmation and configuration cleanup
**Impact:** Reduce costs by restricting Opus to planning tasks only

---

## Problem Statement

Opus triggers too broadly:
- All design agents use Opus automatically
- Keywords trigger Opus ("design", "creative", "architecture")
- Token thresholds trigger Opus (>40K tokens)
- Result: 40% of sessions use Opus when Sonnet would work

**Cost impact:** Opus costs 5x more than Sonnet. Current overuse wastes ~50% of Opus budget.

---

## Design Principle

**Opus excels at planning and reflection. Sonnet excels at implementation.**

Use Opus only for:
1. Complex planning tasks (requirement analysis, architecture)
2. Deep analysis via /ultra-think
3. User explicitly requests it

Use Sonnet for everything else:
- All code implementation
- All design work
- Standard development tasks

---

## Solution Architecture

### 1. Centralized Guard Hook

**File:** `~/.claude/hooks/pre-task-opus-guard.js`

**Trigger:** Before every Task tool invocation

**Logic:**
```
1. Is this /ultra-think? → Show model selection (Opus/Sonnet/Haiku)
2. Is Opus disabled? → Force Sonnet
3. Is task complex tier? → Confirm Opus usage (Yes/No)
4. Default → Use Sonnet
```

**Key feature:** Hook runs even with bypass permissions enabled. Cannot skip.

---

### 2. Configuration Cleanup

**File:** `~/.claude/config/model-selection-strategy.yml`

**Changes:**

1. **Remove all Opus agent assignments**
   - Before: `opus_agents: [design-master, swift-architect, nextjs-pro, ux-designer, ui-designer]`
   - After: `opus_agents: []`
   - Move all to `sonnet_agents`

2. **Remove keyword triggers**
   - Delete lines 84-87 (keyword-based logic)

3. **Remove token threshold triggers**
   - Delete lines 90-96 (token threshold logic)

4. **Update quality escalation**
   - Before: "Escalate to Opus if Sonnet <90%"
   - After: "Run /ultra-think for deep analysis"

**Result:** Only complex tier tasks can trigger Opus, and only with user confirmation.

---

### 3. /opus-disable Command

**File:** `~/.claude/commands/opus-disable.md`

**Purpose:** Block all Opus usage temporarily

**Usage:**
```bash
/opus-disable          # Disable Opus
/opus-disable --status # Check state
/opus-disable --enable # Re-enable Opus
```

**Implementation:**
- Creates flag file: `~/.claude/config/.opus-disabled`
- Pre-task hook checks this flag
- When disabled:
  - Complex tasks use Sonnet
  - /ultra-think offers Haiku or Sonnet (Opus hidden)
  - All agents forced to Sonnet

**State:** Persists across sessions until re-enabled.

---

### 4. Complexity Detection

**File:** `~/.claude/lib/complexity-detector.js`

**Detects complex tier tasks using three signals:**

1. **Planning agents with complexity markers**
   - Agents: requirement-analyst, system-architect
   - Markers: "multi-agent orchestration", "novel algorithm", "strategic planning", "complex system architecture"

2. **Explicit user tagging**
   - User adds `[COMPLEX]` to request
   - Or includes `complexity: complex` in prompt

3. **Large multi-agent workflows**
   - workflow-orchestrator with >5 estimated agents

**Default assumption:** Simple/moderate (Sonnet) unless proven complex.

---

## User Experience

### Scenario 1: /ultra-think Command

```
User: /ultra-think "Analyze this architecture"

System: Which model for this analysis?
  [Opus] Deep multi-perspective analysis
  [Sonnet] Standard analysis
  [Haiku] Quick logging/simple thinking

User selects → Task runs with chosen model
```

### Scenario 2: Complex Task Detection

```
User: "Design new multi-agent orchestration system"

System detects: Planning agent + complexity markers

System: This task is complex. Use Opus?
  [Yes] Use Opus for planning
  [No] Use Sonnet

User selects → Task runs with chosen model
```

### Scenario 3: Standard Implementation

```
User: "Fix calculator view layout"

System detects: Standard implementation (not complex)

System: (no prompt, uses Sonnet automatically)
```

### Scenario 4: Opus Disabled

```
User previously ran: /opus-disable

User: "Design complex architecture" [would normally trigger Opus]

System detects: Opus disabled flag exists

System: (no prompt, uses Sonnet, even for complex tasks)
```

---

## Implementation Plan

### Phase 1: Configuration Cleanup (15 min)
1. Edit `model-selection-strategy.yml`
2. Clear `opus_agents` list
3. Remove keyword triggers
4. Remove token threshold triggers
5. Update quality escalation logic

### Phase 2: Guard Hook (45 min)
1. Create `~/.claude/hooks/pre-task-opus-guard.js`
2. Implement model selection dialog for /ultra-think
3. Implement Opus confirmation for complex tasks
4. Integrate with Task tool interception
5. Test with bypass permissions enabled

### Phase 3: Complexity Detector (30 min)
1. Create `~/.claude/lib/complexity-detector.js`
2. Implement three detection methods
3. Test with various prompts
4. Tune complexity markers

### Phase 4: /opus-disable Command (20 min)
1. Create `~/.claude/commands/opus-disable.md`
2. Implement flag file creation/deletion
3. Update guard hook to check flag
4. Test enable/disable/status modes

### Phase 5: Integration Testing (30 min)
1. Test /ultra-think with all three model options
2. Test complex task detection and confirmation
3. Test /opus-disable blocking
4. Verify no bypass with permissions enabled
5. Test across multiple session starts

**Total estimate:** 2.5 hours

---

## Success Metrics

**Before implementation:**
- Opus usage: 40% of sessions
- Cost per session: $0.59 (60% Sonnet, 40% Opus)
- False Opus triggers: ~30% of Opus usage unnecessary

**After implementation:**
- Opus usage: <10% of sessions (planning only)
- Cost per session: ~$0.25 (90% Sonnet, 10% Opus)
- False Opus triggers: 0% (user confirms every use)
- User awareness: 100% (mandatory confirmation)

**Projected savings:** 58% cost reduction ($0.59 → $0.25 per session)

---

## Files Modified

1. `~/.claude/config/model-selection-strategy.yml` (cleanup)
2. `~/.claude/hooks/pre-task-opus-guard.js` (new)
3. `~/.claude/lib/complexity-detector.js` (new)
4. `~/.claude/commands/opus-disable.md` (new)

---

## Risks and Mitigations

**Risk 1:** User fatigue from confirmations
- **Mitigation:** Only confirm genuinely complex tasks + /ultra-think
- **Mitigation:** /opus-disable provides escape hatch

**Risk 2:** False negatives (complex task not detected)
- **Mitigation:** User can tag with `[COMPLEX]` explicitly
- **Mitigation:** Can still choose Opus in /ultra-think

**Risk 3:** Hook implementation complexity
- **Mitigation:** Single enforcement point, simple logic
- **Mitigation:** Clear test cases defined

---

## Open Questions

None. Design approved and ready for implementation.
