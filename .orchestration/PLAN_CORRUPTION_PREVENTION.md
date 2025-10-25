# Plan Corruption Prevention System

## The Problem We're Solving

**Previous failure mode**: Agents don't follow plans
**New failure mode**: Plans themselves are corrupted - agents following corrupted plans build wrong things

**Cost of one corrupted plan**: 60K+ tokens wasted, user frustration, entire implementations thrown away

---

## The Root Cause

When creating implementation plans, I:
1. **Hallucinated features** user didn't specify (quick-select buttons)
2. **Turned examples into requirements** ("e.g., dial" → "implement dial")
3. **Made simple specs complex** ("search bar" → "multiple selection mechanisms")
4. **Eliminated creative freedom** (prescriptive where user wanted flexibility)
5. **Added redundant UI** (repeated app name multiple times)

---

## The Solution - Three-Layer Defense

### Layer 1: Pre-Flight Checklist (Prevention)
**File**: `.orchestration/PRE_FLIGHT_CHECKLIST.md`

**When**: BEFORE creating any implementation plan

**What it does**:
- Forces exact capture of user's words
- Identifies required vs. creative freedom
- Identifies examples vs. hard requirements
- Commits to validation protocol
- Lists red flag phrases that indicate corruption

**Enforced by**: workflow-orchestrator agent (mandatory first step)

---

### Layer 2: Plan Validation Protocol (Detection)
**File**: `.orchestration/PLAN_VALIDATION_PROTOCOL.md`

**When**: DURING and AFTER plan creation

**What it does**:
- Requires quoting user's specification for every feature
- Provides validation checklist (invention detection, quote compliance)
- Shows correct vs. wrong examples
- Tracks token cost of corruption
- Defines plan structure requirements (quote → interpret → implement)

**Enforced by**: workflow-orchestrator agent (runs validation before finalizing plan)

---

### Layer 3: Quality Gate Check (Verification)
**File**: `.claude/agents/quality-gate.md` (updated)

**When**: BEFORE presenting work to user

**What it does**:
- Reads user's original request
- Checks plan for corruption (features not specified, examples as requirements, etc.)
- Blocks if plan is corrupted
- Demands plan rewrite if violations found
- Only approves if implementation matches user's actual words

**Enforced by**: quality-gate agent (mandatory final step)

---

## Workflow Integration

### Updated workflow-orchestrator Agent

**Setup Phase - Pre-Flight**:
1. STOP and read PRE_FLIGHT_CHECKLIST.md
2. Complete entire checklist
3. Write user request verbatim to user-request.md
4. Collect user's quotes

**Plan Creation**:
1. Read PLAN_VALIDATION_PROTOCOL.md
2. Write plan with quote-first format
3. Run validation checklist
4. Verify no hallucinated features

**Execution Phase**:
1. Verify task descriptions quote user's specs
2. Dispatch agents with exact requirements
3. Red flag check: implementation vs. corruption
4. User's words are tiebreaker

**Quality Gate**:
1. Check for plan corruption
2. Verify against user's actual words
3. Block if corrupted or incomplete

---

## Key Principles

### 1. User's Words = Source of Truth
Plan is translation, not creative reinterpretation

### 2. Examples ≠ Requirements
"e.g., dial" is a suggestion, not a mandate

### 3. Simple Specs = Simple Plans
If user describes something simply, plan must be simple

### 4. Quote or Remove
If I can't quote user to justify it, it shouldn't be in the plan

### 5. Creative Freedom ≠ License to Over-Specify
When user says "explore ideas", don't pick one and mandate it

---

## Red Flags (Stop Immediately)

If writing plan and these phrases appear:
- "Two/three selection mechanisms"
- "Quick-select buttons for common..."
- "Separate dropdown for..."
- "Advanced options panel"
- Complex multi-step flows user didn't describe
- Specific layouts where user said "explore ideas"

**Action**: Delete, re-read user spec, ask "did user specify this?"

---

## Validation Questions

For every feature in plan:

1. **Quote Test**: Can I quote user's words?
2. **Addition Test**: Did I add something not mentioned?
3. **Complexity Test**: Did I make simple things complex?
4. **Freedom Test**: Did I eliminate creative freedom?
5. **Example Test**: Did I turn suggestions into mandates?

If any answer is YES (except Quote Test), fix immediately.

---

## Plan Structure Template

```markdown
## [Section Name]

**USER'S SPECIFICATION (EXACT QUOTE)**:
> "[user's words verbatim]"

**INTERPRETATION**:
- Required: [what MUST be done]
- Creative Freedom: [where agent has flexibility]
- Examples: [suggestions, not requirements]

**IMPLEMENTATION**:
[How to implement what user specified]
```

---

## Success Metrics

### Plan is Valid When:
- ✅ Every feature traced to user's quote
- ✅ Simple specs remained simple
- ✅ Creative freedom preserved
- ✅ Examples not turned into requirements
- ✅ No hallucinated features

### Plan is Corrupted When:
- ❌ Features without user specification
- ❌ Complexity added to simple specs
- ❌ Prescriptive details replace freedom
- ❌ Examples became mandates
- ❌ Multi-option UIs replace single components

---

## Enforcement Summary

1. **workflow-orchestrator**: MUST run pre-flight before creating plans
2. **workflow-orchestrator**: MUST validate plan before execution
3. **quality-gate**: MUST check for corruption before approval
4. **All agents**: If plan contradicts user's words, FLAG IT

---

## Why This Matters

**Before corruption prevention**:
- 60K tokens building wrong UI
- User frustration and rage
- Entire implementations discarded
- Trust in orchestration system damaged

**With corruption prevention**:
- Plans faithfully represent user's intent
- Agents build what user actually wants
- Tokens spent on correct implementations
- User trust maintained

---

## Testing the System

To verify this system works:

1. Create test case with simple user specification
2. Run workflow-orchestrator to create plan
3. Check if plan includes ONLY what user specified
4. Check if examples stayed as examples
5. Check if creative freedom preserved
6. Run quality-gate to verify detection

If system allows corrupted plan through: FIX THE CHECKPOINTS

---

## Maintenance

This system must be updated when:
- New corruption patterns discovered
- New red flags identified
- Validation checks prove insufficient
- User catches corrupted plan that passed validation

**Living document**: Add new examples of corruption as they appear.
