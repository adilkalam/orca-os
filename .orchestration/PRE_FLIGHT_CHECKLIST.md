# Pre-Flight Checklist - MANDATORY Before ANY Orchestration

## Purpose
Prevent plan corruption before it starts. This checklist MUST be run before creating any implementation plan or dispatching any agents.

---

## ✅ CHECKLIST (All must pass)

### 1. User Request Capture
- [ ] User's exact words written to .orchestration/user-request.md (no paraphrasing)
- [ ] I have re-read what I wrote to verify it matches user's actual words
- [ ] No interpretation, no "improvement", no elaboration added

### 2. Specification Analysis
- [ ] I have identified what is REQUIRED vs. what is CREATIVE FREEDOM
- [ ] I have identified examples vs. hard requirements
- [ ] I have identified simple specs that must stay simple

### 3. Plan Corruption Self-Check
- [ ] I will NOT add UI patterns user didn't specify
- [ ] I will NOT turn examples ("e.g., dial") into requirements ("implement dial")
- [ ] I will NOT turn simple specs ("search bar") into complex ones ("buttons + dropdowns")
- [ ] I will NOT be prescriptive where user wanted creative freedom

### 4. Validation Protocol Ready
- [ ] I have read .orchestration/PLAN_VALIDATION_PROTOCOL.md
- [ ] I will run validation checklist after writing plan
- [ ] I will quote user's specification for every feature I add to plan

### 5. Simplicity Commitment
- [ ] If user described it simply, my plan will be simple
- [ ] If user gave one example, I won't create five alternatives
- [ ] If user said "explore ideas", I won't pick one and mandate it

---

## 🚨 RED FLAGS - Stop Immediately If You Write Any Of These

- "Two/three selection mechanisms"
- "Quick-select buttons for common..."
- "Separate dropdown for..."
- "Advanced options panel"
- "Settings modal"
- Any feature with "also includes" or "additionally"

**If you write any red flag phrase**: Delete it, re-read user spec, ask yourself "did user specify this?"

---

## 📋 Quote Collection Template

Before writing plan, collect quotes:

```markdown
## User Specifications (EXACT QUOTES)

### UI Components
> "[exact user quote about UI]"

### User Flows
> "[exact user quote about flows]"

### Data/Logic
> "[exact user quote about data]"

### Creative Freedom Areas
> "[exact user quote indicating flexibility]"
```

---

## 🎯 Plan Structure Requirements

Every section of plan must start with:

```markdown
## [Section Name]

**USER'S SPECIFICATION (EXACT QUOTE)**:
> "[user's words verbatim]"

**INTERPRETATION**:
- Required: [what MUST be done]
- Creative Freedom: [where agent has flexibility]
- Examples: [suggestions, not requirements]

**IMPLEMENTATION**:
[Only now write how to implement]
```

---

## ⚖️ Example vs. Requirement Test

**User says**: "Large number displays with thoughtful layouts for UX experience, e.g., a half circle on the edge of the screen that operates like a dial"

**❌ WRONG interpretation**:
- Required: Half-circle dial design on screen edge
- Implementation: Create half-circle component with dial interaction

**✅ CORRECT interpretation**:
- Required: Large, prominent number displays
- Creative Freedom: Agent explores thoughtful layouts
- Example (not required): Half-circle dial is one possibility
- Implementation: Agent has freedom to design creative layouts following iOS best practices

---

## 🔍 Validation Questions to Ask Myself

For EVERY feature in plan:

1. **Quote Test**: Can I quote user's words that specify this?
   - YES → Include it
   - NO → Remove it or ask user

2. **Addition Test**: Did I add something user didn't mention?
   - YES → Remove it or ask user
   - NO → Keep it

3. **Complexity Test**: Did I make simple things complex?
   - YES → Simplify to match user's description
   - NO → Keep it

4. **Freedom Test**: Did I eliminate creative freedom user gave?
   - YES → Restore flexibility
   - NO → Keep it

5. **Example Test**: Did I turn suggestions into mandates?
   - YES → Restore as examples/suggestions
   - NO → Keep it

---

## 📊 Success Metrics

**Plan is valid when**:
- Every feature can be traced to user's quote
- Simple specs remained simple
- Creative freedom preserved where indicated
- Examples not turned into requirements
- No hallucinated features

**Plan is corrupted when**:
- Features exist without user specification
- Complexity added to simple specs
- Prescriptive details replace creative freedom
- Examples became mandates
- Multi-option UIs replace single components

---

## 🚀 Ready to Proceed?

Before creating plan:
- [ ] All checkboxes above are checked
- [ ] I have user's quotes ready
- [ ] I understand required vs. creative freedom
- [ ] I commit to validation protocol

**If ANY checkbox unchecked**: DO NOT PROCEED with plan creation.

**Remember**: A corrupted plan wastes 60K+ tokens and poisons all downstream work. Prevention is cheaper than fixing.
